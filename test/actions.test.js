const { test, before, after } = require('node:test');
const assert = require('node:assert');
const { startMockApi } = require('./mock-api');

let mock;
let appTester;
let App;

before(async () => {
  mock = await startMockApi();
  process.env.SV_API_BASE = mock.base;
  const zapier = require('zapier-platform-core');
  App = require('../index');
  appTester = zapier.createAppTester(App);
});

after(() => mock.server.close());

const auth = (apiKey = 'sv_live_mockkey') => ({ authData: { apiKey } });

test('auth test accepts a good key and hits /me with a Bearer header', async () => {
  const result = await appTester(App.authentication.test, auth());
  assert.strictEqual(result.email, 'tester@example.com');
  assert.strictEqual(mock.calls.at(-1).path, '/api/v1/me');
  assert.strictEqual(mock.calls.at(-1).headers.authorization, 'Bearer sv_live_mockkey');
});

test('auth test rejects a bad key and a plan without API access', async () => {
  await assert.rejects(appTester(App.authentication.test, auth('sv_live_wrong')), /not accepted/);
  await assert.rejects(appTester(App.authentication.test, auth('sv_live_noapi')), /does not include API access/);
});

for (const [email, status, advice] of [
  ['jane@company.com', 'valid', 'safe'],
  ['info@catchall.test', 'risky', 'care'],
  ['nobody@company.com', 'invalid', 'do_not_send'],
]) {
  test(`verify_email returns ${status} for ${email}`, async () => {
    const result = await appTester(App.creates.verify_email.operation.perform, { ...auth(), inputData: { email } });
    assert.strictEqual(result.status, status);
    assert.strictEqual(result.send_advice, advice);
    assert.deepStrictEqual(mock.calls.at(-1).body, { email });
  });
}

test('verify_email surfaces API errors with the API message', async () => {
  await assert.rejects(
    appTester(App.creates.verify_email.operation.perform, { ...auth(), inputData: { email: '' } }),
    /email is required/,
  );
});

test('verify_email retries later on a rate limit', async () => {
  await assert.rejects(
    appTester(App.creates.verify_email.operation.perform, { ...auth('sv_live_throttled'), inputData: { email: 'jane@company.com' } }),
    (error) => error.name === 'ThrottledError',
  );
});

test('validate_phone defaults to US and live lookup on', async () => {
  const result = await appTester(App.creates.validate_phone.operation.perform, { ...auth(), inputData: { phone: '(415) 555-2671' } });
  assert.strictEqual(result.phone_e164, '+14155552671');
  assert.deepStrictEqual(mock.calls.at(-1).body, { phone: '(415) 555-2671', country: 'US', live: true });
  assert.strictEqual(result.phone_carrier, 'Mock Carrier');
});

test('validate_phone with live lookup switched off sends live=false', async () => {
  const result = await appTester(App.creates.validate_phone.operation.perform, {
    ...auth(),
    inputData: { phone: '+44 7911 123456', country: 'GB', live: false },
  });
  assert.strictEqual(mock.calls.at(-1).body.live, false);
  assert.strictEqual(result.live_lookup, false);
  assert.strictEqual(result.phone_carrier, undefined);
});

test('every action sample matches its declared output fields', () => {
  for (const create of Object.values(App.creates)) {
    const keys = create.operation.outputFields.map((f) => f.key);
    for (const key of Object.keys(create.operation.sample)) assert.ok(keys.includes(key), `${create.key}: sample key ${key} has no outputField`);
  }
});
