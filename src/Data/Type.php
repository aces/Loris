<?php
namespace LORIS\Data;

/**
 * A \LORIS\Data\Type represents one of the different types
 * of data that can be managed by LORIS.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
interface Type extends \JsonSerializable
{
    /**
     * Types must be serializeable to both string and JSON
     */
    public function __toString();

    /**
     * Convert a type to a valid SQL representation that
     * can store that type.
     *
     * @return string
     */
    public function asSQLType() : string;
}
