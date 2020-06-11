<img src="./htdocs/images/LORIS_logo.svg" width="35%">

[![Build Status](https://travis-ci.org/aces/Loris.svg?branch=master)](https://travis-ci.org/aces/Loris) 
[![Minimum PHP Version](https://img.shields.io/travis/php-v/aces/loris/master?color=787CB5)](https://php.net/)
[![Documentation Status](https://readthedocs.org/projects/acesloris/badge/?version=latest)](https://acesloris.readthedocs.io/en/latest/?badge=latest)

# LORIS Neuroimaging Platform

LORIS (Longitudinal Online Research and Imaging System) is a self-hosted web application that provides data- and project-management for neuroimaging research. LORIS makes it easy to manage large datasets including behavioural, clinical, neuroimaging and genetic data acquired over time or at different sites.

* Try the LORIS demo instance at https://demo.loris.ca.

This Readme covers installation of LORIS version <b>23</b> on <b>Ubuntu</b>.
([CentOS Readme also available](/docs/wiki/00_SERVER_INSTALL_AND_CONFIGURATION/01_LORIS_Install/CentOS/README.md)).

Please consult the [Ubuntu Installation guide](docs/wiki/00_SERVER_INSTALL_AND_CONFIGURATION/01_LORIS_Install/Ubuntu/README.md) or [CentOS Installation guide](docs/wiki/00_SERVER_INSTALL_AND_CONFIGURATION/01_LORIS_Install/CentOS/README.md) for more information. Installation instructions and further information about LORIS for developers can be found on the [LORIS ReadTheDocs website](https://acesloris.readthedocs.io/en/latest/).

#### Heroku

You can try LORIS on Heroku before installing it on your system. The project management and clinical data management functions of LORIS are available for experimenting with. Imaging functionality is not yet available.

Deploy and log in with username *admin* and the password that's set up during deployment via ClearDB.

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/aces/Loris/tree/master)
<br>

## Installation

#### System Requirements

 * Apache **2.4** or higher
 * MySQL >= 5.7 (or MariaDB >= 10.3) 
 * PHP <b>7.3</b> or higher
 * [Composer](https://getcomposer.org/) <b>1.4</b> or higher
 * NodeJS <b>8.0</b> or higher
 * NPM
 * make

These dependencies are subject to change so be sure to verify your version of MySQL and PHP when updating LORIS. Installing some dependencies may require `sudo` privileges.

### Install Steps

Consult the [Ubuntu Installation guide](docs/wiki/00_SERVER_INSTALL_AND_CONFIGURATION/01_LORIS_Install/Ubuntu/README.md) or [CentOS Installation guide](docs/wiki/00_SERVER_INSTALL_AND_CONFIGURATION/01_LORIS_Install/CentOS/README.md) for more information.

1. Set up LINUX user and group lorisadmin and create LORIS base directory:

```bash
# Create lorisadmin user and group
# Give lorisadmin `sudo` permission. This is required for the install process
# in order to automatically generate Apache configuration files.
# Sudo privileges can be revoked once the install is completed.
sudo useradd -U -m -G sudo -s /bin/bash lorisadmin
# Add apache to the lorisadmin group
sudo usermod -a -G lorisadmin www-data
# Set the password for the lorisadmin account
sudo passwd lorisadmin
sudo mkdir -m 755 -p /var/www/$projectname
sudo chown lorisadmin.lorisadmin /var/www/$projectname
su - lorisadmin
```

 <i>$projectname ⇾ "loris" or one-word project name</i>

2. Get the code:
Download the latest release from the [releases page](https://github.com/aces/Loris/releases) and extract it to `/var/www/$projectname`

3. Run installer script to install core code, and libraries. The script will prompt for information and so that it can create directories automatically.

For more information, please read the [Ubuntu Installation guide](docs/wiki/00_SERVER_INSTALL_AND_CONFIGURATION/01_LORIS_Install/Ubuntu/README.md) or [CentOS Installation guide](docs/wiki/00_SERVER_INSTALL_AND_CONFIGURATION/01_LORIS_Install/CentOS/README.md).

 ```bash
 cd /var/www/$projectname/tools
 ./install.sh
 ```

4. Run the makefile (use `make dev` if you are setting up a development sandbox)
 ```bash
 cd /var/www/$projectname
 make
 ```

5. Apache configuration

If your apache configuration was not completed by the Install script, run the following enable rewriting of LORIS, enable your `$projectname` site, and restart apache:  (run by user who has root privileges)
    
```bash
sudo a2enmod rewrite
sudo a2dissite default
sudo a2ensite $projectname
sudo service apache2 reload
```
    
6. Go to http://localhost/installdb.php and follow the instructions to finalize LORIS installation, then restart apache.

If you use MySQL 8, please read [this link](https://www.php.net/manual/en/mysqli.requirements.php) and also [this](https://dev.mysql.com/doc/refman/8.0/en/upgrading-from-previous-series.html#upgrade-caching-sha2-password-compatible-connectors).

7. Follow the [Setup Guide in the LORIS Wiki](https://github.com/aces/Loris/wiki/Setup) to complete your post-installation setup and configuration, and for more documentation.

## Community

### Get in touch
For questions and troubleshooting guidance beyond what is covered in our documentation, please subscribe to the [LORIS Developers mailing list](http://www.bic.mni.mcgill.ca/mailman/listinfo/loris-dev) and email us there. 

### Support and GitHub Issues
For troubleshooting specific installation issues or errors, please see the [Installation troubleshooting guide](docs/wiki/00_SERVER_INSTALL_AND_CONFIGURATION/01_LORIS_Install/Troubleshooting.md), and then contact us via the [LORIS Developers mailing list](http://www.bic.mni.mcgill.ca/mailman/listinfo/loris-dev).
For bug reporting and new feature requests, please search and report via our GitHub Issues. 
Please include details such as the version of LORIS you're using as well as information
such as the OS you're using, your PHP and Apache versions, etc.

## Contributing

We are very happy to get code contributions and features from the global LORIS community. 

If you would like to contribute to LORIS development, please consult our [Contributing Guide](./CONTRIBUTING.md).

## Powered by MCIN

LORIS is made by staff developers at the [McGill Centre for Integrative Neuroscience](http://www.mcin.ca), led by Alan Evans and Samir Das at The Neuro (Montreal Neurological Institute-Hospital).

Visit [the LORIS website](https://loris.ca) for the history of LORIS and our **Technical Papers**.

The original (pre-GitHub) LORIS development team from 1999-2010 included: Dario Vins, Alex Zijdenbos, Jonathan Harlap, Matt Charlet, Andrew Corderey, Sebastian Muehlboeck, and Samir Das.  
