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
if (empty($_REQUEST['geneId']) || empty($_REQUEST['table'])) {
    error_log("ERROR: Missing parameter");
    header("HTTP/1.1 400 Bad Request");
    exit(3);
}

$table = $_REQUEST['table'];
$params = array (
    'v_gene_id' => $_REQUEST['geneId']
);

$DB = new Database();
$DB->connect('hg19', 'genome', null, 'genome-mysql.cse.ucsc.edu', false);

$query = "
  SELECT
    geneSymbol as geneSymbol,
    refseq as refSeq,
    description as description
  FROM $table
  WHERE kgID = :v_gene_id
";
// TODO :: Add tr...catch for the Database exception
$results = $DB->pselect($query, $params );

// return the results in JSON format
header("content-type:application/json");
ini_set('default_charset', 'utf-8');
print(json_encode($results));
exit();
?>
