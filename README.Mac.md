### Mac is no longer supported as of 15.10.
Nothing in this document is an official recommendation for LORIS but is only intended to be helpful!

## Important Notes: 
- We recommend installing LORIS on Ubuntu or CentOS as macOS is no longer supported for "production" as of v15.10
- These instructions were last tested on LORIS version v20.*

# How to install a developer instance of LORIS on macOS

This is a guide on how to get a LORIS instance running on your Apple computer for development. You're expected to have basic understanding of using a terminal and editing configuration files.
For production servers, we recommend installing LORIS on Ubuntu or CentOS.

# 1. System Requirements

The following list provides foresight into the proceeding sections and versions to install:

 * macOS (tested on Mojave 10.14.3)
 * XCode Command Line Tools
 * Homebrew
 * Apache (a.k.a httpd)
 * PHP (tested on v7.2.14)
 * PHP extension: ast-0.1.5
 * pkg-config
 * Composer
 * Node.js (npm)
 * MySQL (tested with 10.3.12-MariaDB)
 * Xdebug (tested on v2.6.1)
 
# 1.1 Pre-Requirements

You should have a GitHub account and git installed on your local development machine.
 
## 1.1 On Github, create your own fork of LORIS.

1) Navigate to [github.com/aces/Loris](https://github.com/aces/Loris)
2) Click on the Fork button.

You should now have your own LORIS repository on Github.

## 1.2 Clone your fork of LORIS to your local machine.

**a.** Create a directory for development where you will clone your fork of LORIS.

Paste the following in your terminal and hit enter:
```
mkdir -p ~/Development/GitHub
```

**b.** Clone your fork to `~/Development/GitHub`

Paste the following lines in your terminal, and replace <your_username> with your github username before pressing enter.
```
cd ~/Development/GitHub
git clone https://github.com/<your_username>/Loris.git
```

## 1.3 Install XCode Command Line Tools
Type the following in your terminal and hit enter:
```
xcode-select --install
```

## 1.4 Install [Homebrew](https://brew.sh)
Visit the Homebrew official website and run their installer script in your terminal to install it.

## 1.5 Install Apache (a.k.a httpd)
The following commands will install Apache and launch it as a service on startup:
```
brew update
brew upgrade
brew install httpd
brew link httpd
sudo brew services start httpd
```

#### A few useful terminal commands for Apache
How to start, stop, and restart Apache.
```
sudo apachectl start
sudo apachectl stop
sudo apachectl -k restart
```


#### An alternative to Apache is using php -S in the htdocs directory.
```
php -S localhost:8000 -t . router.php
```
Logs will be sent to stderr.

### 1.5.1 Modify Apache Configuration

Modify the Apache configuration file for our development environment.
```
sudo open -e /usr/local/etc/httpd/httpd.conf
```

**a.** Find & modify the `ServerName` to:
```
ServerName localhost
```

**b.** Find the lines for `DocumentRoot` and `Directory` in Apache and change them to:
```
DocumentRoot "/Users/<your_user>/Development/GitHub/Loris/htdocs/"
<Directory "/Users/<your_user>/Development/GitHub/Loris/htdocs/">
```

**c.** In the same `<Directory>` block, modify `AllowOverride` to allow all:
```
# AllowOverride controls what directives may be placed in .htaccess files.
# It can be "All", "None", or any combination of the keywords:
#   AllowOverride FileInfo AuthConfig Limit
#
AllowOverride All
```

**d.** Enable `mod_rewrite` which is commented out by default:
```
LoadModule rewrite_module lib/httpd/modules/mod_rewrite.so
```

**e.** Modify the `User` & `Group` (replace your_user again with your macOS user) to:
```
User your_user
Group staff
```

#### Restart Apache to load the updated settings
```
sudo apachectl -k restart
```

## 1.6 Install PHP and pkg-config

Type these commands into your terminal and hit enter:
```
brew install php72
brew link php72
brew services start php72
brew install pkg-config
```

### 1.6.1 Modify Apache Configuration for PHP

Modify the Apache configuration file to enable php.
```
sudo open -e /usr/local/etc/httpd/httpd.conf
```

**a.** Add the line below to `LoadModules` (Change `php@<version>` to the correct version):
```
LoadModule php7_module /usr/local/opt/php@<version>/lib/httpd/modules/libphp7.so
```

**b.** Modify `<IfModule dir_module>` to this:
```
<IfModule dir_module>
    DirectoryIndex index.php index.html
</IfModule>
```

**c.** Add the lines below under `</IfModule>`:
```
<FilesMatch \.php$>
    SetHandler application/x-httpd-php
</FilesMatch>
```

#### Restart Apache will load the updated settings
```
sudo apachectl -k restart
```

## 1.7 (Optional) Installing Xdebug

Xdebug allows debugging with breakpoints (such as when using an IDE ex. Intellij).

Type into your terminal and hit enter:
```
pecl install xdebug
```

### 1.7.1 Configure Xdebug for local development

**a.** Comment out the line `zend_extensions=“xdebug.so”` from the top of your `php.ini` file (Note: replace `your_php_version` with the correct php version installed):
```
sudo open -e /usr/local/etc/php/<your_php_version>/php.ini
```

b. Create the file `ext-xdebug.ini` with this command:
```
sudo touch /usr/local/etc/php/<your_php_version>/conf.d/ext-xdebug.ini
```

c. Type the following into the `ext-xdebug.ini` file you just created (Note: replace the `zend_extension` path with the correct one on your machine):
```
[xdebug]
zend_extension="/usr/local/Cellar/php@7.2/7.2.14/pecl/20170718/xdebug.so"
xdebug.remote_enable=on
xdebug.remote_host=localhost
xdebug.remote_port=9000
xdebug.show_error_trace=1
xdebug.remote_autostart=1
xdebug.remote_connect_back=0
xdebug.idekey=phpstorm
```

#### Restart Apache with Xdebug configured.
```
sudo apachectl -k restart
```

### 1.7.2 Install [Xdebug toggle for OSX](https://github.com/w00fz/xdebug-osx) (recommended)

**a.** Install from the GitHub repository.

**b.** Terminal command to view Xdebug state:
```
xdebug
```

**c.** Terminal command to toggle xdebug (On or Off)
```
xdebug on
xdebug off
```

## 1.8 Install the database

We’re installing MariaDB (fork of mysql).

**a.** Type the commands into your terminal and hit enter:
```
brew update
brew upgrade
brew install mariadb
brew services start mariadb
```

**b.** Securing MySQL (set password for user “root” and disable outside localhost, remove anonymous users & test dbs):
```
mysql_secure_installation
```

### 1.8.1 MySQL GUI tool (Optional)

[Sequel Pro](https://sequelpro.com/test-builds) (free)

## 1.9 Install Composer
Type into your terminal and hit enter:
```
brew install composer
```

## 2.0 Install PHP extension: ext-ast ^0.1.5 for phan/phan
Type into your terminal and hit enter:
```
pecl install ast-0.1.5;
```

## 2.1 Install Node.js
Navigate in your browser to [NodeJS.org](https://nodejs.org/en/) to download and run the installer.


## 2.2 Install LORIS
Type into your terminal and hit enter:
```
cd ~/Development/GitHub/Loris
make dev
cd /tools
./install.sh
```

## 2.2.1 Launch the LORIS installer in your browser
Open a browser (Firefox & Chrome are supported) and navigate to:

```
localhost:8080/installdb.php
```

or

```
localhost:8000/installdb.php
```

depending if using Apache or php -S.

Once finished hooray, LORIS should be accessible and you can start developing!
