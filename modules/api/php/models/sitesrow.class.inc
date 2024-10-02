<?php declare(strict_types=1);
/**
 * PHP Version 7
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\api\Models;

use \LORIS\Data\DataInstance;
use \LORIS\StudyEntities\SiteHaver;

/**
 * A SitesRow contains the values from a row in the Database.
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class SitesRow implements DataInstance, SiteHaver
{
    private $_id;
    private $_name;
    private $_alias;
    private $_mrialias;
    private $_isstudysite;

    /**
     * Implements \LORIS\Data\DataInstance interface for this row.
     *
     * @return array which can be serialized by json_encode()
     */
    public function jsonSerialize() : array
    {
        return [
            'Name'      => $this->_name,
            'Alias'     => $this->_alias,
            'MRI alias' => $this->_mrialias
        ];
    }

    /**
     * Returns the CenterID for this row, for filters such as
     * \LORIS\Data\Filters\UserSiteMatch to match against.
     *
     * @return \CenterID The CenterID
     */
    public function getCenterID(): \CenterID
    {
        return \CenterID::singleton($this->_id);
    }
}
