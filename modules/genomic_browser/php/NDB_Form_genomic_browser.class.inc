<?php

/**
 * form_genomic_browser class file
 *
 * PHP version 5
 * 
 * @category   Genomic
 * @package    Main
 * @subpackage Genomic 
 * @author     Loris team <info-loris.mni@mcgill.ca> 
 * @license    @GPLv3
 * @link       https://github.com/aces/Loris
*/

require_once "NDB_BVL_Battery.class.inc";
require_once 'NDB_Form.class.inc';
require_once 'GenomicFile.class.inc';
/**
 * NDB_Form_Genomic_Browser Class
 *
 * This class is genomic_browser Form
 * 
 * @category   Genomic
 * @package    Main
 * @subpackage Genomic 
 * @author     Loris team <info-loris.mni@mcgill.ca>
 * @license    @GPLv3
 * @link       https://github.com/aces/Loris
*/

class NDB_Form_Genomic_Browser extends NDB_Form
{
/**
 * vars to store the DCCID, sessionID, genomic file ID
*/
var $candID;
var $sessionID;
var $genomic_file_ID;

/**
* Determine whether the user has permission to view the genomic_browser_view_file page
*
* @return bool whether the user has access
*/
function _hasAccess()
{
    $user =& User::singleton();
    if (Utility::isErrorX($user)) {
        return PEAR::raiseError("User Error: " .$user->getMessage());
}

    // Add site control? See Imaging Browser example 

    return ($user->hasPermission('genomic_browser_view_allsites') || $user->hasPermission('genomic_browser_view_site'));
}

/**
* Sets up main parameters given one GenomicFileID
* Visit Label or SessionID not required
*
* @return NULL
*/
function viewGenomicFile() 
{
    $this->DB = Database::singleton();
    if (Utility::isErrorX($this->DB)) {
        print "Could not connect to database: ".$DB->getMessage()."<br>\n";
        die();
    }

    $this->genomic_file_ID = $_REQUEST['GenomicFileID'];
    // add check? if (!empty($this->genomic_file_ID) && is_numeric($this->genomic_file_ID)) {

    $this->candID = $_REQUEST['candID'];
    $this->category = $_REQUEST['Category'];

    if (!empty($this->candID) ) {
        // If saving any annotation changes, see imaging browser View Session 
        
        // retrieve file data 
        if (!empty($this->category) ) { 
            // if category was specified (raw/clean)
            $this->_setFileData($this->category); 
        } 
        else { 
            $this->_setFileData(); 
        }

        $this->tpl_data['has_permission'] = ($this->_hasAccess()) ? true : false;
    }
}
/**
* Sets values for Genomic data files
*
* @return NULL
*/
function _setFileData($category = null)  
{
    if (!empty($this->category) ) { // apply Category filter
        $files = $this->DB->pselect(
            "SELECT genomic_files.GenomicFileID FROM genomic_files 
            WHERE CandID=:cid AND Category=:catid", 
            array(
            'cid' => $this->candID,
            'catid' => $this->category
            )
        );
    }
    else {
        $files = $this->DB->pselect(
            "SELECT genomic_files.GenomicFileID FROM genomic_files 
            WHERE CandID=:cid ", 
            array(
            'cid' => $this->candID
            )
        );
    }

    // Not dependent on session ID for now
    $this->tpl_data['files'] = array();
    foreach ($files as $fileRow) {
        $FileObj = new GenomicFile($fileRow['GenomicFileID']);
        $file = array(
            'FileID'   => $fileRow['GenomicFileID'],
            'Filename' => basename($FileObj->getParameter('FileName')),
            'FullFilename' => $FileObj->getParameter('FileName'),
            'FilePackage' => $FileObj->getParameter('FilePackage'),
            'FileType' => $FileObj->getParameter('FileType'),
            'FileSize' => $FileObj->getParameter('FileSize'),
            'Description' => $FileObj->getParameter('Description'),
            'Category' => $FileObj->getParameter('Category'),
            'Pipeline' => $FileObj->getParameter('Pipeline'),
            'Algorithm' => $FileObj->getParameter('Algorithm'),
            'Normalization' => $FileObj->getParameter('Normalization'),
            'SampleID' => $FileObj->getParameter('SampleID'),
            'Caveat' => $FileObj->getParameter('Caveat'),
            'Notes' => $FileObj->getParameter('Notes'),
            'AnalysisProtocol' => $FileObj->getParameter('AnalysisProtcol'),
            'AnalysisDate' => $this->_getDate(
                $FileObj, 'Date_taken', $analysisDate
            ), 
            'SampleDate' => $this->_getDate(
                $FileObj, 'Date_sample', $sampleDate
            ),
            'FileInsertDate' => $FileObj->getParameter('Date_inserted'),

            'Selected' => $FileObj->getParameter('Selected'),
            'QCStatus' => $FileObj->getParameter('QCStatus'),
            'QCDate' => $FileObj->getParameter('QCLastChangeTime'),
        );
        $this->tpl_data['files'][] = $file;
    }
}
/**
* Gets the date according to the type
* 
* @param GenomicFile $file  file object 
* @param string  $type  type of the date
* @param array   $array array containing the date
*
* @return date if exists, if not an empty string
*/
function _getDate($file, $type, $array)
{
if (preg_match(
"/(\d{4})-?(\d{2})-?(\d{2})/", 
$file->getParameter($type), $array
)) {
return (mktime(12, 0, 0, $array[2], $array[3], $array[1]));
} else {
return "";
} 
}

}
?>
