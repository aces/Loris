<?php declare(strict_types=1);

namespace LORIS\redcap\models\records;

use LORIS\redcap\models\RedcapProp;

/**
 * This reprensents a redcap record.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class RedcapRecord extends RedcapProp implements IRedcapRecord
{
    private string $_form_name;

    private array $_props;

    /**
     * Constructor
     *
     * @param array $props The record properties typically from redcap.
     */
    public function __construct(string $form_name, array $props)
    {
        $this->_form_name = $form_name;
        $this->_props     = $props;
    }

    public function getFormName(): string
    {
        return $this->_form_name;
    }

    public function getInstrumentName(): string
    {
        return $this->_form_name;
    }

    public function getPropertyNames(): array
    {
        return array_keys($this->_props);
    }

    public function toArray(): array
    {
        return $this->_props;
    }
}
