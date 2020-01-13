# Installing LORIS In-Depth

This guide assumes an installation on an Ubuntu server. 

If you are using CentOS, please visit the CentOS installation guide for 
instructions on installation.

We also have instructions for how to set up LORIS for macOS. However, only
 Ubuntu and CentOS are officially supported by the team so we may be unable to
 help you with issues arising on other systems.

When you've completed this guide, you should be able to load and log into LORIS in your browser.  Further setup to customize LORIS for your project will be required after tha. Please visit
[the Setup page](https://github.com/aces/Loris/wiki/Setup) in order to complete the setup for LORIS.

## Prequisities

### Server Stack

LORIS requires a LAMP stack in order to run, specifically:
* Apache 2.4
* MySQL 5.7 (or MariaDB 10.3) (or higher)
* PHP 7.3 (or higher)

Additionally, LORIS requires the following package managers:
* npm 8.0 (or higher)
* composer

This guide does not cover installation of these requirements.

### Apt Packages
The following Ubuntu packages are required and should be installed using 
`sudo apt install ...`.

* git
* curl
* wget
* zip
* unzip
* php-json
* make
* software-properties-common
* php7.3-mysql
* php7.3-xml
* php7.3-mbstring
* php7.3-gd
* libapache2-mod-php7.3

## Getting the source code

### LORIS for Development
If installing LORIS for development purposes, clone the source code from our
GitHub repository to the web root. Then change to this directory.

Example command assuming LORIS will be served from `/var/www/`:

```bash
git clone git@github.com:aces/Loris.git /var/www/loris
cd /var/www/loris/
```

### LORIS for Production

Visit the [releases](github.com/aces/loris/releases) page and download the zipped file of the latest LORIS
release. The below command will download the latest LORIS release and save 
it to a file named `loris-src.tar.gz`.

```bash
curl -s https://api.github.com/repos/aces/loris/releases/latest \
| grep 'tarball' \
| cut -d : -f2,3 \
| tr -d \" \
| tr -d , \
| wget -i - -O loris-src.tar.gz
```

When this is complete, expand the compressed file and move its contents to the
directory from which LORIS will be served. 

```bash
tar -zxf loris-src.tar.gz
```

This will create a folder called something like `aces-Loris-9e30cf0`. (The
part after `aces-Loris` is not important).

Rename this file to `loris`, e.g.

```bash
mv aces-Loris-9e30cf0 loris
```

Then move this folder to the web root (e.g. `/var/www/`) and go to this 
directory.

### If installing LORIS for production

```bash
cd `/var/www/loris/`; make
```

### If installing LORIS for development

```bash
# This is necessary for 'phan', a static analysis tool
sudo pecl install ast-1.0.3
cd `/var/www/loris/`; make dev
```

The `dev` target for `make` will install additional libraries that are needed 
for development process but not for production installs.

## Running the install script

The next step in setting up LORIS is running the script `install.sh` in the 
`tools/` directory. The script must be run from this directory.

This will begin an interactive setup process that will configure files and
permissions required to get LORIS up and running.

The install script will prompt for a the user password in order to use `sudo` permission for configuring
certain file permissions as well as Apache. However, the script should not
be run as `root` and will exit automatically if it detects that it has been
executed with superuser permissions.

```bash
cd tools/
./install.sh
```

## Configuring the database

The install script will tell you to navigate to <loris-url>/installdb.php.

MySQL (or MariaDB) must be installed and a root or admin-level MySQL user must
be created before continuing. (This is not the same as a unix root credential.)

This web page will prompt you for the following information:

 * `Server Hostname`. Use `localhost` if your database is hosted on your locally. Use the IP address of your database server otherwise.

 * `Admin Username` A database user with permission to create databases and tables.

 * `Admin Password` The password for the above database user.

 * `Database Name` Defaults to "LORIS".

Click submit, and on the next screen that is presented, follow instructions to enter the username and password of your LORIS database user and front-end `admin` user.

If you encounter issues creating/generating your config file, you may have to manually paste the xml output that appears on the screen into the file `/var/www/loris/project/config.xml`

Your LORIS instance should now be accessible by pointing your browser URL to `http://%IPADDRESS%`

If there are any errors or you get a blank page, troubleshoot the errors in your apache error log - by default
 `/var/log/apache2/loris-error.log`

## Configuring MySQL

Please [go here](https://github.com/aces/Loris/wiki/Hosting-the-Database-Myself)
for information on configuring MySQL.

### Development

The name of our database filled with dummy test data is "Raisinbread". This 
can be used by developers to populate LORIS with useable data for testing
changes to the codebase.

Instructions on installing Raisinbread can be found in the LORIS root folder
at `raisinbread/README.md`

## Troubleshooting

If errors are encountered during the section "Running the install script",
ensure that all the prequisites for LORIS are installed and meet the minimum
required versions.

Next: follow the [Setup process](https://github.com/aces/Loris/wiki/Setup) to customize your LORIS.
after completing this guide.
