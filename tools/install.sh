#!/bin/bash

#
# This will:
#   1. Install PEAR libraries
#   2. Set up the LORIS DB schema
#   3. Log the installation in the logs directory
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

if [[ -n $(which composer) ]] || [[ -x ../composer ]]; then
    echo ""
    echo "PHP Composer appears to be installed."
    composer_scr="composer install --no-dev"
else
    echo "PHP Composer does not appear to be installed. Attempting to install now..."
    curl -sS https://getcomposer.org/installer | php
    mv composer.phar ../composer
    if [[ -x ../composer ]]; then
        echo ""
        echo "PHP Composer successfully installed."
        composer_scr="./composer install --no-dev"
    else
        echo ""
        echo "PHP Composer failed to install. Aborting."
        exit 2;
    fi
fi

echo ""

cat <<QUESTIONS
This install script will ask you to provide inputs for different steps. 
Please ensure you have the following information ready (if applicable):  

  1) Your project directory name.   
     (Will be used to modify the paths for Imaging data in the generated
     config.xml file for LORIS, and may also be used to automatically
     create/install apache config files.)

  2) MySQL Database name. 
     If an empty database has not already been created for your project, 
     choose a simple name such as "LORIS" or "Abc_Def"

  3) Hostname for the machine running MySQL server where the database
     is or will be located.

  4) A new MySQL username that the LORIS system will use to connect
     to this server and database to perform frontend-backend transactions.  
     This script will ask to create this user. 
     Recommended: "lorisuser"

  5) Host address of this machine - from which LORIS system will be connecting 
     (Where Apache is installed)

  6) A new password for the "lorisuser" MySQL username

  7) Another new password for the 'admin' frontend Loris user account.
     This 'admin' account will be the superuser Loris' web-accessible platform.

  8) Credentials of an existing MySQL account with root or superuser privileges, 
     capable of creating the database, or installing the schema, 
     or creating users on the given database. 
     This will only be used to create the database, install the schema, 
     and/or create and grant privileges to the "lorisuser" MySQL user. 

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

# Check that we're running in the proper directory structure.
if [ ! -f ../SQL/0000-00-00-schema.sql ] ; then
    echo "Could not find schema file; make sure the current directory is in tools/ under the distribution."
    exit 2
fi

# Create some subdirectories, if needed.
mkdir -p ../project ../project/data ../project/libraries ../project/instruments ../project/templates ../project/tables_sql ../project/modules ../smarty/templates_c

# Setting 777 permissions for templates_c
chmod 777 ../smarty/templates_c

# Changing group to 'www-data' or 'apache' to give permission to create directories in Document Repository module
# Detecting distribution
if type "lsb_release" > /dev/null 2>&1; then
    os_distro=$(lsb_release -si)
elif type "facter" > /dev/null 2>&1; then
    os_distro=$(facter operatingsystem)
else
    os_distro="unknown"
fi

if [ $os_distro = "Ubuntu" ]; then
    sudo chown www-data.www-data ../modules/document_repository/user_uploads
elif [ $os_distro = "CentOS" ]; then
    sudo chown apache.apache ../modules/document_repository/user_uploads
else
    echo "$os_distro Linux distribution detected. We currently do not support this. Please manually chown/chgrp the user_uploads directory in ../modules/document_repository to the web server"
fi


# Set the proper permission for the tools/logs directory:
if [ -d logs ]; then
    chmod 770 logs
    # Set the group to 'www-data' or 'apache' for tools/logs directory:
    if [ $os_distro = "Ubuntu" ]; then
        sudo chgrp www-data logs
    elif [ $os_distro = "CentOS" ]; then
        sudo chgrp apache logs
    else
        echo "$os_distro Linux distribution detected. We currently do not support this. Please manually set the permissions for user_uploads directory in ../modules/document_repository"
    fi
fi


while [ "$mysqldb" == "" ]; do
	read -p "What is the database name? " mysqldb
	echo $mysqldb | tee -a $LOGFILE > /dev/null
	case $mysqldb in
		"" )
			read -p "What is the database name? " mysqldb
			continue;;
		* )
			break;;
	esac
done;

while [ "$mysqlhost" == "" ]; do
        read -p "Database host? " mysqlhost
	echo $mysqlhost | tee -a $LOGFILE > /dev/null
       	case $mysqlhost in
               	"" )
                       	read -p "Database host? " mysqlhost
                       	continue;;
                * )
       	                break;;
        esac
done;

while [ "$mysqluser" == "" ]; do
        read -p "What MySQL user will LORIS connect as? (Recommended: lorisuser)" mysqluser
	echo $mysqluser | tee -a $LOGFILE > /dev/null
       	case $mysqluser in
               	"" )
                       	read -p "What MySQL user will LORIS connect as? (Recommended: lorisuser)" mysqluser
                       	continue;;
                * )
       	                break;;
       	esac
done;

while [ "$mysqluserhost" == "" ]; do
        read -p "What is the host from which MySQL user '$mysqluser' will connect? (Where Loris' Apache is hosted)" mysqluserhost
        echo $mysqluserhost | tee -a $LOGFILE > /dev/null
        case $mysqluserhost in
                "" )
                        read -p "What is the host from which MySQL user '$mysqluser' will connect? (Where Loris' Apache is hosted)" mysqluserhost
                        continue;;
                * )
                        break;;
        esac
done;

stty -echo

while true; do
        read -p "Choose a password for MySQL user '$mysqluser'? " mysqlpass
	echo ""
        read -p "Re-enter the password to check for accuracy: " mysqlpass2
	if [[ "$mysqlpass" == "$mysqlpass2" ]] ; then
	        break;
	fi
	echo ""
	echo "Passwords did not match. Please try again.";
done;

stty echo ; echo ""
stty -echo

while true; do
        read -p "Choose a different password for the front-end LORIS 'admin' user account: " lorispass
        echo ""
        read -p "Re-enter the password to check for accuracy: " lorispass2
        if [[ "$lorispass" == "$lorispass2" ]] ; then
                break;
        fi
	echo ""
	echo "Passwords did not match. Please try again.";
done;

stty echo ; echo ""

while [ "$mysqlrootuser" == "" ]; do
       	read -p "Existing root or admin-level MySQL username: " mysqlrootuser
	echo $mysqlrootuser | tee -a $LOGFILE > /dev/null
       	case $mysqlrootuser in
               	"" )
                       	read -p "Existing root MySQL username: " mysqlrootuser
                       	continue;;
                * )
       	                break;;
       	esac
done;

stty -echo

while true; do
        read -p "MySQL password for user '$mysqlrootuser': " mysqlrootpass
        echo ""
        read -p "Re-enter the password to check for accuracy: " mysqlrootpass2
        if [[ "$mysqlrootpass" == "$mysqlrootpass2" ]] ; then
                break;
        fi
	echo ""
	echo "Passwords did not match. Please try again.";
done;

stty echo

echo ""
while true; do
    read -p "Would you like to automatically create the MySQL database for LORIS? [yn] " yn
    echo $yn | tee -a $LOGFILE > /dev/null
    case $yn in
        [Yy]* )
            while true; do
                echo ""
                echo "Attempting to create the MySQL database '$mysqldb' ..."
                result=$(echo "CREATE DATABASE $mysqldb" | mysql -h$mysqlhost --user=$mysqlrootuser --password="$mysqlrootpass" -A 2>&1);
                if [[ $result == *1044* ]] || [[ $result == *1045* ]]; then
                    echo "Could not connect to database with the credential provided for '$mysqlrootuser' - Please try again.";
                    read -p "Existing root MySQL username: " mysqlrootuser
                    echo $mysqlrootuser | tee -a $LOGFILE > /dev/null
                    stty -echo
                    while true; do
                        read -p "MySQL password for user '$mysqlrootuser': " mysqlrootpass
                        echo ""
                        read -p "Re-enter the password to check for accuracy: " mysqlrootpass2
                        if [[ "$mysqlrootpass" == "$mysqlrootpass2" ]] ; then
                            break;
                        fi
                        echo ""
                        echo "Passwords did not match. Please try again.";
                     done;
                     stty echo
                # Needed for mysql version > 5.6
                elif [[ $result == *password* ]] && [[ $result != *1007* ]] ; then
                    echo "Warning: Using a password on the command line interface can be insecure.";
                    break;
                elif [[ $result == *1007* ]] ; then
                    echo "Could not create the database $mysqldb. A database with the name $mysqldb already exists.";
                    read -p "Choose a different database name: " mysqldb
                elif [[ $result != '' ]]; then
                    echo "Could not create the database with the user '$mysqlrootuser' provided.";
                    exit 1;
                else
                    break;
                fi
            done;
            break;;
        [Nn]* )
            echo "Not creating MySQL database for LORIS."
            break;;
         * ) echo "Please enter 'y' or 'n'."
    esac
done;


while true; do
    read -p "Would you like to automatically create and grant privileges to MySQL user '$mysqluser'@'$mysqluserhost'? [yn] " yn
    echo $yn | tee -a $LOGFILE > /dev/null
    case $yn in
        [Yy]* )
            echo ""
            echo "Attempting to create and grant privileges to MySQL user '$mysqluser'@'$mysqluserhost' ..."
            echo "GRANT UPDATE,INSERT,SELECT,DELETE,CREATE TEMPORARY TABLES ON $mysqldb.* TO '$mysqluser'@'$mysqluserhost' IDENTIFIED BY '$mysqlpass' WITH GRANT OPTION" | mysql $mysqldb -h$mysqlhost --user=$mysqlrootuser --password="$mysqlrootpass" -A > /dev/null 2>&1
            MySQLError=$?;
            if [ $MySQLError -ne 0 ] ; then
                echo "Could not connect to database with $mysqlrootuser user provided.";
                exit 1;
            fi
            break;;
        [Nn]* )
            echo "Not creating and granting privileges to MySQL user '$mysqluser'@'$mysqluserhost'."
            break;;
         * ) echo "Please enter 'y' or 'n'."
    esac
done;


while true; do
    read -p "Would you like to automatically create/populate database tables from schema? [yn] " yn
    echo $yn | tee -a $LOGFILE > /dev/null
    case $yn in
        [Yy]* )
            echo ""
            echo "Creating/populating database tables from schema."
            echo ""
            mysql $mysqldb -h$mysqlhost --user=$mysqlrootuser --password="$mysqlrootpass" -A 2>&1 < ../SQL/0000-00-00-schema.sql
            mysql $mysqldb -h$mysqlhost --user=$mysqlrootuser --password="$mysqlrootpass" -A 2>&1 < ../SQL/0000-00-01-Permission.sql
            mysql $mysqldb -h$mysqlhost --user=$mysqlrootuser --password="$mysqlrootpass" -A 2>&1 < ../SQL/0000-00-02-Menus.sql
            mysql $mysqldb -h$mysqlhost --user=$mysqlrootuser --password="$mysqlrootpass" -A 2>&1 < ../SQL/0000-00-03-ConfigTables.sql
            mysql $mysqldb -h$mysqlhost --user=$mysqlrootuser --password="$mysqlrootpass" -A 2>&1 < ../SQL/0000-00-04-Help.sql
            mysql $mysqldb -h$mysqlhost --user=$mysqlrootuser --password="$mysqlrootpass" -A 2>&1 < ../SQL/0000-00-99-indexes.sql
            echo "Updating Loris admin user's password."
            pw_expiry=$(date --date="6 month" +%Y-%m-%d)
            echo "Updating admin password reset date to be $pw_expiry"
            mysql $mysqldb -h$mysqlhost --user=$mysqluser --password="$mysqlpass" -A -e "UPDATE users SET Password_MD5=CONCAT('aa', MD5('aa$lorispass')), Password_expiry='$pw_expiry', Pending_approval='N' WHERE ID=1"
            break;;
        [Nn]* )
            echo "Not creating/populating database tables from schema."
            break;;
         * ) echo "Please enter 'y' or 'n'."
    esac
done;


echo ""
echo "Creating config file."
sed -e "s/%HOSTNAME%/$mysqlhost/g" \
    -e "s/%USERNAME%/$mysqluser/g" \
    -e "s/%PASSWORD%/$mysqlpass/g" \
    -e "s/%DATABASE%/$mysqldb/g" \
    < ../docs/config/config.xml > ../project/config.xml


while true; do
    read -p "Would you like to automatically populate database config? [yn] " yn
    echo $yn | tee -a $LOGFILE > /dev/null
    case $yn in
        [Yy]* )
            echo ""
            echo "Populating database config."
            mysql $mysqldb -h$mysqlhost --user=$mysqluser --password="$mysqlpass" -A -e "UPDATE Config SET Value='$RootDir/' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='base')"
            mysql $mysqldb -h$mysqlhost --user=$mysqluser --password="$mysqlpass" -A -e "UPDATE Config SET Value='$RootDir/' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='DownloadPath')"
            mysql $mysqldb -h$mysqlhost --user=$mysqluser --password="$mysqlpass" -A -e "UPDATE Config SET Value='/data/$projectname/data/' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='imagePath')"
            mysql $mysqldb -h$mysqlhost --user=$mysqluser --password="$mysqlpass" -A -e "UPDATE Config SET Value='/data/$projectname/data/' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='data')"
            mysql $mysqldb -h$mysqlhost --user=$mysqluser --password="$mysqlpass" -A -e "UPDATE Config SET Value='/data/$projectname/data/' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='mincPath')"
            mysql $mysqldb -h$mysqlhost --user=$mysqluser --password="$mysqlpass" -A -e "UPDATE Config SET Value='/data/$projectname/data/' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='MRICodePath')"
            break;;
        [Nn]* )
            echo "Not populating database config."
            break;;
         * ) echo "Please enter 'y' or 'n'."
    esac
done;


echo ""
# Install external libraries using composer
cd ..
eval $composer_scr
cd tools


if [ $os_distro = "Ubuntu" ]; then
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
elif [ $os_distro = "CentOS" ]; then
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
