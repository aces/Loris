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

namespace LORIS\redcap\client\models;

use LORIS\redcap\client\RedcapProps;

/**
 * This represents a REDCap Arm
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class RedcapArm
{
    /**
     * The REDCap arm number.
     *
     * @var int
     */
    public readonly int $number;

    /**
     * The REDCap arm name.
     *
     * @var string
     */
    public readonly string $name;

    /**
     * Constructor
     *
     * @param array $props The arm properties from redcap.
     */
    public function __construct(array $props)
    {
        $props = new RedcapProps('arm', $props);

        $this->number = $props->getInt('arm_num');
        $this->name   = $props->getString('name');
    }

    /**
     * Props to array.
     *
     * @return array
     */
    public function toArray(): array
    {
        return [
            'arm_num' => $this->number,
            'name'    => $this->name
        ];
    }
}
