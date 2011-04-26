#!/usr/bin/perl

use strict;
use FindBin;
use lib "$FindBin::Bin";
use Getopt::Tabular;
use LorisDB::DBI;
use LorisDB::File;
use LorisDB::MRI;

# Set stuff for GETOPT
my $verbose    = 1;
my $profile    = undef;
my $minFileID  = undef;
my $maxFileID  = undef;

my $Usage = "mass_jiv.pl generates JIV images for LorisDB for those files that are missing JIVs.
\n\n See $0 -help for more info\n\n";

my @arg_table =
    (
     ["Database options", "section"],
     ["-profile","string",1, \$profile, "Specify the name of the config file which resides in .lorisdb in your home directory."],

     ["File control", "section"],
     ["-minFileID", "integer", 1, \$minFileID, "Specify the minimum FileID to operate on."], 
     ["-maxFileID", "integer", 1, \$maxFileID, "Specify the maximum FileID to operate on."], 

     ["General options", "section"],
     ["-verbose", "boolean", 1,   \$verbose, "Be verbose."],
     );

GetOptions(\@arg_table, \@ARGV) ||  exit 1;

# checking for profile settings
if(-f "$ENV{HOME}/.lorisdb/$profile") {
	{ package Settings; do "$ENV{HOME}/.lorisdb/$profile" }
}
if ($profile && !defined @Settings::db) {
    print "\n\tERROR: You don't have a configuration file named '$profile' in:  $ENV{HOME}/.lorisdb/ \n\n"; exit 33;
} 

if(!$profile) { print $Usage; print "\n\tERROR: You must specify an existing profile.\n\n";  exit 33;  }

# where the JIVs should go
my $jiv_dir = $Settings::data_dir . '/jiv';

# establish database connection if database option is set
print "Connecting to database.\n" if $verbose;
my $dbh = &LorisDB::DBI::connect_to_db(@Settings::db);


## now go make the jivs
$dbh->do("SELECT \@jivPathID:=ParameterTypeID FROM parameter_type WHERE Name='jiv_path'");
$dbh->do("CREATE TEMPORARY TABLE jiv_paths (FileID int(10) unsigned NOT NULL, Value text, PRIMARY KEY (FileID))");
$dbh->do("INSERT INTO jiv_paths SELECT FileID, Value FROM parameter_file WHERE ParameterTypeID=\@jivPathID AND Value IS NOT NULL");

my $extraWhere = "";
$extraWhere .= " AND f.FileID >= $minFileID" if defined $minFileID;
$extraWhere .= " AND f.FileID <= $maxFileID" if defined $maxFileID;

my $sth = $dbh->prepare("SELECT f.FileID, File FROM files AS f LEFT OUTER JOIN jiv_paths AS j USING (FileID) WHERE j.FileID IS NULL AND f.FileType='mnc' $extraWhere");
$sth->execute();

while(my $rowhr = $sth->fetchrow_hashref()) {
    print "$rowhr->{'FileID'}\n" if $verbose;

    unless( -e $rowhr->{'File'} and -f $rowhr->{'File'}) {
	print "MISSING MINC ($rowhr->{'FileID'}) $rowhr->{'File'}\n";
	next;
    }

    my $file = LorisDB::File->new(\$dbh);
    $file->loadFile($rowhr->{'FileID'});

    unless(&LorisDB::MRI::make_jiv(\$file, $jiv_dir)) {
	print "FAILURE!\t$rowhr->{'FileID'}\n";
    }
}

$dbh->disconnect();

print "Finished\n" if $verbose;
exit 0;

