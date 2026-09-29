import DOMPurify from 'dompurify';
import i18n from 'I18nSetup';

window.addEventListener('load', () => {
  const lastLogin = document.getElementById('last-login');

  if (lastLogin?.dataset.timestamp) {
    const timestamp = new Date(lastLogin.dataset.timestamp);
    if (!isNaN(timestamp.getTime())) {
      lastLogin.textContent = new Intl.DateTimeFormat(
        i18n.language.replace('_', '-'),
        {
          dateStyle: 'full',
          timeStyle: 'short',
        }
      ).format(timestamp);
    }
  }
  fetch(loris.BaseURL + '/dashboard/projectdescription').then( (resp) => {
    if (!resp.ok) {
      throw new Error('Could not get project description');
    }
    return resp.json();
  }).then( (json) => {
    const el = document.getElementById('project-description');
    el.innerHTML = DOMPurify.sanitize(json.Description);
  }).catch( (e) => console.error(e));
});
