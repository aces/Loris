<?php
require_once 'NDB_Form.class.inc';
require_once 'CouchDB.class.inc';

class NDB_Form_dataquery extends NDB_Form
{
    function _hasAccess()
    {
        return true;
    }

    function dataquery()
    {
        $user = User::singleton();
        $couch = CouchDB::singleton();
        $this->tpl_data['username'] = $user->getUsername();

        $update = $couch->queryView(
            "DQG-2.0",
            "runlog",
            array("reduce" => "false",
            "limit" => "1",
            "descending" => "true"
            )
        );
        $this->tpl_data['updatetime'] = $update[0]['key'];
    }
}
