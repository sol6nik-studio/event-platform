## Summary

<!-- What changed, why, and what user or operator outcome does it provide? -->

## Verification

<!-- List exact commands and manual checks. -->

- [ ] `pnpm check`
- [ ] `pnpm build`
- [ ] Relevant migrations, API contracts, and documentation are updated

## Risk and security

<!-- Note authorization, data, migration, compatibility, rollout, and rollback impact. -->

- [ ] No secrets, credentials, personal data, or sensitive logs are included
- [ ] New local environment variables are documented without secrets in `.env.example`
- [ ] Security-sensitive behavior has regression coverage where practical
