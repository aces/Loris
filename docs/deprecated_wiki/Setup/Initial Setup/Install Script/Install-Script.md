**[[HOME|Home]]** > **[[SETUP|Setup]]** > **[[INSTALL SCRIPT|Install Script]]**

> As of Loris 17.0.3 **this page is archived.**

**Please see [Installing LORIS](https://github.com/aces/Loris/wiki/Installing-Loris)** wiki page for up-to-date installation steps. 

> If you're looking for LORIS 16.X instructions, click [here](Install-Script-for-16.X).

***

1. [Notes on Operating systems and Dependencies](#notes-on-operating-systems-and-dependencies)
2. [Running the Install Script and Web-based Database Installer](#running-the-install-script-and-web-based-database-installer)
3. [Troubleshooting](#troubleshooting)

***

## Notes on Operating systems and Dependencies 

### Ubuntu 
* The install script should install Composer and dependencies including smarty3.  There is no need to install these dependencies before running the install script.  
* Note that PHP 7 and MySQL 5.7 are recommended for LORIS 17.0 (Fall 2016)

### CentOS

* There aren't exact 17.0 instructions for CentOS but most of the next section will work with CentOS. The information [here](https://github.com/aces/Loris/blob/master/README.CentOS6.md) may help with your install process until instructions are written.

## Running the Install Script and Web-based Database Installer
The Install script and web-based database installer is designed to be run on Ubuntu (14+) or CentOS systems. 

The new instructions may be found [here](https://github.com/aces/Loris/wiki/Installing-Loris-(After-Installing-Prerequisites))

## Troubleshooting 

If re-running the Install script, remove (rename) the config.xml file stored in the project/ directory.  If this file exists, the install script will abort. 

For Ubuntu installations, if any difficulties are encountered in the install script, [[Composer|https://getcomposer.org/doc/00-intro.md#installation-linux-unix-osx]] can be manually installed thus: 
To manually install [[Composer|https://getcomposer.org/doc/00-intro.md#installation-linux-unix-osx]]
```bash
  curl -sS https://getcomposer.org/installer | php;
  sudo mv composer.phar /usr/local/bin/composer
  composer install
```

Running _composer install_ may fail if you do not have a project/libraries directory created: 
```
   cd /var/www/loris/
   mkdir -p project/libraries
   composer install # try again
```

``` 
NOTE: Smarty 3 is installed by Composer. For Ubuntu the recommended smarty3 package can be manually installed using: 
> apt-get install smarty3
```

Once your install script has finished running, **if your Loris does not load**:
* Check your apache logs.  e.g. Ubuntu: /var/log/apache2/_$project_-error.log and _$project_-access.log

* If you see a PHP Fatal error about DateTime -- set your timezone in your php.ini file.  The error usually looks like this:

> PHP Fatal error:  Uncaught exception 'Exception' with message 'DateTime::__construct() ...

* Verify your Loris Configuration settings in the database -- see [[Troubleshooting Configuration|Project-Customization#troubleshooting-configuration-settings]] notes

**[[NEXT: (2) Project Customization|Project Customization]]**