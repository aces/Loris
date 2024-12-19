<?php declare(strict_types=1);

/**
 * PHP Version 8
 *
 * @category REDCap
 * @package  Main
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\redcap\client;

/**
 * Props validator for objects returned by the REDCap API.
 *
 * @category REDCap
 * @package  Main
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class RedcapProps
{
    /**
     * The name of the REDCap object.
     *
     * @var string
     */
    private string $_name;
    /**
     * The props returned by a REDCap API.
     *
     * @var array
     */
    private array $_props;

    /**
     * Constructor.
     *
     * @param string $name  The REDCap object name.
     * @param array  $props The properties of the object.
     */
    function __construct(string $name, array $props)
    {
        $this->_name  = $name;
        $this->_props = $props;
    }

    /**
     * Get a property has a boolean.
     *
     * @param string $prop_name The property name.
     *
     * @return bool The property as a boolean.
     */
    public function getBool(string $prop_name): bool
    {
        $prop = $this->_requireProp($prop_name);
        return !empty($prop) && $prop == 1;
    }

    /**
     * Get a property has a nullable datetime.
     *
     * @param string $prop_name The property name.
     *
     * @return ?\DateTimeImmutable The property as a nullable datetime.
     */
    public function getDateTimeNullable(string $prop_name): ?\DateTimeImmutable
    {
        $prop = $this->_props[$prop_name] ?? null;
        return !empty($prop) ? new \DateTimeImmutable($prop) : null;
    }

    /**
     * Get a property has an integer.
     *
     * @param string $prop_name The property name.
     *
     * @return int The property as an integer.
     */
    public function getInt(string $prop_name): int
    {
        return intval($this->_requireProp($prop_name));
    }

    /**
     * Get a property has a string.
     *
     * @param string $prop_name The property name.
     *
     * @return string The property as a potentially empty string.
     */
    public function getString(string $prop_name): string
    {
        return strval($this->_requireProp($prop_name));
    }

    /**
     * Get a property has a nullable string.
     *
     * @param string $prop_name The property name.
     *
     * @return ?string The property as a nullable non-empty string.
     */
    public function getStringNullable(string $prop_name): ?string
    {
        $prop = $this->_props[$prop_name] ?? null;
        return !empty($prop) ? strval($prop) : null;
    }

    /**
     * Check that a property is not null and throws an exception if it is.
     *
     * @param string $prop_name The property name.
     *
     * @return mixed The non-null property.
     */
    private function _requireProp(string $prop_name): mixed
    {
        if (!array_key_exists($prop_name, $this->_props)) {
            throw new \LorisException(
                "[redcap:{$this->_name}] property $prop_name required but is absent"
            );
        }

        $prop = $this->_props[$prop_name];

        if ($prop === null) {
            throw new \LorisException(
                "[redcap:{$this->_name}] property $prop_name required but is null"
            );
        }

        return $prop;
    }
}
