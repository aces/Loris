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
 * A collection of utility methods for id generation.
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   anyhowstep <justin.ng.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class IdGeneratorUtil
{
    /**
     * Not meant to be instantiated
     */
    private function __construct()
    {
    }

    /**
     * Approximates the n-th harmonic number
     * https://en.wikipedia.org/wiki/Harmonic_number
     * #Alternative.2C_asymptotic_formulation
     *
     * @param int $n The index
     *
     * @return float the n-th harmonic number
     */
    public static function approximateHarmonicNumber($n)
    {
        //Euler-Mascheroni constant
        //https://en.wikipedia.org/wiki/Euler%E2%80%93Mascheroni_constant
        $gamma = 0.57721566490153286060651209008240243104215933593992;

        //http://stackoverflow.com/questions/404346/
        //python-program-to-calculate-harmonic-series
        return $gamma + log($n)
            + 1.0/(  2.0 * $n)
            - 1.0/( 12.0 * $n*$n)
            + 1.0/(120.0 * $n*$n*$n*$n);
    }
    /**
     * Calculated with this in mind:
     * https://en.wikipedia.org/wiki/Coupon_collector's_problem
     * Full explanation,
     * https://math.stackexchange.com/questions/2062743/
     * is-there-a-name-for-this-distribution-generating-until-all-numbers-appear
     *
     * Basically, we want to find how many times we should attempt to generate
     * random numbers before we can *expect* to have generated all random numbers
     * in the range [1, $n].
     * If we try this many times and collide every time, we can reasonably expect
     * the user to increase the probability space.
     *
     * @param int $n The probability space
     *
     * @return int The expected number of attempts before exhausting the space
     */
    public static function approximateRandAttemptsMax($n)
    {
        return intval($n*self::approximateHarmonicNumber($n));
    }
    /**
     * Validates the numeric string, throws an exception if invalid.
     *
     * @param string $raw  The raw string
     * @param string $name The name of the value
     *
     * @return void
     */
    private static function _validateNonNegativeInteger($raw, $name)
    {
        if (!ctype_digit($raw)) {
            throw new Exception("{$name} must be a non-negative integer");
        }
        if ("" . intval($raw) !== $raw) {
            throw new Exception("{$name} must be a valid non-negative integer");
        }
    }
    /**
     * Checks if the key exists.
     *
     * @param array  $xml The xml
     * @param string $key The key
     *
     * @return bool `true` if it exists
     */
    public static function xmlKeyExists($xml, $key)
    {
        return isset($xml["@"][$key]);
    }
    /**
     * Gets the value, throws an exception if unable.
     *
     * @param array  $xml The xml
     * @param string $key The key
     *
     * @return string The value
     */
    public static function xmlGet($xml, $key)
    {
        if (!self::xmlKeyExists($xml, $key)) {
            throw new Exception("Expected '{$key}' to be set");
        }
        return $xml["@"][$key];
    }
    /**
     * Gets the int value, throws an exception if unable.
     *
     * @param array  $xml The xml
     * @param string $key The key
     *
     * @return int The int
     */
    public static function xmlGetInt($xml, $key)
    {
        $raw = self::xmlGet($xml, $key);
        self::_validateNonNegativeInteger($raw, $key);
        return intval($raw);
    }
    /**
     * Tries to get the int value, if specified.
     *
     * @param array  $xml The xml
     * @param string $key The key
     *
     * @return int|null The int
     */
    public static function xmlTryGetInt($xml, $key)
    {
        return self::xmlKeyExists($xml, $key) ?
            self::xmlGetInt($xml, $key) : null;
    }
    /**
     * Tries to get the length, if specified.
     * Notice that `length` and `minLength` are synonymous...
     *
     * @param array $xml The xml
     *
     * @return int|null The length
     */
    public static function xmlTryGetLength($xml)
    {
        $raw;
        if (self::xmlKeyExists($xml, "length")) {
            return self::xmlGetInt($xml, "length");
        } else if (self::xmlKeyExists($xml, "minLength")) {
            return self::xmlGetInt($xml, "minLength");
        } else {
            return null;
        }
    }
}
?>
