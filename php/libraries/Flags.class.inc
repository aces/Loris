<?php
class Flags
{
    public function __construct($dataentry, $administration, $validity)
    {
        $this->_dataentry = $dataentry;
        $this->_administration = $administration;
        $this->_validity = $validity;
    }

    public function toArray(): array
    {
        return array(
            'Data_entry'     => $this->_dataentry,
            'Administration' => $this->_administration,
            'Validity'       => $this->_validity,
        );
    }
}
