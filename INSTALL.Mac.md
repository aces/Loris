#LORIS Mac Install Guide

This is a guide on how to get a LORIS instance Running on your Mac computer. It is designed for installation in a sandbox environment. It has been partially tested for Mac OS X 10.9 and 10.10.

# 1. System Requirements

Before continuing to the subsequent sections ensure that the following tools are installed.  Sudo permission is required.  This section covers installation and recommended versions of:

 * Mac OS X (tested for Mavericks - OS X 10.9 and 10.10)
 * Apache2
 * PHP
 * PEAR
 * Perl
 * MySQL

## 1.1 Apache2

Apache2 should be preinstalled on your Mac. To verify, type the following command into a terminal window:

```
sudo apachectl start
```

Navigate to [http://localhost](http://localhost). Your browser should display the message "It works!"

## 1.2 PHP 

PHP should be preinstalled on your Mac. To verify, type the following command into a terminal:

```
php -v
```

Ensure that your php version is 5 or higher (5.x.x).  Note Loris is tested for php 5.3+

## 1.3 PEAR 

### 1.3.1 Check if PEAR is installed
Check if you currently have PEAR installed:

```
pear version
```
If installed proceed to section 1.3.3 else continue.

### 1.3.2 Installing PEAR

To install PEAR do the following:

```
curl -O http://pear.php.net/go-pear.phar
sudo php -d detect_unicode=0 go-pear.phar
```
### 1.3.3 Locate php.ini file

To determine the location of the php.ini file use the following:

```
php --ini
```
The location of the ```php.ini``` will be listed under the ```Loaded Configuration File:```. If listed ```(none)``` use the following to initiate the file
	
```
sudo cp /etc/php.ini.default /etc/php.ini
```
This command will initiate the file to the ```/etc``` directory

### <a name="include_path"></a>1.3.4 Including PEAR

For PEAR to work with LORIS it has to be included in the ```include_path``` in the ```php.ini```. To do so do the following:

1.  Locate where PEAR installs .php files

	```
	pear config-get php_dir
	```
2. Check to see if the path from aboves output is included in the ```include_path```

	```
	php -c $pathToPhpIni -r 'echo get_include_path()."\n";'
	```
<i>$pathToPhpIni ⇾ path to ```php.ini``` refer to section 1.3.3</i>

3. If not add the path to the ```include_path```

	```
	sudo vi $pathToPhpIni
	```
	<i>$pathToPhpIni ⇾ path to ```php.ini``` refer to 	section 1.3.3</i>

	Locate the line containing ```include_path```. Ensure that you are adding the path to the UNIX instance of the ```include_path``` and that the line does not start with ```;```.
	
	Add the path to the end of the string using a ```:``` to seperate the path from the previous path.
	
## 1.4 Perl 

Perl should be preinstalled on your Mac. To ensure type the following command into terminal 

```
perl -v
```

## 1.5 MySQL 

### 1.5.1 Check if MySQL is installed
Check if you currently have MySQL installed:

```
mysql
```
If already installed continue to section 1.6 else continue

### 1.5.2 Obtaining MySQL

Download the latest DMG Archive for you current Mac setup (either 32-bit or 64-bit) from the following link [dev.mysql.com/downloads/mysql]
(dev.mysql.com/downloads/mysql) and install the necessary files.

### 1.5.3 Starting MySQL

Open System Preferences on your machine and select the MySQL icon. Start the MySQL server if it hasn’t already been started. Check Automatically Start MySQL Server on Startup if you dont want to have to repeat this step everytime you resart your computer.

### 1.5.4 Setting up root user

Access MySQL with the following

```
mysql -u root
```

If the command is not found use the following 

```
sudo sh -c 'echo /usr/local/mysql/bin > /etc/paths.d/mysql'
```
Then restart terminal or open a new tab or window and start this step over.

Once in the mysql command prompt, use the following command to reset the password

``` 
SET PASSWORD FOR 'root'@'localhost' = PASSWORD('$newpwd');
```
<i>$newpwd ⇾ you new desired password for the root user</i>

## 1.6 Smarty 3

###1.6.1 Obtaining Smarty 3
 
Go to [http://www.smarty.net/download](http://www.smarty.net/download) and download the latest stable release of Smarty 3.x.x

###1.6.2 Setting up Smarty 3

Create the following directories if they do not already exist:

```
sudo mkdir /usr/local/lib/php
sudo mkdir /usr/local/lib/php/Smarty
```

Next, unzip the downloaded zip file and locate the libs directory.  Move it into the Smarty directory (created above), and rename it to smarty3 in the process. Use the following: 

```
sudo mv /path/to/Smarty-3.x.x/libs/ /usr/local/lib/php/Smarty/smarty3
```

After you have moved the directory ensure to add the path ```/usr/local/lib/php/Smarty``` to the ```include_path``` in the php.ini file (see [section 1.3.4](#include_path) part 3).

#2. Installing LORIS Code Base

This section goes over how to obtain the LORIS code base and setup the database on your local machine.

##2.1 Obtaining the LORIS code

Download the latest release from the [releases page](https://github.com/aces/Loris/releases) and
extract it to `~/Sites/$projectname`

<i>$projectname ⇾ “loris” or one-word project name</i>

##2.2 Installing LORIS

Run installer script to install core code, libraries, and MySQL schema (see Loris Installation Schematic). 
The script will prompt for information, including usernames and folders which it will create automatically.
```
cd ~/Sites/$projectname/tools
./install.sh
```

The install script may not fully execute on Mac OS systems.  It is recommended to carefully review and execute manually the steps in the install.sh script on your system.  A few MySQL statement examples are provided in section 2.3. 
Since the install script was created for LINUX OS, its apache2 setup steps won’t work. Section 3 describes how to set up the apache2 server for Mac.

##2.3 Manually running install script steps

Since you may not be able to fully execute the install.sh script at step 2.2, the following examples may help in manually executing the sequence of commands found in the install script.

Set up these variables in your bash shell :
``` 
mysqldb=LORIS
mysqlhost=localhost
mysqluser=lorisuser  (suggested)
mysqlpass=password 
mysqlrootuser=root 
```
Keep this terminal window open to keep the variables in memory.

Then execute the following commands in your bash shell to create the Loris database and the lorisuser MySQL user. 
The prompt should ask for the root password. (The one entered in section 1.5.4) 
```
echo "CREATE DATABASE $mysqldb" | mysql -h$mysqlhost --user=$mysqlrootuser -p -A
echo "GRANT UPDATE,INSERT,SELECT,DELETE ON $mysqldb.* TO '$mysqluser'@'localhost' IDENTIFIED BY '$mysqlpass' WITH GRANT OPTION" | mysql $mysqldb -h$mysqlhost --user=$mysqlrootuser -p -A
```

Source the database schema with the following statement in your bash shell (the terminal window used at section 1.5.4) :
```
mysql $mysqldb -h$mysqlhost --user=$mysqlrootuser -p -A 2>&1 < ~/Sites/$projectname/SQL/0000-00-00-schema.sql
```

# 3. Launching the Local Apache2 Server
This section goes into details regarding setting up the local Apache2 server. There are Max OS X 10.10 (Yosemite) specific instructions in section 3.1. If you are not running Yosemite step 3.1 may be be skipped.

## 3.1 Mac OS X Yosemite specific configuration (for Yosemite users only)

In ```/etc/apache2/httpd.conf``` locate the following lines and uncomment them (by removing the ``` # ```) if they are not commented out:

```#LoadModule userdir_module libexec/apache2/mod_userdir.so ```
and
``` #Include /private/etc/apache2/extra/httpd-userdir.conf ```

At the end of your file also include the line
``` Include /etc/apache2/other/*.conf ```

Now open ```/etc/apache2/extra/httpd-userdir.conf``` and uncomment the following line: ```#Include /private/etc/apache2/users/*.conf```.

## 3.2 Enable PHP
Open  ```/etc/apache2/httpd.conf``` in a text editor and locate the line containing
```LoadModule php5_module libexec/apache2/libphp5.so```
Ensure that the line is uncommented (remove the ```#``` at the beginning of the line)

## 3.3 Setup MySql with Apache2
Do the following to allow for use of MySql with Apache2, unless link already exists
```
sudo mkdir /var/mysql
sudo ln -s /tmp/mysql.sock /var/mysql/mysql.sock
```

## 3.4 Setting up user conf file

In order for apache to know where to find the LORIS code base you have to first set up your user config file. To do so, open your user conf file using the following in the ``` /etc/Apache2/Users/``` directory:

```
sudo vi $username.conf
```
<i>$username ⇾ your username for the computer</i>

Once in the text editor, ensure that the file looks similar to the following:

```
<Directory "/Users/$username/Sites/">
    Options Indexes MultiViews FollowSymLinks
    AllowOverride None
    Order allow,deny
    Allow from all
</Directory>
```

Restart your apache server:
```
sudo apachectl restart
```

You can now access you LORIS sandbox using the url <a>http://localhost/~$username/loris/htdocs</a>

To access your sandbox on another device, replace ```localhost``` with your IP address for your machine.

## 3.5 Setup Virtual Host

The following section is a more advanced setting for you local apache server. This section is not necessary, but enables ```http://localhost.loris``` as an url shortcut, and creates LORIS-specific apache logs for easy troubleshooting (similar to ```/var/log/apache2/loris-err.log```).

### 3.5.1 Including vhosts
Open the ```/etc/apache2/httpd.conf``` in a text editor and locate the line containing ```Include /private/etc/apache2/extra/httpd-vhosts.conf```

Ensure that the line is uncommented (remove the ```#``` at the beginning of the line)

### 3.5.2 Adding new vhost
Open the ```/etc/apache2/extra/httpd-vhosts.conf``` in the text editor and add the following:
```
<VirtualHost *:80>
	ServerAdmin webmaster@localhost
	DocumentRoot "/Users/$username/Sites/loris/htdocs/"
	ServerName localhost.loris
	ErrorLog "/private/var/log/apache2/loris.com-error_log"
	CustomLog "/private/var/log/apache2/loris.com-access_log" common
	
	<Directory "/Users/$username/Sites/loris/htdocs/">
		Options Indexes FollowSymLinks
		AllowOverride All
		Order allow,deny
		Allow from all
	</Directory>
	
	php_value include_path .:/usr/share/php:$pathToPear:/Users/$username/Sites/loris/project/libraries:/Users/$username/Sites/loris/php/libraries:/usr/local/lib/php/Smarty
	# Possible values include: debug, info, notice, warn, error, crit,
	# alert, emerg.
	LogLevel warn

	ServerSignature Off

	#SSLEngine Off  # change to On to enable, after updating cert paths below
	#SSLCertificateFile /etc/apache2/ssl/loris-cert.pem
	#SSLCertificateKeyFile /etc/apache2/ssl/loris-key.pem
	#SSLCACertificateFile /etc/apache2/ssl/CA-cacert.pem
</VirtualHost>

<VirtualHost *:80>
	ServerName localhost
	DocumentRoot /Library/WebServer/Documents/
</VirtualHost>
```
 * <i>$username ⇾ your username for the computer</i>
 * <i>$pathToPear ⇾ path where PEAR installs .php files (see [section 1.3.4](#include_path) part 1)</i>

## 3.6 Update Database

Note that the default Loris setup assumes that Loris is running on localhost. If this
is not the case, you'll have to manually update the URL and Host config variables in the
ConfigSettings table by running the following SQL commands from a MySQL prompt:

```SQL
UPDATE Config SET Value='$yourURL' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='url');
UPDATE Config SET Value='$yourHostname' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='host');
```

Make sure that `$yourURL` above contains the "http://" or "https://" and `$yourHostname` does not. If your server is only being accessed from localhost, you can skip this step.


