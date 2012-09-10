#! /bin/sh

################################
####WHAT WILL NOT DO#############
###1)It doesn't set up the SGE
###2)It doesn't fetch the CIVET stuff   TODO:the civet stuff will need to be added to github
###3)It doesn't modify the environment

read -p "what is the database name?" mysqldb
read -p "What is the databse host?" mysqlhost
read -p "What is the Mysql user?" mysqluser
read -p "what is the linux user which the intallation will be based on?" LinuxUser
read -p "what is the root password" rootpass
read -p "what is the project Name" PROJ   ##this will be used to create all the corresponding directories...i.e /data/gusto/bin.....
read -p "what is your email address" email
read -p "Enter the Site number(if there is only one site" site


#################################################################################################
########################################MINC TOOL###############################################
##################################################################################################
echo "installing Minc toolkit (May prompt for sudo password)"
sudo -S apt-get install minc-tools

echo "installing dicom toolkit (May prompt for sudo password)"
sudo -S apt-get install dcmtk



#################################################################################################
############################INSTALL THE PERL LIBRARIES############################################
#################################################################################################
##while true; do
##  read -p "Would you like ot install the PERL libraries" yn
##  case $yn in
##      [Yy]*)
          echo "Installing the perl libraries...THis will take a few minutes..."
          ###echo $rootpass | apt-get install build-essential
          ##will ask a series of questions and must answer yes to almost all....
          ##echo $rootpass | sudo perl -MCPAN -e shell
          echo $rootpass | sudo -S cpan install Math::Round
          echo $rootpass | sudo -S cpan install Bundle::CPAN
          echo $rootpass | sudo -S cpan install Getopt::Tabular
          echo $rootpass | sudo -S cpan install Time::JulianDay
##          break;;
##      [Nn]*)
##          echo "Not installing Perl Libraries"
##          break;;
##       *) echo "please enter y or n"
##    esac
##done;



##Install the CIVET PACKAGEs
######################################################################
###########Modify the config.xml########################################
######################################################################
sed -e "s#%/PATH/TO/MINC/DATA/ROOT/mri-data/minc/%#/data/$PROJ/data#g" -e "s#LORISROOT%#/data/$PROJ/data#g" ../project/config.xml



####################################################################################
#######set environment variables under .bashrc#####################################
###################################################################################
##export $HOME=/home/lorisdev/  Do it only if neccessary
sed -e -i "s#ibis#$PROJ#g" /data/$PROJ/data/bin/mri/environment
source   /data/$PROJ/data/bin/mri/environment
export TMPDIR=/tmp

##########################################################################################
###########################3##Create directories########################################
#########################################################################################
  echo $rootpass | sudo -S mkdir -p /data/$PROJ/bin/ 
  echo $rootpass | sudo -S mkdir -p /data/$PROJ/data/
  echo $rootpass | sudo -S mkdir -p /data/$PROJ/data/trashbin   ##holds mincs that didn't match protocol
  echo $rootpass | sudo -S mkdir -p /data/$PROJ/data/tarchive   ##holds tared dicom-folder
  echo $rootpass | sudo -S mkdir -p /data/$PROJ/data/pic           ##holds jpegs generated for the MRI-browser
  echo $rootpass | sudo -S mkdir -p /data/$PROJ/data/logs         ## holds logs from pipeline script
  echo $rootpass | sudo -S mkdir -p /data/$PROJ/data/jiv            ## holds JIVs used for JIV viewer
  echo $rootpass | sudo -S mkdir -p /data/$PROJ/data/assembly ## holds the MINC files
  echo $rootpass | sudo -S mkdir -p /data/$PROJ/data/batch_output  ##contains the result of the SGE (queue
  echo $rootpass | sudo -S mkdir -p /home/$USER/.neurodb
  ###############incoming directory
  echo $rootpass | sudo -S mkdir -p /data/incoming/$site$PROJ/incoming


##################################################################
################Get the code#######################################
##################################################################
###NOTE By default the code goes to /data/project/bin/
		cd /data/$PROJ/bin/
		git clone git@github.com:aces/Loris-MRI.git mri
		cd mri
		git submodule init
		git submodule sync
		git submodule update

######################################################################################
##########################change the prod file#######################################
#####################################################################################
echo "Creating MRI config file"

sed -e "s#project#$PROJ#g" -e "s#/your/inepuisable/diskspace/location#/data/$PROJ/data#g" -e "s#yourname\@gmail.com#$email#g" -e "s#\/wherever\/you\/put\/this\/get_dicom_info.pl#/data/$PROJ/bin/mri/dicom-archive/get_dicom_info.pl#g"  -e "s#DBNAME#$mysqldb#g" -e "s#DBUSER#$mysqluser#g" -e "s#DBPASS#$mysqlpass#g" -e "s#DBHOST#$mysqlhost#g" /data/$PROJ/bin/mri/dicom-archive/profileTemplate > /home/$USER/.neurodb/prod


####################################################################################
######################chyange permissions ##########################################
####################################################################################
chown $USER:$USER /home/$USER/.neurodb/prod
chmod 775 /home/$USER/.neurodb/prod
chmod -r 775 /data/$PROJECT/; chmod -r 775 /data
sudo chown lorisdev:lorisdev /tmp/
tarchiveLibraryDir = '/data/$PROJ/data/tarchive';
###variables $data_dir, $prefix, $mail_user, $get_dicom_info, $tarchiveLibraryDir 
###isFileToBeRegisteredGivenProtocol Can be easilly customized

##Customize the brain-browser in congfig.xml
##cd /var/www/$PROJ/project
###vi $config.xml <mincPath>path-to-minc-files</mincPath>


