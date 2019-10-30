<?php
/**
 * This provide the accepted file type in the genomic browser
 *
 * PHP Version 5
 *
 *  @category   Loris
 *  @package    Genomic_Module
 *  @author     Loris Team <loris.mni@bic.mni.mcgill.ca>
 *  @contriutor Xavier Lecours boucher <xavier.lecoursboucher@mcgill.ca>
 *  @license    Loris license
 *  @link       https://github.com/aces/Loris-Trunk
 */

$userSingleton =& User::singleton();
if (!$userSingleton->hasPermission('genomic_browser_view_site')
    && !$userSingleton->hasPermission('genomic_browser_view_allsites')
) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}
$DB     =& Database::singleton();
$result = $DB->pselect(
    'SELECT analysis_modality as genomicFileType
       FROM genomic_analysis_modality_enum',
    array()
);
header('Content-Type: application/json; charset=UTF-8');
echo json_encode($result);
exit;

