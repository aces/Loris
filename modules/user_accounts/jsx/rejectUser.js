import swal from 'sweetalert2';
import i18n from 'I18nSetup';
import hiStrings from '../locale/hi/LC_MESSAGES/user_accounts.json';
import jaStrings from '../locale/ja/LC_MESSAGES/user_accounts.json';
import frStrings from '../locale/fr/LC_MESSAGES/user_accounts.json';
import zhStrings from '../locale/zh/LC_MESSAGES/user_accounts.json';

window.addEventListener('load', () => {
  i18n.addResourceBundle('ja', 'user_accounts', jaStrings);
  i18n.addResourceBundle('hi', 'user_accounts', hiStrings);
  i18n.addResourceBundle('fr', 'user_accounts', frStrings);
  i18n.addResourceBundle('zh', 'user_accounts', zhStrings);
  const btn = document.getElementById('btn_reject');

  if (!btn) return;

  btn.addEventListener('click', () => {
    const pathParts = window.location.pathname.split('/');
    const userID = pathParts[pathParts.length - 1];
    const baseurl = loris.BaseURL;

    swal.fire({
      title: i18n.t('Are you sure?', {ns: 'loris'}),
      html: i18n.t('Do you really want to reject this user?', {ns: 'user_accounts'}) + 
            '<br>' + 
            i18n.t('This action cannot be undone.', {ns: 'user_accounts'}),
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: i18n.t('Yes, reject user!', {ns: 'user_accounts'}),
      cancelButtonText: i18n.t('Cancel', {ns: 'loris'}),
    }).then((result) => {
      if (result.value) {
        fetch(`${baseurl}/user_accounts/ajax/rejectUser.php`, {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            identifier: userID,
          }),
        })
          .then((resp) => {
            if (!resp.ok) {
              return resp.text().then((text) => {
                throw new Error(text);
              });
            }
            window.location.href = `${baseurl}/user_accounts/`;
          })
          .catch((error) => {
            swal.fire(i18n.t('Error', {ns: 'loris'}), error.message, 'error');
          });
      }
    });
  });
});
