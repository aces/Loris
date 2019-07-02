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
    /*
     * dataProviders for constructor invalid values
     */
    public function invalidValues(): array
    {
        return array(
                ['A'],
                [1],
                [000000],
                ['11111a'],
                [' 11111'],
               );
    }

    /**
     * @dataProvider invalidValues
     */
    public function testContructorInvalidValues($invalidValue): void
    {
        $this->expectExceptionMessage('DomainException');
        $candid = new CandID($invalidValue);
    }

    public function testGetType(): void
    {
        $candid = new CandID(123456);
        $this->assertEquals('CandID', $candid->getType());
    }

    public function testToString(): void
    {
        $candid = new CandID(123456);
        $this->assertEquals('123456', (string) $candid);
    }
}

