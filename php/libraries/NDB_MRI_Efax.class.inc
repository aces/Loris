<?php
require_once "File.class.inc";
/**
* @version $Id: NDB_MRI_Efax.class.inc,v 3.12 2006/04/05 17:07:42 sebas Exp $
*
fix the recrds
mysql> select Scan_category, count(ID) from NIH_PD.mri_efax_parameter_form group by Scan_category;
+---------------+-----------+
| Scan_category | count(ID) |
+---------------+-----------+
| subject       |      1666 |
+---------------+-----------+
1 row in set (0.00 sec)

mysql> select Scan_category, count(ID) frommri_efax_parameter_form group by Scan_category;
ERROR 1064: You have an error in your SQL syntax near 'group by Scan_category' at line 1
mysql> select Scan_category, count(ID) from mri_efax_parameter_form group by Scan_category;
+----------------+-----------+
| Scan_category  | count(ID) |
+----------------+-----------+
| subject        |      1848 |
| phantom        |        69 |
| living_phantom |        15 |
| mritest        |         4 |
+----------------+-----------+

All missing files are in the unassigned dir. Make a tool to reassign them, use the records from DEV and session infor from PD.

* this class manages efax(ed) files
*
* These filesare sent by e-fax and stored in the MRI_EFAX_FILE_DIR
* with this class they are assigned, registered and DB table mri_efax_parameter_form.
* Efax files can also be:
* unassigned - removed from DB and stored into MRI_EFAX_UNASSIGNED_BIN
* resotred - moved from MRI_EFAX_UNASSIGNED_BIN to MRI_EFAX_FILE_DIR
* deleted from the system (log in mri_efax_deleted_pages)
*
* possible way to get dates of acquisition from MRIs:
*
* @package efax
*/
Class NDB_MRI_Efax extends File
{

    // array to store config file paths
    var $paths;

    // array of acceptable scan types
    var $_scanCategoryArray = array('subject', 'ACRQC', 'living_phantom', 'mritest');

    /**
    * constructor
    */
    function NDB_MRI_Efax($configMriPaths)
    {
        // store the config path as a property
        $this->paths = $configMriPaths;
    }

    /**
    * lists file dir (ls style display)
    *
    * this function lists files in $directory and returns an array with file names (short, like in ls)
    *
    * @param   string the type of files to view (assigned, unassigned, new, backup)
    * @access  private
    * @return  array  $file_list list of files in $directory w/o path to file
    */
    function listFiles($fileType)
    {
        // get the directory w/ newly arrived efax files
        $directory = $this->paths['efax'][$fileType.'_dir'];

        // get file list from $directory
        $file_list = $this->get_files($directory, "jpg");

        // return FALSE in case of error or empty file
        if ($file_list === FALSE) {
            // preserve error
            return PEAR::raiseError("Unable to list directory ($directory)");
        }

        // sort array of files
        if (count($file_list) > 0) sort($file_list);

        // return the array
        return $file_list;
    }

    /**
    * returns an absolute path to file of the efax jpg
    * @param string name of the efax file (w/o path)
    * @param string type of the efax file to view (assigned, unassigned, new, backup)
    * @throws PEAR::Error
    * @return string absolute path to filels

    */
    function getJpgFile($fileName, $fileType)
    {

        // construct the path to file
        $file = $this->paths['efax'][$fileType.'_dir'].$fileName;

        if(!$this->is_sane($file, 1)) {
            return PEAR::raiseError("bad jpg file ($fileName), of type ($fileType):");
        }
        return $file;
    }

    /**
    * returns a list of assigned efax pages
    * @param int $site -  ID of the site,  psc.CenterID field
    * @param int $candID - candidate ID, candidate.CandID field
    * @return array list of assigned efax pages
    * @throws PEAR::Error
    */
    function getListOfEfaxPages($site='', $scan_category='', $candID='')
    {
        // new DB Object
        $db =& Database::singleton();
        if(PEAR::isError($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }

        $user =& User::singleton();
        if(PEAR::isError($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        $query  = "SELECT p.Name as Site, p.MRI_alias, e.Scan_category, c.CandID as CandID, c.PSCID as PSCID, s.VisitNo, s.Visit_label, e.Page, e.File_name, e.Acquisition_date as Date, DATE_FORMAT(e.Testdate, \"%Y-%m-%d\") as Testdate, e.ID, e.SessionID, e.TimepointLock";
        // display comments for admins
        if ($user->hasPermission('mri_efax') || $user->hasPermission('superuser')) {
        	$query .= ",e.Comment";
        }
        $query  .= " FROM mri_efax_parameter_form as e LEFT JOIN session as s ON (s.ID=e.SessionID), candidate as c, psc as p";
        $query  .= " WHERE p.CenterID = s.CenterID AND c.CandID = s.CandID";
        // site specific constraints
        if (!empty($site)) $query .= " AND p.CenterID = '$site'";
        if (!empty($scan_category)) $query .= " AND e.Scan_category = '$scan_category'";
        if (!empty($candID)) $query .= " AND c.CandID like '".$candID."%'";

        $query .= " ORDER BY c.CandID, s.Visit_label, Date, e.Page";
        $db->select($query, $result);

        if (PEAR::isError($result)) {
            return PEAR::raiseError("dbError: " . $result->getMessage());
        }

        return $result;
    }

    /**
    * updates a record in the parameter_form table
    */
    function updateEfaxRecord($field, $value, $fileName, $userID)
    {
        // new DB Object
        $db =& Database::singleton();
        if(PEAR::isError($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }

        $setArray = array($field=>$value, 'UserID'=>$userID);
        $whereArray = array('File_name'=>$fileName);

        // update the record
        $success = $db->update($setArray, $whereArray);
        if (PEAR::isError($success)) {
            return PEAR::raiseError("Error, failed to update record ($fileName), field($field) to value ($value):\n".$success->getMessage());
        }
    }

    /**
    * assign efax page to the timepoint
    * moves the file to the assigned_dir form the new_dir, inserts a record into mri_efax_parameter_form
    * @param int $sessionID
    * @param string categories of the scan
    * @param string name of the file to assign
    * @param int page number, exracted from the file name or content
    * @param date date of MRI study
    * @param string user ID/name
    * @param string comment
    */
    function assignEfaxPage($centerID, $candID, $sessionID, $scanCategory, $fileName, $page, $studyDate, $userID, $comment=null)
    {
        // check scan type
        if (!in_array($scanCategory, $this->_scanCategoryArray)) {
            return PEAR::raiseError("Error, scan category must be: 'subject', 'ACRQC', 'living_phantom', or 'mritest'!");
        }

        // new DB Object
        $db =& Database::singleton();

        // check whether the timepoins is locked, ie. no new efaxes allowed
        $query = "SELECT IF(TimepointLock=1,1,0)as TimepointLock FROM mri_efax_parameter_form WHERE SessionID=$sessionID LIMIT 1";
        $db->selectRow($query, $result);
        if ($result['TimepointLock']==1) {
        	return PEAR::raiseError("NDB_MRI_Efax::assignEfaxPage{}: Error, timepoint is locked, new pages cannot be assigned");
        }

        // site object
        $site =& Site::singleton($centerID);
        if (PEAR::isError($site)) {
            return PEAR::raiseError("Error, failed to create site object".$site->getMessage());
        }

        // construct the target dir
        $targetDir = $this->paths['efax']['assigned_dir'];
        if ($scanCategory == 'subject') $targetDir .= $candID.'/';
        else $targetDir .= $scanCategory.'/'.$site->getSiteMRIAlias().'/';

        // if a dir DNE
        if (!is_dir($targetDir)) {

            // if it's a subject scan, create new dir if it does not exist
            if ($scanCategory == 'subject') {
                // create new dir
                $success = mkdir($targetDir);
                // display error & return false
                if ($success === false) {
                    return PEAR::raiseError(STDERR, "Error, failed to create dir ($targetDir)");
                }

            } else {
                // the non-subject dirs already exist
                // so something is wrong w/ the dir, so block everything immediately...
                return PEAR::raiseError(STDERR, "Error, directory ($targetDir) does no exist!");
            }
        }

        // construct the path to file
        $fileFrom = $this->paths['efax']['new_dir'].$fileName;
        $fileTo = $targetDir.$fileName;

        // get the current date
        $today =  date('Y-m-d');

        // copy the file to the assigned bin
        $success = $this->copy_file($fileFrom, $fileTo);

        if ($success === false) {
            return PEAR::raiseError("Error, failed to copy file ($fileFrom) to the new location ($fileTo): \n".$this->ERROR);
        }

        // insert a record into the mri_efax_parameter_form table
        $setArray = array('CenterID'=>$centerID,'CandID'=>$candID,'Scan_category'=>$scanCategory,'SessionID'=>$sessionID,'Acquisition_date'=>$studyDate,'File_name'=>$fileName, 'Page'=>$page, 'UserID'=>$userID, 'Date_taken'=>$today, 'Comment'=>$comment);

        $success = $db->insert('mri_efax_parameter_form', $setArray);
        if (PEAR::isError($success)) {

            //remove the copied file from the system
            $success1 = $this->_deleteFile($fileTo);
            if (PEAR::isError($success1)) {
                // log the error, to be returned below
                $errorPart = "Error, failed to delete copied file ($fileTo)";
            }
            unset($success1);

            // return all errors
            return PEAR::raiseError("Error, failed to insert a record into mri_efax_parameter_form:\n".$success->getMessage()."\n".$errorPart);
        }

        //remove the original file from the system
        $success = $this->_deleteFile($fileFrom);

        if (PEAR::isError($success)) {
            // throw an error, inform the user to remove the original file manually.
            return PEAR::raiseError("Error, failed to delete the original file ($fileFrom) from the system:\n".$success->getMessage()."\n The efax page has been assigne, remove the original file manually!");
        }

    }

    /**
    * unassigns the efax  page $fileName
    * this function removes the record from the mri_efax_parameter_form table and moves the file to unassigned bin
    * @param string name of the file to delete
    * @throws PEAR::Error
    * @return void
    */
    function unassignEfaxPage($fileName)
    {
        // new DB Object
        $db =& Database::singleton();
        if(PEAR::isError($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }

        // get he scan category of the file
        $query = "SELECT m.CandID, m.Scan_category, p.MRI_alias FROM mri_efax_parameter_form as m, psc as p WHERE p.CenterID = m.CenterID AND File_name = '$fileName'";

        $db->selectRow($query, $result);
        if (PEAR::isError($result)) {
            return PEAR::raiseError("DBError, failed to select Scan cat. for file ($fileName):".$result->getMessage()."\n");
        }

        // if 0 rows, return error
        if (!is_array($result) || count($result) == 0) {
            return PEAR::raiseError("Failed to get Scan cat for file ($fileName)\n");
        }

        // construct the target dir
        $sourceDir = $this->paths['efax']['assigned_dir'];

        // append the file according to the file type
        if ($result['Scan_category'] == 'subject') {

            // all subject scans must have CandID
            if (empty($result['CandID'])) {
                return PEAR::raiseError("Failed to get CandID for file ($fileName)\n");
            }

            // append to target dir
            $sourceDir .= $result['CandID'].'/';

        } else {
            // for all non-subject scans
            $sourceDir .= $result['Scan_category'].'/'.$result['MRI_alias'].'/';
        }

        // construct the path to file
        $fileFrom .= $sourceDir.$fileName;
        $fileTo = $this->paths['efax']['unassigned_dir'].$fileName;

        // move the file to the unassign bin
        $success = $this->copy_file($fileFrom, $fileTo);

        // the parent method returns false, and stores error msg in property ERROR in case of errors
        if ($success === false) {
            return PEAR::raiseError("Error, failed to copy file ($fileFrom) to the new location ($fileTo): \n".$this->ERROR);
        }

        // remove the record from the table mri_efax_parameter_form
        $success = $db->delete('mri_efax_parameter_form', array('File_name'=>$fileName));

        // if error, remove destination file
        if (PEAR::isError($success)) {

            // remove the copied file
            $success1 = $this->_deleteFile($fileTo);
            if (PEAR::isError($success1)) {
                // preserve error
                $errorPart = "Error, failed to delete destination file ($fileTo):\n".$success1->getMessage();
            }
            //return error
            return PEAR::raiseError("Error, failed to remove the record for ($fileName):\n".$success->getMessage()."\n".$errorPart."\n");
        }

        // remove the file from the original location
        $success = $this->_deleteFile($fileFrom);
        if (PEAR::isError($success)) {
            return PEAR::raiseError("Error, failed to delete original file ($fileFrom):\n".$success->getMessage()."\n Remove the file manually!");
        }
    }

    /**
    * restores the efax file, moves it from unassigned bin to the new bin
    * @param string name of the file to delete
    * @throws PEAR::Error
    * @return void
    */
    function restoreEfaxPage($fileName)
    {
        // new DB Object
        $db =& Database::singleton();
        if(PEAR::isError($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }

        // construct the path to file
        $fileFrom = $this->paths['efax']['unassigned_dir'].$fileName;
        $fileTo = $this->paths['efax']['new_dir'].$fileName;

        // copy the file to the new location, the copy_file method checks the files' sanity
        $success = $this->copy_file($fileFrom, $fileTo);
        // the parent method return false, and stores error msg in property ERROR in case of errors
        if ($success === false) {
            return PEAR::raiseError("Error, failed to copy file ($fileFrom) to the new location ($fileTo): \n".$this->ERROR);
        }

        // remove the file from the original location
        $success = $this->_deleteFile($fileFrom);
        if (PEAR::isError($success)) {
            return PEAR::raiseError("Error, failed to delete original file ($fileFrom):\n".$success->getMessage());
        }
    }

    /**
    * wraps the _deleteFile() and logs the action into delete_efax_pages table
    * @param string name of the file to delete
    * @param string type of the efax file to view (assigned, unassigned, new, backup)
    * @throws PEAR::Error
    * @return void
    */
    function deleteEfaxPage($fileName, $fileType)
    {
        // new DB Object
        $db =& Database::singleton();
        if(PEAR::isError($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }

        // construct the path to file
        $file = $this->paths['efax'][$fileType.'_dir'].$fileName;

        if (!$this->is_sane($file, 1)) {
            return PEAR::raiseError("Error file name ($file) is not a valid file!");
        }

        // get the current date
        $today =  date('Y-m-d');

        // insert a record into the mri_efax_deleted_pages table
        $setArray = array('ID'=>'NULL','File_name'=>$fileName,'Date'=>$today);

        $success = $db->insert('mri_efax_deleted_pages', $setArray);
        if (PEAR::isError($success)) {
            return PEAR::raiseError("Error, failed to insert a record into mri_efax_deleted_pages:\n".$success->getMessage());
        }

        //remove the file from the system
        $success = $this->_deleteFile($file);

        if (PEAR::isError($success)) {

            // if delete fails, remove the record from DB
            $success1 = $db->delete('mri_efax_deleted_pages', array('File_name'=>$fileName));
            if (PEAR::isError($success1)) {
                // log the error, to be returned below
                $errorPart = "Error, Failed to remove the record from mri_efax_deleted_pages for File_name ($fileName)";
            }
            unset($success1);

            // throw an error
            return PEAR::raiseError("Error, failed to delete the file ($file) from the system:\n".$success->getMessage()."\n".$errorPart);
        }
    }

    /**
    * deletes a file from the file system
    *
    * @param  string $file - file name to delete with full absolute path to file
    * @return bool
    * @throws PEAR::Error
    * @access private
    */
    function _deleteFile($fileName)
    {
        // test if file exists
        if(!$this->is_sane($fileName, 1)) {

            // preserve the error
            return PEAR::raiseError("File ($fileName) does not exist!");

        } else {

            // delete $file from the file system
            if (unlink($fileName) === FALSE) {
                return PEAR::raiseError("can't delete ($fileName)");
            }
        }
        return TRUE;
    }
    
    /**
    * sets a value to TimepointLock
    * 
    * @param int $sessionID timepoint identifier
    * @return bool
    * @throws PEAR::Error
    * @access public
    */
    function setTimepointLock($sessionID) {
        $db =& Database::singleton();
        $success = $db->run("UPDATE mri_efax_parameter_form SET TimepointLock=IF(TimepointLock=1,0,1) WHERE SessionID=$sessionID");
        if (PEAR::isError($success)) {
            return PEAR::raiseError("NDB_MRI_Efax::setTimepointLock(): failed to update records for sessionID ($sessionID):\n".$success->getMessage());
        }
        return true;
    }
}
?>