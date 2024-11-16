<?php declare(strict_types=1);

namespace LORIS\redcap\models;

use LORIS\redcap\models\RedcapProp;

class RedcapInstrument extends RedcapProp
{

    /**
     * Redcap instrument num.
     *
     * @var string
     */
    private string $_name;

    /**
     * Redcap instrument label.
     *
     * @var string
     */
    private string $_label;

    /**
     * Constructor
     *
     * @param array $props The instrument properties from redcap.
     */
    public function __construct(array $props)
    {
        $propType = 'instrument';
        $expectedProps = [
            'instrument_name',
            'instrument_label'
        ];
        self::checkExpectedProps($expectedProps, $props, $propType);
        self::checkPropIsNotNull($props, $propType, 'instrument_name');
        self::checkPropIsNotNull($props, $propType, 'instrument_label');

        $this->_name  = $props['instrument_name'];
        $this->_label = $props['instrument_label'];
    }

    /**
     * Get instrument name
     *
     * @return string
     */
    public function getInstrumentName(): string {
        return $this->_name;
    }

    /**
     * Get instrument label
     *
     * @return string
     */
    public function getInstrumentLabel(): string {
        return $this->_label;
    }

    public function toArray(): array {
        return [
            'instrument_name'  => $this->_name,
            'instrument_label' => $this->_label,
        ];
    }
}