#!/usr/bin/perl -w

# $Id: minc2jiv.pl,v 1.2 2006/06/14 12:08:20 moi Exp $ 
#
# Description: this is a preprocessing script for converting a
# MNI-MINC volume to a format that JIV can read; it can also
# generate the individual slices (necessary for the 
# 'download on demand' mode of JIV)
#
# Requires: mni-perllib (available from ftp.bic.mni.mcgill.ca)
#
# Inspired by: trislice.pl by John Sled
#
#
# Copyright (C) 2001 Chris Cocosco (crisco@bic.mni.mcgill.ca)
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful, but
# WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
# or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public
# License for more details.

# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software Foundation, 
# Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA, 
# or see http://www.gnu.org/copyleft/gpl.html


use strict;

use Getopt::Tabular;
use MNI::Startup qw/ nocputimes/;
use MNI::FileUtilities;
use MNI::PathUtilities;
use MNI::Spawn;
use MNI::MincUtilities qw( :geometry :range);
use MNI::MiscUtilities qw(:all);


MNI::Spawn::RegisterPrograms( [qw/ cp mincexpand mincextract gzip /] )
    or exit 1;

my $usage = <<USAGE;
usage:  $ProgramName [options] mincfile1 [ mincfile2 ...]
        $ProgramName -help to list options
USAGE
Getopt::Tabular::SetHelp( undef, $usage );

my $output_path= '.';
my $cfg_file= undef;
my $jiv_ext= '.raw_byte';
my $gzip= 1;
my $slices = 0;
my $volume = 1;
my $force = 0;
my @options = 
  ( @DefaultArgs,     # from MNI::Startup
    ['-output_path', 'string', 1, \$output_path, "output path [default: $output_path]"], 
    ['-config', 'string', 1, \$cfg_file, "JIV config file to produce [default: none]"], 
    ['-ext', 'string', 1, \$jiv_ext, "extension for the JIV (raw byte) data files [default: $jiv_ext]"], 
    ['-gzip', 'boolean', 0, \$gzip, "gzip output [default: $gzip]"],
    ['-slices', 'boolean', 0, \$slices, "produce slices (for \"download on demand\") [default: $slices]"],
    ['-volume', 'boolean', 0, \$volume, "produce volume file [default: $volume]"],
    ['-force', 'boolean', 0, \$force, "accept non-standard direction cosines (rotated coordinate axes) [default: $force]"],
  );
GetOptions( \@options, \@ARGV ) 
  or exit 1;
die "$usage\n" unless @ARGV > 0;


my $cfg= 'jiv.download : ';
if( $volume && $slices) {
    $cfg .= "hybrid\n\n";
}
elsif( $volume && !$slices) {
    $cfg .= "upfront\n\n";
}
elsif( !$volume && $slices) {
    $cfg .= "on_demand\n\n";
}
else {
    print "nothing to do!\n";
    exit 0;
}

my $panel= 0;

my $norm_options= "-norm -range 0 255";
my $compress= ($gzip ? "| gzip -c9 " : "") ;

my %base_names_seen;
MNI::FileUtilities::check_output_path("$TmpDir/") or exit 1;

foreach my $in_mnc (@ARGV) {

    ($in_mnc) = MNI::FileUtilities::check_files( [$in_mnc], 1 ); 
    die unless defined $in_mnc;
    my( $dir, $base, $ext) = 
      MNI::PathUtilities::split_path( $in_mnc, 'last', [qw(gz z Z bz2)]);

    croak ("duplicate base name in $in_mnc \n") if $base_names_seen{ $base};
    $base_names_seen{ $base}= 1;
    
    # make a local & un-compressed version (for efficiency when
    # extracted the many-many slices ...)
    #
    my $local_file= "$TmpDir/${base}.mnc"; 
    MNI::FileUtilities::check_output_path( $local_file) or exit 1;
    Spawn( ( $ext =~ m/mnc$/ ) ?  
	   "cp $in_mnc $local_file" : 
	   "mincexpand $in_mnc $local_file" 
	   ); 
    $in_mnc= $local_file;

    $ext= $jiv_ext . ($gzip ? ".gz" : "") ;

    # these are in canonical (x,y,z) order!!
    my( @start, @step, @length, @dir_cosines, @dimorder)= 
	( (), (), (), (), ());
    volume_params( $in_mnc, \@start, \@step, \@length, \@dir_cosines, undef);

    my( @irange)= volume_minmax( $in_mnc);

    my( $order, $perm)= get_dimension_order( $in_mnc);
    my( @dim_names)= qw/ x y z/;
    @dimorder= @dim_names[ @$order];

    # TODO/FIXME: allow for some slop (+/- 5%) in the test ...
    #
    unless( nlist_equal( \@dir_cosines, [ 1,0,0, 0,1,0, 0,0,1 ]) ) {
	if( $force) {
#	    warn "$in_mnc : non-standard direction cosines : world coordinates will not be available!";
	    $cfg .= "jiv.world_coords = false\n";
	}
	else {
	    die "$in_mnc : non-standard direction cosines (that is, rotated coordinate axes) are not supported! Use -force to override ... \n";
	}
    }

    my $header= '';
    $header .= "size   :  @length\n";
    $header .= "start  :  @start\n";
    $header .= "step   :  @step\n";
    $header .= "order  :  @dimorder\n\n";
    $header .= "imagerange  :  @irange\n";

    $dir= $output_path;

    my $out_header = "$dir/${base}.header";
    MNI::FileUtilities::check_output_path( $out_header) or exit 1;
    write_file( $out_header, $header );
    print "\nVolume header info written to $out_header\n\n"
	if $Verbose;

    $cfg .= "${base} = ${base}$ext\n";
    $cfg .= "${base}.header = ${base}.header\n";
    $cfg .= ("jiv.panel." . $panel++ . " = $base\n");

    ### VOLUME: ###

    if( $volume ) {

	my $out_volume = "$dir/$base$ext";
	croak("$out_volume exists and -clobber not given")
	    if (-e $out_volume) && !$Clobber;
	# reorder the lengths in file order:
	my $counts= join ',', @length[ @$order];
	Spawn( "mincextract ${norm_options} -byte -start 0,0,0 -count $counts $in_mnc $compress >$out_volume");
    }

    next unless $slices;

    ### SLICES ###

    # NB: the sign of the steps of the volume file is preserved, but
    # the dimensions are reordered in the "canonical" ordering (such
    # that a "transverse" is always y-x).

    # indexed by the file dimension orthogonal to the slice 
    my( %slice_dirname)= ( 0 => "12", 1 => "02", 2 => "01" );
    my( $s, $out_raw);

    my $dim; # file (not canonical) dimension !
    for( $dim= 0 ; $dim < 3 ; ++$dim) {

	$dir= "$output_path/$base/$slice_dirname{$dim}/";
        MNI::FileUtilities::check_output_path($dir) or exit 1;

	for( $s= 0 ; $s < $length[ $order->[$dim] ]; ++$s) {

	    $out_raw = "$dir$s$ext";
	    croak("$out_raw exists and -clobber not given" )
		if (-e $out_raw) && !$Clobber;
	    
	    my( @slice_start)= ( 0, 0, 0);
	    $slice_start[ $dim]= $s;
	    my( @slice_len)= ( @length[ @$order]);
	    $slice_len[ $dim]= 1;

	    Spawn( "mincextract ${norm_options} -byte " . 
		   " -start " . join( ',',@slice_start) . 
		   " -count " . join( ',',@slice_len) . 
		   " $in_mnc $compress >$out_raw"
		   );
	}
    }

} # for $in_mnc (@ARGV)

if( $cfg_file) {
    MNI::FileUtilities::check_output_path( $cfg_file) or exit 1;
    write_file( $cfg_file, $cfg );
    print "\nConfig file written to $cfg_file\n\n"
	if $Verbose;
}

# --- end of script ! ---



sub write_file {
    my( $name, $text ) = @_;
    open( OUT, ">$name" )
      or die "error creating `$name' ($!)\n";
    print OUT $text;
    close( OUT )
      or die "error closing file `$name' ($!)\n";
}

