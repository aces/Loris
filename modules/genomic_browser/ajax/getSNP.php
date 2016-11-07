<?php
/**
 * This file is used by the Genomic module to get a all beta value
 * from the genomic_cpg table via AJAX
 *
 * PHP version 5
 *
 * @category Epigenomics
 * @package  Loris
 * @author   Xavier Lecours Boucher <loris-dev@bic.mni.mcgill.ca>
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
if (false) {
    error_log("ERROR: Invalid filename");
    header("HTTP/1.1 400 Bad Request");
    exit(3);
}

// TODO :: Add params from $_SESSION
$params = array(
    'v_chromosome' => 'chr' . $_REQUEST['chromosome'],
    'v_startloc'   => $_REQUEST['startLoc'],
    'v_endloc'     => $_REQUEST['endLoc']
);

$DB          = Database::singleton();
$query       = "
SELECT
    SNP.rsID as rsID,
    candidate.PSCID as pscid,
    candidate.Gender as gender,
    genome_loc.StartLoc as genomic_location,
    scr.AlleleA as a1,
    scr.AlleleB as a2
FROM SNP
LEFT JOIN SNP_candidate_rel scr 
    USING (SNPID)
LEFT JOIN genome_loc 
    USING (GenomeLocID)
LEFT JOIN candidate USING (CandID)
WHERE  candidate.entity_type = 'Human'
       AND candidate.active = 'Y'
       AND genome_loc.chromosome LIKE :v_chromosome
       AND genome_loc.StartLoc BETWEEN :v_startloc AND :v_endloc
ORDER  BY rsID,
          gender,
          pscid
";

// TODO :: Add tr...catch for the Database exception
$results = $DB->pselect($query, $params );

// return the results in JSON format
header("content-type:application/json");
ini_set('default_charset', 'utf-8');
print(json_encode($results));
exit();
?>
