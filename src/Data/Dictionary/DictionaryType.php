<?php
namespace LORIS\Data\Dictionary;

/**
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
interface DictionaryType
{
    public function asSQLType() : string;
}
