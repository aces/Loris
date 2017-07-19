<?php
/**
 * Candidate Data Access Object (DAO).
 *
 * This class contains all database handling that is needed to 
 * permanently store and retrieve Candidate object instances.
 */
namespace LORIS\Models;

use \LORIS\Models\Candidate_DTO;

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

        $candidate = new Candidate_DTO($values); 
        return $candidate;
    }

    /**
     *
     */
    public function getAll()
    {
        $sql_query = 'SELECT * from candidate WHERE 1=1';
        $params = array();

        if (!$this->_user->hasPermission('access_all_profiles')) {
            $sql_query .= ' AND FIND_IN_SET(CenterID, :v_user_centers)';
            $params['v_user_centers'] = join(',',$this->_user->getCenterIDs());
        }

        $values = $this->_database->pselect($sql_query, $params);

        if (empty($values)) {
            throw new \LorisException("No candidate");
        }

        return array_map(function($row) {
            return new Candidate_DTO($row);
        }, $values);
    }

    public function update(Candidate_DTO $candidate) {
        $new_values = $candidate->asArray();
        $this->_database->update('candidate', $new_values, array('CandID' => $new_values['CandID']));
    }
}
