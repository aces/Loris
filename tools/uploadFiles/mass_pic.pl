#!/usr/bin/perl

use strict;
use FindBin;
use lib "$FindBin::Bin";
use Getopt::Tabular;
use LorisDB::DBI;
use LorisDB::File;
use LorisDB::MRI;
use File::Basename;

# Set stuff for GETOPT
my $verbose    = 1;
my $profile    = undef;
my $minFileID  = undef;
my $maxFileID  = undef;
my $pipelineDir = undef;
my $visit      = undef;

my $Usage = "mass_pic.pl generates check pic images for LorisDB for those files that are missing pics.
\n\n See $0 -help for more info\n\n";

my @arg_table =
    (
     ["Database options", "section"],
     ["-profile","string",1, \$profile, "Specify the name of the config file which resides in .lorisdb in your home directory."],
     ["-pipelineDir","string",1, \$pipelineDir, "This will change the way mass pic behaves!. Enter the path you used as target for your pipeline processing and it will link verify images into loris."],
     ["-visit","string",1, \$visit, "if you are using -pipelineDir this is a necessary limiter."],

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
if ($pipelineDir && !$visit) { print "\n\tERROR: You must identify the visit label if you are using a pipeline directory.\n\n";  exit 33;}

# where the pics should go
my $pic_dir = $Settings::data_dir . '/pic';

# establish database connection if database option is set
print "Connecting to database.\n" if $verbose;
my $dbh = &LorisDB::DBI::connect_to_db(@Settings::db);


## now go make the pics
$dbh->do("SELECT \@checkPicID:=ParameterTypeID FROM parameter_type WHERE Name='check_pic_filename'");
$dbh->do("CREATE TEMPORARY TABLE check_pic_filenames (FileID int(10) unsigned NOT NULL, Value text, PRIMARY KEY (FileID))");
$dbh->do("INSERT INTO check_pic_filenames SELECT FileID, Value FROM parameter_file WHERE ParameterTypeID=\@checkPicID AND Value IS NOT NULL");

my $extraWhere = "";
$extraWhere .= " AND f.FileID >= $minFileID" if defined $minFileID;
$extraWhere .= " AND f.FileID <= $maxFileID" if defined $maxFileID;

# introduced little complication such that visit label will matter and images will not be linked blindely
my $sth; 
if (!$visit) { $sth= $dbh->prepare("SELECT f.FileID FROM files AS f LEFT OUTER JOIN check_pic_filenames AS c USING (FileID) WHERE c.FileID IS NULL AND f.FileType='mnc' $extraWhere"); }
else { 
    print "Inserting for visit $visit only!\n";
    $sth= $dbh->prepare("SELECT f.FileID FROM session AS s left outer join  files AS f on (s.ID=f.SessionID) Left OUTER JOIN check_pic_filenames AS c USING (FileID) ".
                        "WHERE c.FileID IS NULL and s.Visit_Label=$visit  AND f.FileType='mnc'; $extraWhere"); 
}
    
    $sth->execute();

while(my $rowhr = $sth->fetchrow_hashref()) {
    print "$rowhr->{'FileID'}\n" if $verbose;
    my $file = LorisDB::File->new(\$dbh);
    $file->loadFile($rowhr->{'FileID'});

    if ($pipelineDir) {
        my $sth = ${dbh}->prepare("SELECT CandID, Visit_label FROM session WHERE ID=".$file->getFileDatum('SessionID') );
        
        $sth->execute();
        my $rowhr = $sth->fetchrow_hashref();
    
        my $minc = $file->getFileDatum('File');
        my $mincbase = basename($minc);
        $mincbase =~ s/\.mnc(\.gz)?$//;
        #print $mincbase ."\n";
        my $pic = $pic_dir . '/' . $rowhr->{'CandID'};

        # if the file has a fileid, add that to the filename
        my $fileID = $file->getFileDatum('FileID');
        my $lorisbase = "${mincbase}_${fileID}_check.jpg" if defined $fileID;       
        my $civetbase = "${mincbase}_loris.jpg"; 
        
        if (!-e $pic) { print "\nThe civet output directory for $rowhr->{'CandID'} is not accessible!\n"; next; }
        my $link = "ln -s $pipelineDir/$rowhr->{'CandID'}/verify/${civetbase} ${pic}/${lorisbase}"; 
    
        # if the file has a fileid, add that to the filename
        my $fileID = $file->getFileDatum('FileID');
        $mincbase .= "_$fileID" if defined $fileID;
        
        my $check_pic_filename = $mincbase."_check.jpg";
        my $civetOutputImage = "$pipelineDir/$rowhr->{'CandID'}/verify/${civetbase}";
        if (-e $civetOutputImage) {
            `$link`;
            print "Setting up link : \n\t" . $link ."\n";
            $file->setParameter('check_pic_filename', $rowhr->{'CandID'}.'/'.$lorisbase);
        }
        
    }
    else {
        unless(&LorisDB::MRI::make_pics(\$file, $pic_dir, $Settings::horizontalPics)) {
            print "FAILURE!\n";
        }
    }
}

$dbh->disconnect();

print "Finished\n" if $verbose;
exit 0;

