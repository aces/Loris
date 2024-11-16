<?php declare(strict_types=1);

/**
 * PHP Version 8
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\redcap\models;

/**
 * This abstract class REDCap prop
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
abstract class RedcapProp
{
    /**
     * Check that all properties are the one expected from a given array.
     * Throws an expection if there is a difference.
     *
     * @param array  $expectedProps  the expected properties
     * @param array  $actualProps    the properties to check
     * @param string $propObjectName the property type
     *
     * @throws \LorisException
     *
     * @return void
     */
    protected static function checkExpectedProps(
        array &$expectedProps,
        array &$actualProps,
        string $propObjectName
    ): void {
        $propNames = array_keys($actualProps);
        // expected props in LORIS
        $d1 = array_diff($expectedProps, $propNames);
        if (!empty($d1)) {
            $i = implode(', ', $d1);
            throw new \LorisException("[redcap:$propObjectName] missing props: $i");
        }
        // additional props from REDCap
        $d2 = array_diff($propNames, $expectedProps);
        if (!empty($d2)) {
            $i = implode(', ', $d2);
            throw new \LorisException(
                "[redcap:$propObjectName] additional props (unexpected): $i"
            );
        }
    }

    /**
     * Check that a property is not null, throws an exception if it is.
     *
     * @param array  $props          all props
     * @param string $propObjectName the property name to check
     * @param string $propName       the property type
     *
     * @throws \LorisException
     *
     * @return void
     */
    protected static function checkPropIsNotNull(
        array &$props,
        string $propObjectName,
        string $propName
    ): void {
        if (!array_key_exists($propName, $props)
            || is_null($props[$propName])
        ) {
            throw new \LorisException("[redcap:$propObjectName] $propName required");
        }
    }

    /**
     * Transform object to array.
     *
     * @return array an associative array representing the object.
     */
    abstract public function toArray(): array;
}
