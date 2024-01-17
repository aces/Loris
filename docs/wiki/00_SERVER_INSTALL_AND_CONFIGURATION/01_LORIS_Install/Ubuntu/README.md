# Installing LORIS In-Depth

This guide describes LORIS installation on an Ubuntu (or Debian based) server.

If you are using CentOS, please visit the [CentOS installation guide](../CentOS/README.md) to get the appropriate instructions.

Once you have finished this guide, you should be able to log into LORIS in a web browser. Further setup to customize LORIS for your project will be required after that. To do so, please visit the [setup page](https://github.com/aces/Loris/wiki/Setup).

## Prequisities

### Server Stack

LORIS requires a LAMP stack in order to run, specifically:

* Apache 2.4
* MySQL 5.7 (or MariaDB 10.3) (or higher)
* PHP 8.1 (or higher)

Additionally, the following package managers are required to build LORIS:

* NodeJS 16.10.0 (or higher)
* NPM 8.19.2 (or higher)
* Composer

This guide does not cover the installation of these requirements.

### Apt Packages

The following Ubuntu packages are required and should be installed using `sudo apt install ...`.

* curl
* zip
* unzip
* php-json
* make
* software-properties-common
* php8.2-mysql
* php8.2-xml
* php8.2-mbstring
* php8.2-gd
* php8.2-zip
* php8.2-curl (for development instances only)
* libapache2-mod-php8.2

## Creating the lorisadmin user

Create the _lorisadmin_ user and group. lorisadmin needs `sudo` privileges to automatically generate Apache configuration files during the installation. These privileges can be revoked once the installation is complete.

```bash
# Create the lorisadmin user and group
sudo useradd -U -m -G sudo -s /bin/bash lorisadmin
# Add apache to the lorisadmin group
sudo usermod -a -G lorisadmin www-data
# Set the password for lorisadmin
sudo passwd lorisadmin
sudo mkdir -m 755 -p /var/www/loris
sudo chown lorisadmin:lorisadmin /var/www/loris
# Log in as lorisadmin
su - lorisadmin
```

## Getting the source code

Visit the [releases page](https://github.com/aces/loris/releases) and download the zipped file of the latest LORIS release. This can also be achieved with the following command, saving the release to the file `loris-src.tar.gz`.

```bash
curl -s https://api.github.com/repos/aces/loris/releases/latest \
| grep 'tarball' \
| cut -d : -f2,3 \
| tr -d \" \
| tr -d ,\
| xargs -n 1 curl -L -s -o loris-src.tar.gz
```

Once the download is complete, extract the content of the file and move it to the _LORIS root directory_, located inside web root (e.g. `/var/www/`).

```bash
tar -zxf loris-src.tar.gz
# Adjust the identifier after 'aces-Loris-' to your case
mv aces-Loris-9e30cf0/* /var/www/loris/
```

Go to the LORIS root directory and run `make` to build the project.

```bash
cd /var/www/loris/
# Then either
make      # For a production environment
make dev  # For a development environment
```

## Running the install script

The next step in setting up LORIS is to run the install script `install.sh`, located in the `tools/` directory. The script must be run from this directory, and must _not_ be run using `sudo`.

This will begin the interactive setup process that will configure files and permissions required to get LORIS up and running.

```bash
cd /var/www/loris/tools/
./install.sh
```

Once the Apache server has been configured by the script, reload it.

```bash
sudo systemctl reload apache2
```

## Configuring the database

Open a web browser and go to `http(s)://LORIS_URL/installdb.php`, where `LORIS_URL` is the address of your LORIS server.

MySQL (or MariaDB) must be installed and a root or admin-level MySQL user must be created before continuing (this is not the same as a unix root credential).

This web page will prompt you for the following information:

* `Server Hostname`: Use `localhost` if your database is hosted on the same machine as your web server. Use the IP address of your database server otherwise.
* `Database Name`: The desired LORIS database name, defaults to "LORIS".
* `Admin Username`: An existing database user with permission to create databases and tables.
* `Admin Password`: The password of the above user.

After submitting, register a LORIS user and a LORIS front-end administrator on the next page.

If you encounter issues creating or generating your configuration file, you may have to manually paste the XML output that appears on your screen into the file `/var/www/loris/project/config.xml`.

Your LORIS instance should now be accessible in your web browser at the `http(s)://LORIS_URL` address. If so, congratulations! You have finished the installation of LORIS, and can now go to the [setup page](https://github.com/aces/Loris/wiki/Setup) for more information on how to customize your project.
