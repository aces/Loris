---
layout: default
title: Quick Start
description:
group: dev
permalink: /quick-start/
---

# LORIS Neuroimaging Platform [![Build Status](https://travis-ci.org/aces/Loris.svg?branch=17.1-dev)](https://travis-ci.org/aces/Loris)

LORIS (Longitudinal Online Research and Imaging System) is a web-based data and project management software for neuroimaging research. LORIS makes it easy to manage large datasets including behavioural, clinical, neuroimaging and genetic data acquired over time or at different sites.

<hr>
NEW <b>⇾  Try LORIS on Heroku</b> before installing it on your system<br>
Test out the project management and clinical data management side of LORIS (complete Imaging features not yet available)<br>
Deploy and log in with username <i>admin</i> and the password that's set up during deployment via ClearDB.
[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/aces/Loris/tree/17.1-dev)
<hr>

This Readme covers installation of the <b>17.1</b> LORIS release on <b>Ubuntu</b>.
([CentOS Readme also available](https://github.com/aces/Loris/blob/master/README.CentOS6.md)).

Please consult the [LORIS Wiki Setup Guide](https://github.com/aces/Loris/wiki/Setup) notes on this [Install process](https://github.com/aces/Loris/wiki/Install-Script) for more information not included in this Readme. The [LORIS Developers mailing list](http://www.bic.mni.mcgill.ca/mailman/listinfo/loris-dev) may also provide installation guidance not covered in the Wiki.

# Prerequisites for Installation

 * LINUX (supported on Ubuntu 14+ and [CentOS 6.5](https://github.com/aces/Loris/blob/master/README.CentOS6.md))
 * Apache2
 * MySQL 5.7
 * PHP <b>7</b>
 * Package manager (for LINUX distributions)
 * Composer : should be run with --no-dev option

<b>Important:</b>
 * If you are upgrading your LORIS, you'll also want to upgrade to both PHP 7 and MySQL 5.7, since these dependency versions were not supported in the last release.
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

3. Run installer script to install core code, and libraries. The script will prompt for information and so that it can create directories automatically.

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

5. Go to http://localhost/installdb.php and follow the instructions to finalize LORIS installation.

    _Note_: Apache config files will be installed as *.conf, per Ubuntu 14.04. If running an earlier version of Ubuntu, rename these files, then run the following commands. After, restart Apache.


    ```
    sudo a2dissite default
    sudo a2ensite $projectname
    ```

6. Follow the [Setup Guide in the LORIS Wiki](https://github.com/aces/Loris/wiki/Setup) to complete your post-installation setup and configuration, and for more documentation.

# Community
Please feel free to subscribe to the [LORIS Developers mailing list](http://www.bic.mni.mcgill.ca/mailman/listinfo/loris-dev) to ask any LORIS-related questions.
