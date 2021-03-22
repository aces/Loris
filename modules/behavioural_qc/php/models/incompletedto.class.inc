<?php declare(strict_types=1);

namespace LORIS\behavioural_qc\Models;

/**
 * A IncompleteDTO represents a incomplete in the Behavioural Quality Control module.
 * It is doing the mapping between the incomplete table columns
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
class IncompleteDTO implements \LORIS\Data\DataInstance
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
     * @var string
     */
    private $_project = '';

    /**
     * The site
     *
     * @var string
     */
    private $_site = '';

    /**
     * The id
     *
     * @var string
     */
    private $_id = '';

    /**
     * The sessionID
     *
     * @var string
     */
    private $_sessionID = '';

    /**
     * The test_name
     *
     * @var string
     */
    private $_test_name = '';

    /**
     * The data_entry
     *
     * @var string
     */
    private $_data_entry = '';

    /**
     * The commentID
     *
     * @var string
     */
    private $_commentID = '';

    /**
     * Implements \LORIS\Data\DataInstance interface for this row.
     *
     * @return array
     */
    public function jsonSerialize() : array
    {
        return [
            'instrument' => $this->_instrument,
            'candID'     => $this->_candID,
            'pscID'      => $this->_pscID,
            'visit'      => $this->_visit,
            'project'    => $this->_project,
            'site'       => $this->_site,
            'id'         => $this->_id,
            'sessionID'  => $this->_sessionID,
            'test_name'  => $this->_test_name,
            'data_entry' => $this->_data_entry,
            'commentID'  => $this->_commentID,
        ];
    }
}
