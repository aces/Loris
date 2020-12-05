<?php
/**
 * This file contains unit test for the CandID value object.
 *
 * PHP Version 7
 *
 * @category Tests
 * @package  StudyEntities
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\StudyEntitites\Candidate\Test;

require_once __DIR__ . '/../../../vendor/autoload.php';

use \PHPUnit\Framework\TestCase;
use \LORIS\StudyEntities\Candidate\CandID;

/**
 * Unit test class for the CandID value object
 *
 * PHP Version 7
 *
 * @category Tests
 * @package  StudyEntities
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class CandID_Test extends TestCase
{
    /**
     * DataProviders for constructor invalid values
     *
     * @return []
     */
    public function invalidValues(): array
    {
        return [
            ['A'],
            [1],
            [000000],
            ['11111a'],
            [' 11111'],
            ['111111a'],
            ['a111111'],
            ['1111111']
        ];
    }

    /**
     * Test the CandID constructor with invalid values
     *
     * @param string $invalidValue An invalid value
     *
     * @dataProvider invalidValues
     *
     * @expectedException DomainException
     * @return            void
     */
    public function testContructorInvalidValues($invalidValue): void
    {
       $this->expectException("DomainException");
       $candid = new CandID($invalidValue);
    }

    /**
     * Test CandID::getType()
     *
     * @return void
     */
    public function testGetType(): void
    {
        $candid = new CandID(123456);
        $this->assertEquals('CandID', $candid->getType());
    }

    /**
     * Test __toString()
     *
     * @return void
     */
    public function testToString(): void
    {
        $candid = new CandID(123456);
        $this->assertEquals('123456', (string) $candid);
    }
}

