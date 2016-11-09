#LORIS CentOS 6.x Notes

This document contains supplemental details on how to perform a basic CentOS 6.x install of LORIS.
Note that the main README in LORIS assumes that LORIS is being run on Ubuntu.
As of Loris 17.0, the install script and web-based install steps as described in the main (Ubuntu) readme are applicable to CentOS installs. 

This Readme assumes you already understand basic UNIX, MySQL and Apache setup and
settings. If you're not already comfortable troubleshooting sysadmin issues,
you should not follow this guide.

For further details on the install process, please see the LORIS GitHub Wiki CentOS Install page.  

# System Requirements

Default dependencies installed by CentOS 6.x may not meet the version requirements LORIS deployment or development.
* MySQL 5.7 is supported for LORIS 17.*
* PHP 7 is supported for LORIS 17.* - upgrade your PHP manually

The yum packages to be installed vary from any Ubuntu packages referenced in the LORIS README.

The following should be installed with yum:
 
```bash
yum install httpd
yum install php
yum install php-pdo
yum install php-mysql
yum install mysql
```

PHP Composer must also be installed:
```bash
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

If you just want to get Loris running and upgrade your PHP later, run composer with the `--no-dev` option. 

```bash
# Will download all of LORIS's library requirements, assuming an
# active internet connection. This must be done from the LORIS
# root directory that you downloaded and extracted LORIS into.
# Expect this step to print scary warning messages 
# about downloading and installing dependencies. 
# It may be necessary to create the project/libraries/ directory before running composer install 
composer install --no-dev
```

## Apache configuration

A sample apache configuration file is in `docs/config/apache2-site`. 
The install script will ask if you want to automatically create/install apache config files.
To perform this step manually, copy the sample file to the apache configuration directory (`/etc/httpd/conf.d/`), and add the `.conf` file extension:

```bash
cp docs/config/apache-site /etc/httpd/conf.d/apache-site.conf
```

Ensure that paths and settings in this new file are populated appropriately for your server, e.g. replacing placeholders such as `%LORISROOT%`, `%PROJECTNAME%`, `%LOGDIRECTORY%`. Ensure that the DocumentRoot is pointing to the htdocs/ directory under your LORIS root (usually `/var/www/loris/htdocs`).

Also ensure that your new `smarty/templates_c/` directory under the LORIS
root is writable by Apache.

## SELinux

Finally, SELinux will block MySQL connections from PHP. For now, we'll 
disable SELinux (though on a production server you should learn how to
properly configure it instead.)

```bash
echo 0 >/selinux/enforce
```

And restart apache
```bash
service httpd stop
service httpd start
```

Further configuration can be done using the LORIS configuration module.

If there are any errors or you get a blank page, you'll have to troubleshoot
based on the errors in your apache error log (by default
 `/var/log/httpd/error_log`) 
