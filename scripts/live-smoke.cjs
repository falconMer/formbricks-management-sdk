const assert = require('node:assert/strict');
const { RorSDK } = require('../ts/dist/RorSDK');
(async () => {
  const transport = process.env.ROR_USE_CURL === '1' ? async (url, init) => {
    const { execFileSync } = require('node:child_process');
    const args = ['-sS', '--max-time', '20', '-w', '\n%{http_code}', '-X', init.method || 'GET'];
    for (const [key, value] of Object.entries(init.headers || {})) args.push('-H', `${key}: ${value}`);
    args.push(url);
    const text = execFileSync('curl', args, { encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 });
    const split = text.lastIndexOf('\n');
    return new Response(text.slice(0, split), { status: Number(text.slice(split + 1)), headers: { 'content-type': 'application/json' } });
  } : (url, init) => fetch(url, { ...init, signal: AbortSignal.timeout(20000) });
  const client = new RorSDK({ system: { fetch: transport } });
  const results = await client.Organization().list({ query: 'Bath' });
  assert.ok(results.length > 0, 'Expected public search results');
  assert.ok(results.every(x => /^https:\/\/ror\.org\//.test(x.data().id)));
  console.log(`PASS live search: ${results.length} organization(s), items envelope parsed.`);
  const organization = await client.Organization().load({ id: '00tjv0s33' });
  assert.equal(organization.data().id, 'https://ror.org/00tjv0s33');
  assert.ok(organization.data().names.length > 0);
  console.log(`PASS live load: ${organization.data().id}, names present.`);
  console.log('Both generated SDK operations passed against the public ROR API without credentials.');
})().catch(err => { console.error('Live verification failed:', err.message); process.exitCode = 1; });
