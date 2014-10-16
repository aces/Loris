#!/bin/bash

#
# This will:
#   1. Install PEAR libraries
#   2. Set up the Loris DB schema
#   3. Log the installation in the logs directory
# This will only install the database components and Loris config file.
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
        echo "The logs directory is not writeable. You will not have an automatically generated report of your installation."
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

if [[ -n $(which pear) ]]; then
    echo ""
    echo "PEAR appears to be installed."
else
    echo ""
    echo "PEAR does not appear to be installed. Aborting."
    exit 2;
fi

cat <<QUESTIONS

Please answer the following questions. You'll be asked:

  1) Your project directory name from section A) of the Installation Guide.
     (Will be used to modify the paths for Imaging data in the generated
     config.xml file for LORIS, and may also be used to automatically
     create/install apache config files.)

  2) A name for the MySQL Database. This should be
     a simple identifier such as "Loris" or "Abc_Def".
     This database will be created later on so please make sure
     a database with the same name does not already exist.

  3) The hostname for the machine where the MySQL server will run on
     (this is where we'll create the database).

  4) The MySQL username that the Loris system will use to connect
     to this server and database; this MySQL account will be
     created later on so please make sure a user with the same name
     does not already exist.

  5) The password for this username (it will be set later on).

  6) Another password for the 'admin' account of the Loris DB
     (it will also be set later on).

  7) Credentials of an existing root MySQL account to install the
     default schema. This will only be used once, to create and
     populate the default tables, and to grant privileges to the
     newly created MySQL user in part 3).

QUESTIONS


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
    echo "Loris appears to already be installed. Aborting."
    exit 2;
fi

# Check that we're running in the proper directory structure.
if [ ! -f ../SQL/0000-00-00-schema.sql ] ; then
    echo "Could not find schema file; make sure the current directory is in tools/ under the distribution."
    exit 2
fi

# Create some subdirectories, if needed.
mkdir -p ../project ../project/libraries ../project/instruments ../project/templates ../project/tables_sql ../smarty/templates_c

# Setting 777 permissions for templates_c
chmod 777 ../smarty/templates_c

# set the group user to www-data for tools/logs directory:
if [ -d logs ]; then
	sudo chgrp www-data logs
	# set the proper permission for the tools/logs directory:
	chmod 770 logs 
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
        read -p "What MySQL user will Loris connect as? " mysqluser
	echo $mysqluser | tee -a $LOGFILE > /dev/null
       	case $mysqluser in
               	"" )
                       	read -p "What MySQL user will Loris connect as? " mysqluser
                       	continue;;
                * )
       	                break;;
       	esac
done;

stty -echo

while true; do
        read -p "What is the password for MySQL user '$mysqluser'? " mysqlpass
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
        read -p "Enter the front-end Loris 'admin' user's password: " lorispass
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
       	read -p "Existing root MySQL username: " mysqlrootuser
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
    echo ""
    echo "Attempting to create the MySQL database '$mysqldb' ..."
    result=$(echo "CREATE DATABASE $mysqldb" | mysql -h$mysqlhost --user=$mysqlrootuser --password="$mysqlrootpass" -A 2>&1);
    if [[ $result == *1044* ]] || [[ $result == *1045* ]]; then
        echo "Could not connect to database with the root user provided. Please try again.";
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
        echo "Could not create the database with the root user provided.";
        exit 1;
    else
        break;
    fi
done;



echo ""
echo "Attempting to create and grant privileges to MySQL user '$mysqluser'@'localhost' ..."
echo "GRANT UPDATE,INSERT,SELECT,DELETE ON $mysqldb.* TO '$mysqluser'@'localhost' IDENTIFIED BY '$mysqlpass' WITH GRANT OPTION" | mysql $mysqldb -h$mysqlhost --user=$mysqlrootuser --password="$mysqlrootpass" -A > /dev/null 2>&1
MySQLError=$?;
if [ $MySQLError -ne 0 ] ; then
    echo "Could not connect to database with the root user provided.";
    exit 1;
fi



echo ""
echo "Creating/populuating database tables from schema."
echo ""
mysql $mysqldb -h$mysqlhost --user=$mysqlrootuser --password="$mysqlrootpass" -A 2>&1 < ../SQL/0000-00-00-schema.sql
echo "Updating Loris admin user's password."
mysql $mysqldb -h$mysqlhost --user=$mysqluser --password="$mysqlpass" -A -e "UPDATE users SET Password_MD5=CONCAT('aa', MD5('aa$lorispass')), Pending_approval='N' WHERE ID=1"



echo ""
echo "Creating config file."
sed -e "s/%HOSTNAME%/$mysqlhost/g" \
    -e "s/%USERNAME%/$mysqluser/g" \
    -e "s/%PASSWORD%/$mysqlpass/g" \
    -e "s/%DATABASE%/$mysqldb/g" \
    < ../docs/config/config.xml > ../project/config.xml



echo ""
echo "Populating database config."
mysql $mysqldb -h$mysqlhost --user=$mysqluser --password="$mysqlpass" -A -e "UPDATE Config SET Value='$RootDir/' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='base')"
mysql $mysqldb -h$mysqlhost --user=$mysqluser --password="$mysqlpass" -A -e "UPDATE Config SET Value='$RootDir/' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='DownloadPath')"
mysql $mysqldb -h$mysqlhost --user=$mysqluser --password="$mysqlpass" -A -e "UPDATE Config SET Value='/data/$projectname/data/' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='imagePath')"
mysql $mysqldb -h$mysqlhost --user=$mysqluser --password="$mysqlpass" -A -e "UPDATE Config SET Value='/data/$projectname/data/' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='data')"
mysql $mysqldb -h$mysqlhost --user=$mysqluser --password="$mysqlpass" -A -e "UPDATE Config SET Value='/data/$projectname/data/' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='mincPath')"
mysql $mysqldb -h$mysqlhost --user=$mysqluser --password="$mysqlpass" -A -e "UPDATE Config SET Value='/data/$projectname/data/' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='MRICodePath')"



echo ""
while true; do
    read -p "Would you like to install PEAR libraries (affects system files)? [yn] " yn
    echo $yn | tee -a $LOGFILE > /dev/null
    case $yn in
        [Yy]* )
            echo "Installing PEAR libraries (may prompt for sudo password)."
            echo ""
            echo "Upgrading PEAR..."
            sudo pear upgrade-all
            echo "Installing PEAR Benchmark..."
            sudo pear install Benchmark
            echo "Installing PEAR Config..."
            sudo pear install Config
            echo "Installing PEAR File_Archive..."
            sudo pear install File_Archive
            echo "Installing PEAR HTML_Common..."
            sudo pear install HTML_Common
            echo "Installing PEAR HTML_QuickForm..."
            sudo pear install HTML_QuickForm
            echo "Configuring PEAR preferred state..."
            sudo pear config-set preferred_state beta
            echo "Installing PEAR HTML_QuickForm2..."
            sudo pear install HTML_QuickForm2
            echo "Installing PEAR Mail..."
            sudo pear install Mail
            echo "Installing PEAR Mail_Mime..."
            sudo pear install Mail_Mime
            echo "Installing PEAR Net_SMTP..."
            sudo pear install Net_SMTP
            echo "Installing PEAR Net_Socket..."
            sudo pear install Net_Socket
            echo "Installing PEAR OLE..."
            sudo pear install OLE
            echo "Installing PEAR Pager..."
            sudo pear install Pager
            echo "Installing PEAR PhpDocumentor..."
            sudo pear install PhpDocumentor
            echo "Installing PEAR Spreadsheet_Excel_Writer..."
            sudo pear install Spreadsheet_Excel_Writer
            echo "Installing PEAR Structures_Graph..."
            sudo pear install Structures_Graph
            echo "Installing PEAR XML_Parser..."
            sudo pear install XML_Parser
            break;;
        [Nn]* )
            echo "Not installing PEAR libraries."
            break;;
        * ) echo "Please enter 'y' or 'n'."
   esac
done;


echo ""
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
            sed -e "s#%LORISROOT%#$RootDir/#g" \
                -e "s#%PROJECTNAME%#$projectname#g" \
                < ../docs/config/apache2-site | sudo tee /etc/apache2/sites-available/$projectname.conf > /dev/null
            sudo a2dissite 000-default
            sudo a2ensite $projectname
            break;;
        [Nn]* )
            echo "Not configuring apache."
            break;;
         * ) echo "Please enter 'y' or 'n'."
    esac
done;

echo "Installation complete."


