<?php
/**
 * This file is used by the Genomic module to get gene's data
 * from the UCSC genome browser table.
 *
 * PHP version 5
 *
 * @category Genomic
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

// Check that the user has genomic_browser_view permission
$user = User::singleton();
if (!$user->hasPermission('genomic_browser_view_site') &&
    !$user->hasPermission('genomic_browser_view_allsites') ) {
    error_log("ERROR: Permission denied");
    header('HTTP/1.1 403 Forbidden');
    exit(2);
}

// TODO :: Add some validation about the $_REQUEST
if (empty($_REQUEST['genomic_range']) || empty($_REQUEST['type'])) {
    error_log("ERROR: Missing parameter");
    header("HTTP/1.1 400 Bad Request");
    exit(3);
}

$bits = array();
if (!preg_match('/^([0-9]|[1][0-9]|[2][0-2]|[XYM]):([0-9]+)-([0-9]+)$/',$_REQUEST['genomic_range'],$bits)) {
    error_log("ERROR: Genomic range is invalid");
    header("HTTP/1.1 400 Bad Request");
    exit(4);
}

$params = array(
    'v_chr' => 'chr' . $bits[1],
    'v_start'   => $bits[2],
    'v_end'     => $bits[3]
);

$DB = new Database();
$DB->connect('hg19', 'genome', null, 'genome-mysql.cse.ucsc.edu', false);

$query = "
  SELECT
    name,
    chrom,
    strand,
    txStart,
    txEnd,
    cdsStart,
    cdsEnd,
    exonCount,
    exonStarts,
    exonEnds,
    score,
    name2,
    cdsStartStat,
    cdsEndStat,
    exonFrames
  FROM refGene
  WHERE chrom = :v_chr 
  AND txStart < :v_end
  AND txEnd > :v_start
";

// TODO :: Add tr...catch for the Database exception
$results = $DB->pselect($query, $params );

// return the results in JSON format
header("content-type:application/json");
ini_set('default_charset', 'utf-8');
print(json_encode($results));
exit();
?>
