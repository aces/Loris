# Enabling reCAPTCHA in LORIS

LORIS can be configured to require [Google reCAPTCHA](https://www.google.com/recaptcha/intro/v3.html) in order to limit spam. These following instructions have been tested for reCAPTCHA v2.

After following Google's instructions for obtaining the your public and private keys, you can
use them by updating your configuration settings in the `Config` table in the database:

* `reCAPTCHAPrivate` and `reCAPTCHAPublic`. These should be set to the
corresponding values from your Google reCAPTCHA admin account.
This can also be configured via the Configuration module by modifying the values found in the "API Keys" heading.

* `CSPAdditionalHeaders` should include "frame-src www.google.com;" in order
for the reCAPTCHA to render.
This can also be configured via the Configuration module by modifying the values found in the "Study" heading.

