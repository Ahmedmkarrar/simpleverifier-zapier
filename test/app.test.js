const { test } = require('node:test');
const assert = require('node:assert');
const zapier = require('zapier-platform-core');
const App = require('../index');

test('app definition passes the Zapier schema', () => {
  const schema = require('zapier-platform-core/src/tools/schema');
  assert.deepStrictEqual(schema.validateApp(schema.compileApp(App)), []);
});

test('API key goes in a Bearer header', () => {
  const request = App.beforeRequest[0]({ headers: {} }, {}, { authData: { apiKey: 'sv_live_x' } });
  assert.strictEqual(request.headers.Authorization, 'Bearer sv_live_x');
});

test('a bad key fails the connection test without spending a check', { skip: !process.env.LIVE }, async () => {
  const appTester = zapier.createAppTester(App);
  await assert.rejects(appTester(App.authentication.test, { authData: { apiKey: 'sv_live_invalid' } }));
});
