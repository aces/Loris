<?php
require_once 'NDB_Menu_Filter.class.inc';

class NDB_Menu_Filter_download_files extends NDB_Menu_Filter
{
    function _hasAccess()
    {
        $user =& User::singleton();
        if (Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: " .$user->getMessage());
        }
        return $user->hasPermission('download_files');
    }

    function _setupVariables()
    {
        $user =& User::singleton();

        $this->query = " FROM query_gui_user_files f WHERE UserID=" . $user->getData("ID");

        $this->columns = array('f.filename as File', 'f.downloadDate as QueryTime', 'f.md5sum as MD5', 'f.status as Status');
        $this->order_by = 'downloadDate DESC';
        $this->headers = array('Filename',
                               'QueryTime',
                               'MD5',
                               'Status'
        );
        $this->validFilters = array('f.filename', 'f.status');
        $this->formToFilter = array (
                                    'Filename' =>  'f.filename'
        );
    }

    function _setFilterForm()
    {
        $this->addBasicText('Filename', 'Filename:', array("size"=>9, "maxlength"=>11));
    }

    function _setDataTableRows($count)
    {
        $config = NDB_Config::singleton();
        $db = Database::singleton();
        $paths = $config->getSetting('paths');
        $base = $paths['base'];
        // print out
        $x = 0;
        foreach ($this->list as $item) {
            //count column
            $this->tpl_data['items'][$x][0]['value'] = $x + $count;

            $file = false;
            $md5 = false;

            //print out data rows
            $i = 1;
            foreach ($item as $key => $val) {
                $this->tpl_data['items'][$x][$i]['name'] = $key;
                switch($key) {
                    case 'File': $file = $val; break;
                    case 'MD5': $md5 = $val; break;
                    case 'Status':
                        if($file && file_exists("$base/userdownloads/$file")) {
                            if(!$md5) {
                                $md5 = md5_file("$base/userdownloads/$file");
                                // We're in the Status, MD5 was the previous column
                                $this->tpl_data['items'][$x][$i-1]['value'] = $md5;
                                $db->update("query_gui_user_files", array("status" => 'ready', 'md5sum' => $md5), array("filename" => $file));

                            }
                            $val = 'ready';
                        } else {
                            // If we're in this block, it means the file doesn't exist.
                            // If there's no MD5 sum calculated yet, the file was never there. So it's packaging
                            // If there is an MD5 sum but the file doesn't exist, it was deleted from the 
                            // file system for space reasons, and it's "expired" for the user

                            if(!$val || $val == 'ready') {
                                if(!$md5) {
                                    $db->update("query_gui_user_files", array("status" => 'packaging'), array("filename" => $file));
                                    $val = 'packaging';
                                } else {
                                    $db->update("query_gui_user_files", array("status" => 'expired'), array("filename" => $file));
                                    $val = 'expired';
                                    
                                }
                            }
                        }
                        break;
                }

                $this->tpl_data['items'][$x][$i]['value'] = $val;
                $i++;
            }
            /*
            $this->tpl_data['items'][$x][$i]['name'] = 'Status';
            if($file && file_exists("$base/userdownloads/$file")) {
                $this->tpl_data['items'][$x][$i]['value'] = 'Ready for download';
                }
            } else {
                $this->tpl_data['items'][$x][$i]['value'] = 'Packaging files';
                $db->update("query_gui_user_files", array("status" => 'packaging'), array("filename" => $file));
            }
            */

            $x++;
        }

        return true;
    }

}
