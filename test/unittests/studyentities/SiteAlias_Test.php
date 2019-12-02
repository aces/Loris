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
use \LORIS\StudyEntities\Candidate\SiteAlias;

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
class SiteAlias_Test extends TestCase
{
    /*
     * dataProviders for constructor invalid values
     */
    public function invalidValues(): array
    {
        return array(
                [str_repeat('A', SiteAlias::MIN_LENGTH - 1)],
                [str_repeat('A', SiteAlias::MAX_LENGTH + 1)],
                [str_repeat('1', SiteAlias::MAX_LENGTH)],
                [str_repeat('*', SiteAlias::MAX_LENGTH)],
                [str_repeat('*', SiteAlias::MAX_LENGTH)],
                [str_repeat("\0", SiteAlias::MAX_LENGTH)],
               );
    }

    /**
     * @dataProvider invalidValues
     * @expectedException \DomainException
     */
    public function testContructorInvalidValues($invalidValue): void
    {
        $alias = new SiteAlias($invalidValue);
    }

    public function testGetType(): void
    {
        // Create a valid Site Alias.
        $alias = new SiteAlias(
            \Utility::randomAlphabeticalString(
                SiteAlias::MAX_LENGTH
            )
        );

        $this->assertEquals('SiteAlias', $alias->getType());
    }

    public function testToString(): void
    {
        // Create a valid Site Alias.
        $validAliasString = str_repeat('A', SiteAlias::MAX_LENGTH);
        echo "Valid alias string is $validAliasString\n";
        $this->assertEquals(
            'SiteAlias',
            (string) new SiteAlias($validAliasString)
        );
    }
}

