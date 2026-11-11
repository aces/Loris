<?php declare(strict_types=1);

/**
 * Saved query result filtering tests.
 *
 * PHP Version 8
 *
 * @category Tests
 * @package  Test
 * @author   ayushmaan-16 <ayushmaan.sharma911@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

use LORIS\dataquery\endpoints\queries\query\run\Run;
use LORIS\StudyEntities\Candidate\CandID;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

require_once __DIR__
    . '/../../modules/dataquery/php/endpoints/queries/query/run/run.class.inc';

/**
 * Verify that saved results retain only accessible candidate rows.
 *
 * @category Tests
 * @package  Test
 * @author   ayushmaan-16 <ayushmaan.sharma911@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class QueryRunResultsTest extends TestCase
{
    /**
     * Verify filtering without opening a database connection.
     *
     * @param string[] $allowed  Accessible CandIDs
     * @param array    $rows     Input rows
     * @param array    $expected Decoded output rows
     *
     * @return void
     */
    #[DataProvider('resultCases')]
    public function testFiltersResults(
        array $allowed,
        array $rows,
        array $expected
    ): void {
        $reflection = new ReflectionClass(Run::class);
        $run        = $reflection->newInstanceWithoutConstructor();
        $ids        = array_map(fn(string $id) => new CandID($id), $allowed);
        $method     = new ReflectionMethod(Run::class, '_jsondecoded');
        $results    = $method->invoke($run, new ArrayIterator($rows), $ids);
        self::assertInstanceOf(Traversable::class, $results);
        self::assertSame(
            json_encode($expected),
            json_encode(iterator_to_array($results))
        );
    }

    /**
     * Inputs cover access boundaries, ordering, duplicates and empty results.
     *
     * @return array<string, array{string[], array, array}>
     */
    public static function resultCases(): array
    {
        $first  = ['CandID' => '100001', 'RowData' => '{"value":"first"}'];
        $denied = ['CandID' => '100002', 'RowData' => '{"value":"denied"}'];
        $last   = ['CandID' => 100003, 'RowData' => '{"value":"last"}'];

        return [
            'mixed access and database ID types'    => [
                ['100001', '100003'],
                [$last, $denied, $first],
                [['value' => 'last'], ['value' => 'first']],
            ],
            'multiple rows for the same candidate'  => [
                ['100001'],
                [$first, $denied, $first],
                [['value' => 'first'], ['value' => 'first']],
            ],
            'no accessible candidates'              => [[], [$first], []],
            'no result rows'                        => [['100001'], [], []],
            'no matching candidates'                => [
                ['100003'],
                [$first, $denied],
                [],
            ],
            'ten digit identifiers and nested JSON' => [
                ['9000000000'],
                [
                    ['CandID' => '1000000000', 'RowData' => '{"value":false}'],
                    [
                        'CandID'  => '9000000000',
                        'RowData' => '{"value":{"items":[1,null]}}',
                    ],
                ],
                [['value' => ['items' => [1, null]]]],
            ],
        ];
    }
}
