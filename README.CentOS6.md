#LORIS CentOS 6.x Notes

Note that the main README in LORIS assumes that LORIS is being run on Ubuntu.

This document contains details on how to manually perform a basic CentOS 6.x
install of LORIS without using the install script (as the install script
makes some assumptions about apt-get being installed.)

It assumes you already understand basic UNIX, MySQL and Apache setup and
settings. If you're not already comfortable troubleshooting sysadmin issues,
you should not follow this guide.

For further details on the install process including LORIS nomenclature for recommended UNIX, MySQL and front-end user accounts, please see the LORIS GitHub Wiki CentOS Install page.  

# 1. System Requirements

The yum packages to be installed vary from the Ubuntu packages referenced
in the LORIS README

The following should be installed with yum:
 
```bash
yum install httpd
yum install php
yum install php-pear
yum install php-pdo
yum install php-mysql
yum install mysql
```

PHP Composer must also be installed:
```bash
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

Note that the default dependencies installed by CentOS 6.x may not meet the version requirements LORIS deployment or development.
* MySQL 5.5 or lower is supported for LORIS 16.*
* PHP 5.6 (or 5.5) is required for LORIS 16.* - upgrade your PHP manually
Or run composer with the `--no-dev` option. (Upgrading PHP is preferred, but for now we'll
assume you just want to get it running, so we'll run it with `--no-dev`.)

```bash
# Will download all of LORIS's library requirements, assuming an
# active internet connection. This must be done from the LORIS
# root directory that you downloaded and extracted LORIS into.
# Expect this step to print scary warning messages 
# about downloading and installing dependencies. 
composer install --no-dev
```

## 1.1 MySQL

This details how to manual populate the MySQL database which is assumed
to already exist (if not, create one before proceeding)

Connect to MySQL, use your database and source all the files in the
SQL/ directory of LORIS which are prefixed with `0000-00-` into it
(ie `SQL/0000-00-00-schema.sql`, `SQL/0000-00-01-Permission.sql`, 
`SQL/0000-00-02-Menus.sql`, etc.)

There are a few settings in the Config module that LORIS currently depends
on being updated to load correctly -- these must be set manually from the MySQL commandline as
they're normally set by the install script.

```SQL
UPDATE Config SET Value='/var/www/loris/' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='base');
UPDATE Config SET Value='localhost' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='host');
UPDATE Config SET Value='http://localhost' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='url');
```

Where `/var/www/loris/` is the location where LORIS is installed and assuming
you'll be running on localhost (otherwise update host and url appropriately)

Set the password for the front-end _admin_ user account while connected to MySQL.

```SQL
-- Set 'admin' front-end user account password to YOURPASSWORD
UPDATE users SET Password_md5=CONCAT('aa', MD5('aaYOURPASSWORD')) WHERE ID=1;
```

## 1.2 Config.xml

Create a directory named "project" directory under the LORIS root, and copy
the sample config.xml from `docs/config/config.xml` to `project/config.xml`

Update the _database_ tagset section of config.xml to point to the database you
just configured with an appropriate user. (Ignore _quatuser_ and _quatpassword_ tags.)

## 1.3 Apache

A sample apache configuration file is in `docs/config/apache2-site`. 
You can copy this file to the apache configuration directory (`/etc/httpd/conf.d/`), adding the appropriate suffix:

```bash
cp docs/config/apache-site /etc/httpd/conf.d/apache-site.conf
```

Update the paths and settings in this new file as appropriate for your server, ensuring that all placeholders (`%LORISROOT%`, `%PROJECTNAME%`, `%LOGDIRECTORY%`) are populated. Ensure that the DocumentRoot is pointing to the htdocs/ directory under your LORIS root (usually `/var/www/loris/htdocs`).

You'll have to create a `smarty/templates_c/` directory under the LORIS
root and assure that it's writable by Apache.

## 1.4 Last steps

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

At this point, you should be able to log in to LORIS
at http://localhost/ using the username "admin" and the password that
you set in section 1.1. Further configuration can be done using the
LORIS configuration module.

If there are any errors or you get a blank page, you'll have to troubleshoot
based on the errors in your apache error log (by default
 `/var/log/httpd/error_log`) 
