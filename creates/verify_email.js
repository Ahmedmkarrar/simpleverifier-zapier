const { API_BASE } = require('../constants');

const perform = async (z, bundle) => {
  const response = await z.request({
    method: 'POST',
    url: `${API_BASE}/verify`,
    body: { email: bundle.inputData.email },
  });
  return response.data;
};

module.exports = {
  key: 'verify_email',
  noun: 'Email',
  display: {
    label: 'Verify Email Address',
    description:
      'Checks syntax, domain, disposable provider and the mailbox itself (live SMTP check). Returns valid, risky or invalid with a reason.',
  },
  operation: {
    inputFields: [
      {
        key: 'email',
        label: 'Email',
        required: true,
        helpText: 'The address to check. Only "valid" means the mail server confirmed the mailbox exists.',
      },
    ],
    perform,
    sample: {
      email: 'jane@company.com',
      status: 'valid',
      reason: 'Mailbox exists',
      send_advice: 'safe',
      reason_detail: 'The mail server confirmed this mailbox exists.',
      mailbox_checked: true,
    },
    outputFields: [
      { key: 'email', label: 'Email' },
      { key: 'status', label: 'Status (valid, risky or invalid)' },
      { key: 'reason', label: 'Reason' },
      { key: 'send_advice', label: 'Send Advice (safe, care, retry or do_not_send)' },
      { key: 'reason_detail', label: 'Reason Detail' },
      { key: 'mailbox_checked', label: 'Mailbox Check Available', type: 'boolean' },
    ],
  },
};
