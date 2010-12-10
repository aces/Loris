<?php
// LATER TO DO LIST:
// prevent change of event_file_list (javascript)

/**
 * this class manages efax(ed) files
 * 
 * These filesare sent by e-fax and stored in the MRI_EFAX_FILE_DIR
 * with this class they are assigned, registered and DB table mri_efax_parameter_form.
 * Efax files can also be:
 * unassigned - removed from DB and stored into MRI_EFAX_UNASSIGNED_BIN
 * resotred - moved from MRI_EFAX_UNASSIGNED_BIN to MRI_EFAX_FILE_DIR
 * deleted from the system (log in mri_efax_deleted_pages)
 * 
 * 
 * These SQL statements are used to build efax related DB tables:
 * 
 * -- mri_parameter_form TABLE BUILD
 * DROP TABLE IF EXISTS mri_efax_parameter_form;
 * CREATE TABLE IF NOT EXISTS mri_efax_parameter_form (
 * ID            int(10) unsigned unique auto_increment not null,
 * CenterID      tinyint(2) unsigned not null DEFAULT 1 REFERENCES psc,
 * Scan_category enum('subject','phantom','living_phantom','mritest') not null,
 * CandID        int(6) not null REFERENCES candidate,
 * VisitNo       tinyint(1) not null,
 * ID_session    int(10) unsigned not null REFERENCES session,
 * Acquisition_date date not null,
 * Data_path     varchar(255) not null,
 * Status        varchar(255) not null,
 * Core_path     varchar(255) not null,
 * File_name     varchar(255) not null,
 * Efax_page     char(3) not null,
 * Sent_by       varchar(255) not null,
 * UserID        varchar(255) not null,
 * Date_taken    date not null,
 * Testdate      timestamp(14) not null,
 * Comment       varchar(255) not null,
 * PRIMARY KEY (File_name, Efax_page));
 * 
 * ALTER TABLE mri_efax_parameter_form ADD INDEX (CenterID), ADD INDEX (Scan_category), ADD INDEX (VisitNo);
 * 
 * -- mri_deleted_efax_pages TABLE BUILD
 * DROP TABLE IF EXISTS mri_efax_deleted_pages;
 * CREATE TABLE IF NOT EXISTS mri_efax_deleted_pages (
 * ID int unsigned unique auto_increment not null,
 * File_name varchar(255) not null, -- efax page file name w/o path
 * Date date not null,
 * PRIMARY KEY (File_name, Date));
 * 
 * -- review table structure
 * DESCRIBE mri_efax_parameter_form;
 * DESCRIBE mri_efax_deleted_pages;
 * 
 * -- MAPPING FROM THE old efax tables to the new ones (not necessary in the future)
 * 
 * -- mapping data into mri_efax_parameter_form
 * ALTER TABLE mri_efax_parameter_form ADD Temp tinyint(2) not null AFTER Comment;
 * DELETE FROM mri_efax_parameter_form;
 * INSERT INTO mri_efax_parameter_form SELECT
 * NULL as ID,
 * c.CenterID as CenterID,
 * m.Scan_category as Scan_category,
 * LEFT(m.Core_path, 6) as CandID,
 * 1 as VisitNo,
 * m.ID_session AS ID_session,
 * m.Date_mri as Acquisition_date,
 * m.Data_path as Data_path,
 * m.Status as Status,
 * m.Core_path as Core_path,
 * m.File_name as File_name,
 * m.Efax_page as Efax_page,
 * m.Sent_by as Sent_by,
 * m.UserID as UserID,
 * m.Date_taken as Date_taken,
 * m.Testdate as Testdate,
 * m.Comment as Comment,
 * p.CenterID as Temp
 * FROM NIH_PD.mri_parameter_form as m 
 * LEFT JOIN NIH_PD.candidate as c on (LEFT(m.Core_path, 6) = c.candID),
 * NIH_PD.mri_parameter_form as m1
 * LEFT JOIN NIH_PD.psc as p on (p.MRI_alias = SUBSTRING_INDEX(m1.Core_path, '/', -1))
 * WHERE m.ID = m1.ID;
 * -- erase VisitNo for subject scans with ID_session=0 and other scans - MANUAL FIX for subject scans
 * UPDATE mri_efax_parameter_form SET VisitNo = '0' WHERE ID_session=0;
 * -- fix records for ACRQC
 * UPDATE mri_efax_parameter_form SET CenterID=Temp, Scan_category = 'phantom' WHERE LEFT(Core_path, 5) = 'ACRQC' AND Temp <> 0;
 * -- fix records for living_phntom
 * UPDATE mri_efax_parameter_form SET CenterID=Temp WHERE Scan_category = 'living_phantom' AND Temp <> 0;
 * -- drop temporary column
 * ALTER TABLE mri_efax_parameter_form DROP Temp;
 * -- drop the old table
 * DROP TABLE IF EXISTS mri_parameter_form;
 * 
 * -- populate new mri_efax_deleted_pages table 
 * INSERT INTO mri_efax_deleted_pages 
 * SELECT NULL as ID, Efax_file as File_Name, Date as Date FROM NIH_PD.deleted_efax_pages;
 * -- drop the old table
 * DROP TABLE IF EXISTS mri_deleted_efax_pages;
 * 
 * -- test fixes
 * SELECT count(ID) FROM mri_efax_parameter_form;
 * SELECT count(Scan_category), Scan_category FROM mri_efax_parameter_form WHERE VisitNo=0 GROUP BY (Scan_category);
 * SELECT count(CenterID), CenterID FROM mri_efax_parameter_form WHERE Scan_category = 'phantom' GROUP BY (CenterID);
 * SELECT count(CenterID), CenterID FROM mri_efax_parameter_form WHERE Scan_category = 'living_phantom' GROUP BY (CenterID);
 * SELECT count(CenterID), CenterID FROM mri_efax_parameter_form WHERE Scan_category = 'mritest' GROUP BY (CenterID);
 * SELECT count(CenterID), CenterID FROM mri_efax_parameter_form WHERE Scan_category = 'subject' GROUP BY (CenterID);
 * SELECT count(ID) FROM mri_efax_parameter_form WHERE Scan_category = 'subject';
 * SELECT ID FROM mri_efax_parameter_form WHERE CenterID=0;
 * SELECT count(VisitNo), VisitNo FROM mri_efax_parameter_form WHERE Scan_category = 'subject' GROUP BY (VisitNo);
 * SELECT Scan_category, VisitNo, count(VisitNo) as Count FROM mri_efax_parameter_form WHERE Scan_category <> 'subject' GROUP BY Scan_category, VisitNo;
 * SELECT * FROM mri_efax_parameter_form WHERE Scan_category = 'subject' LIMIT 1\G
 * SELECT * FROM mri_efax_parameter_form WHERE Scan_category = 'living_phantom' LIMIT 1\G
 * SELECT * FROM mri_efax_parameter_form WHERE Scan_category = 'mritest' LIMIT 1\G
 * SELECT * FROM mri_efax_parameter_form WHERE Scan_category = 'phantom' LIMIT 1\G
 * SELECT * FROM mri_efax_parameter_form WHERE Scan_category = '';
 * SELECT DISTINCT Core_path FROM mri_efax_parameter_form WHERE Scan_category <> 'subject'  GROUP BY (Core_path);
 * SELECT count(ID), Scan_category, LEFT(Core_path, 5) AS Type FROM mri_efax_parameter_form WHERE Scan_category <> 'subject' GROUP BY Type, Scan_category;
 * SELECT LEFT(Core_path, 5) AS Type, Scan_category FROM mri_efax_parameter_form WHERE Scan_category <> 'subject';
 * SELECT * FROM mri_efax_deleted_pages;
 * 
 * @package efax
 */


/**
 * File.class.inc contains functions that are called by the
 * functions in these libraries...
 */
require_once "javaCode.inc";
require_once PHP_DIR . "libraries/File.class.inc";


/**
 * CONSTANTS that need to be defined
 */
if(!defined('MRI_EFAX_FILE_DIR')) {
    /**
     * defines where newly received efax pages are stored (may be defined outside, such as in a config file)
     * 
     * @access public
     */
    define('MRI_EFAX_FILE_DIR', '.');
}

if(!defined('MRI_EFAX_ASSIGNED_FILE_DIR')) {
    /**
     * defines where newly received efax pages are stored (may be defined outside, such as in a config file)
     * 
     * @access public
     */
    define('MRI_EFAX_ASSIGNED_FILE_DIR', '.');
}

if(!defined('MRI_EFAX_UNASSIGNED_BIN')) {
    /**
     * defines where unassigned efaxes go (may be defined outside, such as in a config file)
     * 
     * @access public
     */
    define('MRI_EFAX_UNASSIGNED_BIN', '.');
}

if(!defined('DATA_PATH_DIR')) {
    /**
     * defines the value for the Data_path fields in the DB table
     * it is the absolute path to the Core_path directory
     * no trailing slash
     * 
     * @access public
     */
    define('DATA_PATH_DIR', '.');
}


if(!defined('NUM_VISITS')) {
    /**
     * defines the number of Time Point in the study
     * 
     * @access public
     */
    define('NUM_VISITS', '.');
}



/**
 * efax file operations Class
 *
 * this class extend File class
 * and provides efax-specific methods
 * @access public
 */
Class MRIEfaxObject extends File 
{

    /**
     * controls which screen is displayed within the GUI efax section
     */
    var $mri_efax_screen;

    /**
     * controls which screen is displayed within the GUI efax section
     */
    var $mri_efax_page_title;

    /**
     * set the current date in mysql compatible format (YYYY-MM-DD)
     */
    var $mri_efax_event_date;

    /**
     * GUI message that shoul be displayed for the user with instructions what to do next, used in _HTML functions
     */
    var $gui_message;

    /**
     * determines full path to dir with efax file, this way fake efax file cannot be passed
     */
    var $path_to_efax_file;

    /**
     * LIMIT part of the SQL select statement
     */
    var $select_efax_limit;

    /**
     * OFFSET part of the SELECT statement
     */
    var $select_efax_offset;

    /**
     * constructor
     *
     * this function defines:
     * full path to dir with efax files according to which screen is opened
     *      records the file reference to the mri_deleted_efax_pages table
     *
     * @param  string $mri_efax_screen  - screen to show
     * @return void
     */
    function MRIEfaxObject($mri_efax_screen)
    {
        global $php_errormsg;

        /**
         * set mri_efax_screen property
         */
        $this->mri_efax_screen = $mri_efax_screen;

        /**
         * set mri_efax_event_date property
         */
        $this->mri_efax_event_date = date("Y-m-d");

        /**
         * define path_to_efax_file property
         * if the function is called for new, unassigned file, force path to be MRI_EFAX_FILE_DIR
         * for assigned file, force path to be MRI_EFAX_ASSIGNED_FILE_DIR
         * for un-assigned files, force path to be MRI_EFAX_UNASSIGNED_FILE_DIR
         */
        switch ($this->mri_efax_screen) {
        
        case 'New':
            $this->path_to_efax_file = MRI_EFAX_FILE_DIR;
            $this->mri_efax_page_title = "Register New Efax Pages";
            break;
        
        case 'Assigned':
            $this->path_to_efax_file = MRI_EFAX_ASSIGNED_FILE_DIR;
            $this->mri_efax_page_title = "Assigned Efax Pages";
            break;
        
        case 'Unassigned':
            $this->path_to_efax_file = MRI_EFAX_UNASSIGNED_BIN;
            $this->mri_efax_page_title = "Unassigned Efax Pages";
            break;

        default:
            $this->path_to_efax_file = "no dir assigned";
            $this->mri_efax_page_title = "invalid page";
            break;
        }

        return;
    }



    /**
     * deletes efax file from the file system, records event in DB
     *
     * this function deletes an efax file from the file system and
     * records the file reference to the mri_efax_deleted_pages
     * table. This function deals with arrays only.
     *
     * @param  array    $event_file_list - array of efax files w/o path marked for
     *                                     deletion, with structure:
     *                                     $event_file_list[file_name] = efax_page
     * @param  bool     $event_confirm   - boolean that checks if the event has been confirmed before executing
     * @access private
     * @see    _make_event_file_list_array()
     * @see    delete_file()
     * @return bool
     */
    function _delete_efax_file(&$event_file_list, $event_confirm)
    {
        // check if $event_file_list contains at least one file
        if (empty($event_file_list)) {

            $this->error .= " _delete_efax_file()=>No files in $event_file_list";
            $this->gui_message .= " You must selected at least one file<BR>\n";

            return FALSE;
        }

        // test if $event_file_list is an array
        if (!is_array($event_file_list)) {

            // turn $event_file_list into an array
            $event_file_list = $this->_make_event_file_list_array($event_file_list);

        }

        // require that the user confirms the action
        if (!isset($event_confirm)) {

            // SET error
            $this->error .= "_delete_efax_file => need to set event_confirm";
            $this->gui_message .= "Please confirm the \"delete\" action<BR>\n";

            // return TRUE so that the $event_confirm can be set
            return TRUE;
        }

        //loop through the $event_file_list array
        foreach ($event_file_list as $current_efax_file => $current_efax_page) {

            // INSERT a file reference into mri_deleted_efax_pages
            $query = "INSERT INTO mri_efax_deleted_pages VALUES (NULL,'$current_efax_file','$this->mri_efax_event_date')";
            $qid = mysql_query($query);

            if ($qid == FALSE) {

                // set error
                $this->error .= "_delete_efax_file()=>INSERT failed: " . mysql_error() . "\n";
                $this->gui_message .= "INSERT failed:  $query<BR>\n";

                return FALSE;
            }

            // remove the file from the system
            $event_stat = $this->delete_file($this->path_to_efax_file.$current_efax_file);

            if ($event_stat == FALSE) {

                // append to error set in delete_file()
                $this->error .= " _delete_efax_file()=>failed to delete $current_efax_file \n";
                $this->gui_message .= "failed to delete file<BR>\n";            

                // remove the record from DB
                $qid = mysql_query("DELETE FROM mri_efax_deleted_pages WHERE File_name='$current_efax_file'");

                if ($qid == FALSE) {

                    // append to error set in delete_file()
                    $this->error .= " _delete_efax_file()=>DELETE failed " . mysql_error() . "\n"; 
                    $this->gui_message .= "failed DELETE $query<BR>\n";
                } 

                return FALSE;
            }

            // remove this element from the array
            unset($event_file_list[$current_efax_file]);
        }

        // return false here to unset $event_confirm
        return FALSE;
    }




    /**
     * unassignes already assigned efax file
     *
     * this function DELETEs the DB record from the
     * mri_efax_parameter_form table and moves the file to
     * MRI_EFAX_UNASSIGNED_BIN. This function deals with arrays only.
     *
     * @param  array   $event_file_list - array of efax files w/o path marked for
     *                                    deletion, with structure:
     *                                    $event_file_list[$file_name] = $efaxID
     * @param  bool    $event_confirm   - boolean that checks if the event has been confirmed before executing
     * @param  int     $efaxID          - field mri_parameter_form.ID
     * @access private
     * @see    _make_event_file_list_array()
     * @see    delete_file()
     * @see    copy_file
     * @return bool
     */
    function _unassign_efax_file(&$event_file_list, $event_confirm, $efaxID='')
    {
        // check if $event_file_list contains at least one file
        if (empty($event_file_list)) {

            $this->error .= "_unassign_efax_file()=>No files in $event_file_list";
            $this->gui_message .= " You must selected at least one file<BR>\n";
        
            return FALSE;
        }
      
        // test if $event_file_list is an array
        if (!is_array($event_file_list)) {

            if (!empty($efaxID)) {

                // turn $event_file_list into an array
                $event_file_list = $this->_make_event_file_list_array($event_file_list, $efaxID);

            } else {

                // set error
                $this->error .= "_unassign_efax_file()=>Invalid EfaxID for $event_file_list\n";
                $this->gui_message .= "ID not set for $event_file_list, script error<BR>\n";

                return FALSE;
            }
        }

        // require that the user confirms the action
        if (!isset($event_confirm)) {

            // SET error
            $this->error .= "_unassign_efax_file => need to set event_confirm\n";
            $this->gui_message .= "Please confirm the \"unassign\" action<BR>\n";

            // return TRUE so that the $event_confirm can be set
            return TRUE;
        }

        //loop through the $event_file_list array
        foreach ($event_file_list as $current_efax_file => $current_efaxID) {

            // set $core_path
            $query = "SELECT Core_path FROM mri_efax_parameter_form WHERE ID = '$current_efaxID'";

            $qid = do_query($query);

            if ($qid == FALSE) {
                
                // SET error
                $this->error .= "_unassign_efax_file => SELECT failed: ".mysql_error()."\n";
                $this->gui_message .= "Failed to construct path to file, please contact DCC<BR>$query\n";

                // return TRUE so that the $event_confirm can be set
                return FALSE;
            } else {
                $row = mysql_fetch_array($qid, MYSQL_ASSOC);
                $core_path = $row["Core_path"];
                unset($row);
                mysql_free_result($qid);
            }


            // copy $current_efax_file to MRI_EFAX_UNASSIGNED_BIN
            $event_stat = $this->copy_file($this->path_to_efax_file.$core_path."/".$current_efax_file, MRI_EFAX_UNASSIGNED_BIN.$current_efax_file);       

            if ($event_stat == FALSE) {
              
                // append to error from copy_file()
                $this->error .= "_unassign_efax_file()=>copy failed $current_efax_file to ".MRI_EFAX_UNASSIGNED_BIN." \n";
                $this->gui_message .= "failed to copy $current_efax_file<BR>\n";

                return FALSE;
            }
            unset($event_stat);

            // remove original file
            $event_stat = $this->delete_file($this->path_to_efax_file.$core_path."/".$current_efax_file);
            
            if ($event_stat == FALSE) {
              
                // append to error from delete_file()
                $this->error .= "_unassign_efax_file()=>unable to delete $current_efax_file from ".$this->path_to_efax_file.$core_path."/"." \n";
                $this->gui_message .= "failed to delete $current_efax_file<BR>\n";

                // remove copied file
                $event_stat = $this->delete_file(MRI_EFAX_UNASSIGNED_BIN.$current_efax_file);

                if ($event_stat == FALSE) {

                    // append to error from delete_file()
                    $this->error .= "=>unable to delete copied $current_efax_file from ".MRI_EFAX_UNASSIGNED_BIN." \n";
                    $this->gui_message .= "failed to delete copied $current_efax_file<BR>\n";
                }

                return FALSE;
            }

            // DELETE DB record
            $query = "DELETE FROM mri_efax_parameter_form WHERE ID = '$current_efaxID'";
            $qid = mysql_query($query);

            if ($qid == FALSE) {

                $this->error .= "_unassign_efax_file()=>DELETE failed: ".mysql_error()." \n";
                $this->gui_message .= "failed to DELETE DB record for ID = $current_efaxID, File: $current_efax_file";

                return FALSE;
            }

            // remove this element from the array
            unset($event_file_list[$current_efax_file]);
        }

        // return false here to unset $event_confirm
        return FALSE;
    }



    /**
     * restores unassigned efax file: moves 2 d MRI_EFAX_FILE_DIR
     *
     * this function moves the unassigned files from MRI_EFAX_UNASSIGNED_BIN
     * back to tbe MRI_EFAX_FILE_DIR so that they could be reassigned again
     *
     * @param  array $event_file_list - array of unassigned efax files w/o path marked for
     *                                  deletion, with structure:
     *                                  $event_file_list[file_name] = efax_page
     * @param  bool  $event_confirm   - boolean that checks if the event has been confirmed before executing
     * @access private
     * @see    _make_event_file_list_array()
     * @see    delete_file()
     * @return bool
     */
    function _restore_efax_file(&$event_file_list, $event_confirm)
    {
        // check if $event_file_list contains at least one file
        if (empty($event_file_list)) {
          
            $this->error .= "_restore_efax_file()=>No files in $event_file_list";
            $this->gui_message .= " You must selected at least one file<BR>\n";
          
            return FALSE;
        }

        // test if $event_file_list is an array
        if (!is_array($event_file_list)) {

            // turn $event_file_list into an array
            $event_file_list = $this->_make_event_file_list_array($event_file_list);

        }

        // require that the user confirms the action
        if (!isset($event_confirm)) {

            // SET error
            $this->error .= "_restore_efax_file => need to set event_confirm";
            $this->gui_message .= "Please confirm the \"restore\" action<BR>\n";

            // return TRUE so that the $event_confirm can be set
            return TRUE;
        }

        //loop through the $event_file_list array
        foreach ($event_file_list as $current_efax_file => $current_efax_page) {

            // copy $current_efax_file to MRI_EFAX_FILE_DIR
            $event_stat = $this->copy_file($this->path_to_efax_file.$current_efax_file,MRI_EFAX_FILE_DIR.$current_efax_file);
          
            if ($event_stat == FALSE) {
            
                // append to error from copy_file()
                $this->error .= "_restore_efax_file()=>unable to copy ";
                $this->error .= $this->path_to_efax_file.$current_efax_file." to ".MRI_EFAX_FILE_DIR."\n";
                $this->gui_message .= "failed to copy $this->path_to_efax_file.$current_efax_file to ".MRI_EFAX_FILE_DIR;

                return FALSE;
            }
            unset($event_stat);

            // remove original file
            $event_stat = $this->delete_file($this->path_to_efax_file.$current_efax_file);
          
            if ($event_stat == FALSE) {

                // append to error from delete_file()
                $this->error .= "_restore_efax_file()=>unable to delete $current_efax_file from ".$this->path_to_efax_file." \n";
                $this->gui_message .= "failed to delete original $current_efax_file";
            
                // remove copied file
                $event_stat = $this->delete_file(MRI_EFAX_FILE_DIR.$current_efax_file);
            
                if ($event_stat == FALSE) {

                    // append to error from delete_file()
                    $this->error .= "_restore_efax_file()=>unable to delete $current_efax_file from ".MRI_EFAX_FILE_DIR." \n";
                    $this->gui_message .= "failed to delete copied $current_efax_file";
                }

                return FALSE;
            }
            unset($event_stat);

            
            // remove this element from the array
            unset($event_file_list[$current_efax_file]);
        }


        // return false here to unset $event_confirm
        return FALSE;
    }


    /**
     * assigns efaxed file page to the candidate profile/visit or date_scan for non-candidate scans
     *
     * this function assigns an efax file and registers it in the database table mri_efax_parameter_form
     * it handles various types of scans and set values to different fields accordingly.
     *
     * @param  array   $event_file_list - array of unassigned efax files w/o path marked for
     *                                    deletion, with structure:
     *                                    $event_file_list[file_name] = efax_page
     * @param  bool    $event_confirm   - boolean that checks if the event has been confirmed before executing
     * @param  string  $userID          - field users.UserID
     * @param  int     $user_centerID   - user's study site psc.CenterID => users.CenterID
     * @param  array   $filter          - array with form data
     * @param  string  $efax_page       - [optional] page number of the efax to assign (in case it's not passed as array)
     * @access private
     * @return bool
     */
    function _assign_efax_file(&$event_file_list, $event_confirm, $userID, $user_centerID, $filter, $efax_page='')
    {
        /**
         * CHECK args passed by the form
         * non-subject scan must have a valid centerID and date of acquisition and both were tested above
         * subject scan must have a valid set of CandID(tested), VisitNo, ID_session (if applicable), and date of acquistion (tested)
         */
        // check if $event_file_list contains at least one file
        if (empty($event_file_list)) {
          
            // set error
            $this->error .= "_assign_efax_file()=>No files in $event_file_list";
            $this->gui_message .= " You must selected at least one file<BR>\n";
            return FALSE;
        }

        // test if $event_file_list is an array
        if (!is_array($event_file_list)) {
            // make an array
            $event_file_list = $this->_make_event_file_list_array($event_file_list);
        }

        // check if $centerID is passed, it's popup menu, so only check for empty()
        if (empty($filter["m.CenterID"])) {

            $this->error .= "_assign_efax_file()=>No study site selected filter['m.CenterID']";
            $this->gui_message .= "Please select the Study Site<BR>\n";           
            return FALSE;

        }

        // VisitNo has to be entered
        if (empty($filter["m.Scan_category"])) {
            
            $this->error .= "_assign_efax_file()=>No Scan_category selected filter['m.Scan_category']";
            $this->gui_message .= "Please select a Scan Class<BR>\n";           
            return FALSE;
        }

        // date the date of acquisition
        if (checkdate($filter["month"],$filter["day"],$filter["year"]) == FALSE) {

            // set error
            $this->error .= "_assign_efax_file()=>invalid date of acquisition: $filter[month],$filter[day],$filter[year]";
            $this->gui_message .= "Please enter a valid Date of Scan<BR>\n";
            return FALSE;
        }

        if ($filter["m.Scan_category"] != 'subject') {

            // get MRI_alias from psc table for selected $centerID to set the $core_path
            // set variable: $center_mri_alias
            $query = "SELECT MRI_alias FROM psc WHERE CenterID = '".$filter["m.CenterID"]."'";
            $qid = do_query($query);
            if ($qid == FALSE) {
                $this->error .= "_assign_efax_file()=>SELECT failed".mysql_error()."\n";
                $this->gui_message .= "Failed to verify study site information, please try again<BR>\n";
                return FALSE;
            } else {
                // get MRI_Alias
                while ($row = mysql_fetch_array($qid,MYSQL_ASSOC)) {
                    $center_mri_alias = $row["MRI_alias"];
                }
            }
            unset($row);
            mysql_free_result($qid);

            // for non-subject scans
            $filter["m.CandID"]=0;
            $filter["m.VisitNo"] = 0;
            $filter["m.ID_session"] = 0;

        } else {

            // CandID has to be entered
            if (empty($filter["m.CandID"])) {

                $this->error .= "_assign_efax_file()=>No Candidate selected filter['m.CandID']";
                $this->gui_message .= "Please enter a valid DCCID<BR>\n";           
                return FALSE;
            }

            // VisitNo has to be entered
            if (empty($filter["m.VisitNo"])) {

                $this->error .= "_assign_efax_file()=>No Time Point selected filter['m.VisitNo']";
                $this->gui_message .= "Please select a Time Point<BR>\n";           
                return FALSE;
            }

            // select ID_session and Date_visit for the passed CandID and VisitNo
            $my_candidate = $this->_get_candidate_data($user_centerID, $filter["m.CandID"], $filter["m.VisitNo"]);

            if ($my_candidate === FALSE) {
                // preserve error
                $this->gui_message = "Unable to get time point data for selected candidate";
                return FALSE;
            } elseif ($my_candidate == 0) {
                $filter["m.Date_visit"] = 0;
                $filter["m.ID_session"] = 0;
            } else {
                $filter["m.Date_visit"] = $my_candidate[0]["Date_visit"];
                $filter["m.ID_session"] = $my_candidate[0]["ID_session"];
            }
            unset($my_candidate);

            // acquisition date CANNOT be less than date of visit (in case of non-started visit ignore)
            // create dates
            $my_date = strtotime($filter["year"]."-".$filter["month"]."-".$filter["day"]);
            $set_date = strtotime($filter["m.Date_visit"]);
            // compare the dates
            if ($my_date < $set_date && $filter["m.Date_visit"]>0) {

                // set error
                $this->error .= "_assign_efax_file()=>date of acq [$my_date] is before date of visit [$set_date]";
                $this->gui_message .= "Date of acquisition cannot happen before the date of visit<BR>\n";
                return FALSE;
            }
            // unset vars
            unset($my_date);
            unset($set_date);
        }

        // set $core_path according to the scan category
        switch($filter["m.Scan_category"]) {

        case "subject":
            // set core path as a part of a path to efax file
            $core_path = $filter["m.CandID"];
            break;

        case "mritest":
        case "living_phantom":
            //set core path
            $core_path = $filter["m.Scan_category"]."/".$center_mri_alias;
            break;

        case "phantom":
            // set core path
            $core_path = "ACRQC"."/".$center_mri_alias;
            break;

        }


        // require that the user confirms the action
        if (!isset($event_confirm)) {

            // SET error
            $this->error .= "_assign_efax_file()=> need to set event_confirm";
            $this->gui_message .= "Please confirm the \"assign\" action<BR>\n";

            // return TRUE so that the $event_confirm can be set
            return TRUE;
        }

        /**
         * assign efaxes
         */
        //loop through the $event_file_list array
        foreach ($event_file_list as $current_efax_file => $current_efax_page) {

            // check that dir MRI_EFAX_ASSIGNED_FILE_DIR.$core_path does exist
            if ($this->is_sane(MRI_EFAX_ASSIGNED_FILE_DIR.$core_path, 1, 1) === FALSE) {
                // make dir (ignore $this->error for now...)
                $event_stat = mkdir(MRI_EFAX_ASSIGNED_FILE_DIR.$core_path, 0775);
                
                if ($event_stat == FALSE) {
                    
                    // append to error from copy_file()
                    $this->error .= "_assign_efax_file()=>unable to create directory: ".MRI_EFAX_ASSIGNED_FILE_DIR.$core_path."\n";
                    $this->gui_message  = "failed to create directory: ".MRI_EFAX_ASSIGNED_FILE_DIR.$core_path."/<BR>\n";
                    return FALSE;
                }
                unset($event_stat);
            }

            // copy $current_efax_file to MRI_EFAX_ASSIGNED_FILE_DIR
            $event_stat=$this->copy_file($this->path_to_efax_file.$current_efax_file,MRI_EFAX_ASSIGNED_FILE_DIR.$core_path."/".$current_efax_file);
          
            if ($event_stat == FALSE) {
            
                // append to error from copy_file()
                $this->error .= "_assign_efax_file()=>unable to copy ";
                $this->error .= $this->path_to_efax_file.$current_efax_file." to ".MRI_EFAX_ASSIGNED_FILE_DIR.$core_path."/"."\n";
                $this->gui_message  = "failed to copy $this->path_to_efax_file$current_efax_file to ";
                $this->gui_message .= MRI_EFAX_ASSIGNED_FILE_DIR.$core_path."/<BR>\n";
                return FALSE;
            }
            unset($event_stat);


            // INSERT DB record into mri_efax_parametere_form
            $query = "INSERT INTO mri_efax_parameter_form (
                      ID, CenterID, Scan_category,
                      CandID, VisitNo, ID_session, 
                      Acquisition_date, 
                      Data_path, Status, Core_path, File_name, 
                      Efax_page, Sent_by, UserID, Date_taken, Testdate, Comment) 
                      VALUES (
                      NULL, '".$filter["m.CenterID"]."', '".$filter["m.Scan_category"]."',
                      '".$filter["m.CandID"]."', '".$filter["m.VisitNo"]."', '".$filter["m.ID_session"]."', 
                      '".$filter["year"]."-".$filter["month"]."-".$filter["day"]."', 
                      '".DATA_PATH_DIR."', 'efaxes', '$core_path', '$current_efax_file', '$current_efax_page',
                      '".$filter["m.Sent_by"]."', '$userID', '".$this->mri_efax_event_date."', NULL, '".$filter["m.Comment"]."')
                 ";

            $qid = mysql_query($query);

            if ($qid == FALSE) {

                // set error
                $this->error .= "_assign_efax_file()=>INSERT failed: ".mysql_error()."\n";
                $this->gui_message .= "failed to INSERT DB record for [$current_efax_file] page: [$current_efax_page]";

                // remove copied file
                $event_stat = $this->delete_file(MRI_EFAX_ASSIGNED_FILE_DIR.$core_path."/".$current_efax_file);
            
                if ($event_stat == FALSE) {

                    // append to error from delete_file()
                    $this->error .= "unable to delete $current_efax_file from ".MRI_EFAX_ASSIGNED_FILE_DIR.$core_path."/\n";
                    $this->gui_message .= "failed to delete copied $current_efax_file<BR>\n";
                }
            
                return FALSE;
            }


            // remove original file
            $event_stat = $this->delete_file($this->path_to_efax_file.$current_efax_file);
          
            if ($event_stat == FALSE) {

                // append to error from delete_file()
                $this->error .= "unable to delete $current_efax_file from ".$this->path_to_efax_file." \n";
                $this->gui_message .= "failed to delete original $current_efax_file<BR>\n";
            
                // DELETE DB record
                $query = "DELETE FORM mri_efax_parameter_form WHERE ID = last_insert_id()";
                $qid = mysql_query($query);

                if ($qid == FALSE) {
                    // append to error
                    $this->error .= "=>DELETE failed: ".mysql_error()."\n";
                    $this->gui_message .= "failed to DELETE DB record for [$current_efax_file] page: [$current_efax_page]<BR>\n";
                }

                // remove copied file
                $event_stat = $this->delete_file(MRI_EFAX_ASSIGNED_FILE_DIR.$core_path."/".$current_efax_file);
            
                if ($event_stat == FALSE) {
                    // append to error from delete_file()
                    $this->error .= "unable to delete $current_efax_file from ".MRI_EFAX_ASSIGNED_FILE_DIR.$core_path."/\n";
                    $this->gui_message .= "failed to delete copied $current_efax_file";
                }

                return FALSE;
            }

            // remove this element from the array
            unset($event_file_list[$current_efax_file]);
        }

        // return false here to unset $event_confirm
        return FALSE;
    }



    /**
     * selects DB records for assigned efax pages
     *
     * this function selects efax page data from mri_efax_parameter_form table
     * NOTE: 0 rows are allowed.
     *
     * @param   int     $user_centerID from users.CenterID table
     * @param   string  $scan_category from mri_efax_parameter_form.Scan_category field
     * @param   int     $user_centerID   - user's study site psc.CenterID => users.CenterID
     * @access  private
     * @see     do_query()
     * @return array    $efax_list array of selected table data
     */
    function _select_efax_page($query_where, $query_order, $user_centerID)
    {
        // set default limit and offset in case none are saved in the object
        if (empty($this->select_efax_limit)) $this->select_efax_limit = 0;
        if (empty($this->select_efax_offset)) $this->select_efax_offset = 50;

        // construct SELECT query
        $query  = " SELECT
                   p.Name as Site,
                   m.Scan_category as Class,
                   m.CandID as DCCID,
                   c.PSCID as PSCID,
                   m.VisitNo AS Time_Point,
                   s.Objective as Obj,
                   m.Acquisition_date as Scan_date,
                   m.Efax_page AS Page,
                   CONCAT_WS('/', m.Data_path, m.Status, m.Core_path, m.File_name) AS File,
--                   m.Sent_by as Sent_by,
                   m.UserID as User,
                   m.Date_taken as Assigned,
                   m.Comment as Comment,
                   m.File_name as File_name,
                   m.ID_session as ID_session,
                   m.ID as EfaxID
                  FROM
                   mri_efax_parameter_form as m LEFT JOIN candidate as c USING (CandID) LEFT JOIN session as s ON (m.ID_session = s.ID), psc as p
                  WHERE
                   $query_where AND m.CenterID = p.CenterID
                  ";        
        if (!is_dcc()) $query .= " AND m.CenterID = '$user_centerID'";
        $query .= " ORDER BY $query_order";
        $query .= " LIMIT ".$this->select_efax_limit.", ".$this->select_efax_offset;

        // execute the query
        $qid = do_query($query, FALSE, TRUE);

        if ($qid == FALSE) {
            // set error property for debugging
            $this->error .= "_select_efax_page=>SELECT failed: " . mysql_error() . "\n";
            $this->gui_message .= "Failed to select assigned parameter forms from the database, please register this bug in Mantis:<BR>\"".$this->error."\"\n";
            return FALSE;
        }

        if (mysql_num_rows($qid) == 0) {
            // if 0 rows, return TRUE
            $this->error .= "_select_efax_page=>SELECT: 0 rows returned";
            $this->gui_message .= "No assigned parameter forms available";
            return FALSE;
        }

        // construct an array w/ result set
        while ($row = mysql_fetch_array($qid, MYSQL_ASSOC)) {
            $efax_list[] = $row;
        }
        return $efax_list;
    }


   /**
     * turns $event_file_list into a correctly structured array
     *
     * this function construct an array in case $event_file_list was
     * passed as a string. This is necessary b/c all other functions
     * are set to work with arrays. In case $event_file_list is a
     * string, than it is passed as a $key, and value as $val.
     *
     * @param  string  $key - $event_file_list string
     * @param  string  $val - vaue for $key
     * @access private
     * @return array
     *
     */
    function _make_event_file_list_array($key, $val = '')
    {
        if (empty($val)) $val = 'n/a';

        // make an array
        $event_file_list[$key] = array($val);

        return $event_file_list;
    }

   /**
     * selects candidate data from the database
     *
     * this function sleect basic candidate data from the database to
     * be used in selection forms. Returns FALSE in case of error, but
     * allows 0 rows - returns 0
     *
     * @param  string  $user_centerID
     * @param  string  $candID - field mri_efax_parameter_form.CandID (FKey to candidate.CandID)
     * @param  int     $visitNo - field mri_efax_parameter_form.visitNo (FKey to session.VisitNo)
     * @access private
     * @see    do_query()
     * @see    is_dcc()
     * @return array
     *
     */
    function _get_candidate_data($user_centerID, $candID, $visitNo='')
    {
        // 
        $query = "SELECT c.CandID, c.CenterID, s.VisitNo, s.Date_visit, s.ID as ID_session 
                  FROM candidate as c LEFT JOIN session as s USING (CandID) 
                  WHERE c.CandID = '$candID'";
        if (!empty($visitNo)) $query .= " AND VisitNo = '$visitNo'";
        if (!is_dcc()) $query .= " AND c.CenterID = '$user_centerID'";
        $query .=" ORDER BY VisitNo";
        
        $qid = do_query($query, FALSE, TRUE);

        if ($qid == FALSE) {

            $this->error .= "_get_candidate_data()=>failed SELECT: ".mysql_error()."\n";
            return FALSE;

        } elseif(mysql_num_rows($qid)==0) {

            $this->error .= "_get_candidate_data()=>SELECT: 0 rows returned\n";
            return 0;
            
        } else {

            $i=0;
            while ($row = mysql_fetch_array($qid, MYSQL_ASSOC)) {
                foreach ($row as $key=>$val) {
                    $filter[$i][$key] = $val;
                }
                $i++;
            }
        }
        return $filter;
    }


    /**
     * makes WHERE string for an SQL statement
     *
     * this function constructs a WHERE string to be used with SQL
     * statement when selecting, inserting or updating database
     * records. It takes values from the $filter array, which contains
     * candidate data from the html form. It also checks if the Date
     * of scan is valid - if not it does not include the date into the
     * WHERE
     *
     * @param  array   $filter - and array with candidate data
     * @access private 
     * @return string
     */
    function _make_where_from_array($filter) {
        // changed from empty to is_array
        if(!is_array($filter)) return 1;
        foreach($filter AS $key=>$val) {
            if(empty($val)) continue;
            if ($key !='year' && $key != 'month' && $key !='day') {
                if(is_array($val)) {
                    $retval .= empty($retval) ? '' : ' OR ';
                    $retval .= "(".$this->_make_where_from_array($val).")";
                } else {
                    $retval .= empty($retval) ? '' : ' AND ';
                    $retval .= "$key='$val'";
                }
            }
        }
        // set the date
        if (checkdate($filter['month'], $filter['day'], $filter['year']) !== FALSE) { 
            $retval .= empty($retval) ? '' : ' AND ';
            $retval .= "Acquisition_date = '$filter[year]-$filter[month]-$filter[day]'";
        }

        if(empty($retval)) $retval = '1';
        return $retval;
    }

    /**
     * makes ORDER string for an SQL statement
     *
     * this function constructs an ORDER string to be used with SQL
     * statement when selecting database records. It takes values from
     * the $order array
     *
     * @param  array   $order - and array with fields
     * @access private 
     * @return string
     */
    function _make_order_from_array($order) {
        return join(',', $order);
    }



    /**
     * display HTML form & table with new efax pages
     *
     * this function shows the recordslist of files returned by the
     * _list_files_in_directory() function
     * the lists files in MRI_EFAX_ASSIGNED_FILE_DIR, with URL links
     * to view the efax page and checkbox to select efax page for
     * assignment, restoration, or deletion.
     *
     * @param   array  $base_filter      - array with Get Data form data
     * @param   array  $filter           - array with form data
     * @param   array  $event_file_list  - array with select form data
     * @param   string $event_type       - define event to execute (eg. delete_efax_file)
     * @param   bool   $event_confirm    - boolean that checks if the event has been confirmed before executing
     * @param   string $userID           - field users.UserID
     * @param   int    $user_centerID    - users.CenterID field (FKey to psc.CenterID)
     * @access  public
     * @see     _assign_efax_file()
     * @see     _delete_efax_file()
     * @see     _restore_efax_file()
     * @see     _list_files_in_directory()
     * @see     is_dcc()
     * @see     submit_button()
     * @see     make_select
     * @see     useColor()
     * @return void
     */
    function manage_efax_files_HTML($base_filter, $filter, $event_file_list, $event_type, $event_confirm, $userID, $user_centerID)
    {
        // set page submit button vals
        switch ($this->mri_efax_screen) {
         
        case 'New':
            $submit_value1 = 'delete';
            $submit_value2 = 'assign';
            break;

        case 'Unassigned':
            $submit_value1 = 'delete';
            $submit_value2 = 'restore';
            break;

        case 'Assigned':
        default:
            return FALSE;
            break;
        }


        /**
         * $event_type switch to determine what to do with submitted data
	 * if nothin, then test for Get Data - $base_filter array
         */ 
        switch ($event_type) {

            // assign new efax files
        case "assign":            
            $event_confirm = $this->_assign_efax_file($event_file_list, $event_confirm, $userID, $user_centerID, $filter);
            break;

            // move un-assigned efax file to new bin
        case "restore":
            $event_confirm = $this->_restore_efax_file($event_file_list, $event_confirm);
            break;

            // delete new or un-assigned efax file
        case "delete":
            $event_confirm = $this->_delete_efax_file($event_file_list, $event_confirm);
            break;

        default:
            // $event_type is not set
            if ($base_filter["GetData"] == 'Get Data') {

                // unset form data
                unset($filter);

                if (empty($base_filter['m.Scan_category'])) {

                    $this->gui_message .= "Please select Scan Class.";
                    $error_exists = 1;

                } else {

                    if ($base_filter['m.Scan_category'] != 'subject') {

                        // for non-candidate subjects, ignore DCCID, just map Scan_category to $filter
                        unset($base_filter['m.CandID']);

                    } else {

                        if (empty($base_filter['m.CandID'])) {

                            // for subject scan CandID need to be set
                            $this->gui_message .= "Please enter the DCCID.<BR>\n";
                            $error_exists = 1;

                        } else {
                        
                            // get the data for CandID, if invalid return FALSE
                            $filter_arr = $this->_get_candidate_data($user_centerID, $base_filter["m.CandID"]);

                            if ($filter_arr == FALSE) {

                                // preserve error
                                $this->gui_message .= "Please enter a valid DCCID.<BR>\n";
                                $error_exists = 1;
                            
                            } elseif ($filter_arr == 0) {

                                $this->gui_message .= "Please enter a valid DCCID.<BR>\n";
                                $filter['m.CandID'] = 0;
                                $error_exists = 1;

                            } else {

                                // map the multidim $filter_arr into $filter for all common elements (except VisitNo & ID_session)
                                $filter["m.CenterID"] = $filter_arr[0]["CenterID"];
                                $filter['m.CandID'] = $filter_arr[0]["CandID"];
                            }
                        }
                    }

                    $filter["m.Scan_category"] = $base_filter['m.Scan_category'];
                }
            }
            break;
        }

        // get candidate visit data for subject scans
        if ($filter["m.Scan_category"] == 'subject' && !empty($filter["m.CenterID"]) && !($base_filter["GetData"] == 'Get Data')) {

            // get the data for CandID, if invalid return FALSE
            $filter_arr = $this->_get_candidate_data($user_centerID, $base_filter["m.CandID"]);

            if (!is_array($filter_arr)) {

                // preserve error
                $this->gui_message .= "Please enter a valid DCCID.<BR>\n";
                $error_exists = 1;

            }
        }

        /**
         * start HTML display
         */
        // title table
        echo "<table border=0 cellspacing=1 cellpadding=2 align='center' valign='top' width='100%'>\n";
        //title row
        echo "<TR bgColor='#D3DCE3'>\n";
        echo "<TH colspan='$colspan'><FONT size=-1>$this->mri_efax_page_title</FONT></TH>\n";
        // end title table
        echo "</TR></TABLE>\n";

        // start the form
        echo "<FORM>\n";

        if ($this->mri_efax_screen == 'New') {
            // site/candidate/visit selection form table
            echo "<TABLE border=0 cellspacing=1 cellpadding=2 align='center' valign='top' width='100%'>\n";
            echo "<TR>\n";
            echo "<TD colspan='$colspan'><FONT size=-1>\n";

            // get data table
            print "<table><tr>\n";
            // message
            print "<td colspan=2><font color='blue' size='-1'>1. Select a Scan Class. Insert DCCID for a subject scan.</font></td>\n";
            print "</tr><tr>\n";
            // candID
            print "<td><font size='-1'>DCCID: <input type='text' name='base_filter[m.CandID]' size=6 maxlength=6 value='".$base_filter['m.CandID']."'></font></td>\n";
            // scan category
            print "<td><font size='-1'>Scan Class: <select name='base_filter[m.Scan_category]'>\n";
            print "<option value='subject' ".($base_filter['m.Scan_category']=='subject' ? 'selected' : '').">subject</option>\n";
            print "<option value='phantom' ".($base_filter['m.Scan_category']=='phantom' ? 'selected' : '').">phantom</option>\n";
            print "<option value='living_phantom' ".($base_filter['m.Scan_category']=='living_phantom' ? 'selected' : '').">living_phantom</option>\n";
            print "<option value='mritest' ".($base_filter['m.Scan_category']=='mritest' ? 'selected' : '').">mritest</option>\n";
            print "</select>\n";
            print "</font></td>\n";
            // submit button Get Data
            print "<td><font size='-1'><input type='Submit' name='base_filter[GetData]' value='Get Data'></font></td>\n";
            print "</tr></table>\n\n";
        

            if (!empty($filter["m.Scan_category"]) && empty($error_exists)) {

                // table with $filter data
                print "<table cellpadding=2 cellspacing=2><tr>\n";
                // message
                print "<td colspan=3><font color='blue' size='-1'>2. Select a Visit (subject scan only) and enter a Scan date.</font></td>\n";
                print "</tr><tr>\n";
                // site
                $query  = " SELECT p.Name, p.MRI_alias, p.CenterID FROM psc as p WHERE p.MRI_alias<>''";
                if ($filter["m.Scan_category"] == 'subject') {
                    $query .=" AND CenterID = '".$filter["m.CenterID"]."'";
                }
                if (!is_dcc()) {
                    $query .=" AND CenterID = '$user_centerID'";
                }
                $query .=" ORDER BY Name";
                $qid = do_query($query);
                
                if ($qid == FALSE) {
                    $this->error .= "manage_efax_files_HTML()=>".mysql_error()."\n";
                    $this->gui_message .= "failed to display selection form<BR>Please add a bug in Mantis and copy the following error message:<BR>$this->error\n";
                    echo "<td>$this->gui_message</td></form></tr></table>";
                    return FALSE;
                } else {
                    print "<td><font size='-1'>PSC: ";
                    print "<select name='filter[m.CenterID]'>\n";
                    if (is_dcc() && $filter["m.Scan_category"] != 'subject') print "<option value=''>&nbsp;</option>\n";
                    while($row = mysql_fetch_array($qid)) {
                        // changed from MRI_alias to CenterID
                        $selected = ($row['Name']==$filter['p.Name'] || $row["CenterID"]==$filter["m.CenterID"])  ? 'selected' : '';
                        print "<option value='$row[CenterID]' $selected>$row[Name]</option>\n";
                    }
                    print "</select>\n";
                }
                print "</font></td>\n";

                // scan date
                print "<td><font size='-1'>Scan Date: \n";
                $today = getdate(time());
                make_select('filter[year]', array_merge(array('Year'), range(2001, $today['year'])), $filter["year"]);
                make_select('filter[month]', array_merge(array('Month'), range(1,12)), $filter["month"], array('Month', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'));
                make_select('filter[day]', array_merge(array('Day'), range(1,31)), $filter["day"]);
                print "</font></td>\n";


                if ($filter["m.Scan_category"] == 'subject') {

                    // visitno
                    print "<td><font size='-1'>Visit: <select name='filter[m.VisitNo]'>\n";
                    print "<option value=''>&nbsp;</option>\n";
                    foreach ($filter_arr as $index=>$current_filter) {
                        $j=$index+1;
                        print "<option value='$current_filter[VisitNo]' ".($filter['m.VisitNo']==$current_filter["VisitNo"] ? 'selected' : '').">";
                        print $current_filter["VisitNo"] . " as of: " . $current_filter["Date_visit"] . " (" . $current_filter["ID_session"] . ")";
                        print "</option>\n";
                        print "<INPUT TYPE='HIDDEN' NAME='filter[m.ID_session".$j."]' VALUE='".$current_filter["ID_session"]."'>\n";
                        print "<INPUT TYPE='HIDDEN' NAME='filter[m.Date_visit".$j."]' VALUE='".$current_filter["Date_visit"]."'>\n";
                    }
                    unset($j);
                    for ($index=$index+2; $index<=NUM_VISITS; $index++) {
                        print "<option value='$index' ".($filter['m.VisitNo']==$index ? 'selected' : '').">$index</option>\n";
                        print "<INPUT TYPE='HIDDEN' NAME='filter[m.ID_session$index]' VALUE='0'>\n";
                        print "<INPUT TYPE='HIDDEN' NAME='filter[m.Date_visit$index]' VALUE='".$current_filter["Date_visit"]."'>\n";
                    }
                    print "</select>\n";
                    print "</font></td>\n";
                
                    // hidden vars for subject scans
                    print "<INPUT TYPE='HIDDEN' NAME='filter[m.CandID]' VALUE='".$filter["m.CandID"]."'>\n";
                }

                //comment
                print "</tr><tr>\n";
                print "<td colspan='3'><font size='-1'>Comment: <INPUT TYPE='TEXT' size=40 NAME='filter[m.Comment]' VALUE='".$filter["m.Comment"]."'></font></td>\n";
                // sent by 
                print "</tr><tr>\n";
                print "<td colspan='3'><font size='-1'>Sent By: <INPUT TYPE='TEXT' size=40 NAME='filter[m.Sent_by]' VALUE='".$filter["m.Sent_by"]."'></font></td>\n";
            
                // hidden vars for all non-subject scans
                print "<INPUT TYPE='HIDDEN' NAME='filter[m.Scan_category]' VALUE='".$filter["m.Scan_category"]."'>\n";

                // message
                print "</tr><tr>\n";
                print "<td colspan='3'><font color='blue' size='-1'>3. Select the file(s) to assign.</font></td>\n";
                print "</tr></table>\n\n";
            }

            echo "</FONT></TD>\n";
            // blank row
            echo "<TR bgColor='#D3DCE3'>\n";
            echo "<TD colspan='$colspan'><FONT size=1>&nbsp</FONT></TD>\n";
            echo "</TR></TABLE>\n";
        }

        // unset vars
        if ($base_filter["GetData"] == 'Get Data') {
            unset($event_file_list);
            unset($event_confirm);
            unset($event_type);
        }

        // get the list of efax pages returned by the SELECT query
        $efax_list = $this->_list_files_in_directory($this->path_to_efax_file);

        // GUI MESSAGE table
        echo "<table border=0 cellspacing=1 cellpadding=2 align='center' valign='top' width='100%'>\n";
        echo "<TR>\n";
        echo "<TD><FONT size=-1 color='blue'>MSG: ".$this->gui_message."</FONT></TD>\n";
        if (is_super_user()) {
            // debugging
            echo "</TR><TR>\n";
            echo "<TD><FONT size=-1 color='red'>error: ".$this->error."</FONT></TD>\n";
        }
        // end title table
        echo "</TR></TABLE>\n";


        // if not array set to FALSE
        // check if $event_file_list contains at least one file
        if ($efax_list == FALSE) {
          
            // append to error
            $this->error  .= "manage_efax_files_HTML()=>No files in ".$this->path_to_efax_file;
            $this->gui_message .= "There are no unassiged efax pages<BR>\n";

            // if FALSE is returned print out the error screen
            echo "<table border=0 cellspacing=1 cellpadding=2 align='center' valign='top' width='100%'>\n";
            echo "<TR bgColor='#D3DCE3'>\n";
            echo "<TH><FONT size=-1>".$this->gui_message."</FONT></TH>\n";
            echo "</FORM></TR></TABLE>\n";

            return;

        } else {

            //  count the columns in the table
            $colspan = 3;

            // start the table
            echo "<table border=0 cellspacing=1 cellpadding=2 align='left' valign='top'>\n";

            // blank row
            echo "<TR bgColor='#D3DCE3'>\n";
            echo "<TD colspan='$colspan' width='400'><FONT size=1>&nbsp</FONT></TD>\n";

            // print out column titles row
            echo "</TR><TR bgColor = '#D3DCE3'>\n";
            // 1st cell is a "delete" column title
            echo "<TH><FONT size=-1>Select File</FONT></TH>\n";
            echo "<TH><FONT size=-1>File Name</FONT></TH>\n";
            echo "<TH><FONT size=-1>Page No.</FONT></TH>\n";

            // print row with DELETE and ASSIGN submit buttons
            echo "</TR><TR bgColor = ".useColor().">\n";
            echo "<TD ALIGN='center'><FONT size=-1><NOBR>";
            submit_button(FALSE, "event_type", $submit_value2);
            echo "</NOBR></FONT></TD>\n";
            echo "<TH><FONT size=-1><NOBR><= selected files =></NOBR></FONT></TH>\n";
            echo "<TD ALIGN='center'><FONT size=-1><NOBR>";
            echo "&nbsp;";
            echo "</NOBR></FONT></TD>\n";

            // print out data rows
            foreach($efax_list as $current_efax_file) {

                // extract page number from $current_efax_page
                if(substr($current_efax_file,strpos($current_efax_file, '.')+1,1) != "j") {
                    $current_efax_page = substr(basename($current_efax_file,".jpg"),strpos(basename($current_efax_file,".jpg"),'.')+1);
                } else {
                    $current_efax_page = 'n/a';
                }
                
                // print record row(s)
                echo "</TR><TR bgColor = ".useColor().">\n";

                // 1st cell is the "delete" checkbox
                echo "<TD align='center'><FONT size=-1><NOBR>";
                echo "<INPUT TYPE='CHECKBOX' NAME='event_file_list[$current_efax_file]' VALUE='$current_efax_page' ";
                if ($event_file_list[$current_efax_file] == $current_efax_page) {
                    echo "CHECKED";
                }
                echo ">\n";
                echo "</NOBR></FONT></TD>\n";

                // display file name
                echo "<TD><FONT size=-1>$current_efax_file</FONT></TD>\n";

                // display efax page 
                echo "<TD align='center'><FONT size=-1><NOBR>\n";
                echo "<a href=\"javascript:pop_me_up('mri/efax/view_files.php?file=".$this->path_to_efax_file.$current_efax_file."', 'mri_efax_view', 'resizable=1,width=650,scrollbars=yes,toolbar=yes')\">";
                echo $current_efax_page;
                echo "</a></NOBR></FONT></TD>\n";
            }

            // print row with DELETE and ASSIGN submit buttons
            echo "</TR><TR bgColor = ".useColor().">\n";
            echo "<TD ALIGN='center'><FONT size=-1><NOBR>";
            submit_button(FALSE, "event_type", $submit_value2);
            echo "</NOBR></FONT></TD>\n";
            echo "<TH><FONT size=-1><NOBR><= selected files =></NOBR></FONT></TH>\n";
            echo "<TD ALIGN='center'><FONT size=-1><NOBR>";
            submit_button(FALSE, "event_type", $submit_value1);
            echo "</NOBR></FONT></TD>\n";

            // hidden vars
            echo "<INPUT TYPE='hidden' NAME='mri_efax_screen' VALUE='".$this->mri_efax_screen."'>";

            // pass confirm var
            if ($event_confirm === TRUE) {
                echo "<INPUT TYPE='hidden' NAME='event_confirm' VALUE='$event_confirm'>";
            }

            // end form
            echo "</FORM>\n";

            // end table
            echo "</TR></TABLE>";

        }

        return;
    }



    /**
     * display HTML form & table with assigned efax pages (DB records)
     *
     * this function shows the records returned by the
     * _select_efax_page() function.
     * It lists the efaxes in the DB, with URL links to view the efax
     * page and checkbox to select efax page for unassignment or
     * editing.
     *
     * @param   array  $filter             - array with form data
     * @param   array  $event_file_list    - array with select form data
     * @param   string $event_type         - define event to execute (eg. delete_efax_file)
     * @param   bool   $event_confirm      - boolean that checks if the event has been confirmed before executing
     * @param   string $userID             - field users.UserID
     * @param   int    $user_centerID      - users.CenterID field (FKey to psc.CenterID)
     * @param   int    $select_efax_limit  - LIMIT for the SQL SELECT statement
     * @param   int    $select_efax_offset - OFFSET for the SQL SELECT statement
     * @access  public
     * @see     _unassign_efax_file()
     * @see     _select_efax_page()
     * @see     selection_filter_HTML()
     * @see     _fix_wrong_dates()
     * @see     _make_where_from_array()
     * @see     _make_order_from_array()
     * @see     prev_next_button()
     * @see     is_dcc()
     * @see     is_super_user()
     * @see     submit_button()
     * @return  void
     */
    function manage_efax_files_in_DB_HTML($filter, $event_file_list, $event_type, $event_confirm, $userID, $user_centerID, $select_efax_limit='', $select_efax_offset='')
    {
        // set page submit button vals
        switch ($this->mri_efax_screen) {
         
        case 'Assigned':
            $submit_value1 = 'unassign';
            break;

        case 'Unassigned':
        case 'New':
        default:
            return FALSE;
            break;
        }


        /**
         * $event_type switch to determine what 
         */ 
        switch ($event_type) {

	  //  unassign efax files
        case "unassign":
            $event_confirm = $this->_unassign_efax_file($event_file_list, $event_confirm);
            break;
        }


        // define new limit and offset for the SELECT query
        if (!empty($select_efax_limit))  $this->select_efax_limit  = $select_efax_limit;
        if (!empty($select_efax_offset)) $this->select_efax_offset = $select_efax_offset;



        /**
         * start HTML display
         */
        // title table
        echo "<table border=0 cellspacing=1 cellpadding=2 align='center' valign='top' width='100%'>\n";
        // debugging temporary
        echo "<TR>\n";
        echo "<TD><FONT size=-1 color='red'>error: ".$this->error."</FONT></TD>\n";
        echo "</TR><TR>\n";
        echo "<TD><FONT size=-1 color='blue'>MSG: ".$this->gui_message."</FONT></TD>\n";
        //title row
        echo "<TR bgColor='#D3DCE3'>\n";
        echo "<TH colspan='$colspan'><FONT size=-1>".$this->mri_efax_page_title."</FONT></TH>\n";
        // end title table
        echo "</TR></TABLE>\n";


        // selection form table
        echo "<table border=0 cellspacing=1 cellpadding=2 align='center' valign='top' width='100%'>\n";
        echo "<TR>\n";
        // start the form
        echo "<FORM>\n";
        // site/candidate/visit selection form fields
        echo "<TD colspan='$colspan'><FONT size=-1>\n";
        $this->selection_filter_HTML($filter, $user_centerID);
        echo "</FONT></TD>\n";
        echo "</TR></TABLE>\n";

        /**
         * prevent table from displaying data
         */
        if (!is_array($filter)) {
            
            // if outside the candidate profile (is dcc) then don't display records until selection is made
            echo "</FORM>\n";
            return;
        }

        /**
         * get the list of efax pages from DB
         */
        // define WHERE
        $query_where = $this->_make_where_from_array($filter);
        // define ORDER BY 
        $order = array('m.CenterID DESC', 'm.Scan_category DESC', 'c.PSCID', 'm.ID_session', 'm.File_name', 'm.Acquisition_date', 'm.Efax_page');
        $query_order = $this->_make_order_from_array($order);
        // query the database
        $efax_list = $this->_select_efax_page($query_where, $query_order, $user_centerID);
        
        if ($efax_list == FALSE) {

            // if FALSE is returned print out the error screen
            echo "<table border=0 cellspacing=1 cellpadding=2 align='center' valign='top' width='100%'>\n";
            echo "<TR bgColor='#D3DCE3'>\n";
            echo "<TH><FONT size=-1>".$this->gui_message."</FONT></TH>\n";
            echo "</FORM></TR></TABLE>\n";

            return;

        } else {

            // define prev  & next buttons
            if(count($filter)>0) {
                $argstring = '?';
                foreach($filter AS $key=>$val) {
                    $argstring .= "filter%5B$key%5D=$val&";
                }
            }
            // get the new values of limits for prev and next buttons, if FALSE hide button
            $prev_URL = $this->prev_next_button_HTML("prev", "mri_efax.php$argstring&", $this->select_efax_limit, $this->select_efax_offset);
            $next_URL = $this->prev_next_button_HTML("next", "mri_efax.php$argstring&", $this->select_efax_limit, $this->select_efax_offset, count($efax_list));
            // define what to display as records returned
            $display_records  = "records ";
            $display_records .= $this->select_efax_limit;
            $display_records .= " - ";
            if (count($efax_list) < $this->select_efax_offset) {
                $display_records .= $this->select_efax_limit + count($efax_list);
            } else {
                $display_records .= $this->select_efax_limit + $this->select_efax_offset;
            }

            // define colspan (+1 b/c of checkbx column)
            $colspan = count($efax_list[0]) + 1;

            // start data table
            echo "<table border=0 cellspacing=1 cellpadding=2 align='center' valign='top' width='100%'>\n";
            // print navigation row
            echo "<TR>\n";
            echo "<TD colspan='$colspan' align='right'><FONT size=-1>\n";
            // display prev button
            if ($show_prev !== FALSE) {
                echo $prev_URL;
            }
            // display current position
            echo $display_records;
            // display next button
            if ($show_next !== FALSE) {
                echo $next_URL;
            }
            echo "</FONT></TD>\n";

            
            // print column titles row
            echo "</TR><TR bgColor = '#D3DCE3'>\n";
            if (is_super_user() || $userID == 'rozie' || $userID == 'louis') {
                // 1st cell is "delete" column title
                echo "<TH><FONT size=-1>Select File</FONT></TH>\n";
            }
            // array the keys and print the column title row
            foreach ($efax_list as $column_titles) {
                $keys = array_keys($column_titles);
                break 1;
            }
            foreach($keys as $val) {
                if ((is_super_user() || $userID == 'rozie'  || $userID == 'louis') || ($val != 'User' && $val != 'Comment' && $val != 'File_name' && $val != 'ID_session' && $val != 'EfaxID')) {
                    echo "<TH><FONT size=-1>".$val."</FONT></TH>\n";
                }
            }
            unset($keys);
            unset($column_titles);
            reset($efax_list);


            if (is_super_user() || $userID == 'rozie' || $userID == 'louis') {
                // print row wth submit button(s)
                echo "</TR><TR bgColor = ".useColor().">\n";
                // DELETE submit button, only for Rozie
                echo "<TD colspan='$colspan'><FONT size=-1>";
                submit_button(FALSE, "event_type", $submit_value1);
                echo " <= selected files";
                echo "</FONT></TD>\n";
            }


            // print data rows
            foreach($efax_list as $current_efax_file) {

                // print record row(s)
                echo "</TR><TR bgColor = ".useColor().">\n";

                // checkbox visible only to Rozie
                if (is_super_user() || $userID == 'rozie' || $userID == 'louis') {
                    // 1st cell is the "delete" checkbox
                    echo "<TD align='center'><FONT size=-1>";
                    echo "<INPUT TYPE='CHECKBOX' NAME='event_file_list[$current_efax_file[File_name]]' VALUE='$current_efax_file[EfaxID]' ";
                    if ($event_file_list[$current_efax_file["File_name"]] == $current_efax_file["EfaxID"]) {
                        echo "CHECKED";
                    }
                    echo ">\n";
                    echo "</FONT></TD>\n";
                }

                // define url to access efax page for the File cell of the current row 
                $url_to_efax = "<a href=\"javascript:pop_me_up('mri/efax/view_files.php?file=$current_efax_file[File]', 'mri_efax_view', 'resizable=1,scrollbars=yes,toolbar=yes')\">View</a>";
                // save it as a new value of the File element
                $current_efax_file["File"] = $url_to_efax;
                unset($url_to_efax);

                // remaining cells w/ data fields
                foreach($current_efax_file as $key=>$val) {
                    // extra fields visible only to Rozie
                    if ((is_super_user() || $userID == 'rozie' || $userID == 'louis') || ($key != 'User' && $key != 'Comment' && $key != 'File_name' && $key != 'ID_session' && $key != 'EfaxID')) {
                        echo "<TD ALIGN='center'><FONT size=-1>";
                        if ($key != 'Comment') echo "<NOBR>";
                        echo $val;
                        echo "</FONT></TD>\n";
                    }
                }
            }


            if (is_super_user() || $userID == 'rozie' || $userID == 'louis') {
                // print row wth submit button(s)
                echo "</TR><TR bgColor = ".useColor().">\n";
                // DELETE submit button, only for Rozie
                echo "<TD colspan='$colspan'><FONT size=-1>";
                submit_button(FALSE, "event_type", $submit_value1);
                echo " <= selected files";
                echo "</FONT></TD>\n";

                // hidden vars
                echo "<INPUT TYPE='hidden' NAME='mri_efax_screen' VALUE='".$this->mri_efax_screen."'>\n";
                echo "<INPUT TYPE='hidden' NAME='select_efax_limit' VALUE='".$this->select_efax_limit."'>\n";
                echo "<INPUT TYPE='hidden' NAME='select_efax_offset' VALUE='".$this->select_efax_offset."'>\n";
                
                // pass confirm var
                if (!empty($event_confirm)) {
                    echo "<INPUT TYPE='hidden' NAME='event_confirm' VALUE='$event_confirm'>";
                }
            }

            // end form
            echo "</FORM>\n";

            // end table
            echo "</TR></TABLE>";
        }

        return;
    }



    /**
     * controls prev & next buttons in HTML tables
     *
     * this function controls prev and next buttons in the HTML tables
     * that show partial result sets. it returns a URL string to buld
     * the button. It also separatey handles prev and next buttons,
     * using discrete rules for each of them.
     *
     * @param   string $button_type is it 'prev' or 'next' button
     * @param   string $php_file name of the script to be called in a href
     * @param   int    $lower_limit marks where the result set begins (changes all the time)
     * @param   int    $step_offset what is the offset, i.e. how many results are displayed at the time
     * @param   int    $rows_returned row count of currently displayed rows(used for next button only)
     * @param   string $browser_args URL args to be passed
     * @access  public
     * @return  string
     */
    function prev_next_button_HTML($button_type, $php_file, $limit, $offset, $rows_returned='', $browser_args='')
    {
        // construct prev URL
        $URL  = "&nbsp;<a href='$php_file";
        $URL .= "&select_efax_limit=";

        // deal with "prev" type first
        if ($button_type == 'prev') {

            if ($limit == 0 ) {

                // if at the beginning of the result set, don't display prev
                return FALSE;

            } elseif ($limit <= $offset) {

                // if the part of displayed result set is lower than
                // step/offset then return number for which the "prev"
                // should move the resultset backwards
                $URL .= 0;

            } else {

                // if in the middle of end of the result set, show
                // "prev" button
                $URL .= $limit - $offset;
            }

            
        } else {

            if ($rows_returned < $offset) {

                // if there are fewer row returned than the step_offset
                // than hide next button
                return FALSE;

            } else {
                
                // increment current limit for the offset
                 $URL .= $limit + $offset;
            }
        }
        $URL .= "&select_efax_offset=".$this->select_efax_offset;

	// additional URL args
	if(!empty($browser_args)) $URL .= "&".$browser_args;

        $URL .= "'>";
        if ($button_type == 'prev') $URL .= "<< ";
        $URL .= $button_type;
        if ($button_type == 'next') $URL .= " >>";
        $URL .= "</a>&nbsp;\n";

        return $URL;
    }


 
    /**
     * dispays candidate selection HTML form
     *
     * this function displays HTM form to select site/candidate/visit
     * info the form populates $filter array which is used as an
     * argument for _select_efax_data()
     *
     * @param   array  $filter - array with form data
     * @param   string $user_centerID - field users.CenterID (FKey to psc.CenterID)
     * @access  public
     * @see     make_select()
     * @see     is_dcc()
     * @see     submit_button()
     * @return  void
     */
    function selection_filter_HTML($filter, $user_centerID) {

        // site
	$query  = "SELECT Name, MRI_alias, CenterID FROM psc WHERE MRI_alias <> ''";
	if(!is_dcc()) $query .= " AND CenterID = '$user_centerID'";
	$query .= " ORDER BY Name";
	$qid = do_query($query);

	if ($qid == FALSE) {
	  $this->error .= "_selection_filter_HTML()=>".mysql_error()."\n";
	  $this->gui_message .= "failed to display selection form<BR>Please add a bug in Mantis and copy the following error message:<BR>$this->error<BR>\n";
	  return FALSE;
	} else {
	  // start table if site selection is OK
	  print "<table><tr>";
	  print "<td>PSC: <select name='filter[m.CenterID]'>\n<option value=''>&nbsp;</option>\n";
	  while($row = mysql_fetch_array($qid)) {
	    $selected = ($row['Name']==$filter['p.Name'] || $row["CenterID"]==$filter["m.CenterID"])  ? 'selected' : '';
	    print "<option value='$row[CenterID]' $selected>$row[Name]</option>\n";
	  }
	  print "</select></td>\n";
	}

        // scan category
        print "<td>Scan Class: <select name='filter[m.Scan_category]'>\n";
        print "<option value=''>&nbsp;</option>\n";
        print "<option value='subject' ".($filter['m.Scan_category']=='subject' ? 'selected' : '').">subject</option>\n";
        print "<option value='phantom' ".($filter['m.Scan_category']=='phantom' ? 'selected' : '').">phantom</option>\n";
        print "<option value='living_phantom' ".($filter['m.Scan_category']=='living_phantom' ? 'selected' : '').">living_phantom</option>\n";
        print "<option value='mritest' ".($filter['m.Scan_category']=='mritest' ? 'selected' : '').">mritest</option>\n";
        print "</select>\n";
        print "</td>\n";

        // candID
        print "<td>DCCID: <input type='text' name='filter[m.CandID]' size=6 value='".$filter['m.CandID']."'></td>\n";

        // pscid
        print "<td>PSCID: <input type='text' name='filter[c.PSCID]' size=7 value='".$filter['c.PSCID']."'></td>\n";

        // visitno
        print "<td>Visit: <select name='filter[m.VisitNo]'>\n";
        print "<option value=''>&nbsp;</option>\n";
        for ($i=1; $i<=NUM_VISITS; $i++) {
            print "<option value='$i' ".($filter['m.VisitNo']==$i ? 'selected' : '').">$i</option>\n";
        }
        print "</select>\n";
        print "</td>";

        // visitno
        print "<td>Scan Date: \n";
        $today = getdate(time());
        make_select('filter[year]', array_merge(array('Year'), range(2001, $today['year'])), $filter["year"]);
        make_select('filter[month]', array_merge(array('Month'), range(1,12)), $filter["month"], array('Month', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'));
        make_select('filter[day]', array_merge(array('Day'), range(1,31)), $filter["day"]);

        print "</tr></table>\n";
        print "<input type='Submit' value='Filter'>\n";

	return;
    }
}
?>