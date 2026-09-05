#!/usr/bin/env node

import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skillsRoot = path.join(root, '.codex', 'skills');
const expected = new Map([
  [
    'arena-product-requirements',
    ['product-scope.md', 'personas.md', 'user-flows.md', 'acceptance-criteria.md', 'metrics.md'],
  ],
  [
    'arena-tournament-domain',
    [
      'glossary.md',
      'entities.md',
      'tournament-state-machine.md',
      'registration-state-machine.md',
      'match-state-machine.md',
      'dispute-workflow.md',
      'bracket-rules.md',
      'game-provider-contract.md',
    ],
  ],
  [
    'arena-system-architecture',
    [
      'system-context.md',
      'containers.md',
      'module-boundaries.md',
      'dependency-rules.md',
      'architecture-quality-attributes.md',
      'adr-template.md',
    ],
  ],
  [
    'arena-backend-node',
    [
      'backend-module-template.md',
      'error-contract.md',
      'transaction-policy.md',
      'job-policy.md',
      'realtime-policy.md',
    ],
  ],
  [
    'arena-frontend-next',
    [
      'rendering-policy.md',
      'data-fetching.md',
      'component-boundaries.md',
      'routing-map.md',
      'frontend-error-states.md',
      'performance-budget.md',
    ],
  ],
  [
    'arena-api-contracts',
    [
      'api-style.md',
      'pagination.md',
      'filtering.md',
      'idempotency.md',
      'versioning.md',
      'webhooks.md',
    ],
  ],
  [
    'arena-database',
    [
      'data-model.md',
      'migration-policy.md',
      'index-policy.md',
      'concurrency.md',
      'retention.md',
      'backup-restore.md',
    ],
  ],
  [
    'arena-auth-security',
    [
      'threat-model.md',
      'authentication.md',
      'authorization.md',
      'session-security.md',
      'file-upload-security.md',
      'secrets.md',
      'security-review.md',
      'privacy.md',
    ],
  ],
  [
    'arena-design-system',
    [
      'design-tokens.md',
      'component-contracts.md',
      'accessibility.md',
      'responsive-layout.md',
      'content-style.md',
      'game-assets-policy.md',
    ],
  ],
  [
    'arena-testing-quality',
    [
      'test-strategy.md',
      'test-pyramid.md',
      'critical-user-journeys.md',
      'quality-gates.md',
      'test-data.md',
    ],
  ],
  [
    'arena-observability',
    ['telemetry.md', 'logging.md', 'metrics.md', 'tracing.md', 'slo.md', 'alerts.md'],
  ],
  [
    'arena-devops-release',
    [
      'local-development.md',
      'ci-pipeline.md',
      'deployment.md',
      'environment-strategy.md',
      'release-policy.md',
      'rollback.md',
      'disaster-recovery.md',
      'runbooks.md',
    ],
  ],
  ['arena-code-review', ['review-checklist.md', 'risk-classification.md', 'review-output.md']],
]);

const errors = [];
const checkedFiles = new Set();
const names = new Set();

const fail = (message) => errors.push(message);
const rel = (file) => path.relative(root, file);
const sorted = (values) => [...values].sort((a, b) => a.localeCompare(b));

function parseFrontmatter(text, file) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) {
    fail(`${rel(file)}: missing valid YAML frontmatter delimiters`);
    return {};
  }
  const result = {};
  for (const [index, line] of match[1].split('\n').entries()) {
    const field = line.match(/^([a-z][a-z0-9_-]*):\s*(.+)$/);
    if (!field) {
      fail(`${rel(file)}: invalid frontmatter YAML at line ${index + 2}`);
      continue;
    }
    const [, key, raw] = field;
    let value = raw.trim();
    if (value.startsWith('"')) {
      try {
        value = JSON.parse(value);
      } catch {
        fail(`${rel(file)}: invalid quoted YAML scalar for ${key}`);
      }
    }
    result[key] = value;
  }
  return result;
}

function validateOpenAiYaml(text, file, skillName) {
  const lines = text.trimEnd().split('\n');
  if (lines[0] !== 'interface:') fail(`${rel(file)}: must start with interface:`);
  const values = {};
  for (let index = 1; index < lines.length; index += 1) {
    const match = lines[index].match(/^\s{2}([a-z_]+): ("(?:[^"\\]|\\.)*")$/);
    if (!match) {
      fail(`${rel(file)}:${index + 1}: invalid or unsupported YAML; use quoted interface scalars`);
      continue;
    }
    try {
      values[match[1]] = JSON.parse(match[2]);
    } catch {
      fail(`${rel(file)}:${index + 1}: invalid YAML string`);
    }
  }
  for (const key of ['display_name', 'short_description', 'default_prompt']) {
    if (typeof values[key] !== 'string' || values[key].length === 0)
      fail(`${rel(file)}: missing ${key}`);
  }
  const short = values.short_description ?? '';
  if (short.length < 25 || short.length > 64)
    fail(`${rel(file)}: short_description must be 25-64 characters`);
  if (!(values.default_prompt ?? '').includes(`$${skillName}`))
    fail(`${rel(file)}: default_prompt must mention $${skillName}`);
  if (/allow_implicit_invocation:\s*false/.test(text))
    fail(`${rel(file)}: implicit invocation must remain enabled`);
}

if (process.argv.includes('--self-test')) {
  const before = errors.length;
  parseFrontmatter('name: missing-delimiters\n', path.join(root, 'self-test-skill.md'));
  validateOpenAiYaml(
    'interface:\n  display_name: unquoted\n',
    path.join(root, 'self-test-openai.yaml'),
    'self-test',
  );
  if (errors.length - before < 2)
    throw new Error('validator self-test failed to reject invalid fixtures');
  errors.length = before;
  console.log('Skills validator self-test passed: invalid frontmatter and YAML were rejected.');
  process.exit(0);
}

async function existingFile(file) {
  try {
    return (await stat(file)).isFile();
  } catch {
    return false;
  }
}

async function walk(dir) {
  const result = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...(await walk(full)));
    else if (entry.isFile()) result.push(full);
  }
  return result;
}

const actualDirs = (await readdir(skillsRoot, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);
for (const name of expected.keys())
  if (!actualDirs.includes(name)) fail(`missing skill directory: ${name}`);
for (const name of actualDirs)
  if (!expected.has(name)) fail(`unexpected project skill directory: ${name}`);

for (const folder of sorted(actualDirs)) {
  const skillDir = path.join(skillsRoot, folder);
  const skillFile = path.join(skillDir, 'SKILL.md');
  const agentFile = path.join(skillDir, 'agents', 'openai.yaml');
  if (!(await existingFile(skillFile))) {
    fail(`${folder}: missing SKILL.md`);
    continue;
  }
  if (!(await existingFile(agentFile))) fail(`${folder}: missing agents/openai.yaml`);

  const skillText = await readFile(skillFile, 'utf8');
  checkedFiles.add(skillFile);
  const frontmatter = parseFrontmatter(skillText, skillFile);
  if (frontmatter.name !== folder) fail(`${rel(skillFile)}: name must match directory`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(frontmatter.name ?? ''))
    fail(`${rel(skillFile)}: invalid lowercase kebab-case name`);
  if (names.has(frontmatter.name))
    fail(`${rel(skillFile)}: duplicate skill name ${frontmatter.name}`);
  names.add(frontmatter.name);
  const description = frontmatter.description ?? '';
  if (description.length < 80 || description.length > 500)
    fail(`${rel(skillFile)}: description must be discriminating (80-500 chars)`);
  if (!/(Use|use|when|for `)/.test(description) || !/(do not|exclude|Excludes)/.test(description)) {
    fail(`${rel(skillFile)}: description must state activation and exclusion boundary`);
  }
  for (const heading of [
    '# Purpose',
    '# Mandatory invariants',
    '# Workflow',
    '# Reference routing',
    '# Result checks',
    '# Stop conditions',
    '# Allowed exceptions',
  ]) {
    if (!skillText.includes(heading)) fail(`${rel(skillFile)}: missing section ${heading}`);
  }

  const linkedRefs = new Set(
    [...skillText.matchAll(/\]\(references\/([^\s)#?]+\.md)(?:#[^)]+)?\)/g)].map(
      (match) => match[1],
    ),
  );
  const refsDir = path.join(skillDir, 'references');
  const actualRefs = new Set(
    (await readdir(refsDir, { withFileTypes: true }))
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name),
  );
  const requiredRefs = new Set(expected.get(folder));
  for (const ref of requiredRefs)
    if (!actualRefs.has(ref)) fail(`${folder}: missing required reference ${ref}`);
  for (const ref of actualRefs)
    if (!requiredRefs.has(ref)) fail(`${folder}: unexpected/unused reference ${ref}`);
  for (const ref of actualRefs)
    if (!linkedRefs.has(ref)) fail(`${folder}: reference not routed from SKILL.md: ${ref}`);
  for (const ref of linkedRefs)
    if (!actualRefs.has(ref)) fail(`${folder}: linked reference does not exist: ${ref}`);

  if (await existingFile(agentFile)) {
    checkedFiles.add(agentFile);
    validateOpenAiYaml(await readFile(agentFile, 'utf8'), agentFile, folder);
  }

  for (const file of await walk(skillDir)) {
    checkedFiles.add(file);
    const basename = path.basename(file).toLowerCase();
    if (basename === 'readme.md' || basename.startsWith('changelog'))
      fail(`${rel(file)}: forbidden skill auxiliary file`);
  }
}

for (const file of checkedFiles) {
  const text = await readFile(file, 'utf8');
  if (
    /\[(?:TODO|TBD|FIXME)[^\]]*\]|\bREPLACE[_ -]?ME\b|Briefly describe what this skill does|Add the task-specific guidance/i.test(
      text,
    )
  ) {
    fail(`${rel(file)}: unfinished placeholder/scaffold text`);
  }
  const secretPatterns = [
    /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
    /\bAKIA[0-9A-Z]{16}\b/,
    /\bgh[opusr]_[A-Za-z0-9]{30,}\b/,
    /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/,
    /\bsk_live_[A-Za-z0-9]{16,}\b/,
  ];
  if (secretPatterns.some((pattern) => pattern.test(text)))
    fail(`${rel(file)}: possible committed secret`);

  if (file.endsWith('.md')) {
    for (const match of text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
      const target = match[1].trim().split('#')[0];
      if (!target || /^(?:https?:|mailto:|#)/.test(target) || path.isAbsolute(target)) continue;
      const resolved = path.resolve(path.dirname(file), decodeURIComponent(target));
      if (!(await existingFile(resolved))) fail(`${rel(file)}: broken relative link ${match[1]}`);
    }
  }
}

const packageJson = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
if (packageJson.engines?.node !== '24.20.0') fail('package.json: engines.node must equal 24.20.0');
if (packageJson.engines?.pnpm !== '11.25.0') fail('package.json: engines.pnpm must equal 11.25.0');
if (packageJson.packageManager !== 'pnpm@11.25.0')
  fail('package.json: packageManager must equal pnpm@11.25.0');
if ((await readFile(path.join(root, '.nvmrc'), 'utf8')).trim() !== '24.20.0')
  fail('.nvmrc must equal 24.20.0');
const npmrc = await readFile(path.join(root, '.npmrc'), 'utf8');
if (!/^engine-strict=true$/m.test(npmrc)) fail('.npmrc must enforce engine-strict=true');
if (!/^manage-package-manager-versions=true$/m.test(npmrc))
  fail('.npmrc must enforce the packageManager pin');

const workspaceManifests = [path.join(root, 'package.json')];
for (const workspaceDir of ['apps', 'packages']) {
  const parent = path.join(root, workspaceDir);
  for (const entry of await readdir(parent, { withFileTypes: true })) {
    if (entry.isDirectory()) workspaceManifests.push(path.join(parent, entry.name, 'package.json'));
  }
}
for (const manifest of workspaceManifests) {
  const json = JSON.parse(await readFile(manifest, 'utf8'));
  for (const section of [
    'dependencies',
    'devDependencies',
    'optionalDependencies',
    'peerDependencies',
  ]) {
    for (const [dependency, version] of Object.entries(json[section] ?? {})) {
      const allowedLocal = version === 'workspace:*' || version === 'catalog:';
      const exact = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version);
      if (!allowedLocal && !exact)
        fail(`${rel(manifest)}: ${dependency} uses uncontrolled version ${version}`);
    }
  }
}

const compose = await readFile(path.join(root, 'docker-compose.yml'), 'utf8');
if (/image:\s*[^\s]+:(?:latest|[0-9]+|[0-9]+-alpine)\s*$/m.test(compose))
  fail('docker-compose.yml: image tags must be exact and must not use latest/major-only tags');
for (const service of [
  'web',
  'api',
  'worker',
  'postgres',
  'redis',
  'minio',
  'mailpit',
  'otel-collector',
]) {
  if (!new RegExp(`^  ${service}:`, 'm').test(compose))
    fail(`docker-compose.yml: missing required local service ${service}`);
}

const ci = await readFile(path.join(root, '.github', 'workflows', 'ci.yml'), 'utf8');
for (const match of ci.matchAll(/uses:\s*[^\s@]+@([^\s]+)/g)) {
  if (!/^v\d+\.\d+\.\d+$/.test(match[1]) && !/^[a-f0-9]{40}$/.test(match[1])) {
    fail(`.github/workflows/ci.yml: action reference must be an exact tag or commit: ${match[0]}`);
  }
}

if (errors.length > 0) {
  console.error(`Skills validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  const referenceCount = [...expected.values()].reduce((sum, refs) => sum + refs.length, 0);
  console.log(
    `Skills validation passed: ${expected.size} skills, ${referenceCount} references, ${checkedFiles.size} files checked.`,
  );
}
