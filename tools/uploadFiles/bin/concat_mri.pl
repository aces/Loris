#!/usr/bin/perl 

#---------------------------------------------------------------------------
#@COPYRIGHT :
#             Copyright 1996, Alex P. Zijdenbos
#             McConnell Brain Imaging Centre,
#             Montreal Neurological Institute, McGill University.
#             Permission to use, copy, modify, and distribute this
#             software and its documentation for any purpose and without
#             fee is hereby granted, provided that the above copyright
#             notice appear in all copies.  The author and McGill University
#             make no representations about the suitability of this
#             software for any purpose.  It is provided "as is" without
#             express or implied warranty.
#---------------------------------------------------------------------------- 
#$RCSfile: concat_mri.pl,v $
#$Revision: 1.2 $
#$Author: jharlap $
#$Date: 2007/03/07 12:27:22 $
#$State: Exp $
#---------------------------------------------------------------------------

$0 =~ s/^.+\///;

$postfix   = "_concat";
$targetDir = ".";
$clean     = 0;
$clobber   = 0;
$compress  = 0;
$debug     = 0;
$verbose   = 0;
$ignoreContrast = 0;
@mincFiles = ();
%sortList  = ();
$minSliceSep = 1;
$maxSliceSep = 3;
$nonSliceTolerance = '1e-5';
$sliceTolerance    = '0.05';
$resampleStep = ();
$useStdin  = 0;

$HelpInfo = <<EOH;

Usage:  $0 [<options>] <mincfiles>
  
  $0 runs mincconcat on pairs of files in <mincfiles> for which patient name, 
  study ID, TR, TE, and FA are equal and the dimension variables indicate a 
  stacking or interleaving in the slice direction. If necessary, mincresample
  is called.

  General options:
    -clean
        Remove the original files when they are concatenated
    -clobber
        Overwrite existing output file(s)
    -debug
        Print commands rather than executing them
    -verbose
        Print additional info while running
    -compress
        Compress the resulting files
    -stdin
        Read the list of input files from STDIN

  Output file options:
    -postfix <postfix>
        Create output file names using the first file name, followed by <postfix>.
        <postfix> will be inserted before the .mnc extension, if it exists.
        Default: $postfix
    -targetdir <dir>
        Store all output files in <dir>. Default: $targetDir

  Concatenation options:
    -ignorecontrast
        Ignore the contrast agent flag in the file headers
    -minslicesep <sep>
        Do not concatenate if the resulting slice separation is less than <sep>.
        This is merely a safety-net. Default: $minSliceSep
    -maxslicesep <sep>
        Do not concatenate if the resulting slice separation is more than <sep>.
        This is merely a safety-net. Default: $maxSliceSep
    -nonslicetolerance <tolerance>
        Resample input volumes when the difference in start values in one of the
        non-slice dimensions exceeds <tolerance>. Default: $nonSliceTolerance
    -slicetolerance <tolerance>
        Allow <tolerance> when judging concatenateability based on the start 
        values in the slice dimension. Default: $sliceTolerance
    -step <step>
        Step used in final resampling. Default: autoselect

  Author:        Alex Zijdenbos
  Date:          95/03/13
  Last modified: 99/07/19

EOH

if ($#ARGV < 1) { print $HelpInfo; exit; }

while (@ARGV) {
  $_ = shift;
  if    (/^-clean$/)      { $clean = 1; }
  elsif (/^-clobber$/)    { $clobber = 1; }
  elsif (/^-debug$/)      { $debug = 1; }
  elsif (/^-verbose$/)    { $verbose = 1; }
  elsif (/^-h(|elp)$/)    { die $HelpInfo; }
  elsif (/^-compress$/)   { $compress = 1; }
  elsif (/^-stdin$/)      { $useStdin = 1; }
  elsif (/^-targetdir$/)  { $targetDir = shift; }
  elsif (/^-postfix$/)    { $postfix = shift; }
  elsif (/^-ignorecontrast$/){ $ignoreContrast = 1; }
  elsif (/^-minslicesep$/){ $minSliceSep = shift; }
  elsif (/^-maxslicesep$/){ $maxSliceSep = shift; }
  elsif (/^-nonslicetolerance$/) { $nonSliceTolerance = shift; }
  elsif (/^-slicetolerance$/)    { $sliceTolerance = shift; }
  elsif (/^-slicetolerance$/)    { $sliceTolerance = shift; }
  elsif (/^-step$/)       { $resampleStep = shift; }
  elsif (/^-./)           { print "Unrecognized option $_ ignored\n"; }
  else                    { push(@mincFiles, $_); }
}

if($useStdin) {
	 while(<>) {
		  chomp;
		  push(@mincFiles, $_);
	 }
}

# Process all MINC files specified on the command line
foreach $fileName (@mincFiles) {
  # Get information from mincinfo
  $data = `mincinfo -error_string UNDEFINED -attvalue patient:full_name -attvalue study:study_id -attvalue study:acquisition_id -attvalue acquisition:repetition_time -attvalue acquisition:echo_time -attvalue dicom_0x0018:el_0x0082 -attvalue acquisition:flip_angle -attvalue dicom_0x0018:el_0x0010 -dimnames -dimlength xspace -dimlength yspace -dimlength zspace -attvalue xspace:step -attvalue yspace:step -attvalue zspace:step -attvalue xspace:start -attvalue yspace:start -attvalue zspace:start $fileName 2>/dev/null`;

  $data =~ s/\s+\n/\n/g;
  ($name, $ID, $acq, $TR, $TE, $IR, $FA, $tag, $dimNames, 
   $length{"xspace"}, $length{"yspace"}, $length{"zspace"}, 
   $sep{"xspace"}, $sep{"yspace"}, $sep{"zspace"}, 
   $start{"xspace"}, $start{"yspace"}, $start{"zspace"}) = split(/\n/, $data);

  $tag = 'NONE' if $ignoreContrast;

  $ID =~ s/_.+$//; # Get rid of acquisition time in the study id
  ($dim0, $dim1, $dim2) = split(/\s+/, $dimNames);

  if ($sep{$dim0} < 0) {  # Make sure that steps in the slice dimension are +
      $start{$dim0} = $start{$dim0} + $length{$dim0} * $sep{$dim0};
      $sep{$dim0} = -$sep{$dim0};
  }

  $sep{$dim0} = &round($sep{$dim0}, 3);  # Round separations off to 3 decimals
  $sep{$dim1} = &round($sep{$dim1}, 3);
  $sep{$dim2} = &round($sep{$dim2}, 3);

  # Round starts off to 5 decimals
  $start{$dim0} = sprintf("%.5f", &round($start{$dim0}, 5));  
  $start{$dim1} = sprintf("%.5f", &round($start{$dim1}, 5));
  $start{$dim2} = sprintf("%.5f", &round($start{$dim2}, 5));

  $TR = &round($TR, 3); # Round acquisition params off to 3 decimals
  $TE = &round($TE, 3);
  $FA = &round($FA, 3);
  $IR = &round($IR, 3);

  # Remove any non-digits from the acquisition ID
  if ($acq ne 'UNDEFINED') {
      $acq =~ s/[^\d]//g;
  }

  $key = sprintf("%s:%s:%.3f:%.3f:%.3f:%.2f:%s:%s:%s:%s:%.3f:%.3f:%.3f:%d:%d", 
		 $name, $ID, $TR, $TE, $IR, $FA, $tag, $dim0, $dim1, $dim2, 
		 $sep{$dim0}, $sep{$dim1}, $sep{$dim2}, 
		 $length{$dim1}, $length{$dim2});

  $value = [ $start{$dim0}, $start{$dim1}, $start{$dim2}, $length{$dim0}, $acq, 
	     $fileName ];

  if (defined($sortList{$key})) {
    push(@{$sortList{$key}}, $value);
  }
  else {
    $sortList{$key} = [ $value ];
  }
}

&printHashOfArrays(\%sortList) if ($verbose);

&resolveRepeats(\%sortList);

&printHashOfArrays(\%sortList) if ($verbose);

FILE:
foreach $key (sort(keys %sortList)) {
    ($name, $ID, $TR, $TE, $IR, $FA, $tag, $dim0, $dim1, $dim2, $d0, $d1, $d2, $D1, $D2) 
	= split(/:/, $key);

    $dim0 =~ s/space.*$//;
    $dim1 =~ s/space.*$//;
    $dim2 =~ s/space.*$//;
    
    $count = @{$sortList{$key}};
    
    if ($count > 1) {
        @fileParams = @{$sortList{$key}};
	# Sort by startvalue of slice dimension
        @fileParams = &sortArray('$$_[0]', @fileParams);

	($start0, $start1, $start2, $length0, $acq0, $file) = @{ shift(@fileParams) };
	
	@filesToConcat = ();
	push(@filesToConcat, $file);
	@tempFiles = ();
	@filesToClean = ();
	# Always resample to avoid irregular spacings due to roundoff errors
	$resample = 1;
	$sliceSep = ($resample && defined($resampleStep)) ? $resampleStep : 0;
	
	# Create output filename
	$concatFile = $file;
	$concatFile =~ s/^.+\///;               # Strip path
	$concatFile =~ s/(\.gz|\.z|\.Z)//;      # Strip compression extension
	$concatFile = "$targetDir/$concatFile"; # Prepend target dir
	if ($concatFile =~ /(.+)\.mnc$/) { $concatFile = "$1${postfix}.mnc"; }
	else                             { $concatFile .= $postfix; }

	if ((-e $concatFile || -e "${concatFile}.gz") && !$clobber) {
	    print "$concatFile exists; use -clobber to overwrite.\n";
	    print "  ==> skipping file $filesToConcat[0] and its matches.\n";
	    next FILE;
	}

	while (@fileParams) {
	    ($st0, $st1, $st2, $le0, $ac0, $file) = @{ shift(@fileParams) };

	    $deltaStart = $st0 - $start0;
	    if (!$deltaStart) {
		print "Identical start values encountered.\n";
		print "  ==> skipping file $filesToConcat[0] and its matches.\n";
		next FILE;
	    }

	    print "d0: $d0 deltaStart: $deltaStart sliceSep: $sliceSep\n" if $verbose;

	    if (!$sliceSep) {
		if ($d0 > $deltaStart) { 
		    $sliceSep = $d0/int(&round($d0/$deltaStart)); 
		}
		else { 
		    $sliceSep = $d0; 
		}
		if (($sliceSep > $maxSliceSep) || ($sliceSep < $minSliceSep)) {
		    print "Slice separation $sliceSep not in [$minSliceSep,$maxSliceSep].\n";
		    print "  ==> skipping file $filesToConcat[0] and its matches.\n";
		    next FILE;
		}
	    }

	    $interleaved = &abs($deltaStart - $sliceSep) <= $sliceTolerance;
	    $slabs       = &abs($deltaStart - $length0 * $d0) <= $sliceTolerance;

	    print "Slice sep: $sliceSep deltaStart: $deltaStart\n" if $verbose;

	    if ($interleaved || $slabs) {
		if ((&abs($st1 - $start1) > $nonSliceTolerance) || 
		    (&abs($st2 - $start2) > $nonSliceTolerance)) {
		    $resample = 1;
		    $label = "start";
		    $tempFile = &newFile("/tmp/concat_mri.$$");
		    $cmd = "mincresample";
		    $cmd .= " -nearest" if ($interleaved);
		    &run("$cmd -$dim1$label $start1 -$dim2$label $start2 $file $tempFile", $debug, $clobber);
		    push(@filesToConcat, $tempFile);
		    push(@tempFiles, $tempFile);
		    push(@filesToClean, $file);
		}
		else {
		    push(@filesToConcat, $file);
		}

		$start0 = $st0;
		$length0 = $le0;
	    }
	    else {
		print "  ==> Int. test: " . &abs($deltaStart - $sliceSep);
		print " <= $sliceTolerance\n";
		print "  ==> Slab test: " . &abs($deltaStart - $length0 * $d0);
		print " <= $sliceTolerance\n";

		print "  ==> Cannot concatenate file $file\n";
		print "                    with file $filesToConcat[0]\n";
	    }
	}

	if ($#filesToConcat <= 0) {
	    next FILE;
	}

	if ($resample) {
	    $tempFile = &newFile("/tmp/concat_mri.$$");
	    push(@tempFiles, $tempFile);

	    &run("mincconcat " . join(' ', @filesToConcat) . " $tempFile", 
		 $debug, $clobber);
	    
	    $label = "step";

	    &run("mincresample -$dim0$label $sliceSep $tempFile $concatFile", 
		 $debug, $clobber);
	}
	else {
	    &run("mincconcat " . join(' ', @filesToConcat) . " $concatFile", 
		 $debug, $clobber);
	}

	if ($clean && (-e $concatFile)) {
	    unlink @filesToConcat;
	    unlink @filesToClean;
	}

	unlink @tempFiles;

	if ($compress) {
	    &run("gzip -f $concatFile", $debug, 0);
	}
    }
}

#-------------------------------------------------------------------------
#
# Attempt to resolve repeated scans based on repeated start values
#
#-------------------------------------------------------------------------
sub resolveRepeats {
    my($sortListRef) = @_;
    my($key, $value);
    my %newSortList;
    my @keysToRemove = ();
    
  ENTRY:
    while (($key, $value) = each %$sortListRef) {
	# Sort acquisitions by acquisition ID
	my @fileParams = &sortArray('$$_[4]', @$value);
	
	# Loop through acquisitions, keeping track of the start values
	my %startValues;
	my ($start, $params);
	foreach $params (@fileParams) {
	    $start = $$params[0];

	    if (defined $startValues{$start}) {
		# We've seen this start value before; start a new series
		# with a modified key
		%startValues = ();
		my @keyvalues = split(/:/, $key);
		$keyvalues[5] .= 'X';
		$key = join(':', @keyvalues);
	    }
	    else {
		$startValues{$start} = 1;
	    }
	    
	    # Store parameters in new sortList
	    if (! defined $newSortList{$key}) {
		$newSortList{$key} = [ $params ];
	    }
	    else {
		push(@{ $newSortList{$key} }, $params);
	    }
	}
    }

    %$sortListRef = %newSortList;
}

#-------------------------------------------------------------------------
#
# Either print or run $command, depending on the $debug flag
#
#-------------------------------------------------------------------------
sub run {
  local($command, $debug, $clobber) = @_;
  if ($clobber) { $command .= " -clobber"; }

  print "$command\n";
  if (!$debug) { 
      return system($command); 
  }
  return 0;
}

#-------------------------------------------------------------------------
#
# Calculate absolute value
#
#-------------------------------------------------------------------------
sub abs {
  local($value) = @_;
  if ($value < 0) {
    $value = -$value;
  }
  $value;
}

#-------------------------------------------------------------------------
#
# Round off to n (default 0) decimal places, where n is the second argument.
#
#-------------------------------------------------------------------------
sub round {
  local($value, $n) = @_;
  if ($n) {
    $factor = 10**$n;
  }
  else { 
    $factor = 1; 
  }

  $value *= $factor;

  if ($value < 0) { $value -= 0.5; }
  else            { $value += 0.5; }

  $value = int($value);

  $value/$factor;
}

#-------------------------------------------------------------------------
#
# Check whether the supplied filename exists, possibly compressed; 
# if it does, add a version number.
#
#-------------------------------------------------------------------------
sub newFile {
  local($fileName, $verbose) = @_;
  local($version)     = 1;
  local($newFileName) = $fileName;
  local($expFileName) = &existsCompressed($newFileName);
  while ($expFileName) {
    if ($verbose) { print "$newFileName already exists.\n"; }
    $version++;
    $newFileName = "$fileName.version$version";
    if ($verbose) { print "Trying $newFileName...\n"; }
    $expFileName = &existsCompressed($newFileName);
  }

  $newFileName;
}

#-------------------------------------------------------------------------
#
# Checks whether the specified path exists, possibly in compressed form;
# returns the expanded path
#
#-------------------------------------------------------------------------
sub existsCompressed {
  local($baseName) = @_;
  $baseName =~ s/(\.gz|\.z|\.Z)$//;
  local($fileName) = $baseName;

  if (!(-e $fileName)) {
    $fileName = "${baseName}.gz";
    if (!(-e $fileName)) {
      $fileName = "${baseName}.z";
      if (!(-e $fileName)) {
	$fileName = "${baseName}.Z";
	if (!(-e $fileName)) {
	  $fileName = ();
	}
      }
    }
  }
  
  $fileName;
}

#-------------------------------------------------------------------------
#
# Sort an array of strings using the numeric key obtained from the
# specified sort expression
#
#-------------------------------------------------------------------------
sub sortArray {
  local($sortExpr, @array) = @_;
  local(@keys);
  foreach (@array) {
      push(@keys, eval $sortExpr);
  }
  sub byKeys { $keys[$a] <=> $keys[$b]; }
  @array[sort byKeys $[..$#array];
}

#-------------------------------------------------------------------------
#
# Prints a hash of arrays (e.g., %sortList).
#
#-------------------------------------------------------------------------
sub printHashOfArrays {
    my ($hashref) = @_;
    foreach my $key (sort keys %$hashref) {
	print "Key: $key\n";
	foreach my $array (@{ $$hashref{$key} }) {
	    print join(' ', @$array) . "\n";
	}
    }
}
    
    
