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
 * Generates an alphabetic id, padded to `$length`
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   anyhowstep <justin.ng.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class AlphabeticGenerator extends NumericGenerator
{
    /**
     * Converts a base26 string to an alphabetic string.
     *
     * @param string $str The base26 string
     *
     * @return string The alphabetic string
     */
    private static function _base26ToAlphabetic($str)
    {
        //Get the ordinal values of these characters
        $digit_0 = ord("0");
        $alpha_a = ord("a");

        //To convert 0-9 to a-j
        $digit2alpha = -$digit_0 + $alpha_a;
        //To convert a-p to k-z
        $alpha_offset = 10;

        //Convert each character appropriately
        for ($i=0; $i<strlen($str); ++$i) {
            $char = $str[$i];
            if (ctype_digit($char)) {
                $char    = chr(ord($char)+$digit2alpha);
                $str[$i] = $char;
            } else {
                $char    = chr(ord($char)+$alpha_offset);
                $str[$i] = $char;
            }
        }
        return $str;
    }
    /**
     * Converts an int to an alphabetic string (modified base26).
     * It's a little more complicated than that because
     * base26 is 0-9 and a-p.
     * We still have to convert this base26 string to pure
     * alphabetic characters.
     *
     * @param int $int The int
     *
     * @return string The alphabetic string
     */
    private static function _intToAlphabetic($int)
    {
        $str = base_convert("{$int}", 10, 26);
        $str = self::_base26ToAlphabetic($str);
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
        $str = self::_intToAlphabetic($cur);
        return str_pad($str, $this->getLength(), "a", STR_PAD_LEFT);
    }

    /**
     * Constructor
     *
     * @param int $length The length
     */
    public function __construct($length)
    {
        parent::__construct(0, pow(26, $length)-1, $length);
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
            return new AlphabeticGenerator($length);
        }
    }
}
?>
