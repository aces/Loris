#LORIS Neuroimaging Platform [![Build Status](https://travis-ci.org/aces/Loris.svg?branch=16.1-dev)](https://travis-ci.org/aces/Loris)

LORIS (Longitudinal Online Research and Imaging System) is a web-based data and project management software for neuroimaging research. LORIS makes it easy to manage large datasets including behavioural, clinical, neuroimaging and genetic data acquired over time or at different sites.

<hr>
NEW <b>⇾  Try LORIS on Heroku</b> before installing it on your system<br>
Deploy and log in with username <i>admin</i> and the password that's set up during deployment via ClearDB.
[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/aces/Loris/tree/17.0-dev)
<hr>

This Readme covers installation of the <b>17.0</b> LORIS development branch on <b>Ubuntu</b>.
([CentOS Readme also available](https://github.com/aces/Loris/blob/16.1-dev/README.CentOS6.md)).

If you are looking to install a stable release, please consult the [Releases page](https://github.com/aces/Loris/releases) and the Readme for the last stable release.

Please consult the [LORIS Wiki Setup Guide](https://github.com/aces/Loris/wiki/Setup) notes on this [Install process](https://github.com/aces/Loris/wiki/Install-Script) for more information not included in this Readme. The [LORIS Developers mailing list](http://www.bic.mni.mcgill.ca/mailman/listinfo/loris-dev) may also provide installation guidance not covered in the Wiki. 

# Prerequisites for Installation

 * LINUX (supported on Ubuntu 14.04 and [CentOS 6.5](https://github.com/aces/Loris/blob/16.1-dev/README.CentOS6.md))
 * Apache2 (libapache2-mod-php5)
 * MySQL 5.5 or lower (libmysqlclient15-dev mysql-client mysql-server)
 * PHP <b>5.6</b> (php5 php5-mysql php5-gd php5-sqlite)
 * php5-json (for Debian/Ubuntu distributions)
 * Package manager (for LINUX distributions)
 * Composer : should be run with --no-dev option

<b>Important:</b>
 * Only PHP <b>5.6</b> is supported for LORIS 16.1. We recommend installing/upgrading PHP using this (deprecated) PPA repository: <i>ppa:ondrej/php5-5.6 </i>
 * MySQL 5.7 is not supported for LORIS 16.1 and will cause errors when loading LORIS.  MySQL 5.5 or lower (5.*) is recommmended.  
 * Composer should be run with --no-dev option unless you are an active LORIS developer. 

Consult the [LORIS Wiki](https://github.com/aces/Loris/wiki/Setup) page on this [Install process](https://github.com/aces/Loris/wiki/Install-Script) for more information.

# Installation

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

3. Run installer script to install core code, libraries, and MySQL schema (see LORIS Setup Schematic). The script will prompt for information, including usernames and folders which it will create automatically.

    For more information, please read the [Install Script wiki page](https://github.com/aces/Loris/wiki/Install-Script).

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

5. Go to http://localhost to verify that the LORIS core database has been successfully installed. Congratulations!
Log in with the username "admin" and the password you supplied for this user while running the Install script.

    _Note_: Apache config files will be installed as *.conf, per Ubuntu 14.04. If running an earlier version of Ubuntu, rename these files, then run the following commands. After, restart Apache.


    ```
    sudo a2dissite default
    sudo a2ensite $projectname
    ```
6. Note that the default Loris setup assumes that Loris is running on localhost. If this
is not the case, you'll have to manually update the URL and Host config variables in the
ConfigSettings table by running the following SQL commands from a MySQL prompt:

    ```SQL
    UPDATE Config SET Value='$yourURL' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='url');
    UPDATE Config SET Value='$yourHostname' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='host');
    ```

    Make sure that `$yourURL` above contains the "http://" or "https://" and `$yourHostname` does not. If your server is only being accessed from localhost, you can skip this step.

7. Follow the [Setup Guide in the LORIS Wiki](https://github.com/aces/Loris/wiki/Setup) to complete your post-installation setup and configuration, and for more documentation.

# Community
Please feel free to subscribe to the [LORIS Developers mailing list](http://www.bic.mni.mcgill.ca/mailman/listinfo/loris-dev) to ask any LORIS-related questions.
