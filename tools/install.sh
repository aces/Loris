#!/bin/bash

#
# This will:
#   1. Set up the LORIS DB schema
#   2. Log the installation in the logs directory
# This will only install the database components and LORIS config file.
#

# Must be run interactively.
if ! test -t 0 -a -t 1 -a -t 2 ; then
    echo "This installation program should be run interactively."
    exit 2
fi

# Create logs directory, if needed.
mkdir -p logs

START=`date "+%Y-%m-%dT%H:%M:%S"`
LOGDIR="logs"
LOGFILE="logs/install-$START.log"
LOGPIPE=/tmp/pipe.$$
mkfifo -m 700 $LOGPIPE
trap "rm -f $LOGPIPE" EXIT
tee -a <$LOGPIPE $LOGFILE &
exec 1>$LOGPIPE 2>&1

CWD=`pwd`
RootDir=`dirname $CWD`


echo "LORIS Installation Script starting at $START"

if [ ! -w $LOGDIR ] ; then
        echo "The logs directory is not writable. You will not have an automatically generated report of your installation."
        while true; do
                read -p "Do you still want to continue? [yn] " yn
		echo $yn | tee -a $LOGFILE > /dev/null
                case $yn in
                        [Yy]* )
                                break;;
                        [Nn]* )
                                echo "Aborting installation."
                                exit 2;;
                        * ) echo "Please enter 'y' or 'n'."
                esac
        done;
else
	echo "The log for this session will be stored in file $CWD/$LOGFILE"
fi


# Banner
cat <<BANNER
---------------------------------------------------------------------
                   LORIS Installation Script
---------------------------------------------------------------------
BANNER

# Check that bash is being used
if ! [ $BASH ] ; then
    echo "Please use bash shell. Run the install script as command: ./install.sh"
    exit 2
fi

if [[ -n $(which php) ]]; then
    echo ""
    echo "PHP appears to be installed."
else
    echo ""
    echo "PHP does not appear to be installed. Aborting."
    exit 2;
fi

if [[ -n $(which composer) ]]; then
    echo ""
    echo "PHP Composer appears to be installed."
    composer_scr="composer install --no-dev"
elif [[ -x ../composer ]]; then
    echo ""
    echo "PHP Composer appears to be installed."
    composer_scr="./composer install --no-dev"
else
    echo ""
    echo "PHP Composer does not appear to be installed. Please install it before running this script."
    echo ""
    echo "(e.g. curl -sS https://getcomposer.org/installer | php)"
    exit 2;
fi

echo ""

cat <<QUESTIONS
This install script will ask you to provide inputs for different steps.
Please ensure you have the following information ready (if applicable):

  1) Your project directory name.
     (Will be used to modify the paths for Imaging data in the generated
     config.xml file for LORIS, and may also be used to automatically
     create/install apache config files.) If unsure, a default like "LORIS"
     should be acceptable.

Please also consult the Loris WIKI on GitHub for more information on these
Install Script input parameters.
QUESTIONS

echo ""

while true; do
        read -p "Ready to continue? [yn] " yn
	echo $yn | tee -a $LOGFILE > /dev/null
        case $yn in
            [Yy]* )
                break;;
            [Nn]* )
		echo "Exiting."
                exit 1;;
             * ) echo "Please enter y or n"
        esac
done;

echo ""

while [ "$projectname" == "" ]; do
        read -p "Enter project name: " projectname
        echo $projectname | tee -a $LOGFILE > /dev/null
        case $projectname in
                "" )
                        read -p "Enter project name: " projectname
                        continue;;
                * )
                        break;;
        esac
done;

if [ -f ../project/config.xml ]; then
    echo "LORIS appears to already be installed. Aborting."
    exit 2;
fi

# Create some subdirectories, if needed.
create-project.sh ../project

mkdir -p ../smarty/templates_c
# Setting 770 permissions for templates_c
chmod 770 ../smarty/templates_c

# Changing group to 'www-data' or 'apache' to give permission to create directories in Document Repository module
# Detecting distribution
os_distro=$(hostnamectl |awk -F: '/Operating System:/{print $2}'|cut -f2 -d ' ')

debian=("Debian" "Ubuntu")
redhat=("Red" "CentOS" "Fedora" "Oracle") 

if [[ " ${debian[*]} " =~ " $os_distro " ]]; then
    sudo chown www-data.www-data ../modules/document_repository/user_uploads
    sudo chown www-data.www-data ../modules/data_release/user_uploads
    sudo chown www-data.www-data ../smarty/templates_c
    # Make Apache the group for project directory, so that the web based install
    # can write the config.xml file.
    sudo chgrp www-data ../project
    sudo chmod 770 ../project
elif [[ " ${redhat[*]} " =~ " $os_distro " ]]; then
    sudo chown apache.apache ../modules/document_repository/user_uploads
    sudo chown apache.apache ../modules/data_release/user_uploads
    sudo chown apache.apache ../smarty/templates_c
    # Make Apache the group for project directory, so that the web based install
    # can write the config.xml file.
    sudo chgrp apache ../project
    sudo chmod 770 ../project
else
    echo "$os_distro Linux distribution detected. We currently do not support this. Please manually chown/chgrp to the web server user in: the user_uploads directory in ../modules/data_release/ and ../modules/document_repository/, as well as ../smarty/templates_c/"
fi

# Set the proper permission for the tools/logs directory:
if [ -d logs ]; then
    chmod 770 logs
    # Set the group to 'www-data' or 'apache' for tools/logs directory:
    if [[ " ${debian[*]} " =~ " $os_distro " ]]; then
        sudo chgrp www-data logs
    elif [[ " ${redhat[*]} " =~ " $os_distro " ]]; then
        sudo chgrp apache logs
    else
        echo "$os_distro Linux distribution detected. We currently do not support this. Please manually set the permissions for the directory tools/logs/"
    fi
fi

echo ""
# Install external libraries using composer
cd ..
eval $composer_scr
cd tools


if [[ " ${debian[*]} " =~ " $os_distro " ]]; then
echo "Ubuntu distribution detected."
    # for CentOS, the log directory is called httpd
    logdirectory=/var/log/apache2
    while true; do
        read -p "Would you like to automatically create/install apache config files? (Works for Ubuntu 14.04 default Apache installations) [yn] " yn
        echo $yn | tee -a $LOGFILE > /dev/null
        case $yn in
            [Yy]* )
                if [ -f /etc/apache2/sites-available/$projectname ]; then
                    echo "Apache appears to already be configured for $projectname. Aborting\n"
                    exit 1
                fi;
                # Need to pipe to sudo tee because > is done as the logged in user, even if run through sudo
                sed -e "s#%LORISROOT%#$RootDir#g" \
                    -e "s#%PROJECTNAME%#$projectname#g" \
      	            -e "s#%LOGDIRECTORY%#$logdirectory#g" \
                    < ../docs/config/apache2-site | sudo tee /etc/apache2/sites-available/$projectname.conf > /dev/null
                sudo ln -s /etc/apache2/sites-available/$projectname.conf /etc/apache2/sites-enabled/$projectname.conf
                sudo a2dissite 000-default
                sudo a2ensite $projectname.conf
                sudo a2enmod rewrite
                sudo a2enmod headers
                break;;
            [Nn]* )
                echo "Not configuring apache."
                break;;
            * ) echo "Please enter 'y' or 'n'."
        esac
    done;
elif [[ " ${redhat[*]} " =~ " $os_distro " ]]; then
echo "CentOS distribution detected."
# for CentOS, the log directory is called httpd
logdirectory=/var/log/httpd
while true; do
    read -p "Would you like to automatically create/install apache config files? (In development for CentOS 6.5) [yn] " yn
    echo $yn | tee -a $LOGFILE > /dev/null
    case $yn in
        [Yy]* )
            if [ -f /etc/httpd/conf.d/$projectname ]; then
                echo "Apache appears to already be configured for $projectname. Aborting\n"
                exit 1
            fi;

            # Need to pipe to sudo tee because > is done as the logged in user, even if run through sudo
            sed -e "s#%LORISROOT%#$RootDir#g" \
                -e "s#%PROJECTNAME%#$projectname#g" \
                -e "s#%LOGDIRECTORY%#$logdirectory#g" \
                < ../docs/config/apache2-site | sudo tee /etc/httpd/conf.d/$projectname.conf > /dev/null

            sudo service httpd restart
            echo "You may need to manually uncomment the load rewrite module line of your conf."
            break;;
        [Nn]* )
            echo "Not configuring apache."
            break;;
         * ) echo "Please enter 'y' or 'n'."
    esac
done;
else
    echo "$os_distro Linux distribution detected. We currently do not support this. Please configure Apache manually."
    exit 1
fi

echo "Installation complete."
