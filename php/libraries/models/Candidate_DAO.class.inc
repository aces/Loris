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
     * @throws LorisException
     */
    public function getObject($candid)
    {
        $sql_query = 'SELECT * from candidate WHERE CandID = :v_candid';
        $params = array('v_candid' => $candid);

        if (!$this->_user->hasPermission('access_all_profiles')) {
            $sql_query .= ' AND FIND_IN_SET(CenterID, :v_user_centers)';
            $params['v_user_centers'] = join(',',$this->_user->getCenterIDs());
        }
        
        $values = $this->_database->pselectRow($sql_query, $params);

        if (empty($values)) {
            throw new \LorisException("This candidate does not exists.");
        }

        $candidate = new Candidate_VO(); 
        $candidate->setAll($values);
        return $candidate;
    }

    /**
     *
     */
    public function getAll()
    {
        $sql_query = 'SELECT * from candidate WHERE 1=1 LIMIT 2';
        $params = array();

        if (!$this->_user->hasPermission('access_all_profiles')) {
            $sql_query .= ' AND FIND_IN_SET(CenterID, :v_user_centers)';
            $params['v_user_centers'] = join(',',$this->_user->getCenterIDs());
        }

        $values = $this->_database->pselect($sql_query, $params);

        if (empty($values)) {
            throw new \LorisException("This candidate does not exists.");
        }

        return array_map(function($row) {
            $candidate = new Candidate_VO();
            $candidate->setAll($row);
            return $candidate;
        }, $values);
    }
}
