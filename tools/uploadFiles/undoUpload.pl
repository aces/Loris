#!/usr/bin/perl 
# J-Sebastian Muehlboeck

use strict;
use Getopt::Tabular;       
use FindBin;

use lib "$FindBin::Bin";
use LorisDB::File;
use LorisDB::DBI;
use Data::Dumper;

# Turn on autoflush for standard output buffer 
$|++;

my ($CandID, $PSCID);
my $verbose = 1;
my $nuke    = 0;
my $visit   = undef;
my $profile = undef;


my $Help = <<HELP;

WHAT THIS IS:

-- Tool to delete MRI sessions and related entries from the LorisDB database for a given CandID, visit and PSCID --

Usage:\n\t $0 CandID [ -visit VisitNum -pscid PSCID ]  [options]
\n\n See $0 -help for more info\n\n

HELP

my @arg_table =
    (
     ["Main options","section"],
     ["-profile","string",1, \$profile, "name of config file in ~/.lorisdb."],
     ["-visit","string",1, \$visit, "Visit number. You have to specify it!"],
     ["General options", "section"],
     ["-verbose","boolean",1, \$verbose, "Be verbose."],
     ["-nuke","boolean",1, \$nuke, "Actually delete the entries."],
     );

my $Usage = <<USAGE;
usage: $0 <FileID> [options]
       $0 -help to list options

USAGE
&Getopt::Tabular::SetHelp($Help, $Usage);
&Getopt::Tabular::GetOptions(\@arg_table, \@ARGV) || exit 1;


# input option error checking
if(!defined($profile)) { print "\n\tERROR: You must specify a profile \n\n"; exit 33; }
{ package Settings; do "$ENV{HOME}/.lorisdb/$profile" }
if (!defined @Settings::db) { print "\n\tERROR: You don't have a configuration file named '$profile' in:  $ENV{HOME}/.lorisdb/ \n\n"; exit 33; }
if (!$visit) { print "\n\tThe flag : \'-visit\' is not optional!\n\n"; exit 1; }

if(scalar(@ARGV) != 1) { print $Usage; exit 1; }
$CandID = $ARGV[0];

# establish database connection and query for affected files 
my $dbh = LorisDB::DBI::connect_to_db(@Settings::db);
my $query = "select FileID, file, s.ID from session AS s, files AS f 
             where f.sessionID=s.ID AND s.visit_label=" . $dbh->quote($visit) . " AND s.CandID=" . $dbh->quote($CandID) . " AND f.outputtype ='native' "; 
my $sth = $dbh->prepare($query);
$sth->execute();
my $SelectedFiles = $sth->fetchall_arrayref();

# figure out the corresponding CandID
my $query = "SELECT PSCID FROM candidate WHERE CandID=\"$CandID\" ";
my $sth = $dbh->prepare($query);
$sth->execute();
$PSCID = $sth->fetchrow_array();
print "The corresponding Patient ID is : $PSCID \n";

my $fileCount = @$SelectedFiles;
if ($fileCount == 0) {print "\n\nNo MRI file sessions found. Nothing to be deleted!\n\n"; exit; }

# get rid of all file related entries
my ($fileID,$file,$session);
foreach my $row (@$SelectedFiles) {
    ($fileID, $file, $session) = @$row;
    print "$session, $fileID, $file \n";
    $dbh->do("delete from feedback_mri_comments where FileID=$fileID") if $nuke;  print "delete from feedback_mri_comments where FileID=$fileID\n";
    $dbh->do("delete from parameter_file where FileID=$fileID") if $nuke;         print "delete from parameter_file where FileID=$fileID\n";
    $dbh->do("delete from files where fileID=$fileID") if $nuke;                  print "delete from files where fileID=$fileID\n";
    print "I should remove this file : $file\n";
    if ($nuke) { if (!-e $file) { print $file . " does not exist!\n"; } 
		 else { `rm -f $file` }
	     } 
}
# get rid of session related entries and finally the session itself.
$dbh->do("delete from feedback_mri_comments where SessionID=$session") if $nuke;  print "delete from feedback_mri_comments where SessionID = $session\n";
$dbh->do("delete from mri_acquisition_dates where SessionID=$session") if $nuke;  print "delete from  mri_acquisition_dates where SessionID = $session\n";
$dbh->do("delete from session where ID=$session") if $nuke;                       print "delete from session where ID = $session\n";
$dbh->do("update tarchive SET SessionID=NULL where SessionID=$session") if $nuke;  print "Clearing tarchive SessionID for this candidate.\n";

if ($PSCID) {
    print "Clearing notification Spool.\n";
    $dbh->do( "DELETE FROM notification_spool WHERE Message LIKE '%${PSCID}%'" ) if $nuke;
}


