window.togglePwd = function() {
  const pwdInput = document.getElementById('pwd-input');
  const pwdIcon = document.getElementById('pwd-icon');

  if (pwdInput.type === 'password') {
    pwdIcon.classList.remove('glyphicon-eye-open');
    pwdIcon.classList.add('glyphicon-eye-close');
    pwdInput.type = 'text';
  } else {
    pwdIcon.classList.remove('glyphicon-eye-close');
    pwdIcon.classList.add('glyphicon-eye-open');
    pwdInput.type = 'password';
  }
};
