# LORIS CentOS 7.x Notes

This document contains supplemental details on how to perform a basic CentOS 7.x install of LORIS.
Note that the main README in LORIS assumes that LORIS is being run on Ubuntu.

This Readme assumes some familiarity with Linux, MariaDB (MySQL) and Apache.

For further details on the install process, please see the LORIS GitHub Wiki CentOS Install page.  

# System Requirements - Install dependencies

Default dependencies installed by CentOS 7.x may not meet the version requirements for LORIS deployment or development:
* MariaDB 10.3 is supported for LORIS 21.* 
* PHP 7.2 is supported for LORIS 21.*

In addition to the above, the following packages should be installed with `yum` and may also differ from the packages referenced in the main (Ubuntu) [LORIS Readme](./README.md). Detailed command examples are provided below (`sudo` privilege may be required depending on your system).
 * Apache 2.4 or higher
 * [Composer](https://getcomposer.org)
 * NodeJS 8.0 or higher
 * NPM >= 8.0
 * make

## Apache2
```bash
sudo yum install httpd 
sudo systemctl enable httpd
sudo systemctl start httpd
```
## PHP 7.2
```bash
sudo yum install epel-release
sudo yum install http://rpms.remirepo.net/enterprise/remi-release-7.rpm
sudo yum install yum-utils
sudo yum-config-manager --enable remi-php72
sudo yum update
sudo yum install php72
sudo yum install php72-php-fpm php72-php-gd php72-php-json php72-php-mbstring php72-php-mysqlnd php72-php-xml php72-php-xmlrpc php72-php-opcache php72-php-pdo php72-php-mysql
```
## MariaDB

MySQL is not recommended/supported on CentOS, see [paragraph 2 here](https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-centos-7) for background). MySQL and MariaDB are nearly identical in operation.

*Note:* LORIS developers (those NOT working with a .zip release codebase) should skip steps relating to hosting their database locally. Contact your system administrator for database credentials.

```bash
sudo yum install MariaDB-client MariaDB-server
```

By default in CentOS 7, the MariaDB version is 10.2
Check what version you have installed by running:
```
mysql -V
```

Upgrade your MariaDB to version 10.3 (LORIS 21 does not support MariaDB 10.2.27)
Then, 
```bash
sudo systemctl start mariadb 
sudo systemctl enable mariadb
sudo systemctl status mariadb
```

To finalise the MariaDB installation: 
```bash
sudo mysql_secure_installation
```
Then follow instructions to create a password for the root user.

## NodeJS
```bash
sudo yum install nodejs
```

## PHP Composer
```bash
sudo curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```
# Get the Code

Download the latest release from the [releases page](https://github.com/aces/Loris/releases) to the home directory (~/), unzip it, and copy the contents to your project directory, `/var/www/loris` (we recommend naming your project directory `loris`, although you can use a different naming convention if you prefer). 
```bash
wget https://github.com/aces/Loris/archive/v$VERSION.tar.gz
tar -zxf Loris-%VERSION%.tar.gz
cp -r Loris-%VERSION%/ /var/www/loris
```

Alternatively the latest development branch can be obtained by forking the [LORIS repository](http://github.com/aces/Loris) for development purposes. We do not support unstable dev branches. 

# Configure Apache

A sample apache configuration file is in `docs/config/apache2-site`. 
The install script will ask if you want to automatically create/install apache config files.
It is recommended to perform this step **manually** --: copy our sample file to the apache configuration directory (`/etc/httpd/conf.d/`) and add the `.conf` file extension:

```bash
cd /var/www/loris
cp docs/config/apache-site /etc/httpd/conf.d/apache-site.conf
```

Customize and Verify your settings: 
* Paths and settings in `/etc/httpd/conf.d/apache-site.conf` should be populated appropriately for your server. Replace placeholders such as `%LORISROOT%` with `/var/www/loris`, `%PROJECTNAME%` with `loris`, `%LOGDIRECTORY%` with `/var/log/httpd/loris-error.log` 
 * DocumentRoot should point to `/var/www/loris/htdocs`
 * The `smarty/templates_c/` directory must be writable by Apache (e.g. by running: `sudo chgrp -R httpd /var/www/loris/smarty/templates_c` and `sudo chmod 775 /var/www/loris/smarty/templates_c`).

Modify the Apache configuration file for our production environment.
```
vi /etc/httpd/conf/httpd.conf
```

**a.** Find & modify the `ServerName` to:
```
ServerName your.Loris.url.here:80
```

**b.** Find the lines for `DocumentRoot` and `Directory` in Apache and change them to:
```
DocumentRoot "/var/www/loris/htdocs/"
<Directory "/var/www/loris/htdocs/">
```

**c.** In the same `<Directory>` block, modify `AllowOverride` to allow all:
```
# AllowOverride controls what directives may be placed in .htaccess files.
# It can be "All", "None", or any combination of the keywords:
#   AllowOverride FileInfo AuthConfig Limit
#
AllowOverride All
```

Finally, restart apache:
```bash
sudo systemctl restart httpd
sudo systemctl status httpd
```
# Install LORIS

For the purpose of following LORIS conventions and easy understanding of all LORIS documentation, we recommend the following account names: 

* `lorisadmin` unix user with sudo permission who will setup and manage the LORIS back-end
* `lorisuser` MySQL database user with limited (insert, delete, update, select...) permissions, for database transactions requested by the Loris front-end
* `admin` default front-end username for LORIS administrator account (login via browser)

## Run the LORIS install script to set up directories

```bash
cd /var/www/loris/tools
./install.sh
```
Run the makefile (use `make dev` if you are setting up a development sandbox)
```bash
cd /var/www/loris
make
```
## Install your database
Open your browser and go to: `http://%IPADDRESS%/installdb.php`

(%IPADDRESS% will likely be the IP address of the VM you are ssh'ed into)

The web page will prompt you for the following information: 

 * `Server Hostname` localhost if your database is hosted on your VM or the IP address of your database server

 * `Admin Username` should be `root` or a MariaDB user with permission to create databases and tables

 * `Admin Password` The password you set for `root` user when running the `mysql_secure_installation` step

 * `Database Name` set to "LORIS" by default, can be customised

Click submit, and on the next screen that is presented, follow instructions to enter the username and password of your LORIS database user (`lorisuser`), and front-end `admin` user. 

If you encounter issues creating/generating your config file, you may have to manually paste the xml output that appears on the screen into the file `/var/www/loris/project/config.xml`

Your LORIS instance should now be accessible by pointing your browser URL to `http://%IPADDRESS%`

If there are any errors or you get a blank page, troubleshoot the errors in your apache error log - by default 
 `/var/log/httpd/loris-error.log`

**Next:** Follow the [**Setup Guide** in the LORIS wiki](https://github.com/aces/Loris/wiki/Setup) for all post-install steps and troubleshooting.  
Config settings can be accessed via the front-end Config module under the Admin drop-down menu.

Please see the main (Ubuntu) [LORIS Readme](./README.md) for info on our Community, Contributing, and who we are. 
