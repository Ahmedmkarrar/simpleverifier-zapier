const addApiKey = (request, z, bundle) => {
  if (bundle.authData && bundle.authData.apiKey) {
    request.headers = request.headers || {};
    request.headers.Authorization = `Bearer ${bundle.authData.apiKey}`;
  }
  return request;
};

const handleErrors = (response, z) => {
  if (response.status === 429) throw new z.errors.ThrottledError('SimpleVerifier rate limit reached (120 calls a minute per key).', 60);
  if (response.status === 503) throw new z.errors.ThrottledError('SimpleVerifier is briefly unavailable.', 30);
  if (response.status === 401) throw new z.errors.Error('Your API key was not accepted. Create one at https://simpleverifier.com/api-keys', 'AuthenticationError', 401);
  if (response.status === 402) throw new z.errors.Error((response.data && response.data.error) || 'This plan does not include API access. Upgrade at https://simpleverifier.com/pricing', 'AuthenticationError', 402);
  if (response.status >= 400 && response.data && response.data.error) {
    throw new z.errors.Error(response.data.error, 'ApiError', response.status);
  }
  return response;
};

module.exports = { addApiKey, handleErrors };
