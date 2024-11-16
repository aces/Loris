<?php declare(strict_types=1);

namespace LORIS\redcap\models\records;

/**
 * This reprensents a redcap record.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class RedcapRepeatingRecord extends RedcapRecord implements IRedcapRecord
{
    private int $_repeat_index;

    /**
     * Constructor
     *
     * @param string $form_name This record form name in redcap
     * @param array $props The record properties typically from redcap.
     * @param int $repeat_index This record repeat index.
     */
    public function __construct(string $form_name, array $props, int $repeat_index)
    {
        $this->_repeat_index = $repeat_index;

        parent::__construct($form_name, $props);
    }

    public function getRepeatIndex(): int
    {
        return $this->_repeat_index;
    }

    public function getInstrumentName(): string
    {
        return $this->getFormName() . '_' . $this->_repeat_index;
    }
}
