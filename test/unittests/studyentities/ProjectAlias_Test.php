<?php declare(strict_types=1);
/**
 * This file contains unit test for the CandID value object.
 *
 * PHP Version 7
 *
 * @category Tests
 * @package  StudyEntities
 * @author   John Saigle <john.saigle@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\StudyEntitites\Candidate\Test;

require_once __DIR__ . '/../../../vendor/autoload.php';

use \PHPUnit\Framework\TestCase;
use \LORIS\StudyEntities\Candidate\ProjectAlias;

/**
 * Unit test class for the CandID value object
 *
 * PHP Version 7
 *
 * @category Tests
 * @package  StudyEntities
 * @author   John Saigle <john.saigle@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class ProjectAlias_Test extends TestCase
{
    /*
     * dataProviders for constructor invalid values
     */
    public function invalidValues(): array
    {
        return array(
                [str_repeat('A', ProjectAlias::MIN_LENGTH - 1)],
                [str_repeat('A', ProjectAlias::MAX_LENGTH + 1)],
                [str_repeat('1', ProjectAlias::MAX_LENGTH)],
                [str_repeat('*', ProjectAlias::MAX_LENGTH)],
                [str_repeat('*', ProjectAlias::MAX_LENGTH)],
                [str_repeat("\0", ProjectAlias::MAX_LENGTH)],
               );
    }

    /**
     * @dataProvider invalidValues
     * @expectedException \DomainException
     */
    public function testContructorInvalidValues($invalidValue): void
    {
        $alias = new ProjectAlias($invalidValue);
    }

    public function testGetType(): void
    {
        // Create a valid Project Alias.
        $alias = new ProjectAlias(
            \Utility::randomAlphabeticalString(
                ProjectAlias::MAX_LENGTH
            )
        );

        $this->assertEquals('ProjectAlias', $alias->getType());
    }

    public function testToString(): void
    {
        // Create a valid Project Alias.
        $validAliasString = str_repeat('A', ProjectAlias::MAX_LENGTH);
        $this->assertEquals(
            'ProjectAlias',
            (string) new ProjectAlias($validAliasString)
        );
    }
}

