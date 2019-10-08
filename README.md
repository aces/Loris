# [![Build Status](https://travis-ci.org/aces/Loris.svg?branch=master)](https://travis-ci.org/aces/Loris) LORIS Neuroimaging Platform 

LORIS (Longitudinal Online Research and Imaging System) is a self-hosted web application that provides data- and project-management for neuroimaging research. LORIS makes it easy to manage large datasets including behavioural, clinical, neuroimaging and genetic data acquired over time or at different sites.

A demo instance is available at https://demo.loris.ca.

This Readme covers installation of the LORIS <b>v21</b> release on <b>Ubuntu</b>.
([CentOS Readme also available](https://github.com/aces/Loris/blob/master/README.CentOS6.md)).

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
 * [Composer](https://getcomposer.org/)
 * NodeJS <b>8.0</b> or higher

These dependencies are subject to change so be sure to verify your version of MySQL and PHP when updating LORIS.

### Install Steps

Consult the [LORIS Wiki](https://github.com/aces/Loris/wiki/Setup) page on this [Install process](https://github.com/aces/Loris/wiki/Installing-Loris) for more information.

1. Set up LINUX user lorisadmin and create LORIS base directory:

    ```
    sudo useradd -U -m -G sudo -s /bin/bash lorisadmin
    sudo passwd lorisadmin
    su - lorisadmin
    ```

    <b>Important: All steps from this point forward must be executed by lorisadmin user</b>

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

4. Apache configuration and restart 
LORIS requires Apache's mod_rewrite module to rewrite its URLs. Enable this module, then restart Apache: 

    ```
    sudo a2enmod rewrite
    sudo service apache2 reload
    ```

5. Go to http://localhost/installdb.php and follow the instructions to finalize LORIS installation.

    _Note_: Apache config files will be installed as *.conf, per Ubuntu 14.04. If running an earlier version of Ubuntu, rename these files, then run the following commands. After, restart Apache.


    ```
    sudo a2dissite default
    sudo a2ensite $projectname
    ```

6. Follow the [Setup Guide in the LORIS Wiki](https://github.com/aces/Loris/wiki/Setup) to complete your post-installation setup and configuration, and for more documentation.

## Community

### GitHub Issues
Please don't hesitate to create an issue if you're stuck with something. Please
include details such as the version of LORIS you're using as well as information
such as the OS you're using, your PHP and Apache versions, etc.

### Get in touch
Please feel free to subscribe to the [LORIS Developers mailing list](http://www.bic.mni.mcgill.ca/mailman/listinfo/loris-dev) to ask any LORIS-related questions. We may also be able to provide you with installation guidance not covered in the Wiki.

## Contributing

### Contributing Code
If you would like to contribute to LORIS development, please consult our [Contributing Guide](./CONTRIBUTING.md).

