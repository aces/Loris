#!/usr/bin/env bash

#
# This script will:
#   1. Install the directory structure with appropriate permissions
#   2. Configure apache (optional)
#   3. Log these steps in the logs/ directory (if writable)
#

set -euo pipefail

# Script must be run from tools directory.
if [[ "$PWD" != *'/tools'* ]]; then
    echo "Please run this script from the tools directory."
    exit 2
fi

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

if [ $UID == "0" ]; then
    echo "install.sh must not be run as root (but should be run as a user with sudo access.)"
    exit 1
fi

echo "LORIS Installation Script starting at $START"

if [ ! -w $LOGDIR ] ; then
        echo "The logs directory is not writable. You will not have an automatically generated report of your installation."
        echo "We recommend you verify your user permissions and then re-run this script."
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

if [ -f ../project/config.xml ]; then
    echo " "
    echo "LORIS appears to already be installed. Aborting."
    exit 2;
fi

# Check that bash is being used
if ! [ $BASH ] ; then
    echo "Please switch to a bash shell. Then re-run this script using the command: ./install.sh"
    exit 2
fi

if [[ -n $(command -v php) ]]; then
    echo ""
    echo "PHP appears to be installed."
else
    echo ""
    echo "PHP does not appear to be installed. Aborting."
    exit 2;
fi

echo ""
echo "More information on the complete installation and setup process is available on the LORIS Wiki on GitHub."
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

# Create some subdirectories, if needed.
./create-project.sh ../project

mkdir -p ../smarty/templates_c
# Setting 770 permissions for templates_c
chmod 770 ../smarty/templates_c

# Changing group to 'www-data' or 'apache' to give permission to create directories in Document Repository module
# Detecting distribution
if ! os_distro=$(hostnamectl 2>/dev/null)
then
  os_distro="Other"
else
  os_distro=$(hostnamectl |awk -F: '/Operating System:/{print $2}'|cut -f2 -d ' ')
fi

debian=("Debian" "Ubuntu")
redhat=("Red" "CentOS" "Fedora" "Oracle")

if [[ " ${debian[*]} " =~ " $os_distro " ]]; then
    mkdir -p ../modules/document_repository/user_uploads
    mkdir -p ../modules/data_release/user_uploads
    sudo chown www-data.www-data ../modules/document_repository/user_uploads
    sudo chown www-data.www-data ../modules/data_release/user_uploads
    sudo chown www-data.www-data ../smarty/templates_c
    # Make Apache the group for project directory, so that the web based install
    # can write the config.xml file.
    sudo chgrp www-data ../project
    sudo chmod 770 ../project
elif [[ " ${redhat[*]} " =~ " $os_distro " ]]; then
    mkdir -p ../modules/document_repository/user_uploads
    mkdir -p ../modules/data_release/user_uploads
    sudo chown apache.apache ../modules/document_repository/user_uploads
    sudo chown apache.apache ../modules/data_release/user_uploads
    sudo chown apache.apache ../smarty/templates_c
    # Make Apache the group for project directory, so that the web based install
    # can write the config.xml file.
    sudo chgrp apache ../project
    sudo chmod 770 ../project
else
    echo "$os_distro Linux distribution detected. We currently do not support this. "
    echo "Please manually change subdirectory ownership and permissions to ensure the web server can read *and write* in the following: "
    echo "../modules/data_release/user_uploads "
    echo "../modules/document_repository/user_uploads "
    echo "../smarty/templates_c "
    echo ""
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

if [[ " ${debian[*]} " =~ " $os_distro " ]]; then
echo "Ubuntu distribution detected."
    # for CentOS, the log directory is called httpd
    logdirectory=/var/log/apache2
    while true; do
        read -p "Would you like to automatically set up your apache configuration files? [yn] " yn
        echo $yn | tee -a $LOGFILE > /dev/null
        case $yn in
            [Yy]* )
                export projectname=""
                while [ "$projectname" == "" ]; do
                        read -p "Please enter your Project name (if unsure, use LORIS) : " projectname
                        echo $projectname | tee -a $LOGFILE > /dev/null
                        case $projectname in
                                "" )
                                       read -p "Enter project name: " projectname
                                       continue;;
                                 * )
                                       break;;
                        esac
                done;
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
    read -p "Would you like to automatically set up your apache configuration files? (In development for CentOS) [yn] " yn
    echo $yn | tee -a $LOGFILE > /dev/null
    case $yn in
        [Yy]* )
            while [ "$projectname" == "" ]; do
                      read -p "Please enter your Project name (if unsure, use LORIS) : " projectname
                      echo $projectname | tee -a $LOGFILE > /dev/null
                      case $projectname in
                              "" )
                                     read -p "Enter project name: " projectname
                                     continue;;
                               * )
                                     break;;
                      esac
            done;
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
            echo "You may need to manually uncomment the load rewrite module line of your apache configuration."
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

echo "Script execution finished. Installation of LORIS directory structure is complete."
echo "Please keep a copy of this script output for troubleshooting purposes. "
echo ""
echo "Next steps: "
echo "- Run 'make' (or 'make dev') from inside your $RootDir folder."
echo "- Verify/enable your apache configuration and restart apache"
echo "- Navigate to <loris-url>/installdb.php using a supported browser (Chrome or Firefox) to continue installing the database."
