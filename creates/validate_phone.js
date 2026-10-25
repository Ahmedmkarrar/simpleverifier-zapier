const { API_BASE } = require('../constants');

const perform = async (z, bundle) => {
  const response = await z.request({
    method: 'POST',
    url: `${API_BASE}/phone`,
    body: {
      phone: bundle.inputData.phone,
      country: bundle.inputData.country || 'US',
      live: !['false', '0', 'no'].includes(String(bundle.inputData.live).toLowerCase()),
    },
  });
  return response.data;
};

module.exports = {
  key: 'validate_phone',
  noun: 'Phone Number',
  display: {
    label: 'Validate Phone Number',
    description:
      'Checks a number against its country numbering plan and returns the E.164 form, country and line type. It does not say whether a number is in service.',
  },
  operation: {
    inputFields: [
      { key: 'phone', label: 'Phone Number', required: true, helpText: 'As written, e.g. +44 7911 123456 or (415) 555-2671.' },
      { key: 'country', label: 'Country', default: 'US', helpText: 'Two-letter country code used for numbers written without a leading +.' },
      {
        key: 'live',
        label: 'Live Carrier Lookup',
        type: 'boolean',
        default: 'true',
        helpText: 'Run a live carrier lookup on valid numbers. Lookups need live phone lookups on your account; without them you get the free numbering-plan check.',
      },
    ],
    perform,
    sample: {
      phone_status: 'valid',
      phone_e164: '+14155552671',
      phone_country: 'US',
      phone_type: 'fixed_line_or_mobile',
      live_lookup: false,
    },
    outputFields: [
      { key: 'phone_status', label: 'Phone Status' },
      { key: 'phone_e164', label: 'E.164 Number' },
      { key: 'phone_country', label: 'Country' },
      { key: 'phone_type', label: 'Line Type (numbering plan)' },
      { key: 'phone_carrier', label: 'Carrier (live lookup only)' },
      { key: 'phone_line_type', label: 'Line Type (live lookup only)' },
      { key: 'live_lookup', label: 'Live Lookup Ran', type: 'boolean' },
    ],
  },
};
