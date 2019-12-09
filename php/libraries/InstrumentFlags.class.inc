<?php declare(strict_types=1);
/**
 * This file contains the intrument flags class
 *
 * PHP Version 7
 *
 * @category Behavioural
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

/**
 * This is a placeholder for instrument flags
 *
 * @category Behavioural
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class InstrumentFlags
{
    /**
     * Contructor
     *
     * @param ?string $dataentry      A value for data entry
     * @param ?string $administration A value for administration
     * @param ?string $validity       A value for validity
     */
    public function __construct(
        ?string $dataentry,
        ?string $administration,
        ?string $validity
    ) {
        $this->_dataentry      = $dataentry;
        $this->_administration = $administration;
        $this->_validity       = $validity;
    }

    /**
     * Provide an array representation of an instrument flag status
     *
     * @return array
     */
    public function toArray(): array
    {
        return array(
            'Data_entry'     => $this->_dataentry,
            'Administration' => $this->_administration,
            'Validity'       => $this->_validity,
        );
    }
}
