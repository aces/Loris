## Overview

Loris allows users to use `Google reCAPTCHA V2` to protect public pages from spam and abuse. Currently this feature is implemented on `Request Account` page, but can easily be added to other public pages.

<p align="center">
  <img src="https://cloud.githubusercontent.com/assets/6627543/25592114/7ea3a5c8-2e85-11e7-9001-a1c2fece7efe.png" alt="Request Account Page Screenshot"/>
</p>

>**Note**: A project needs to have reCAPTCHA keys set in `Configuration` module in order to use this functionality.  
Follow [set up](#set-up) instruction below to set the keys.

---

## Set up

1. [Login](https://www.google.com/recaptcha/admin) to reCAPTCHA site with your Google account 

2. Follow the steps to register a new site (**Note**: Loris uses reCAPTCHA V2)
<p align="center">
  <img src="https://cloud.githubusercontent.com/assets/6627543/25592555/36a63662-2e87-11e7-9eb1-ae1a2a8e4bbd.png" alt="Google reCAPTCHA Screenshot 1"/>
</p>

3. Locate `Site Key` and `Secret Key` on reCAPTCHA website
<p align="center">
  <img src="https://cloud.githubusercontent.com/assets/6627543/25593258/d8371710-2e89-11e7-8e41-e72e5e687743.png" alt="Google reCAPTCHA Screenshot 2"/>
</p>

4. Open Loris `Configuration` module and copy the `Site Key` (Public Key) and the `Secret Key` (Private Key) in the appropriate section as shown in the screenshot.
<p align="center">
  <img src="https://cloud.githubusercontent.com/assets/6627543/25593293/fa667da8-2e89-11e7-95ff-5c4b9b98b808.png" alt="Loris Configuration Module"/>
</p>

---

## Add reCAPTCHA to Loris pages

1. Display reCAPTCHA on a Loris page

**PHP**
```php
// Get reCAPTCHA keys
$reCAPTCHAPrivate = $config->getSetting('reCAPTCHAPrivate');
$reCAPTCHAPublic  = $config->getSetting('reCAPTCHAPublic');

// Display reCAPTCHA if both private and public keys are set
if ($reCAPTCHAPrivate && $reCAPTCHAPublic) {
    $tpl_data['captcha_key'] = $reCAPTCHAPublic;
}
```
**Template (Smarty)**
```tpl
{if $captcha_key}
    <div class="g-recaptcha" data-sitekey="{$captcha_key}"></div>
{/if}
```

2. Validate request with reCAPTCHA

```php
// Verify reCAPTCHA on POST request
$reCAPTCHAPrivate = $config->getSetting('reCAPTCHAPrivate');
if (isset($_POST['g-recaptcha-response']) && isset($reCAPTCHAPrivate)) {
    $recaptcha = new \ReCaptcha\ReCaptcha($reCAPTCHAPrivate);
    $resp      = $recaptcha->verify(
        $_POST['g-recaptcha-response'],
        $_SERVER['REMOTE_ADDR']
    );
    if (!$resp->isSuccess()) {
        $errors         = $resp->getErrorCodes();
        $err['captcha'] = 'Please complete the reCaptcha!';
    }
}
```

---

## Additional Resources

To read more about reCAPTCHA, visit https://www.google.com/recaptcha/