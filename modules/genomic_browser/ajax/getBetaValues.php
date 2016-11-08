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
    'v_cpgchromosome' => 'chr' . $_REQUEST['chromosome'],
    'v_cpgstartloc'   => $_REQUEST['startLoc'],
    'v_cpgendloc'     => $_REQUEST['endLoc']
);

$DB          = Database::singleton();
$query       = "
SELECT 
    cpg.cpg_name as cpg,
    cpg.beta_value as beta_value,
    genome_loc.StartLoc as cpg_loc,
    candidate.PSCID as pscid,
    candidate.Gender as gender
FROM candidate 
LEFT JOIN genomic_sample_candidate_rel gscr
    ON (gscr.CandID = candidate.CandID)
LEFT JOIN genomic_cpg cpg
    ON (gscr.sample_label = cpg.sample_label)
LEFT JOIN genomic_cpg_annotation gca
    USING (cpg_name)
LEFT JOIN genome_loc
    ON (genome_loc.GenomeLocID = gca.location_id)
WHERE 
candidate.Entity_type = 'Human' AND
candidate.Active = 'Y' AND
genome_loc.chromosome LIKE :v_cpgchromosome AND
genome_loc.StartLoc BETWEEN :v_cpgstartloc AND :v_cpgendloc
";

// TODO :: Add tr...catch for the Database exception
$results = $DB->pselect($query, $params );

// return the results in JSON format
header("content-type:application/json");
ini_set('default_charset', 'utf-8');
print(json_encode($results));
exit();
?>
