# ROR TypeScript SDK — Voxgig assessment

An unofficial MIT-licensed client for the public Research Organization Registry v2 API, generated with Voxgig. No signup, work email, API key or paid account is required for these examples.

The repository name was chosen for an initial Formbricks attempt. The final assessment uses **ROR**, avoiding Formbricks' signup barrier. The generated package is named `ror-sdk`; no npm package has been published.

| Operation | SDK method | API route |
| --- | --- | --- |
| Search / list organizations | `client.Organization().list({ query: 'Bath' })` | `GET /v2/organizations` |
| Retrieve an organization | `client.Organization().load({ id: '00tjv0s33' })` | `GET /v2/organizations/{id}` |

## Setup

Requires Node.js 24 or newer. From the project root:

```bash
npm ci --prefix .sdk
npm ci --prefix ts
npm run generate
npm run build
npm test
npm run test:live
npm run doctor
```

## Quickstart

Install this local generated package in another project with `npm install /absolute/path/to/checkout/ts`.

```ts
import { RorSDK } from 'ror-sdk'

const client = new RorSDK()
const organizations = await client.Organization().list({ query: 'Bath' })
for (const organization of organizations) {
  console.log(organization.data())
}
const organization = await client.Organization().load({ id: '00tjv0s33' })
console.log(organization.data())
```

The client returns entities; `.data()` exposes each record. List results unwrap the upstream `items` array. Load results use the upstream record directly. Use `try/catch` because entity methods reject on HTTP errors.

## Verification and scope

The project includes generated offline tests, local HTTP contract tests, and a live script that calls both routes against the actual public ROR service. The live script uses only neutral public examples from ROR documentation and makes a small number of sequential requests. Routine CI runs offline tests; manual CI can also run the live check. Native fetch uses a 20-second timeout per request. In a proxy-restricted environment with curl installed, use `ROR_USE_CURL=1 npm run test:live` (PowerShell: `$env:ROR_USE_CURL='1'; npm run test:live`) to use the SDK's supported custom HTTP transport. The live results for this assessment used that transport.

The independent OpenAPI subset models selected organization fields, the query/page/filter parameters, and list/load operations. It is not the complete official ROR schema. Lists expose one page; automatic pagination is not configured. ROR offers optional client identification and may change rate limits; check its current documentation before production usage.

## Regeneration

Edit `openapi/ror.json`, copy it to `.sdk/def/ror.json`, and run `npm run generate`. Project metadata is in `.sdk/model/project.aontu`. Generated source is in `ts/`; change the model or generator templates/components rather than editing that output. The overlay disables root-file generation so the project licence and authored report survive regeneration.

See [ASSESSMENT_REPORT.md](ASSESSMENT_REPORT.md) and [VERIFICATION.md](VERIFICATION.md) for results and observed generator issues. [MIT licence](LICENSE); [upstream notices](THIRD_PARTY_LICENSES.md).

## Sources

- https://voxgig.com/sdk
- https://ror.readme.io/docs/rest-api
- https://ror.readme.io/docs/api-query
- https://ror.readme.io/docs/api-single
- https://ror.readme.io/docs/client-id
