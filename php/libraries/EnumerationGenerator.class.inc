<?php
/**
 * Generates Ids used for PSCID and ExternalId
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   anyhowstep <justin.ng.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

/**
 * Generates an id from a set
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   anyhowstep <justin.ng.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class EnumerationGenerator extends NumericGenerator
{
    private $_value_arr;

    /**
     * Expected to return `null` if unable to get the
     * current string, this returns the current string in sequence
     *
     * @return string|null The current string in the id
     */
    public function cur()
    {
        $cur = $this->curRaw();
        if (is_null($cur)) {
            return null;
        }
        return $this->_value_arr[$cur];
    }

    /**
     * Constructor
     *
     * @param array $value_arr The values
     */
    public function __construct($value_arr)
    {
        parent::__construct(0, count($value_arr)-1, -1);
        $this->_value_arr = $value_arr;
    }
    /**
     * Parses the xml to produce the generator
     *
     * @param array $xml The xml
     *
     * @return object The generator
     */
    public static function fromXMLConfig($xml)
    {
        $value_arr = explode("|", $xml["#"]);
        if (count($value_arr) == 0) {
            throw new Exception("Empty enumeration definition not allowed");
        }
        return new EnumerationGenerator($value_arr);
    }
}
?>
