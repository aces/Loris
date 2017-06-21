<?php
/**
 * Candidate Data Access Object (DAO).
 *
 * This class contains all database handling that is needed to 
 * permanently store and retrieve Candidate object instances.
 */
namespace LORIS\Models;

use \LORIS\Models\Candidate_VO;

class Candidate_DAO
{
    private $_database;
    /**
     *
     */
    public function __construct()
    {
        $this->_database = \NDB_Factory::singleton()->database();
    }

    /**
     *
     */
    public function getObject($candid)
    {
        $sql_query = 'select * from candidate where CandID = :v_candid';
        $values = $this->_database->pselectRow($sql_query, array('v_candid' => $candid));

        $candidate = new Candidate_VO(); 
        $candidate->setAll($values);
        return $candidate;
    }
}
