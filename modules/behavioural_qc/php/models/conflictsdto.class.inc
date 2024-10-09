<?php declare(strict_types=1);

namespace LORIS\behavioural_qc\Models;

/**
 * A ConflictsDTO represents an profile in the behavioural_qc module.
 * It is doing the mapping between the conflicts table columns
 * and the JSON object properties returned to the frontend.
 *
 * Additionally, it implements the DataInstance interface so it can be used by
 * a Database Provisioner.
 *
 * @category Behavioural
 * @package  Loris
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 *           Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */
class ConflictsDTO implements \LORIS\Data\DataInstance,
    \LORIS\StudyEntities\SiteHaver
{
    /**
     * The instrument
     *
     * @var string
     */
    private $_instrument = '';

    /**
     * The candID
     *
     * @var string
     */
    private $_candID = '';

    /**
     * The pscID
     *
     * @var string
     */
    private $_pscID = '';

    /**
     * The visit
     *
     * @var string
     */
    private $_visit = '';

    /**
     * The project
     *
     * @var int
     */
    private $_project;

    /**
     * The feedback_status
     *
     * @var string
     */
    private $_cohort = '';

    /**
     * The site
     *
     * @var int
     */
    private $_site;

    /**
     * The fieldName
     *
     * @var string
     */
    private $_fieldName = '';

    /**
     * The testName
     *
     * @var string
     */
    private $_testName = '';

    /**
     * The test_name_display
     *
     * @var string
     */
    private $_test_name_display = '';

    /**
     * The sessionID
     *
     * @var string
     */
    private $_sessionID = '';

    /**
     * The commentID
     *
     * @var string
     */
    private $_commentID = '';

    /**
     * Returns the CenterID for this instance, for filters such as
     * \LORIS\Data\Filters\UserSiteMatch to match against.
     *
     * @return \CenterID
     */
    public function getCenterID(): \CenterID
    {
        return \CenterID::singleton($this->_site);
    }

    /**
     * Returns the ProjectID for this row, for filters such as
     * \LORIS\Data\Filters\UserProjectMatch to match again.
     *
     * @return \ProjectID
     */
    public function getProjectID(): \ProjectID
    {
        return \ProjectID::singleton($this->_project);
    }

    /**
     * Implements \LORIS\Data\DataInstance interface for this row.
     *
     * @return array
     */
    public function jsonSerialize() : array
    {
        return [
            'instrument'        => $this->_instrument,
            'candID'            => $this->_candID,
            'pscID'             => $this->_pscID,
            'visit'             => $this->_visit,
            'project'           => $this->_project,
            'cohort'            => $this->_cohort,
            'site'              => $this->_site,
            'fieldName'         => $this->_fieldName,
            'testName'          => $this->_testName,
            'test_name_display' => $this->_test_name_display,
            'sessionID'         => $this->_sessionID,
            'commentID'         => $this->_commentID,
        ];
    }

}
