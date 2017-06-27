<?php
/**
 * Visit Data Access Object (DAO).
 * Candidate related as opposed to the Project related class.
 *
 * This class contains all database handling that is needed to 
 * permanently store and retrieve Candidate object instances.
 */
namespace LORIS\Models;

use \LORIS\Models\Visit_VO;

class Visit_DAO
{
    private $_user;
    private $_database;

    /**
     *
     */
    public function __construct()
    {
        $login = \SinglePointLogin::getInstance();

        $this->_user     = $login->getLoggedInUser();
        $this->_database = \NDB_Factory::singleton()->database();
    }

    /**
     *
     */
    public function getObject(string $candid, string $visit_label)
    {
        $sql_query = 'select * from session where CandID = :v_candid AND Visit_label = :v_visit_label';
        $values = $this->_database->pselectRow($sql_query, array('v_candid' => $candid, 'v_visit_label' => $visit_label));

        $visit = new Visit_VO(); 
        $visit->setAll($values);
        return $visit;
    }

    /**
     *
     */
    public function getAll(string $candid)
    {
        $sql_query = 'select * from session where CandID = :v_candid';
        $values = $this->_database->pselect($sql_query, array('v_candid' => $candid));

        // TODO :: permissions

        return array_map(function($row) {
            $visit = new Visit_VO();
            $visit->setAll($row);
            return $visit;
        }, $values);
    }
}
