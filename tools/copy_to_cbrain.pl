#!/usr/bin/perl
# Dave MacFarlane 2011
# david.macfarlane2@mcgill.ca
# Script to send minc files to a CBrain server using CBrain API, 
# launch a CIVET task, and store the CBrain TaskID in the Loris database
# Takes list of files from STDIN
# Requires public keys to be setup for the user executing it to $RemoteHost
# TODO: - don't use SSH unless $RemoteHost is set (and not set to localhost)

require CbrainAPI;
use NeuroDB::DBI;
use File::Basename;
use strict;
use Getopt::Tabular;

my $profile;
my $loris_user;
my @args = ();

my @arg_table = 
        (['-profile', "string", 1, \$profile, "Set the profile to use in ~/.neurodb"],
        ["-lorisuser", "string", 1, \$loris_user, "Loris user who launched task"]
);

my $result = GetOptions(\@arg_table, \@ARGV);
if(!defined($profile)) {
    print "profile is required\n";
    exit(-1);
} 
if(!defined($loris_user)) {
    print "Lorisuser parameter is required\n";
    exit(-1);
}


# input option error checking

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
    my $useridsth = $dbh->prepare("SELECT ID FROM users WHERE UserId=? LIMIT 1");
    my $newtasksth = $dbh->prepare("INSERT INTO CBrainTasks (UserID, Timestamp, CBrainHost, TaskID, Status) VALUES (?, ?, ?, ?, ?)");
    my $fileidsth = $dbh->prepare("SELECT FileID FROM files WHERE File like CONCAT('%', ?)");
    my $insertfilesth = $dbh->prepare("INSERT INTO CBrainSubmittedFiles(FileID, CBrainTaskID) VALUES (?, ?)");

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
    sub GetUserID { 
        my $name = shift;
        return _GetSingleVal($useridsth, $name);
    }

    sub InsertNewTask {
        my $UserID = shift;
        my $timestamp = shift;
        my $cbrainhost = shift;
        my $TaskID = shift;
        $newtasksth->execute($UserID, $timestamp, $cbrainhost, $TaskID, 'Unknown');
        return $dbh->{mysql_insertid};
    }
    sub InsertFileList {
        my $CBrainTaskID = shift;
        my $filename = shift;
        
        print "Filename: $filename";
        my $FileID = _GetSingleVal($fileidsth, $filename);
        print "FileID: $FileID";
        $insertfilesth->execute($FileID, $CBrainTaskID);
    }
    sub DisconnectDBH {
        $configsth->finish;
        $useridsth->finish;
        $newtasksth->finish;
        $fileidsth->finish;
        $insertfilesth->finish;

        $dbh->disconnect();
    }
}

# Magic values that Pierre asked me to use
# They should be un-hardcoded once the API
# allows it.
my $ProviderID = GetConfigOption("CBrainProviderID");
my $ToolConfigID = GetConfigOption("CBrainToolConfigID");
my $cbrainhost = GetConfigOption("CBrainHost");

my $civetprefix = "civet";

# Username/password to login to cbrain with.
# This should be converted into commandline
# options. The password should be a 
# hash once CBrain API allows it.
my $UserName = GetConfigOption("CBrainUsername");
my $Password = GetConfigOption("CBrainPassword");

my $FilePath = GetConfigOption("CBrainFilePath");
my $RemoteUser = GetConfigOption("FilesUserName");
my $FileHost = GetConfigOption("FilesHost");

my $UserID = GetUserID($loris_user);
print "ProviderID: $ProviderID\n";
print "ToolConfigID: $ToolConfigID\n";
print "cbrainhost: $cbrainhost\n";
print "UserName: $UserName\n";
print "Password: $Password\n";
print "\n";
if(!$UserID) {
    print "Loris User does not exist\n";
    exit(-1);
}
print "$loris_user : $UserID\n\n";

my $timestamp = time();
my %subject_map = ();

# Get the list of files from stdin, and set the subject_map
# required by cbrain
my $filelist = "";
while(my $line = <>) {
    chomp($line);
    print "$line\n";
    $filelist .= $line . "\n";
    my @paths = split('/', $line);
    $subject_map{$paths[$#paths]} = basename($paths[$#paths],  '.mnc' );
    print "Key: $paths[$#paths]\n";
    print "Value: $subject_map{$paths[$#paths]}\n";

    # Don't copy the file here anymore, it's done in one shot through a shell script below
    #system("ssh -n $RemoteUser\@$FileHost \"ln $line $FilePath/$timestamp/\"");
}
# put list in a file on $FileHost in filelists/cbrain.$timestamp.txt
system("ssh -n $RemoteUser\@$FileHost \"cat > $FilePath/filelists/cbrain.$timestamp.txt << EOF;\n$filelist\nEOF\n\"");
print "ssh -n $RemoteUser\@$FileHost \"cat > $FilePath/filelists/cbrain.$timestamp.txt << EOF;\n$filelist\nEOF\n\"";
print "Finished putting filelist on $FileHost";
# Copy each of the files to directory named $timestamp on $FileHost
my $cmd = "ssh -n $RemoteUser\@$FileHost \"mkdir $FilePath/$timestamp; for file in \\`cat $FilePath/filelists/cbrain.$timestamp.txt\\`; do ln \\\$file $FilePath/$timestamp/; done\"";
print $cmd;
system($cmd);
print "Finished linking files";

# Launch the civet task on CBrain for all the files that were copied and store the
# TaskID
my $agent = CbrainAPI->new(
    cbrain_server_url => $cbrainhost 
);

print "Logging in to CBrain";
$agent->login($UserName, $Password);
print "Registering collection $timestamp on $ProviderID";
my $CollectionId = $agent->register_file($timestamp, 'FileCollection', $ProviderID);
print "CollectionId: $CollectionId\n";
my $TaskIDs = $agent->create_civet_task_for_collection($ToolConfigID, "CIVET run launched at $timestamp", $CollectionId, $civetprefix, \%subject_map, 
{ 
  'output_filename_pattern'  => '{subject}-{cluster}-{task_id}-{run_number}'
});
print $agent->error_message();
print "Looping through @$TaskIDs\n";
foreach my $TaskID (@$TaskIDs) {
    my $task = $agent->show_task($TaskID);

    print "TaskID: $TaskID\n";
    my $CBrainTaskID = InsertNewTask($UserID, $timestamp, $cbrainhost, $TaskID, 'Unknown');
    # $CBrainTaskID = ID from CBrainTasks column in Loris. Used as foreign key.
    # $TaskID = ID _in_ CBrain for Task. Used with CBrain API
    
    my @params = split(/\n/, $task->{'params'});
    foreach my $param (@params) {
        if($param =~ m/t1_name:/) {
            my ($field, $val) = split(/: /,$param);
            chomp($val);
            print $val ;
            InsertFileList($CBrainTaskID, $val);
            print . "\n";
        }
    }
}


DisconnectDBH();
