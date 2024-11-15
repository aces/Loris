<?php declare(strict_types=1);

/**
 * Unit test for CSV Parser class
 *
 * PHP Version 8
 *
 * @category Tests
 * @package  Main
 * @author   Jefferson Casimir <jefferson.casimir@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris
 */
require_once __DIR__ . '/../../vendor/autoload.php';

use PHPUnit\Framework\TestCase;
/**
 * Unit test for CSV Parser class
 *
 * @category Tests
 * @package  Main
 * @author   Jefferson Casimir <jefferson.casimir@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris
 */
class CSVParserTest extends TestCase
{
    /**
     * Setup
     *
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();
    }

    /**
     * Tears down the fixture, for example, close a network connection.
     * This method is called after a test is executed.
     *
     * @return void
     */
    protected function tearDown(): void
    {
        parent::tearDown();
    }

    /**
     * DataProviders for constructor valid CSV files
     *
     * @return array[]
     */
    public function validCSVFiles(): array
    {
        $filePaths = [];
        $filePath  = tempnam(sys_get_temp_dir(), 'test_') . '.csv';
        $csvData   = <<<CSV
header1,header2,header3
value1,"value2",value3\n

value4,value5,value6
CSV;    // Empty line above was left intentionally
        file_put_contents($filePath, $csvData);
        $filePaths[] = [$filePath];

        return $filePaths;
    }

    /**
     * Test the CSVParser with valid CSVs
     *
     * @param string $validCSVPath Valid CSV path
     *
     * @dataProvider validCSVFiles
     *
     * @expectedException \InvalidArgumentException
     * @return            void
     */
    public function testCSVParser(string $validCSVPath): void
    {
        $csvParser       = new \LORIS\CSVParser(new SplFileInfo($validCSVPath));
        $expectedHeaders = ['header1', 'header2', 'header3'];
        $data            = $csvParser->parse($expectedHeaders);
        // Tests: All flags and Field enclosure character (")
        $this->assertEquals(
            [
                [
                    'header1' => 'value1',
                    'header2' => 'value2',
                    'header3' => 'value3'
                ],
                [
                    'header1' => 'value4',
                    'header2' => 'value5',
                    'header3' => 'value6'
                ],
            ],
            $data
        );
    }

    /**
     * DataProviders for constructor valid CSV files
     *
     * @return array[]
     */
    public function invalidCSVFiles(): array
    {
        $filePaths = [];

        // Test invalid file extension (not .csv)
        $invalidExtensionFilePath
            = tempnam(sys_get_temp_dir(), '_RuntimeException_') . '.csw';
        file_put_contents($invalidExtensionFilePath, '');
        $filePaths[] = [$invalidExtensionFilePath];

        $incongruentData = <<<CSV
header1,header2,header3
value1,value2
value4,value5,value6
CSV;
        // Test omitting a column in a row
        $incongruentDataFilePath
            = tempnam(sys_get_temp_dir(), '_ValueError_') . '.csv';
        file_put_contents($incongruentDataFilePath, $incongruentData);
        $filePaths[] = [$incongruentDataFilePath];

        $unexpectedHeaders = <<<CSV
header5,header6,header7
value1,value2, value3
value4,value5,value6
CSV;
        // Test unexpected headers
        $unexpectedHeadersFilePath
            = tempnam(sys_get_temp_dir(), '_RuntimeException_') . '.csv';
        file_put_contents($unexpectedHeadersFilePath, $unexpectedHeaders);
        $filePaths[] = [$unexpectedHeadersFilePath];

        return $filePaths;
    }


    /**
     * Test the CSVParser with invalid CSVs
     *
     * @param string $invalidCSVPath Invalid CSV path
     *
     * @dataProvider invalidCSVFiles
     *
     * @expectedException \InvalidArgumentException
     * @return            void
     */
    public function testInvalidCSV(string $invalidCSVPath): void
    {
        $expectedException = explode('_', $invalidCSVPath)[1];
        if (strlen($expectedException) > 0) {
            $this->expectException($expectedException);
        }

        $csvParser       = new \LORIS\CSVParser(new SplFileInfo($invalidCSVPath));
        $expectedHeaders = ['header1', 'header2', 'header3'];
        $data            = $csvParser->parse($expectedHeaders);
        $this->assertEquals(
            [
                [
                    'header1' => 'value1',
                    'header2' => 'value2',
                    'header3' => 'value3'
                ],
                [
                    'header1' => 'value4',
                    'header2' => 'value5',
                    'header3' => 'value6'
                ],
            ],
            $data
        );
    }
}
