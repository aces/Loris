# LORIS Neuroimaging Platform

LORIS (Longitudinal Online Research and Imaging System) is a web-based data and project management software for neuroimaging research. LORIS makes it easy to manage large datasets including behavioural, clinical, neuroimaging and genetic data acquired over time or at different sites.

<hr>
<b>⇾  Try LORIS on Heroku</b> before installing it on your system<br>
Test out the project management and clinical data management side of LORIS (complete Imaging features not yet available)<br>
Deploy and log in with username <i>admin</i> and the password that's set up during deployment via ClearDB.

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/aces/Loris/tree/master)
<hr>

| Branch | Status |
| ------ | ------ |
| master | [![Build Status](https://travis-ci.org/aces/Loris.svg?branch=master)](https://travis-ci.org/aces/Loris)
| major  | [![Build Status](https://travis-ci.org/aces/Loris.svg?branch=major)](https://travis-ci.org/aces/Loris)
| minor  | [![Build Status](https://travis-ci.org/aces/Loris.svg?branch=minor)](https://travis-ci.org/aces/Loris)
| bugfix | [![Build Status](https://travis-ci.org/aces/Loris.svg?branch=bugfix)](https://travis-ci.org/aces/Loris)

This Readme covers installation of the LORIS <b>v20.*</b> release on <b>Ubuntu</b>.
([CentOS Readme also available](https://github.com/aces/Loris/blob/master/README.CentOS6.md)).

Please consult the [LORIS Wiki Setup Guide](https://github.com/aces/Loris/wiki/Setup) notes on this [Install process](https://github.com/aces/Loris/wiki/Installing-Loris) for more information not included in this Readme. The [LORIS Developers mailing list](http://www.bic.mni.mcgill.ca/mailman/listinfo/loris-dev) may also provide installation guidance not covered in the Wiki. 

# Prerequisites for Installation

 * Apache **2.4** or higher
 * MySQL >= 5.7 (or MariaDB >= 10.3) 
 * PHP <b>7.2</b> or higher
 * [Composer](https://getcomposer.org/)

<b>Note:</b>
 * Composer should be run with --no-dev option unless you are an active LORIS developer. 

Consult the [LORIS Wiki](https://github.com/aces/Loris/wiki/Setup) page on this [Install process](https://github.com/aces/Loris/wiki/Installing-Loris) for more information.

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

# Community
Please feel free to subscribe to the [LORIS Developers mailing list](http://www.bic.mni.mcgill.ca/mailman/listinfo/loris-dev) to ask any LORIS-related questions.

