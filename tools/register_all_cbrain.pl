#!/usr/bin/perl
# Dave MacFarlane 2011
# david.macfarlane2@mcgill.ca

#insert into ConfigSettings (Name, Description, Visible, AllowMultiple, Parent) VALUES ('CBrainRegisterProviderID', 'CBrain data provider to register files when they''re registered into Loris', true, false, null);
#insert into Config (ConfigID, Value) VALUES (14, 47);

require CbrainAPI;
use strict;
use NeuroDB::DBI;
use Getopt::Tabular;
use File::Basename;

my $profile;
my $loris_user;
my @args = ();

my @arg_table = 
        (['-profile', "string", 1, \$profile, "Set the profile to use in ~/.neurodb"],
);

my $result = GetOptions(\@arg_table, \@ARGV);
if(!defined($profile)) {
    print "profile is required\n";
    exit(-1);
}

# Group prepared statements together and throw in some helper functions to execute them
# This is the only interaction we have directly with the DB
{
    { package Settings; do "$ENV{HOME}/.neurodb/$profile" }
    if (!defined(@Settings::db)) {
        print "\n\tERROR: You don't have a configuration file named '$profile' in:  $ENV{HOME}/.neurodb/ \n\n";
        exit(33);
    }

    my $dbh = &NeuroDB::DBI::connect_to_db(@Settings::db);
    my $configsth= $dbh->prepare("SELECT c.Value FROM ConfigSettings cs LEFT JOIN Config c ON (c.ConfigID=cs.ID) WHERE cs.Name=?");
    my $filelist = $dbh->prepare("SELECT f.FileID, f.File from files f WHERE f.CBrainID IS NULL");
    my $updatesth = $dbh->prepare("UPDATE files SET CBrainID=? WHERE FileID=?");
    sub _GetSingleVal {
        my $sth = shift;
        my $param = shift;
        $sth->execute($param);
        my @results = $sth->fetchrow_array;
        return $results[0];
    }
    sub GetConfigOption {
        my $name = shift;
        return _GetSingleVal($configsth, $name);
    }

    sub UpdateFileID {
        my $FileID = shift;
        my $CBrainID = shift;
        $updatesth->execute($CBrainID, $FileID);
    }

    sub GetFileList {
        $filelist->execute;
        return $filelist;
    }
    sub DisconnectDBH {
        $filelist->finish;
        $configsth->finish;
        
        $dbh->disconnect;
    }
}

my $cbrainhost = GetConfigOption("CBrainHost");
my $UserName = GetConfigOption("CBrainUsername");
my $Password = GetConfigOption("CBrainPassword");
my $ProviderID= GetConfigOption("CBrainRegisterProviderID");

my $agent = CbrainAPI->new(
    cbrain_server_url => $cbrainhost
);
$agent->login($UserName, $Password);

my $executed = GetFileList();
my $i = 0;
while(my @row = $executed->fetchrow_array) {
    my $FileID = $row[0];
    my $file = basename($row[1]);
    print "registering $FileID, $file\n";
    $i++;
    #my $CBrainFileID = $i;
    my $CBrainFileID= $agent->register_file($file, 'MincFile', $ProviderID);
    UpdateFileID($FileID, $CBrainFileID);
}

DisconnectDBH();

