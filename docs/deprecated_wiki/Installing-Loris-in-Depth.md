The following details steps for **Ubuntu 16.04**. _Your mileage may vary_.

The following instructions must be executed in sequence. If you get an error at any of the steps, troubleshoot them before continuing.
> [Click here for Brief installation instructions](https://github.com/aces/Loris/wiki/Installing-Loris-in-Brief)

When you're done, don't forget to continue following the rest of the [[Setup Guide|Setup]] including imaging setup.

# Assumptions
1. You are on Ubuntu 16.04; `lsb_release -a` should say Ubuntu 16.04
1. You'll be ssh'ing into a remote machine. If you are not, just ignore the steps that tell you to `ssh`

# Getting Prerequisites
1. `ssh` into your remote machine as a user in the `sudo` group (like `root`)
1. Run the following commands in sequence. If you get an error at any of the steps, troubleshoot them before continuing.
1. `sudo apt-get update`
1. If you'll be hosting the database locally, `sudo apt-get install -y mysql-server`
1. If you'll be hosting the database externally, `sudo apt-get install -y mysql-client`
1. `sudo apt-get install -y zip curl wget python-software-properties software-properties-common`, this will install some utilities that will help the install process
1. `sudo apt-add-repository ppa:ondrej/php`, this is a personal package archive (PPA) that will allow you to install more recent versions of PHP on Ubuntu
1. `sudo apt-get update`
1. `sudo apt-get install -y apache2`, this installs the web server we need (apache2)
1. `sudo apt-get install -y php7.2 php7.2-mysql php7.2-xml php7.2-json php7.2-mbstring php7.2-gd`, this installs PHP and the necessary extensions for LORIS to work
1. `sudo apt-get install -y composer`, this is a package manager that LORIS uses for its PHP dependencies
1. `sudo apt-get install -y libapache2-mod-php7.2`, this installs a module for apache2 that allows it to use PHP
1. `sudo a2enmod php7.2`, this enables the module for apache2, in case it wasn't enabled before
1. `sudo service apache2 restart`, this restarts the web server, allowing changes (like modules being enabled) to take effect

> Ensure you have set up your MySQL root credential before continuing further. 

<!--

> To future maintainers of this documentation,
>
> PHP extensions list populated with:
>
> ```` for e in `composer show --tree | grep -oP '\-\-\K(ext-[a-zA-Z0-9-][a-zA-Z0-9-]*)' | sort | uniq | sed 's/ext-//g'`; do sudo dpkg -l | grep -wo php7.2-$e; done; ````
>
> `php7.2-json`, `php7.2-mbstring`, `php7.2-gd` are just needed by the LORIS code base for `json_encode()/json_decode()`, for the user account module, and for image processing, respectively.

-----

> To future maintainers of this documentation,
>
> If you need to know the exact names of the PHP extensions to install, run the following command,
>
> `sudo apt-cache pkgnames | grep php7 | sort`
>
> For example, `ext-xml` will have the package name `php7.0-xml`, which should be found on the output.

-->

-----

To figure out if you have a specific package installed,

`sudo dpkg -l | grep <partial-or-whole-package-name>`

So, to figure out if you have `php7.2-xml`, run `sudo dpkg -l | grep php7.2-xml`

So, to figure out if you have `libapache2-mod-php<version>`, run `sudo dpkg -l | grep libapache2-mod` (remember that partial package names work)

-----

# Terminology
+ `<unix-user>` = The unix user you ssh with
+ `<loris-release-url>` = The latest LORIS release URL
+ `<project-name>` = The name of your project
+ `<loris-host-name>` = The host name of your LORIS install (eg. www.example.com)
+ `<loris-url>` = `<loris-host-name>` with a scheme; typically `http://` or `https://` (eg. http://www.example.com)
+ `<mysql-host-name>` = The host name of your MySQL server (You usually append `:3306` to it. Maybe `localhost`?)
+ `<mysql-database>`  = The database of your LORIS install hosted on your MySQL server (Or, if you're not familiar with MySQL, the "schema")
+ `<mysql-admin-username>` = The username of your MySQL admin account (Should have all privileges or all privileges for `<mysql-database>`)
+ `<mysql-admin-password>` = The password of your MySQL admin account
+ `<mysql-user-username>` = The username of your MySQL user account (Should have `SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, REFERENCES, CREATE TEMPORARY TABLES, LOCK TABLES` granted on `<mysql-database>.*`)
+ `<mysql-user-password>` = The password of your MySQL user account

# Terminology - Glossary for credentials referenced elsewhere in this Wiki
+ `<unix-user>` = `lorisadmin` <-- A literal string
+ `<loris-release-url>` = No equivalent
+ `<project-name>` = `loris` <-- A literal string (may be something else depending on your setup)
+ `<loris-host-name>` = `$yourHostName/_$yourhost_`
+ `<mysql-host-name>` = `$dbhost`
+ `<mysql-database>`  = `$dbname`
+ `<mysql-admin-username>` = `lorisDBadmin` <-- A literal string
+ `<mysql-admin-password>` = `$newpassword`
+ `<mysql-user-username>` = `lorisuser` <-- A literal string
+ `<mysql-user-password>` = No equivalent

# Creating a user for LORIS

You may choose to run everything on `root` but that is not necessarily desirable...

1. `ssh` into your remote machine as a user in the `sudo` group (like `root`)
1. Run `sudo useradd -U -m -G sudo -s /bin/bash <unix-user>`, this creates a user and makes some changes to the user; like adding it to the `sudo` group.
1. Run `sudo passwd <unix-user>`, this changes the password of the newly created user
1. Run `su - <unix-user>`, `su` is the command for "switching users".
1. You should now be ssh'd  as `<unix-user>`

<!-- *In this example, `loris-install-dude` is the `<unix-user>`* -->

<!-- [[img/Installing-Loris-After-Installing-Prerequisites/creating-user-create.png]] -->

# Getting the LORIS codebase

Make sure you're ssh'd as `<unix-user>`

1. Run `cd /var/www` (Or where your `apache2` is serving files from)

If you want to get the files with Git, [go here](https://github.com/aces/Loris/wiki/Setting-Up-Git)

If you want to get the files via a `zip` file, [go here](https://github.com/aces/Loris/wiki/Getting-the-Release)

2. Run `sudo chown <unix-user>.<unix-user> loris`

> If `cd /var/www` fails, saying the directory does not exist, make sure you have apache2 installed and that the directory `/var/www` is readable (and, later, writable) by the current unix user (which should be the case).

> To check if you have apache2 installed, run `apache2 -v`. If you get an error, you do not have apache2 installed and should go install it with `sudo apt-get install apache2`.

> Note that the path is assumed to be var/www/loris however your own path may be var/www/`<project-name>`, depending on your setup. 



<!-- *In this example, `LorisInstall` is the `<loris-directory>`* -->

<!-- [[img/Installing-Loris-After-Installing-Prerequisites/create-dir-create.png]] -->

# Running the Install Script

> If the install script installs **`composer`** for you, **delete** it immediately. You should install `composer` **separately** using `sudo apt-get install composer` or an equivalent command.
>
> Installing `composer` locally has been known to cause issues for developers.

Make sure you're ssh'd as `<unix-user>`

1. Run `cd /var/www` (Or where your `apache2` is serving files from)
1. Run `cd loris/tools`
1. Run `sudo ./install.sh`
1. Fill in your `<project-name>` (You get to choose what it is)
1. Determine if you want `install.sh` to configure apache2 for you
1. Key in `<unix-user>`'s password
1. Wait
1. Installation complete

> If you get an error in the install step, you might be missing `ext-xml`. The prerequisites are listed at the top of this page and `ext-xml` is one of them. To resolve this, run `sudo apt-get install php<version>-xml`. If you're running PHP 7.2, it will be `sudo apt-get install php7.2-xml`. If you're running PHP 7.0, it will be `sudo apt-get install php7.0-xml`.

> Note that the path is assumed to be var/www/loris however your own path may be var/www/`<project-name>`, depending on your setup. 

<!-- *In this example, `LorisInstall` is also the `<project-name>` for consistency. Your project name shouldn't differ too much from your `<loris-directory>`.* -->

<!-- [[img/Installing-Loris-After-Installing-Prerequisites/install.png]] -->

# Configuring Apache2

Assuming you let the install script configure apache2 for you but it didn't work out for some reason.

1. Run `sudo a2enmod rewrite`
1. Run `sudo a2ensite loris`
1. Run `sudo service apache2 restart`

> Note that the path is assumed to be var/www/loris however your own path may be var/www/`<project-name>`, depending on your setup. 

<!-- [[img/Installing-Loris-After-Installing-Prerequisites/install-a2.png]] -->

# MySQL Information

If you are hosting the database yourself (locally or externally), [go here](https://github.com/aces/Loris/wiki/Hosting-the-Database-Myself)

If you are a summer student installing "Raisin Bread", [go here](https://github.com/aces/loris-developer-kit/wiki/Installing-the-Raisinbread-Sample-Data-Set)

<!--
Commented out until https://github.com/aces/Loris/pull/2723 gets merged

If someone else is hosting the database for you, [go here](https://github.com/aces/Loris/wiki/Hosting-the-Database-by-Others)-->

<!-- Commented out until this gets merged; https://github.com/aces/Loris/pull/2723
# Installing the Database #1

> If you are installing "Raisinbread", **DO NOT PROCEED**. If you don't know what "Raisinbread" is or are not installing it, please proceed.

> Instructions for Raisinbread are [here](https://github.com/aces/loris-developer-kit/wiki/Installing-the-Raisinbread-Sample-Data-Set)

1. Figure out your `<loris-url>`
1. Open your internet browser
1. Navigate to `<loris-url>/installdb.php`
1. Fill in `<mysql-host-name>` (maybe `localhost`?)
1. Fill in `<mysql-admin-username>`
1. Fill in `<mysql-admin-password>`
1. Fill in `<mysql-database>`
1. If you're a summer student, chances are, your database will have already been created for you. So, check the **Use Existing Database** checkbox.
1. If you're a summer student, chances are, you installed a sample data set. So, check the **Do Not Install** checkbox.
1. Submit

[[img/Installing-Loris-After-Installing-Prerequisites/install-db-admin-zoomed-3.png]]

# Installing the Database #2

1. Fill in `<mysql-user-username>`
1. Fill in `<mysql-user-password>`
1. If you're a summer student, chances are, your MySQL user will have already been created for you. So, check the **Already Created** checkbox.
1. Fill in `<loris-admin-username>`, you get to decide on whatever it is!
1. Fill in `<loris-admin-password>`, you get to decide on whatever it is!
1. **Don't forget your `<loris-admin-username>` and `<loris-admin-password>`!**
1. Submit
1. A `config.xml` file will have been created at `<loris-directory>/Loris/project`
1. The `project` folder is where your *custom* files go, all files in the folder are ignored by git

*Filling in information:*

[[img/Installing-Loris-After-Installing-Prerequisites/install-db-user-zoomed-3.png]]

*Done!*

[[img/Installing-Loris-After-Installing-Prerequisites/install-db-done-zoomed-2.png]]
-->
# Logging In to the LORIS Admin Panel

1. Open your internet browser
1. Navigate to `<loris-url>`
1. Fill in `<loris-admin-username>`
1. Fill in `<loris-admin-password>`
1. Log in
1. Maybe add your username and password to a password manager?

<!-- [[img/Installing-Loris-After-Installing-Prerequisites/log-in-zoomed-3.png]] -->

***
You now have the basic LORIS features installed and are [ready to set up](https://github.com/aces/Loris/wiki/Setup) configurations, Behavioural instruments and Imaging support.

# Troubleshooting the basic installation

#### Help! `<loris-url>` is loading a blank white page!
#### Help! `<loris-url>` is saying it cannot read/write `templates_c`!

Verify the following in your LORIS setup

1. The LORIS `'base'` path is configured correctly in the Configuration module / back-end Config table. 
This should be the case if done automatically.  The path has to end with a forward slash `/` and should look like, `/var/www/loris/`.
If your front end isn't loading, check this Config setting via the MySQL back-end : [Troubleshooting information here](https://github.com/aces/Loris/wiki/Project-Customization#troubleshooting-configuration-settings)

1. That `loris/smarty/templates_c` exists; if it doesn't,
    1. `cd loris/smarty`
    1. `sudo mkdir templates_c`
    1. `sudo chmod 777 templates_c`

1. That `loris/smarty/templates_c` is owned by `www-data` (Run `ls -al` to check) or has `777` permissions (Not ideal but `install.sh` does something similar, Run `sudo chmod 777 loris/smarty/templates_c`)

> Note that the path is assumed to be `/var/www/loris/` however your own path may be var/www/`<project-name>`, depending on your setup. 