<?php declare(strict_types=1);
/**
 * AnonymousUser class tests
 *
 * PHP Version 7
 *
 * @category Tests
 * @package  Test
 * @author   Shen Wang <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

use \LORIS\AnonymousUser;
use PHPUnit\Framework\TestCase;
/**
 * Unit test for AnonymousUser class
 *
 * @category Tests
 * @package  Main
 * @author   Shen Wang <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class AnonymousUserTest extends TestCase
{
    /**
     * AnonymousUser object used for testing
     *
     * @var AnonymousUser object
     */
    private $anonymousUser;

    /**
     * This method is called before each test is executed.
     *
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();

        $this->anonymousUser = new AnonymousUser();

    }

    /**
     * Tests getSiteNames function which should return an empty array.
     *
     * @return void
     */
    public function testGetSiteNames(): void
    {
      $this->assertEquals(array(),$this->anonymousUser->getSiteNames());
    }
}

