This page details steps for **Ubuntu 16.04**, for Loris 18.*

The following instructions must be executed in sequence. If you get an error at any of the steps, troubleshoot them before continuing.
> [Click here for Detailed installation instructions](https://github.com/aces/Loris/wiki/Installing-Loris-in-Depth)

When you're done, don't forget to continue following the rest of the [[Setup Guide|Setup]] including imaging setup.

# Assumptions
1. You are on Ubuntu 16.04; `lsb_release -a` should say Ubuntu 16.04
1. You'll be ssh'ing into a remote machine. If you are not, just ignore the steps that tell you to `ssh`

# Getting Prerequisites

1. `ssh` into your remote machine as a user in the `sudo` group (like `root`)
1. `sudo apt-get update`
1. `sudo apt-get install -y mysql-server mysql-client`
1. `sudo apt-get install -y zip curl wget python-software-properties software-properties-common`
1. `sudo add-apt-repository ppa:ondrej/php`
1. `sudo apt-get update`
1. `sudo apt-get install -y apache2`
1. `sudo apt-get install -y php7.2 php7.2-mysql php7.2-xml php7.2-json php7.2-mbstring php7.2-gd php-ast`
1. `sudo apt-get install -y composer`
1. `sudo apt-get install -y libapache2-mod-php7.2`
1. `sudo a2enmod php7.2`
1. `sudo service apache2 restart`

# Creating a user for LORIS

1. `ssh` into your remote machine as a user in the `sudo` group (like `root`)
1. `sudo useradd -U -m -G sudo -s /bin/bash lorisadmin`
1. `sudo passwd lorisadmin`
1. `su - lorisadmin`
1. `whoami`, you should see `lorisadmin`

# Downloading LORIS

<!--
> To future maintainers of this document, please update the latest release ZIP file link by getting the link from here: https://github.com/aces/Loris/releases/latest
-->

Make sure you're ssh'd as `lorisadmin`

> Note that the path is assumed to be var/www/loris however your own path may be var/www/`<project-name>`, depending on your setup. 

1. `cd /var/www`
1. [[Get the latest release URL|https://github.com/aces/Loris/wiki/Getting-the-Release]] and then (e.g.) `sudo wget https://github.com/aces/Loris/archive/v18.0.4.zip -O release.zip`
1. `sudo unzip release.zip`
1. `ls`, you should see a directory named `Loris-_XX-X-X_`
1. `sudo mv Loris* loris`
1. `ls`, you should see a `loris` directory
1. `sudo rm release.zip`
1. `sudo chown lorisadmin.lorisadmin loris`

# Running the Install Script

Make sure you're ssh'd as `lorisadmin`

> Note that the path is assumed to be var/www/loris however your own path may be var/www/`<project-name>`, depending on your setup. 

1. `cd /var/www/loris/tools`
1. `sudo ./install.sh`
1. Fill in your `<project-name>` (You get to choose what it is)
1. When `install.sh` asks to configure apache2 for you, accept
1. Key in `lorisadmin`'s password
1. Wait
1. Installation complete

# Configuring Apache2

Assuming you let the install script configure apache2 for you but it didn't work out for some reason.

1. `sudo a2enmod rewrite`
1. `sudo a2ensite <project-name>`
1. `sudo service apache2 restart`

# Installing the Database - 1 of 2

You must already have MySQL installed, and MySQL root credential set up. 

1. Figure out your `<loris-url>` (It's probably the IP address of your remote machine)
1. Open your internet browser
1. Navigate to `<loris-url>/installdb.php`
1. Fill in `<mysql-host-name>`; if the MySQL server is on the same machine that is hosting Loris, it will be `localhost`
1. Fill in `<mysql-admin-username>`; it is easiest to just use the existing MySQL `root` credential
1. Fill in `<mysql-admin-password>`
1. Fill in `<mysql-database>`; this database must not exist yet as the installer will try to create it
1. Submit

[[img/Installing-Loris-After-Installing-Prerequisites/install-db-admin-zoomed-4.png]]

# Installing the Database - 2 of 2

1. Fill in `<mysql-user-username>`, `<mysql-user-password>`; must not be the same as root/admin MySQL credential
1. Fill in `<loris-admin-username>`, `<loris-admin-password>`; 8 or more characters, must include a capital letter and a special character
1. Submit

[[img/Installing-Loris-After-Installing-Prerequisites/install-db-user-zoomed-4.png]]

# Logging In to the LORIS Admin Panel

1. Open your internet browser
1. Navigate to `<loris-url>`
1. Fill in `<loris-admin-username>`
1. Fill in `<loris-admin-password>`
1. Log in

[[img/Installing-Loris-After-Installing-Prerequisites/log-in-zoomed-3.png]]

***
You now have the basic LORIS features installed and are [ready to set up](https://github.com/aces/Loris/wiki/Setup) configurations, Behavioural instruments and Imaging support.

# Troubleshooting the basic installation

#### Help! `<loris-url>` is loading a blank white page!
#### Help! `<loris-url>` is saying it cannot read/write `templates_c`!

> Note that the path is assumed to be var/www/loris however your own path may be var/www/`<project-name>`, depending on your setup. 

Check the following:

1. That the `base` path setting in your Config table is correct.  If your front-end is not loading: [Back-end troubleshooting instructions here](https://github.com/aces/Loris/wiki/Project-Customization#troubleshooting-configuration-settings)

1. That `/var/www/loris/smarty/templates_c` exists; if it doesn't,
    1. `cd /var/www/loris/smarty`
    1. `sudo mkdir templates_c`
    1. `sudo chmod 777 templates_c`

1. That `/var/www/loris/smarty/templates_c` is owned by `www-data` (Run `ls -al /var/www/loris/smarty` to check) or has `777` permissions (Not ideal but `install.sh` does something similar, Run `sudo chmod 777 /var/www/loris/smarty/templates_c`)