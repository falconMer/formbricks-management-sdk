# Voxgig mini-task 1: developer-experience report

**Author:** Smail Mersad  
**Date:** 8 October 2026  
**API:** Research Organization Registry (ROR), public v2 API  
**Repository:** https://github.com/falconMer/formbricks-management-sdk

## Result and choice of API

A TypeScript SDK was generated with the Voxgig toolchain, MIT licensed, and checked with generated tests, local HTTP contract tests and real ROR requests. ROR was absent from the Voxgig website catalogue and GitHub searches for `ror org:voxgig-sdk` and `"research organization" org:voxgig-sdk` on this date.

Formbricks was the initial choice, but cloud signup requested a work-email domain the candidate did not have. The final API was changed to ROR, which allows public requests without credentials. A SaaS trial was recommended in the brief, not mandatory. The repository keeps the name chosen for the initial attempt; the final package is `ror-sdk`.

| Verification | Observed result |
| --- | --- |
| TypeScript generation and build | Passed |
| Generated offline tests | 202 passed, 0 failed, 1 skipped |
| Local HTTP contract tests | 5 passed, 0 failed |
| Live generated-SDK search | Passed: 17 organizations for the public `Bath` example |
| Live generated-SDK load | Passed: `https://ror.org/00tjv0s33`, names present |
| `voxgig-sdkgen doctor` | Passed: `.sdk matches the scaffold (0 additive)` |

## Observations and recommendations

The entity interface was straightforward: `Organization().list(...)` and `Organization().load(...)`. The generator correctly unwrapped `items` for lists and used the direct record for loads. The offline tests check runtime behavior and documentation examples without credentials. The custom `system.fetch` option made live testing possible in a proxy-restricted environment without changing generated source.

The initial Formbricks scaffold hit npm `ERESOLVE`: `create-sdkgen` 0.30.6 pinned `apidef ~8.22.1` and `sdkgen ~4.34.0`, but sdkgen 4.34.1 required apidef >=8.23.0. The working projects pin sdkgen 4.34.0. Recommendation: continuously validate scaffold dependency ranges against newly released patches and diagnose incompatible toolchain versions clearly.

Using `--no-install` with `--target` and `--feature` creates the scaffold but fails because target installation needs the toolchain. The error explains the recovery. A second sequencing issue occurred when target metadata was declared before `target add`: model unification failed on missing `ext` and `comment.line`. Recommendation: make the target-add command tolerate an existing partial project overlay, or explain this ordering in onboarding. Installing dependencies, adding the target, then restoring its overlay worked.

Root licence attribution defaults to Voxgig. The supported overlay `phase.top.active: false` lets the project retain authored root documentation and copyright while keeping upstream MIT notices. Recommendation: make root copyright configurable together with package authorship.

Generation logs optional `require-missing` warnings for `ReadmeFeatures_ts` and `AgentGuide_ts` despite successful output and tests. Recommendation: label these as optional fallback messages.

The previous Formbricks contract checks also found that a missing required query argument was sent to the server rather than rejected locally. That finding remains useful feedback from the initial attempt; it is not a live ROR failure.

## Scope and AI disclosure

The independently authored OpenAPI subset covers organization list/search and load, selected fields, and query/page/filter parameters. It does not claim the complete ROR schema or automatic pagination. Real API verification made only two sequential public requests through the generated SDK using its supported curl-backed custom transport. Default native-fetch access to the public service stalled in this build environment; native fetch worked in local HTTP contract checks.

AI performed research, generation, model configuration, verification and documentation. No human personal review or human work duration is claimed. The brief's 30-minute human-work cap remains applicable; automated execution spanned multiple sessions. No npm release, message to Voxgig or invoice was sent.

## Sources

- https://voxgig.com/sdk
- https://github.com/voxgig/create-sdkgen/blob/main/AGENTS.md
- https://github.com/orgs/voxgig-sdk/repositories
- https://ror.readme.io/docs/rest-api
- https://ror.readme.io/docs/api-query
- https://ror.readme.io/docs/api-single
- https://ror.readme.io/docs/client-id
