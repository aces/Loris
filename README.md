#LORIS Neuroimaging Platform

LORIS is a web-accessible database solution for neuroimaging, providing a secure infrastructure to automate the flow of clinical data for complex multi-site neuroimaging studies.

# Prerequisites

 * LINUX (supported on Ubuntu 14.04 and CentOS 6.5) or Mac OS X (tested for Mavericks - OS X 10.9)
 * Apache2 (libapache2-mod-php5)
 * MySQL (libmysqlclient15-dev mysql-client mysql-server)
 * PHP/PEAR 5.3+ (php5 php-pear php5-mysql php5-gd)
 * php5-json (for Debian/Ubuntu distributions)
 * Smarty 3
 * Package manager (for LINUX distributions)
 * Composer

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

    <i>$projectname ⇾ “loris” or one-word project name</i>

2. Get code:
    Download the latest release from the [releases page](https://github.com/aces/Loris/releases) and
    extract it to `/var/www/$projectname`

3. Run installer script to install core code, libraries, and MySQL schema (see LORIS Setup Schematic). The script will prompt for information, including usernames and folders which it will create automatically.

    ```
    cd /var/www/$projectname/tools
    ./install.sh
    sudo service apache2 reload
    ```

4. Go to http://localhost to verify that the LORIS core database has been successfully installed. Congratulations!
Log in with the username “admin” and the password you supplied for this user while running the Install script.

    _Note_: Apache config files will be installed as *.conf, per Ubuntu 14.04. Rename these if running earlier version.

    ```
    sudo a2dissite default
    sudo a2ensite $projectname
    ```
5. Note that the default Loris setup assumes that Loris is running on localhost. If this
is not the case, you'll have to manually update the URL and Host config variables in the
ConfigSettings table by running the following SQL commands from a MySQL prompt:

```SQL
UPDATE Config SET Value='$yourURL' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='url');
UPDATE Config SET Value='$yourHostname' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='host');
```

Make sure that `$yourURL` above contains the "http://" or "https://" and `$yourHostname` does not. If your server is only being accessed from localhost, you can skip this step.

6. Notes for LORIS post-installation setup are contained in the [LORIS Wiki](https://github.com/aces/Loris/wiki/Setup).

# Community
Please feel free to subscribe to the [LORIS Developers mailing list](http://www.bic.mni.mcgill.ca/mailman/listinfo/loris-dev) to ask any LORIS-related questions.
