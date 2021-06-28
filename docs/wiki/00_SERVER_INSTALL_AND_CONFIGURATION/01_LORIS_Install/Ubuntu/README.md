# Installing LORIS In-Depth

This guide assumes an installation on an Ubuntu server. 

If you are using CentOS, please visit the CentOS installation guide for 
instructions on installation.

When you've completed this guide, you should be able to load and log into LORIS in your browser. Further setup to customize LORIS for your project will be required after that. Please visit
[the Setup page](https://github.com/aces/Loris/wiki/Setup) in order to complete the setup for LORIS.

## Prequisities

### Server Stack

LORIS requires a LAMP stack in order to run, specifically:

* Apache 2.4  

* MySQL 5.7 (or MariaDB 10.3) (or higher)  

* PHP 7.3 (or higher) - PHP 7.4 recommended

Additionally, the following package manager are required to build LORIS:  

* NodeJS 10.13.0 (or higher)  

* composer

This guide does not cover installation of these requirements.

### Apt Packages
The following Ubuntu packages are required and should be installed using 
`sudo apt install ...`.

* curl  

* zip  

* unzip  

* php-json  

* make  

* software-properties-common  

* php7.4-mysql  

* php7.4-xml  

* php7.4-mbstring  

* php7.4-gd  

* php7.4-zip  

* php7.4-curl (for development instances only)  

* libapache2-mod-php7.4  


## Getting the source code

Visit the [releases](https://github.com/aces/loris/releases) page and download the zipped file of the latest LORIS
release. The below command will download the latest LORIS release and save 
it to a file named `loris-src.tar.gz`.

```bash
curl -s https://api.github.com/repos/aces/loris/releases/latest \
| grep 'tarball' \
| cut -d : -f2,3 \
| tr -d \" \
| tr -d ,\
| xargs -n 1 curl -L -s -o loris-src.tar.gz
```

When this is complete, expand the compressed file and move its contents to the
_loris root directory_ from which LORIS will be served: 

```bash
tar -zxf loris-src.tar.gz
```

This will create a folder called something like `aces-Loris-9e30cf0`. (The
part after `aces-Loris` is not important).

Rename this folder to `loris`, e.g.

```bash
mv aces-Loris-9e30cf0 loris
```

Then move this folder to the web root (e.g. `/var/www/`) and go to this 
directory.

```bash
mv ./loris /var/www/
cd /var/www/loris
```

Once in the correct directory, run one of the following commands given your environment:

```bash
make      # For production environments
make dev  # For development environments
```

## Creating the lorisadmin user
Create the _lorisadmin_ user and group and give _lorisadmin_ `sudo` permission. 
This is required for the install process in order to automatically generate
Apache configuration files. Sudo priviledges can be revoked once the install
is completed. 

## Creating the lorisadmin user

```bash
# Create lorisadmin user and group
# Give lorisadmin `sudo` permission. This is required for the install process
# in order to automatically generate Apache configuration files.
# 
# Sudo privileges should be revoked once the install is completed.
sudo useradd -U -m -G sudo -s /bin/bash lorisadmin
# Add apache to the lorisadmin group
sudo usermod -a -G lorisadmin www-data
# Set the password for the lorisadmin account
sudo passwd lorisadmin
sudo mkdir -m 755 -p /var/www/$projectname
sudo chown lorisadmin.lorisadmin /var/www/$projectname
su - lorisadmin
```

## Running the install script

The next step in setting up LORIS is running the script `install.sh` in the 
`tools/` directory. The script must be run from that directory, and must _not_ be
run using sudo.

This will begin an interactive setup process that will configure files and
permissions required to get LORIS up and running.

```bash
cd /var/www/loris/tools/
./install.sh
```

## Configuring the database

Open your browser and go to: `<loris-url>/installdb.php`.

MySQL (or MariaDB) must be installed and a root or admin-level MySQL user must
be created before continuing. (This is not the same as a unix root credential.)

This web page will prompt you for the following information:

 * `Server Hostname`. Use `localhost` if your database is hosted on the same machine as your web server. Use the IP address of your database server otherwise.

 * `Admin Username` A database user with permission to create databases and tables.

 * `Admin Password` The password for the above database user.

 * `Database Name` Defaults to "LORIS".

Click submit, and on the next screen that is presented, follow instructions to enter the username and password of your LORIS database user and front-end `admin` user.

If you encounter issues creating/generating your config file, you may have to manually paste the xml output that appears on the screen into the file `/var/www/loris/project/config.xml`

Your LORIS instance should now be accessible by pointing your browser URL to `http://%IPADDRESS%`.

Now that the installation is complete, follow the [Setup process](https://github.com/aces/Loris/wiki/Setup) to customize your project.
