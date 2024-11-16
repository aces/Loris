<?php declare(strict_types=1);

namespace LORIS\redcap\models;

use LORIS\redcap\models\RedcapProp;

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
    public function getArmNum(): int {
        return $this->_num;
    }

    /**
     * Get Arm name.
     *
     * @return string
     */
    public function getArmName(): string {
        return $this->_name;
    }

    public function toArray(): array {
        return [
            'arm_num' => $this->_num,
            'name'    => $this->_name
        ];
    }
}