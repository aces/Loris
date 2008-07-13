package LorisDB::File;

use English;
use Carp;

=pod

=head1 NAME

LorisDB::File -- Provides an interface to the MRI file management subsystem of LorisDB

=head1 SYNOPSIS

 use LorisDB::File;
 use LorisDB::DBI;

 my $dbh = LorisDB::DBI::connect_to_db();

 my $file = LorisDB::File->new(\$dbh);

 my $fileID = $file->findFile('/path/to/some/file');
 $file->loadFile($fileID);

 my $acquisition_date = $file->getParameter('acquisition_date');
 my $parameters_hashref = $file->getParameters();

 my $coordinate_space = $file->getFileDatum('CoordinateSpace');
 my $filedata_hashref = $file->getFileData();


 # less common to use methods, available mainly for register_db...
 my $dbh_copy = $file->getDatabaseHandleRef();

 $file->loadFileFromDisk('/path/to/some/file');
 $file->setFileData('CoordinateSpace', 'nonlinear');
 $file->setParameter('patient_name', 'Larry Wall');

 my $parameterTypeID = $file->getParameterTypeID('patient_name');

=head1 DESCRIPTION

This class defines a BIC MRI (or related) file (minc, bicobj, xfm,
etc) as represented within the LorisDB database system.

B<Note:> if a developer does something naughty (such as leaving out
the database handle ref when instantiating a new object or so on) the
class will croak.

=head1 METHODS

=cut


use strict;

my $VERSION = sprintf "%d.%03d", q$Revision: 1.6 $ =~ /: (\d+)\.(\d+)/;

=pod

B<new( \$dbh )> (constructor)

Create a new instance of this class.  The parameter C<\$dbh> is a
reference to a DBI database handle, used to set the object's database
handle, so that all the DB-driven methods will work.

Returns: new instance of this class.

=cut

sub new {
    my $params = shift;
    my ($dbhr) = @_;
    unless(defined $dbhr) {
	croak("Usage: ".$params."->new(\$databaseHandleReference)");
    }

    my $self = {};
    $self->{'dbhr'} = $dbhr;
    return bless $self, $params;
}

=pod

B<loadFile( C<$fileID> )>

Load the object with all the data pertaining to a file as defined by
parameter C<$fileID>.

=cut

sub loadFile {
    my $this = shift;
    my ($fileID) = @_;

    my $query = "SELECT * FROM files WHERE FileID=$fileID";
    my $sth = ${$this->{'dbhr'}}->prepare($query);
    $sth->execute();

    if($sth->rows == 0) {
	return 0;
    }
    $this->{'fileData'} = $sth->fetchrow_hashref();

    $query = "SELECT Name, Value FROM parameter_file left join parameter_type USING (ParameterTypeID) WHERE FileID=$fileID";
    $sth = ${$this->{'dbhr'}}->prepare($query);
    $sth->execute();

    if($sth->rows == 0) {
	return 0;
    }

    $this->{'parameters'} = {};
    while(my $paramref = $sth->fetchrow_hashref()) {
	$this->{'parameters'}->{$paramref->{'Name'}} = $paramref->{'Value'};
    }

    return 1;
}

=pod

B<findFile( $filename )>

Finds the FileID pertaining to a file as defined by
parameter C<$filename>, which is a full /path/to/file.

Returns: (int) FileID or undef if no file was found.

=cut

sub findFile {
    my $this = shift;
    my ($file) = @_;

    my $query = "SELECT FileID FROM files WHERE File='$file'";
    my $sth = ${$this->{'dbhr'}}->prepare($query);
    $sth->execute();

    if($sth->rows == 0) {
	return undef;
    } else {
	my $row = $sth->fetchrow_hashref();
	return $row->{'FileID'};
    }
}
    

=pod

B<getFileData( )>

Gets the set of file data (data from the C<files> table in the database).

Returns: hashref of the contents of the record in the C<files> table for the loaded file.

=cut

sub getFileData {
    my $this = shift;
    return $this->{'fileData'};
}

=pod

B<getFileDatum( C<$datumName> )>

Gets one element from the file data (data from the C<files> table in the database).

Returns: scalar of the particular datum requested pertaining to the loaded file.

=cut

sub getFileDatum {
    my $this = shift;
    my ($propertyName) = @_;

    return $this->{'fileData'}->{$propertyName};
}

=pod

B<getParameter( C<$parameterName> )>

Gets one element from the file's parameters (data from the C<parameter_file> table in the database).

Returns: scalar of the particular parameter requested pertaining to the loaded file.

=cut

sub getParameter {
    my $this = shift;
    my ($paramName) = @_;

    return $this->{'parameters'}->{$paramName};
}

=pod

B<getParameters( )>

Gets the set of parameters for the loaded file (data from the C<parameter_file> table in the database).

Returns: hashref of the records in the C<parameter_file> table for the loaded file.

=cut

sub getParameters {
    my $this = shift;
    return $this->{'parameters'};
}

=pod

B<getDatabaseHandleRef( )>

Gets the database handle reference which the object is using internally.

Returns: DBI database handle reference

=cut

sub getDatabaseHandleRef {
    my $this = shift;
    return $this->{'dbhr'};
}

=pod

B<loadFileFromDisk( C<$filename> )>

Reads the headers from the file specified by C<$filename> and loads the current object with the resultant parameters.

Returns: 0 if any failure occurred or 1 otherwise

=cut

sub loadFileFromDisk {
    my $this = shift;
    my ($file) = @_;
    my $fileType;

    # try to untaint the filename
    if($file =~ /[\`;]/ || $file =~ /\.\./) {
	croak("loadFileFromDisk: $file is not a valid filename");
    }
    unless($file =~ /^\//) {
        croak("loadFileFromDisk: $file is not an absolute path");
    }

    # set fileData (at least, as much as possible)
    my ($user) = getpwuid($UID);
    $this->setFileData('InsertedByUserID', $user);
    $this->setFileData('File', $file);
    
    if($file =~ /\.mnc(\.gz)?$/) {
        $fileType = 'mnc';
    } elsif($file =~ /\.obj$/) {
        $fileType = 'obj';
    } elsif($file =~ /\.xfm$/) {
        $fileType = 'xfm';
    } elsif($file =~ /\.imp$/) {
        $fileType = 'imp';
    }
    $this->setFileData('FileType', $fileType) if defined $fileType;
    
    # if the file is not a minc, then just we've done as much as we can...
    if(!defined($fileType) || $fileType ne 'mnc') {
        return 1;
    }
    
    # get the set of attributes
    my $header = `mincheader -data "$file"`;
    my @attributes = split(/;\n/s, $header);
    foreach my $attribute (@attributes) {
        if($attribute =~ /\s*(\w*:\w+) = (.*)$/s) {
            $this->setParameter($1, $2);
=pod
#fixme debug if ever we run into weird values again
            if (length($2) < 1000) {
             #   print length($2)."\n";
                print "$1\t\t\t---->\t\'" . $this->getParameter($1). "\'\t\n";
            }
#end fixme
=cut
        }
    }
    # get dimension lengths
    my $dimnames = `mincinfo -dimnames $file`;
    $dimnames = removeWhitespace($dimnames);
    $this->setParameter('dimnames', $dimnames);
    my @dimensions = split(/\s+/, $dimnames);

	 my $dimlength_command = "mincinfo";
    foreach my $dimension (@dimensions) {
		  $dimlength_command .= " -dimlength $dimension";
	 }
	 $dimlength_command .= " $file |";

	 open MI, $dimlength_command or return 0;

	 foreach my $dimension (@dimensions) {
		  my $value = <MI>;
		  chomp($value);
		  $this->setParameter($dimension, $value);
	 }
	 close MI;
    
    $this->setParameter('header', $header);

    return 1;
}

=pod

B<setFileData( C<$propertyName>, C<$value> )>

Sets the fileData property named C<$propertyName> to the value of C<$value>.

=cut

sub setFileData {
    my $this = shift;
    my ($paramName, $value) = @_;
    
    $this->{'fileData'}->{$paramName} = $value;

    if($this->getFileDatum('FileID')) {
	my $fileID = $this->getFileDatum('FileID');
	$value = ${$this->{'dbhr'}}->quote($value);
	
	my $query = "UPDATE files SET $paramName=$value WHERE FileID=$fileID";
	${$this->{'dbhr'}}->do($query);
    }
}

=pod

B<setParameter( C<$parameterName>, C<$value> )>

Sets the parameter named C<$parameterName> to the value of C<$value>.

=cut

sub setParameter {
    my $this = shift;
    my ($paramName, $value) = @_;
    
    $value = removeWhitespace($value);
    $this->{'parameters'}->{$paramName} = $value;

    if($this->getFileDatum('FileID')) {
	my $fileID = $this->getFileDatum('FileID');
	my $paramID = $this->getParameterTypeID($paramName);
	my $query = "SELECT count(*) AS counter FROM parameter_file WHERE FileID=$fileID AND ParameterTypeID=$paramID";
	my $sth = ${$this->{'dbhr'}}->prepare($query);
	$sth->execute();
	my $row = $sth->fetchrow_hashref();

	$value = ${$this->{'dbhr'}}->quote($value);
	if($row->{'counter'} > 0) {
	    $query = "UPDATE parameter_file SET Value=$value, InsertTime=UNIX_TIMESTAMP() WHERE FileID=$fileID AND ParameterTypeID=$paramID";
	} else {
	    $query = "INSERT INTO parameter_file SET Value=$value, FileID=$fileID, ParameterTypeID=$paramID, InsertTime=UNIX_TIMESTAMP()";
	}
	${$this->{'dbhr'}}->do($query);
    }
}

=pod

B<removeParameter( C<$parameterName> )>

Removes the parameter named C<$parameterName>.

=cut

sub removeParameter {
    my $this = shift;
    my ($paramName) = @_;
    
    undef $this->{'parameters'}->{$paramName};
}

=pod

B<getParameterTypeID( C<$parameter> )>

Gets the ParameterTypeID for the parameter C<$parameter>.  If
C<$parameter> does not exist, it will be created.

Returns: (int) ParameterTypeID

=cut

sub getParameterTypeID {
    my $this = shift;
    my ($paramType) = @_;
    
    my $dbh = ${$this->{'dbhr'}};
    
    # look for an existing parameter type ID
    my $query = "SELECT ParameterTypeID FROM parameter_type WHERE Name=".$dbh->quote($paramType);
    my $sth = $dbh->prepare($query);
    $sth->execute();
    
    if($sth->rows > 0) {
        my $row = $sth->fetchrow_hashref();
        return $row->{'ParameterTypeID'};
    } else {
        # parameter type does not yet exist, so create it
        
        my ($user) = getpwuid($UID);
        $query = "INSERT INTO parameter_type (Name, Type, Description, SourceFrom, Queryable) VALUES (".$dbh->quote($paramType).", 'text', ".$dbh->quote("$paramType magically created by LorisDB::File").", 'parameter_file', 0)";
        $dbh->do($query);
        return $dbh->{'mysql_insertid'};
    }
}
	
sub removeWhitespace {
    my @vars = @_;
    foreach my $var (@vars) {
        $var =~ s|^\"?\s*||xmgi;
        $var =~ s|\s*\"?\s*$||xmgi; 
# fixme this is garbage
        #$var =~ s|\"?$||xmgi;
        #$var =~ s|\n^\s?||xmgi;
        #$var =~ s|\\n||;
    }

    if(scalar(@vars) == 1) {
        return $vars[0];
    } else {
        return @vars;
    }
}
    
1;


__END__

=pod

=head1 TO DO

Other operations should be added: perhaps get* methods for those fields in the C<files> table which are lookup fields.

=head1 BUGS

None reported.

=head1 COPYRIGHT

Copyright (c) 2004,2005 by Jonathan Harlap, McConnell Brain Imaging Centre,
Montreal Neurological Institute, McGill University.

=head1 AUTHORS

Jonathan Harlap <jharlap@bic.mni.mcgill.ca>

=cut    
