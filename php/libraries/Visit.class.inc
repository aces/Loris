<?php
/**
 * This file contains the Visit class.
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Main
 * @author   Mélanie Legault <melanie.legault2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

/**
 * Base class that contains method to access the visit of projects
 *
 * @category Main
 * @package  Main
 * @author   Mélanie Legault <melanie.legault2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

class Visit
{
    /**
     * Return an array containing the label and legacyLabel of a visit
     *
     * @param integer $id the identifier of the label
     *
     * @throws DatabaseException
     *
     * @return array a hash with both label
     *                 hash is of the form
     *                 array('Label'       => 'label',
     *                       'LegacyLabel' => 'legacy label')
     */
    public function getLabel($id)
    {
        $DB = Database::singleton();

        $result = $DB->pselect(
            "SELECT VisitLabel, VisitLegacyLabel
             FROM visit
             WHERE VisitID = :id",
            array('id' => $id)
        );
        return $result;
    }

    /**
     * Return an array of hash containing all the visit available
     * for a project
     *
     * @param array $param array['projectID'] the ID of the project
     *                     array['subprojectID'] the ID of the subproject
     *                     for which the visit should be available
     *                     if none, all visit
     *
     * @throws DatabaseException
     *
     * @return array an array of hash with id and both label
     *               array is of the form
     *               array(0 => array('VisitID'     => visit ID,
     *                                'Label'       => 'label',
     *                                'LegacyLabel' => 'legacy label'))
     */
    public static function getList($param = array())
    {
        $DB = Database::singleton();

        $where      = "";
        $queryParam = array();
        if (isset($param['projectID']) && !is_null($param['projectID'])) {
            $where = " JOIN visit_project_subproject_rel using(VisitID)
                       WHERE ProjectID = :projectID";
            $queryParam['projectID'] = $param['projectID'];
            if (empty($param['subprojectID'])) {
                $where .= " AND SubprojectID IS NULL";
            } else {
                $where .= " AND SubprojectID = :subprojectID";
                $queryParam['subprojectID'] = $param['subprojectID'];

            }
        } elseif (isset($param['subprojectID'])
            && !is_null($param['subprojectID'])
        ) {
            $where = " JOIN visit_project_subproject_rel using(VisitID)
                       WHERE SubprojectID = :subprojectID AND ProjectID IS NULL";
            $queryParam['subprojectID'] = $param['subprojectID'];
        }
        $result = $DB->pselect(
            "SELECT VisitID, VisitLabel, VisitLegacyLabel
             FROM visit" . $where,
            $queryParam
        );
        return $result;
    }

    /**
     * Modify the label and legacyLabel of a visit
     *
     * @param string $id          the ID of the visit
     * @param string $label       the front-end label
     * @param string $legacyLabel the back-end label
     *
     * @throws DatabaseException
     *
     * @return void
     */
    public function setLabel($id, $label, $legacyLabel=null)
    {
        $DB = Database::singleton();

        $set = array('VisitLabel' => $label);
        if (!is_null($legacyLabel)) {
            $set['VisitLegacyLabel'] = $legacyLabel;
        }
        $DB->update("visit", $set, array('VisitID' => $id));
    }

    /**
     * Create a new visit and label and legacyLabel
     *
     * @param string $label       the front-end label
     * @param string $legacyLabel the back-end label
     *
     * @throws DatabaseException
     *
     * @return int the VisitID
     */
    public function createVisit($label, $legacyLabel=null)
    {
        $DB = Database::singleton();

        $set = array('VisitLabel' => $label);
        if (!is_null($legacyLabel)) {
            $set['VisitLegacyLabel'] = $legacyLabel;
        }
        $DB->insert("visit", $set);
        return $DB->getLastInsertId();
    }

    /**
     * Add a visit to a project and/or subprojet
     *
     * @param integer $visitID the visit ID
     * @param array   $param   array['projectID'] the ID of the project
     *                         array['subprojectID'] the ID of the subproject
     *                         for which the visit should be added
     *                         if none, error
     *
     * @throws DatabaseException
     * @throws LorisException
     *
     * @return int the VisitProjectSubprojectID
     */
    public function addToProjectSubproject($visitID, $param)
    {
        $DB = Database::singleton();

        $set = array('VisitID' => $visitID);
        if (isset($param['projectID']) && !is_null($param['projectID'])) {
            $set['ProjectID'] = $param['projectID'];
            if (isset($param['subprojectID'])
                && !is_null($param['subprojectID'])
            ) {
                $set['SubprojectID'] = $param['subprojectID'];
            }
        } elseif (isset($param['subprojectID'])
            && !is_null($param['subprojectID'])
        ) {
            $set['SubprojectID'] = $param['subprojectID'];
        } else {
            throw new LorisException("Need at least a project or subproject");
        }

        $DB->insert("visit_project_subproject_rel", $set);
        return $DB->getLastInsertId();
    }

    /**
     * Delete a visit from a project and/or subproject
     *
     * @param integer $visitID the visit ID
     * @param array   $param   array['projectID'] the ID of the project
     *                         array['subprojectID'] the ID of the subproject
     *                         for which the visit should be deleted
     *                         if none, all visit
     *
     * @throws DatabaseException
     * @throws LorisException
     *
     * @return void
     */
    public function deleteFromProject($visitID, $param)
    {
        $DB = Database::singleton();

        $where = array('VisitID' => $visitID);
        if (isset($param['projectID']) && !is_null($param['projectID'])) {
            $where['ProjectID'] = $param['projectID'];
            if (empty($param['subprojectID'])) {
                $where['SubprojectID'] = null;
            } else {
                $where['SubprojectID'] = $param['subprojectID'];
            }
        } elseif (isset($param['subprojectID'])
            && !is_null($param['subprojectID'])
        ) {
            $where['SubprojectID'] = $param['subprojectID'];
            $where['ProjectID']    = null;
        } else {
            throw new LorisException("Need at least a project or subproject");
        }
        $DB->delete("visit_project_subproject_rel", $where);
    }
}
?>
?>
