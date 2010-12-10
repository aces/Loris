#! /usr/bin/perl

#!/usr/local/perl5.8/bin/perl5.8.5
#/usr/local/bin/perl5.8.0

# ------------------------------ MNI Header ----------------------------------
#@NAME       : registerFile.pl
#@DESCRIPTION: registers free-range files into the database (for those handmade mincs)
#@USES       : LorisDB::DBI and LorisDB::MRI (and, of course, strict)
#@REQUIRES   : 
#@VERSION    : $Id: registerFile.pl,v 1.4 2008/03/19 19:51:03 sebas Exp $
#@CREATED    : 2003/05/21, Jonathan Harlap
#@MODIFIED   : 
#@COPYRIGHT  : Copyright (c) 2003 by Jonathan Harlap, McConnell Brain Imaging
#              Centre, Montreal Neurological Institute, McGill University.
#-----------------------------------------------------------------------------

use strict;
use Getopt::Tabular;
use File::Basename;
use FindBin;
use lib "$FindBin::Bin";

use LorisDB::DBI;
use LorisDB::MRI;
use LorisDB::File;

use Data::Dumper;

$|++;

my $Usage = "Usage: $0 </PATH/TO/FILE> <outputType> [options]\nSee $0 -help for more info\n";

my $coordinateSpace;
my $Algorithm;
my $outputType;
#my $fileType = 'mnc';
my $comment;
my $acquisitionProtocol;
my $acquisitionProtocolID;
my $source_list;
my $pipeline;
my $verbose = 0;
my @args = ();
my $filename;
my $profile     = undef;       # this should never be set unless you are in a stable production environment

my $sessionID = undef;
my $objective;
my $center_name;
my $subjectIDsref;

# build arguments table for getopt
# &Getopt::Tabular::AddPatternType("coordinateOptions", "^(native|linear|nonlinear)\$", "'native', 'linear', or 'nonlinear'");
# &Getopt::Tabular::AddPatternType("classifyOptions", "^(clean|cocosco|em)\$", "'clean', 'cocosco', or 'em'");
&Getopt::Tabular::AddPatternType("sourceList", "^[0-9,]+\$", "comma separated file ids, with no whitespace");
#&Getopt::Tabular::AddPatternType("filetypeOptions", "^(mnc|obj|xfm|xfmmnc|imp|vertstat)\$", "'mnc','obj','xfm','xfmmnc','imp', or 'vertstat'");
my @arg_table =
    (
     ["Input options", "section"],
#     ["-filetype", "filetypeOptions", 1, \$fileType,
#      "File type, such as mnc, obj, xfm, etc..."],
     ["-protocol", "string", 1, \$acquisitionProtocol,
      "Acquisition protocol, such as t1w, t2w, pdw..."],
     ["-coordspace", "string", 1, \$coordinateSpace,
      "Coordinate space, e.g. native, linear, nonlinear or icbm152_symmetric_linear etc."],
     ["-algorithm", "string", 1, \$Algorithm,
      "Algorithm, e.g classify clean, cocosco or lsq12 etc."],

     ["-source", "sourceList", 1, \$source_list,
      "The comma separated (no whitespace) list of file IDs from which this new file was generated"],
     ["-pipeline", "string", 1, \$pipeline,
      "The pipeline used to generate the file"],

     ["-comment", "string", 1, \$comment,
      "A comment to be attached to the file"],

     ["General options", "section"],
     ["-profile     ","string",1, \$profile, "name of config file in ~/.lorisdb."],
     ["-verbose|-quiet", "boolean", 1, \$verbose,
      "Be verbose"],
     ["-version", "eval", undef, 'print "Version $VERSION\n"; exit 0',
      "Print out the version information"],
     );

&GetOptions (\@arg_table, \@ARGV, \@args) || exit 1;
($filename, $outputType) = @args;

# input option error checking
{ package Settings; do "$ENV{HOME}/.lorisdb/$profile" }
if ($profile && !defined @Settings::db) { print "\n\tERROR: You don't have a configuration file named '$profile' in:  $ENV{HOME}/.lorisdb/ \n\n"; exit 33; }
if(!$profile) { print "$Usage\n\tERROR: You must specify a profile.\n\n";  exit 33;  }

# make sure we have all the arguments we need
unless($filename && $outputType) {
    print $Usage;
    exit 1;
}

# and make sure we have permission to read the file
unless(-r $filename) {
    print "Cannot read $filename\n";
    exit 1;
}

# establish database connection
my $dbh = &LorisDB::DBI::connect_to_db(@Settings::db);
print "\n==> Successfully connected to database \n" if $verbose;

# create File object
my $file = LorisDB::File->new(\$dbh);

# load File object
$file->loadFileFromDisk($filename);
if ($file->getFileDatum('FileType') eq 'mnc') {

	# map dicom fields
	&LorisDB::MRI::mapDicomParameters(\$file);
    print "Mapped DICOM parameters\n" if $verbose;
	
    # optionally do extra filtering, if needed
    if( defined( &Settings::filterParameters )) {
        print " --> using user-defined filterParameters for $filename\n" if $verbose;
        Settings::filterParameters(\$file);
    }
}

# source list is king, if defined
if(defined($source_list)) {
	# figure out sessionID
	
	my $sourceFileID;
        my @sourceBits = split(/,/, $source_list);
	if(scalar(@sourceBits) > 1) {
            $sourceFileID = $sourceBits[0];
        } else {
            $sourceFileID = $source_list;
        }

	unless($sourceFileID =~ /^[0-9]+$/) {
		print "Non mincs require the -source option with a valid FileID as an argument\n";
		exit 1;
	}

	my $query = "SELECT SessionID FROM files WHERE FileID='$sourceFileID'";
	my $sth = $dbh->prepare($query);
        $sth->execute();
	if($sth->rows > 0) {
		my $row = $sth->fetchrow_hashref();
		$sessionID = $row->{'SessionID'};
	}

	unless(defined($sessionID)) {
		print "The -source option requires a valid FileID as an argument\n";
		exit 1;
	}

	$file->setFileData('SessionID', $sessionID);

} elsif ($file->getFileDatum('FileType') eq 'mnc') {

	# get psc
	my $centerID;
    my $lookupCenterNameUsing;
    $lookupCenterNameUsing = 'patient_name' if ($Settings::lookupCenterNameUsing eq 'PatientName');
    $lookupCenterNameUsing = 'patient_id' if ($Settings::lookupCenterNameUsing eq 'PatientID');

    unless(defined($lookupCenterNameUsing)) {
        print "\nERROR: registerFile.pl only knows how to lookup center name using PatientName or PatientID.\n\n";
        exit 2;
    }

	($center_name, $centerID) = LorisDB::MRI::getPSC($file->getParameter($lookupCenterNameUsing), \$dbh);
	print "Determined center name: $center_name, center id: $centerID\n" if $verbose;
	
	# get the ScannerID
	my $scannerID = LorisDB::MRI::findScannerID($file->getParameter('manufacturer'),
												$file->getParameter('manufacturer_model_name'),
												$file->getParameter('device_serial_number'),
												$file->getParameter('software_versions'),
												$centerID,
												\$dbh, 0);
	$file->setParameter('ScannerID', $scannerID);
    print "Set scannerid = $scannerID\n" if $verbose;
	
	# get ids from the headers
    if(!defined(&Settings::getSubjectIDs)) {
        print "\nERROR: Profile does not contain getSubjectIDs routine. Upload will exit now.\n\n";
        exit 66; 
    }
    $subjectIDsref = Settings::getSubjectIDs($file->getParameter('patient_name'),
                                                $file->getParameter('patient_id'),
                                                $scannerID,
                                                \$dbh);
    print "\n==> Data found for candidate   : $subjectIDsref->{'CandID'} - $subjectIDsref->{'PSCID'} - Visit: $subjectIDsref->{'visitLabel'} - SubprojectID : $subjectIDsref->{'SubprojectID'}\n" if $verbose;
    
    
	# get session ID
	my $requiresStaging;
	($sessionID, $requiresStaging) = LorisDB::MRI::getSessionID($subjectIDsref, $file->getParameter('study_date'), \$dbh, $subjectIDsref->{'subprojectID'}, 1);
	$file->setFileData('SessionID', $sessionID);
	$file->setFileData('PendingStaging', $requiresStaging);
    print "Set sessionid = $sessionID, pending staging = $requiresStaging\n" if $verbose;

	# done with things we can only do with mincs...
} else {
    print "Non mincs (and mincs missing patient info in the header) require the -source option with a valid FileID as an argument\n";
    exit 1;
}

if(!$coordinateSpace && $outputType eq 'native') {
	$coordinateSpace = 'native';
        print "Forced coordinate space to native\n" if $verbose;
}

if($coordinateSpace) {
	$file->setFileData('CoordinateSpace', $coordinateSpace);
}

if($Algorithm) {
	$file->setFileData('Algorithm', $Algorithm);
}

$file->setFileData('OutputType', $outputType);

if($comment) {
	$file->setParameter('Comment', $comment);
}

if($source_list) {
	$file->setParameter('Source_list', $source_list);
}

if($pipeline) {
    $file->setParameter('Pipeline', $pipeline);
}

# if no acquisition protocol was specified
if($coordinateSpace eq 'native' && !defined($acquisitionProtocol)) {
    # get acquisition protocol (identify the volume)
    $acquisitionProtocol = &LorisDB::MRI::identify_scan_db($center_name, $subjectIDsref->{'subprojectID'}, \$file, \$dbh);
}

# save the protocol
if(defined($acquisitionProtocol)) {
    # convert the textual scan_type into the scan_type id
    $acquisitionProtocolID = &LorisDB::MRI::scan_type_text_to_id($acquisitionProtocol, \$dbh);
    $file->setFileData('AcquisitionProtocolID', $acquisitionProtocolID);
    print "Set acquisition protocol id = $acquisitionProtocolID, acquisition protocol = $acquisitionProtocol\n" if $verbose;
}

# set Date_taken = last modification timestamp (can't seem to get creation timestamp)
my $Date_taken = (stat($filename))[9];

# compute the md5 hash
my $md5hash = &LorisDB::MRI::compute_hash(\$file);
$file->setParameter('md5hash', $md5hash);
if(!LorisDB::MRI::is_unique_hash(\$file)) {
    print "Non-unique file will not be added to database\n";
    exit 1;
}
print "Computed MD5 hash = $md5hash\n" if $verbose;

# register into the db
my $fileID;
$fileID = &LorisDB::MRI::register_db(\$file);

# if we don't have a valid MRIID
unless($fileID) {
    # tell the user something went wrong
    print "FAILED TO REGISTER FILE!\n";
	
    # and exit
    exit 1;
}

# tell the user we've done so and include the MRIID for reference
print "Registered $filename in database, given FileID: $fileID\n";

# and exit
$dbh->disconnect;
exit 0;
