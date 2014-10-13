#LORIS Neuroimaging Platform

LORIS is a web-accessible database solution for neuroimaging, providing a secure infrastructure to automate the flow of clinical data for complex multi-site neuroimaging studies.

# Prerequisites

 * LINUX (Optimized for Ubuntu 14.04) or Mac OS X (tested for Mavericks - OS X 10.9)
 * Apache2 (libapache2-mod-php5)
 * MySQL (libmysqlclient15-dev mysql-client mysql-server)
 * PHP/PEAR 5.2+ (php5 php-pear php5-dev php5-mysql php5-gd)
 * php5-json (for Debian/Ubuntu distributions) 
 * Git
 * Smarty 3
 * Package manager (for LINUX distributions)

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
 * Click “Fork” in https://github.com/aces/Loris. Fork to your Git-user. 
 * Clone fork to your server: 

    ```
    cd /var/www/ g
    git clone git@github.com:your-git-username/Loris-Trunk.git $projectname 
    ```

3. Run installer script to install core code, libraries, and MySQL schema (see LORIS Setup Schematic). The script will prompt for the following information, including usernames and folders which it will create automatically.

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

5. Notes for Loris post-installation setup are contained in the [Loris Developers Guide](https://docs.google.com/document/d/129T2SfqzKTTOkoXRykzCLe5Vy70A9Dzjw1O3vqgwsPQ).

# Community
Please feel free to subscribe to the LORIS Developer's mailing list, where you can feel free to ask any LORIS-related questions.

[LORIS Developers mailing list](http://www.bic.mni.mcgill.ca/mailman/listinfo/loris-dev)
