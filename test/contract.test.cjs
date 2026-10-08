const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { RorSDK } = require('../ts/dist/RorSDK');
const record = { id: 'https://ror.org/00tjv0s33', status: 'active', names: [{ value: 'Public Test University', types: ['ror_display'], lang: null }], types: ['education'], domains: [], locations: [] };
let server, base;
const requests = [];
before(async () => {
  server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    requests.push({ url, headers: req.headers });
    res.setHeader('content-type', 'application/json');
    if (url.pathname === '/v2/organizations') {
      return res.end(JSON.stringify({ number_of_results: 1, items: url.searchParams.get('query') === 'empty' ? [] : [record] }));
    }
    if (url.pathname === '/v2/organizations/00tjv0s33') return res.end(JSON.stringify(record));
    res.writeHead(404); res.end(JSON.stringify({ errors: ['Not found'] }));
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}/v2`;
});
after(async () => { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); });
function client() { return new RorSDK({ base }); }

test('list unwraps items into entities and preserves nested names', async () => {
  const rows = await client().Organization().list({ query: 'Bath' });
  assert.deepEqual(rows[0].data(), record);
  assert.equal(requests.at(-1).url.pathname, '/v2/organizations');
  assert.equal(requests.at(-1).headers.authorization, undefined);
  assert.equal(requests.at(-1).headers['x-api-key'], undefined);
});
test('query parameters are encoded and page/filter remain separate', async () => {
  await client().Organization().list({ query: 'Public & Test', page: 2, filter: 'types:education' });
  const q = requests.at(-1).url.searchParams;
  assert.equal(q.get('query'), 'Public & Test'); assert.equal(q.get('page'), '2'); assert.equal(q.get('filter'), 'types:education');
});
test('load parses a direct record', async () => {
  assert.deepEqual((await client().Organization().load({ id: '00tjv0s33' })).data(), record);
});
test('an empty items list resolves to an empty entity list', async () => {
  assert.deepEqual(await client().Organization().list({ query: 'empty' }), []);
});
test('HTTP 404 rejects the load operation', async () => {
  await assert.rejects(client().Organization().load({ id: '000000000' }));
});
