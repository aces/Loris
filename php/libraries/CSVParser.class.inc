<?php declare(strict_types=1);

/**
 * This file contains a class used to parse csv files
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */

namespace LORIS;

use SplFileInfo;
use SplFileObject;

/**
 * This class is used as a helper for parsing csv files
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class CSVParser
{
    protected SplFileInfo $csvFile;
    /**
     * Construct parser
     *
     * @param SplFileInfo $csvFile csv file path
     *
     * @return void
     */
    public function __construct(SplFileInfo $csvFile)
    {
        if ($csvFile->getExtension() !== 'csv') {
            throw new \RuntimeException('Invalid file extension');
        }
        $this->csvFile = $csvFile;
    }

    /**
     * Check that headers match (equivalent arrays)
     *
     * @param array|false $headers         Headers parsed from csv file
     * @param array       $expectedHeaders Expected headers (ex: from instrument)
     * @param bool        $strict          If true, $headers cannot be a superset
     *                                     of $expectedHeaders
     *
     * @return bool                        Returns true if headers are valid
     */
    private function _validateHeaders(
        array|false $headers, array $expectedHeaders, bool $strict = false
    ): bool {
        if (!$headers || ($strict && count($headers) !== count($expectedHeaders))
        ) {
            return false;
        }

        $matchingHeaders = true;
        foreach ($expectedHeaders as $expectedHeader) {
            if (!in_array($expectedHeader, $headers)) {
                error_log("Header not found: $expectedHeader");
                $matchingHeaders = false;
                break;
            }
        }
        return $matchingHeaders;
    }

    /**
     * Parses the csv file
     *
     * @param array  $expectedHeaders Expected headers. Leave empty to
     *                                skip validation
     * @param string $separator       The field delimiter (one character only).
     *                                Defaults as a comma.
     * @param string $enclosure       The field enclosure character
     *                                (one character only).
     *                                Defaults as a double quotation mark
     * @param string $escape          The escape character (one character only).
     *                                Defaults as backslash
     * @param int    $flags           Bit mask of the flags to set.
     *                                See SplFileObject constants
     *                                for the available flags.
     *                                Default is:
     *                                SplFileObject::READ_CSV |
     *                                SplFileObject::DROP_NEW_LINE |
     *                                SplFileObject::SKIP_EMPTY |
     *                                SplFileObject::READ_AHEAD
     *
     * @return array                  Returns array of header->value mapping
     *
     * Example with defaults:
     * csv file:    A,B,C
     *              1,e,3
     *              4,"5",w
     *
     * output:      [
     *                  [ [A] => 1, [B] => e, [C] => 3 ],
     *                  [ [A] => 4, [B] => 5, [C] => w ]
     *              ]
     */
    public function parse(
        array $expectedHeaders = [],
        string $separator = ',',
        string $enclosure = '"',
        string $escape = '\\',
        int $flags
        =
        SplFileObject::READ_CSV |
        SplFileObject::DROP_NEW_LINE |
        SplFileObject::SKIP_EMPTY |
        SplFileObject::READ_AHEAD,
    ): array {
        $fileObject = new SplFileObject($this->csvFile->getRealPath());
        $fileObject->setFlags($flags);

        $csvHeaders = $fileObject->fgetcsv($separator, $enclosure, $escape);

        // Validate expected headers, if provided
        if (count($expectedHeaders) > 0) {
            if (!$this->_validateHeaders($csvHeaders, $expectedHeaders)) {
                throw new \RuntimeException(
                    'File headers do not match expected headers'
                );
            }
        }

        // Parse and create header => value mapping
        $csv = [];
        while ($row = $fileObject->fgetcsv($separator, $enclosure, $escape)) {
            $csv[] = array_combine($csvHeaders, $row);
        }
        return $csv;
    }
}
