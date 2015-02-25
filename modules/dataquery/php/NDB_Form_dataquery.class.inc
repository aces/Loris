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
        $username = $user->getUsername();
        $couch = CouchDB::singleton();

        $update = $couch->queryView(
            "DQG-2.0",
            "runlog",
            array(
             "reduce" => "false",
             "limit" => "1",
             "descending" => "true"
            )
        );
        $this->tpl_data['updatetime'] = $update[0]['key'];

        $categories = $couch->queryView(
            "DQG-2.0",
            "datadictionary",
            array(
             "reduce" => "true",
             "group_level" => "1"
            )
        );

        $cat_tpl = array();
        foreach($categories as $row) {
            $cat_tpl[$row['key'][0]] = $row['value'];
        }
        $this->tpl_data['categories'] = $cat_tpl;

        $usersaved = $couch->queryView(
            "DQG-2.0",
            "savedqueries",
            array(
             "key" => "\"$username\"",
             "reduce" => "false",
            )
        );


        $globalsaved = $couch->queryView(
            "DQG-2.0",
            "savedqueries",
            array(
             "key" => "\"global\"",
             "reduce" => "false",
            )
        );

        $IDMapCallback = function($row) {
            return $row['id'];
        };

        $usersavedNames = array_map($IDMapCallback, $usersaved);
        $globalsavedNames = array_map($IDMapCallback, $globalsaved);

        $this->tpl_data['savedqueries'] = array(
            'user'   => $usersavedNames,
            'shared' => $globalsavedNames
        );
    }
}
