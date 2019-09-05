# [![Build Status](https://travis-ci.org/aces/Loris.svg?branch=master)](https://travis-ci.org/aces/Loris) LORIS Neuroimaging Platform 

---
LORIS (Longitudinal Online Research and Imaging System) is a self-hosted web application that provides data- and project-management for neuroimaging research. LORIS makes it easy to manage large datasets including behavioural, clinical, neuroimaging, genetic and biospecimen data acquired over time or at different sites.

* Try the LORIS demo instance at https://demo.loris.ca.

This Readme covers installation of the LORIS <b>v22.*</b> release on <b>Ubuntu</b>.
([CentOS Readme also available](./README.CentOS6.md)).

Please consult the [LORIS Wiki Setup Guide](https://github.com/aces/Loris/wiki/Setup) notes on this [Install process](https://github.com/aces/Loris/wiki/Installing-Loris) for more information.

#### Heroku

You can try LORIS on Heroku before installing it on your system. The project management and clinical data management functions of LORIS are available for experimenting with. Imaging functionality is not yet available.

Deploy and log in with username *admin* and the password that's set up during deployment via ClearDB.

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/aces/Loris/tree/master)
<br>

## Installation

#### System Requirements

 * Apache **2.4** or higher
 * MySQL >= 5.7 (or MariaDB >= 10.3) 
 * PHP <b>7.2</b> or higher
 * Node >= 6.17
 * [Composer](https://getcomposer.org/)

_Composer should be run with --no-dev option unless you are an active LORIS developer._

These dependencies are subject to change so be sure to verify your version of MySQL and PHP when updating LORIS.

### Install Steps

Consult the [LORIS Wiki](https://github.com/aces/Loris/wiki/Setup) page on this [Install process](https://github.com/aces/Loris/wiki/Installing-Loris) for more information.

1. Set up LINUX user lorisadmin and create LORIS base directory:

    ```
    sudo useradd -U -m -G sudo -s /bin/bash lorisadmin
    sudo passwd lorisadmin
    su - lorisadmin
    ```

    <b>Important ⇾ All steps from this point forward must be executed by lorisadmin user</b>

    ```
    sudo mkdir -m 775 -p /var/www/$projectname
    sudo chown lorisadmin.lorisadmin /var/www/$projectname
    ```

    <i>$projectname ⇾ "loris" or one-word project name</i>

2. Get code:
    Download the latest release from the [releases page](https://github.com/aces/Loris/releases) and
    extract it to `/var/www/$projectname`

3. Run installer script to install core code, and libraries. The script will prompt for information and so that it can create directories automatically.

    For more information, please read the [Installing Loris wiki page](https://github.com/aces/Loris/wiki/Installing-Loris).

    ```
    cd /var/www/$projectname/tools
    ./install.sh
    ```

4. Run the makefile (use `make dev` if you are setting up a development sandbox)
    ```
    cd /var/www/$projectname
    make
    ```

5. Apache configuration

If your apache configuration was not completed by the Install script, run the following enable rewriting of LORIS, enable your `$projectname` site, and restart apache:

    ```
    sudo a2enmod rewrite
    sudo a2dissite default
    sudo a2ensite $projectname
    sudo service apache2 reload
    ```

6. Go to http://localhost/installdb.php and follow the instructions to finalize LORIS installation, then restart apache.

7. Follow the [Setup Guide in the LORIS Wiki](https://github.com/aces/Loris/wiki/Setup) to complete your post-installation setup and configuration, and for more documentation.

## Community

### Get in touch
For questions and troubleshooting guidance beyond what is covered in our GitHub Wiki, please subscribe to the [LORIS Developers mailing list](http://www.bic.mni.mcgill.ca/mailman/listinfo/loris-dev) and email us there. 

### GitHub Issues
For bug reporting and new feature requests, please search and report via our GitHub Issues. 
Please include details such as the version of LORIS you're using as well as information
such as the OS you're using, your PHP and Apache versions, etc.

## Contributing

The [LORIS team](http://loris.ca) at the Montreal Neurological Institute (MNI) is very happy to get code contributions and features from the global LORIS community. 

### Contributing Code
If you would like to contribute to LORIS development, please consult our
[Contributing Guide](./CONTRIBUTING.md).

