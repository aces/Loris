<?php
/**
 * This file is used by the Genomic module to get SNP data
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
if (empty($_REQUEST['genomic_range'])) {
    error_log("ERROR: Missing parameter");
    header("HTTP/1.1 400 Bad Request");
    exit(3);
}

$bits = array();
if (!preg_match('/^(^chr|^Chr|^CHR|^)([0-9]|[1][0-9]|[2][0-2]|[xXyYmM]):([0-9, ]+)-([0-9, ]+)$/',$_REQUEST['genomic_range'],$bits)) {
    error_log("ERROR: Genomic range is invalid");
    header("HTTP/1.1 400 Bad Request");
    exit(4);
}

$params = array(
    'v_chr' => 'chr' . $bits[2],
    'v_start'   => $bits[3],
    'v_end'     => $bits[4]
);

$DB = Database::singleton();

$query = "
SELECT SNPID, rsID, Description, SNPExternalName, SNPExternalSource, ReferenceBase, MinorAllele, Markers, FunctionPrediction, Damaging, ExonicFunction,Chromosome, Strand, EndLoc, StartLoc, EndLoc from SNP s JOIN genome_loc l USING (GenomeLocID) WHERE l.chromosome = :v_chr AND l.StartLoc BETWEEN :v_start AND :v_end ORDER BY l.StartLoc
";
// TODO :: Add tr...catch for the Database exception
$results = $DB->pselect($query, $params );
$result = array_reduce($results, function($carry, $item) {
    if(empty($carry[$item['rsID']])) {
        $carry[$item['rsID']] = array(
            'rsID' => $item['rsID'],
            'genomic_location' => $item['StartLoc'],
            'referenceBase' => $item['ReferenceBase'],
            'minorAllele' => $item['MinorAllele'],
            'functionPrediction' => $item['FunctionPrediction'],
            'exonicFunction' => $item['ExonicFunction'],
            'alleles' => array()
        );
    }
    // array_push($carry[$item['rsID']]['alleles'], $item['allele']);
    return $carry;
}, array());

header("content-type: application/json");
ini_set('default_charset', 'utf-8');
print(json_encode(array_values($result)));
exit();
?>
