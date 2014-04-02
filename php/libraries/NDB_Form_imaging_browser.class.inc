<?php
require_once 'NDB_Form.class.inc';
require_once 'Imaging_Session_ControlPanel.class.inc';
require_once 'MRIFile.class.inc';

class NDB_Form_imaging_browser extends NDB_Form
{

    function view_session() {
        $DB = Database::singleton();
        $this->tpl_data['headerTable'] = $this->getHeaderTable();

        $files = $DB->pselect("SELECT FileID from files WHERE SessionID=:SID",
            array(
                'SID' => $_REQUEST['sessionID']
            )
        );
        $this->tpl_data['files'] = array();
        foreach($files as $fileRow) {
            $FileObj = new MRIFile($fileRow['FileID']);
            $file = array(
                'FileID'   => $fileRow['FileID'],
                'Filename' => basename($FileObj->getParameter('File')),
                'CheckPic' => $FileObj->getParameter('check_pic_filename'),
                'FullFilename' => $FileObj->getParameter('File'),
                'JivFilename' => basename($FileObj->getParameter('File')),
                'JivAddress' => str_replace('_check.jpg', '', $FileObj->getParameter('check_pic_filename'))
            );

                $this->tpl_data['files'][] = $file;
        }
    }

    function getHeaderTable() {
        $smarty = new Smarty_neurodb;
        $smarty->ModuleName = "imaging_browser";

        $smarty->assign($this->tpl_data);
        $html = $smarty->fetch("table_session_header.tpl");
        return $html;
    }

    function getControlPanel() {
        $controlPanel = new Imaging_Session_ControlPanel($_REQUEST['sessionID']);
        return $controlPanel->display();
    }
}
?>
