<?php declare(strict_types=1);

namespace LORIS\redcap\models\records;

/**
 * This interface allows for type abstraction of REDCap records
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
interface IRedcapRecord
{
    public function getFormName(): string;
    public function getInstrumentName(): string;
    public function getPropertyNames(): array;
}
