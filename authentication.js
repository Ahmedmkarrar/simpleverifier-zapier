const { API_BASE } = require('./constants');

const test = async (z) => {
  const response = await z.request({ url: `${API_BASE}/me`, skipThrowForStatus: true });
  if (response.status === 401) throw new z.errors.Error('Your API key was not accepted. Create one at https://simpleverifier.com/api-keys', 'AuthenticationError', 401);
  if (response.status === 402) throw new z.errors.Error(response.data.error || 'This plan does not include API access. Upgrade at https://simpleverifier.com/pricing', 'AuthenticationError', 402);
  response.throwForStatus();
  return response.data;
};

module.exports = {
  type: 'custom',
  fields: [
    {
      key: 'apiKey',
      label: 'API Key',
      required: true,
      type: 'password',
      helpText:
        'Create a key on your [SimpleVerifier API keys page](https://simpleverifier.com/api-keys). It starts with `sv_live_`. API access comes with selected paid plans (see simpleverifier.com/pricing).',
    },
  ],
  test,
  connectionLabel: '{{email}}',
};
