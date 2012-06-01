#! /bin/sh

##prompt user for
###1) user name
###2) password
###3) 

read -p "what is the database name?" mysqldb
read -p "What is the databse host?" mysqlhost
read -p "What is the Mysql user?" mysqluser
read -p "what is the linux user which the intallation will be based on?" LinuxUser
read -p "what is the root password" rootpass
read -p "what is the project Name" PROJ   ##this will be used to create all the corresponding directories...i.e /data/gusto/bin.....

###unhard-code the paths in the mri-scripts
##Modify the config.xml

#INSTALLATION

##MINC TOOL
echo "installing Minc toolkit"
echo $rootpass | sudo -S apt-get install minc-tool

#INSTALL THE PERL LIBRARIES
while true; do
  read -p "Would you like ot install the PERL libraries" yn
  case $yn in
  [Yy]*)
  echo "Installing the perl libraries...THis will take a few minutes..."
  ###echo $rootpass | apt-get install build-essential
  ##will ask a series of questions and must answer yes to almost all....
  ##echo $rootpass | sudo perl -MCPAN -e shell
  echo $rootpass | sudo -S cpan install Math::Round
  echo $rootpass | sudo -S cpan install Bundle::CPAN
  echo $rootpass | sudo -S cpan install Getopt::Tabular
  echo $rootpass | sudo -S cpan install Time::JulianDay


##Install the CIVET PACKAGEs

###Modify the config.xml

<data>/data/$PROJ/data/</data>
<imagePath>/data/$PROJ/data/</imagePath>


###set environment variables under .bashrc
export $HOME=/home/lorisdev/
source /data/ndn-asd/data/bin/mri/environment
export TMPDIR=/tmp

##populate the MRI-protocol table
##must be done manually

##Create directories
mkdir /data/$PROJ/bin/ 
mkdir /data/$PROJ/data/
mkdir /data/YourProjectName/data/trashbin   ##holds mincs that didn't match protocol
mkdir /data/YourProjectName/data/tarchive   ##holds tared dicom-folder
mkdir /data/YourProjectName/data/pic           ##holds jpegs generated for the MRI-browser
mkdir /data/YourProjectName/data/logs         ## holds logs from pipeline script
mkdir /data/YourProjectName/data/jiv            ## holds JIVs used for JIV viewer
mkdir /data/YourProjectName/data/assembly ## holds the MINC files
mkdir /data/YourProjectName/data/batch_output  ##contains the result of the SGE (queue
		mkdir /home/$USER/.neurodb

##incoming directory
#based on the sites...
		mkdir /data/incoming/TOR/incoming
		mkdir /data/incoming/MTL/incoming

###Get the code
		cd /data/$PROJ/bin/  
		git clone git@github.com:aces/Loris-MRI.git  Loris-MRI
		cd Loris-MRI
		git submodule init
		git submodule sync
		git submodule update

###copy the dicom-archive/profileTemplate  to /home/lorisdev/.neurodb/prod

		cp dicom-archive/profileTemplate /home/$USER/.neurodb/prod

##change permissions 
chown $USER:$USER /home/$USER/.neurodb/prod
chmod 775 /home/$USER/.neurodb/prod
chmod -r 775 /data/$PROJECT/; chmod -r 775 /data
sudo chown lorisdev:lorisdev /tmp/

##change the prod file
##@db = ('database name', 'lorisuser', 'lorisuser-password', 'localhost or IP/machine');
$data_dir             = '/data/$PROJ/data'; 
$prefix                 = "$PROJ"; 
$get_dicom_info  = "/data/$PROJ/bin/mri/dicom-archive/get_dicom_info.pl";
$tarchiveLibraryDir = '/data/$PROJ/data/tarchive';
###variables $data_dir, $prefix, $mail_user, $get_dicom_info, $tarchiveLibraryDir 
###isFileToBeRegisteredGivenProtocol Can be easilly customized

##Customize the brain-browser in congfig.xml
cd /var/www/$PROJ/project
vi $config.xml <mincPath>path-to-minc-files</mincPath>


