<?php
/**
 * This file is used by the Genomic module to get a all beta value
 * close to a snp. It groups them by allele.
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

if (empty($_REQUEST['snpId'])) {
    error_log('Missing snpId');
    header("HTTP/1.1 400 Bad Request");
    exit(3);
}
$results = array();

$params = array(
    'v_snp_id' => $_REQUEST['snpId']
);

$DB          = Database::singleton();
// Find the closest cpgs
$query       = "
  SELECT DISTINCT
    a.cpg_name,
    ABS(l1.StartLoc - l2.StartLoc) as DistanceAbs
  FROM genomic_cpg_annotation a 
  JOIN genome_loc l1 
    ON (a.location_id = l1.GenomelocID)
  JOIN genome_loc l2
  JOIN SNP s
    ON (l2.GenomeLocID = s.GenomeLocID)
  WHERE l1.Chromosome = l2.Chromosome
  AND s.rsID = :v_snp_id
  ORDER BY DistanceAbs
  LIMIT 1
";
// TODO :: We could increase the limit and let the user move from cpg to cpg (left <- -> right arrows) creating a new modal window for each.   

$cpgs = $DB->pselect($query, $params );

foreach ($cpgs as $cpg) {
  $params['v_cpg_name'] = $cpg['cpg_name'];
  $query = "
    SELECT 
      candidate.Gender,
      c.beta_value,
      CASE WHEN scr.AlleleA < scr.AlleleB THEN CONCAT(scr.AlleleA, scr.AlleleB) ELSE CONCAT(scr.AlleleB, scr.AlleleA) END as Alleles
    FROM genomic_cpg c
    JOIN genomic_sample_candidate_rel gscr
      USING (sample_label)
    JOIN SNP_candidate_rel scr
      USING (CandID)
    JOIN SNP
      USING (SNPID)
    JOIN candidate
      USING (CandID)
    WHERE c.cpg_name = :v_cpg_name
    AND SNP.rsID = :v_snp_id
    ORDER BY Alleles
  ";
  $beta_values = $DB->pselect($query, $params);
  $results[$cpg['cpg_name']] = $beta_values;
}

header("content-type: text/plain");
ini_set('default_charset', 'utf-8');

echo 'cpg_num,cpg_name,alleles_num,' . implode(',',array('Gender', 'BetaValue', 'Alleles')) . "\n";


$counter = 1;
foreach ($results as $cpg_name => $cpg) {
    $alleles = array();
    foreach($cpg as $result) {
        $values = array_values($result);
        if (array_search($values[2],$alleles) === false) {
            $alleles[] = $values[2];
        }
        $index = array_search($values[2],$alleles);
        echo "$counter,$cpg_name,$index," . implode(',',$values) . "\n";
    }
    $counter++;
};

exit();
?>
