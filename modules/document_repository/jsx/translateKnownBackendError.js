const KNOWN_BACKEND_ERROR_MSGIDS = Object.freeze({
  'Duplicate category name under same parent folder.':
    'Duplicate category name under same parent folder.',
  'Can not delete non-empty category':
    'Can not delete non-empty category',
});

/**
 * Translate known backend error bodies while preserving raw fallback text.
 *
 * @param {string} message - Backend-provided error body.
 * @param {function} t - i18n translate function.
 * @return {string} Translated text for known messages or raw fallback.
 */
const translateKnownBackendError = (message, t) => {
  if (typeof message !== 'string' || message === '') {
    return message;
  }
  const msgid = KNOWN_BACKEND_ERROR_MSGIDS[message];
  if (!msgid || typeof t !== 'function') {
    return message;
  }
  return t(msgid, {ns: 'document_repository', defaultValue: message});
};

export default translateKnownBackendError;
