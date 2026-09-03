export default {
  '*.{js,mjs,cjs,ts,tsx}': ['eslint --fix --max-warnings=0', 'prettier --write'],
  '*.{css,html,json,jsonc,md,yaml,yml}': 'prettier --write',
};
