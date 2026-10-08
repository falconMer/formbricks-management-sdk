# Verification evidence

Executed on 8 October 2026. Final API: ROR v2.

## Toolchain

Node.js 24.19.0; npm 11.9.0; `@voxgig/create-sdkgen` 0.30.6; `@voxgig/sdkgen` 4.34.0; `@voxgig/apidef` 8.22.1. Lockfiles record the complete build and target dependency trees.

## Local checks

`npm run generate` and the TypeScript build passed. The final `npm test` run reported:

```text
Generated suite: tests 203; pass 202; fail 0; skipped 1.
HTTP contract suite: tests 5; pass 5; fail 0.
Total: 207 passed; 0 failed; 1 skipped.
```

The contract tests cover list-envelope parsing, nested names and nullable values, URL encoding, page/filter parameters, absence of authentication headers, direct-record loading, empty lists and HTTP 404 rejection.

`npm run doctor` passed:

```text
.sdk matches the scaffold (0 additive)
```

## Real API calls through the generated SDK

Command: `ROR_USE_CURL=1 npm run test:live`.

```text
PASS live search: 17 organization(s), items envelope parsed.
PASS live load: https://ror.org/00tjv0s33, names present.
Both generated SDK operations passed against the public ROR API without credentials.
```

The SDK used its documented `system.fetch` customization point with a curl-backed transport that respects request method, headers and a 20-second request limit. Only neutral public examples from ROR documentation were queried. This verifies the generated client against the public service; it is not a mocked transport. Native fetch handled local contract traffic, but native access to the public ROR host stalled in this build environment.

## Limits

The independent specification covers two routes and selected response fields. Neither complete schema compatibility nor production readiness is claimed. ROR rate limits and client-identification requirements may change. Automated checks do not substitute for the candidate's personal review.
