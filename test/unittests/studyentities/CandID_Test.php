<?php declare(strict_types=1);

/**
 * This file contains unit test for the CandID value object.
 *
 * PHP Version 8
 *
 * @category Tests
 * @package  StudyEntities
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\StudyEntities\Candidate\Test;

require_once __DIR__ . '/../../../vendor/autoload.php';

use \PHPUnit\Framework\TestCase;
use \LORIS\StudyEntities\Candidate\CandID;

/**
 * Unit test class for the CandID value object
 *
 * PHP Version 8
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
     * Test CandID::getType()
     *
     * @return void
     */
    public function testGetType(): void
    {
        $candid = new CandID("123456");
        $this->assertEquals('CandID', $candid->getType());
    }

    /**
     * Test __toString()
     *
     * @return void
     */
    public function testToString(): void
    {
        $candid = new CandID("123456");
        $this->assertEquals('123456', (string)$candid);
    }
}

