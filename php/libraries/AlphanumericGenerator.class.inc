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
 * Generates an alphanumeric id, padded to `$length`
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   anyhowstep <justin.ng.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class AlphanumericGenerator extends NumericGenerator
{
    /**
     * Converts an int to an alphanumeric string (base 36)
     *
     * @param int $int The int
     *
     * @return string The alphanumeric string
     */
    private static function _intToAlphanumeric($int)
    {
        $str = base_convert("{$int}", 10, 36);
        return $str;
    }

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
        $str = self::_intToAlphanumeric($cur);
        return str_pad($str, $this->getLength(), "0", STR_PAD_LEFT);
    }

    /**
     * Constructor
     *
     * @param int $length The length
     */
    public function __construct($length)
    {
        parent::__construct(0, pow(36, $length)-1, $length);
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
        $length = IdGeneratorUtil::xmlTryGetLength($xml);

        if (is_null($length)) {
            throw new Exception("'length' must be set");
        } else if ($length == 0) {
            throw new Exception("'length' must be > 0");
        } else {
            return new AlphanumericGenerator($length);
        }
    }
}
?>
