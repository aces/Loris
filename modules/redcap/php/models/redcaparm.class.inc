<?php declare(strict_types=1);

/**
 * PHP Version 8
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\redcap\models;

use LORIS\redcap\models\RedcapProp;

/**
 * This represents a REDCap Arm
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class RedcapArm extends RedcapProp
{
    /**
     * Redcap Arm num.
     *
     * @var int
     */
    private int $_num;

    /**
     * Redcap Arm name.
     *
     * @var string
     */
    private string $_name;

    /**
     * Constructor
     *
     * @param array $props The arm properties from redcap.
     */
    public function __construct(array $props)
    {
        $propType = 'arm';
        $expectedProps = [
            'arm_num',
            'name'
        ];
        self::checkExpectedProps($expectedProps, $props, $propType);
        self::checkPropIsNotNull($props, $propType, 'arm_num');
        self::checkPropIsNotNull($props, $propType, 'name');

        $this->_num  = intval($props['arm_num']);
        $this->_name = $props['name'];
    }

    /**
     * Get Arm num.
     *
     * @return int
     */
    public function getArmNum(): int
    {
        return $this->_num;
    }

    /**
     * Get Arm name.
     *
     * @return string
     */
    public function getArmName(): string
    {
        return $this->_name;
    }

    /**
     * Props to array.
     *
     * @return array
     */
    public function toArray(): array
    {
        return [
            'arm_num' => $this->_num,
            'name'    => $this->_name
        ];
    }
}