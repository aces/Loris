<?php declare(strict_types=1);

use LORIS\StudyEntities\DataInstanceAccess;
use PHPUnit\Framework\TestCase;

/**
 * Unit tests for DataInstanceAccess helper methods.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class DataInstanceAccessTest extends TestCase
{
    /**
     * Verify center matching works with a single center getter.
     *
     * @return void
     */
    public function testCenterMatchWithSingleCenter(): void
    {
        $resource = new class () {
            /**
             * Return center for this fake resource.
             *
             * @return \CenterID
             */
            public function getCenterID(): \CenterID
            {
                return \CenterID::singleton(1);
            }
        };

        $user = $this->getMockBuilder(\User::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['hasCenter'])
            ->getMock();
        $user->expects($this->once())
            ->method('hasCenter')
            ->with(\CenterID::singleton(1))
            ->willReturn(true);

        $this->assertTrue(DataInstanceAccess::centerMatch($user, $resource));
    }

    /**
     * Verify center matching succeeds when one center matches in a list.
     *
     * @return void
     */
    public function testCenterMatchWithMultipleCenters(): void
    {
        $resource = new class () {
            /**
             * Return center IDs for the anonymous test resource.
             *
             * @return int[]
             */
            public function getCenterIDs(): array
            {
                return [5, 7];
            }
        };

        $user = $this->getMockBuilder(\User::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['hasCenter'])
            ->getMock();
        $user->expects($this->exactly(2))
            ->method('hasCenter')
            ->willReturnOnConsecutiveCalls(false, true);

        $this->assertTrue(DataInstanceAccess::centerMatch($user, $resource));
    }

    /**
     * Verify project matching accepts scalar project IDs.
     *
     * @return void
     */
    public function testProjectMatchWithScalarProject(): void
    {
        $resource = new class () {
            /**
             * Return project for this fake resource.
             *
             * @return int
             */
            public function getProjectID(): int
            {
                return 3;
            }
        };

        $user = $this->getMockBuilder(\User::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['hasProject'])
            ->getMock();
        $user->expects($this->once())
            ->method('hasProject')
            ->with(\ProjectID::singleton(3))
            ->willReturn(true);

        $this->assertTrue(DataInstanceAccess::projectMatch($user, $resource));
    }

    /**
     * Verify allowNullProject behavior for null project IDs.
     *
     * @return void
     */
    public function testProjectMatchHandlesNullProjectByFlag(): void
    {
        $resource = new class () {
            /**
             * Return null project for this fake resource.
             *
             * @return ?\ProjectID
             */
            public function getProjectID(): ?\ProjectID
            {
                return null;
            }
        };

        $user = $this->getMockBuilder(\User::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['hasProject'])
            ->getMock();
        $user->expects($this->never())->method('hasProject');

        $this->assertFalse(DataInstanceAccess::projectMatch($user, $resource));
        $this->assertTrue(DataInstanceAccess::projectMatch($user, $resource, true));
    }

    /**
     * Verify combined center/project matching requires both checks.
     *
     * @return void
     */
    public function testCenterAndProjectMatchRequiresBoth(): void
    {
        $resource = new class () {
            /**
             * Return center for this fake resource.
             *
             * @return \CenterID
             */
            public function getCenterID(): \CenterID
            {
                return \CenterID::singleton(1);
            }

            /**
             * Return project for this fake resource.
             *
             * @return \ProjectID
             */
            public function getProjectID(): \ProjectID
            {
                return \ProjectID::singleton(2);
            }
        };

        $user = $this->getMockBuilder(\User::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['hasCenter', 'hasProject'])
            ->getMock();
        $user->method('hasCenter')->willReturn(true);
        $user->method('hasProject')->willReturn(false);

        $this->assertFalse(
            DataInstanceAccess::centerAndProjectMatch($user, $resource)
        );
    }

    /**
     * Verify missing center/project getters fail closed.
     *
     * @return void
     */
    public function testMissingGettersReturnFalse(): void
    {
        $resource = new class () {
        };

        $user = $this->getMockBuilder(\User::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['hasCenter', 'hasProject'])
            ->getMock();
        $user->expects($this->never())->method('hasCenter');
        $user->expects($this->never())->method('hasProject');

        $this->assertFalse(DataInstanceAccess::centerMatch($user, $resource));
        $this->assertFalse(DataInstanceAccess::projectMatch($user, $resource));
    }

    /**
     * Verify invalid scalar IDs fail closed.
     *
     * @return void
     */
    public function testInvalidScalarIdentifiersReturnFalse(): void
    {
        $resource = new class () {
            /**
             * Return invalid center value for this fake resource.
             *
             * @return string
             */
            public function getCenterID(): string
            {
                return 'invalid-center';
            }

            /**
             * Return invalid project value for this fake resource.
             *
             * @return string
             */
            public function getProjectID(): string
            {
                return 'invalid-project';
            }
        };

        $user = $this->getMockBuilder(\User::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['hasCenter', 'hasProject'])
            ->getMock();
        $user->expects($this->never())->method('hasCenter');
        $user->expects($this->never())->method('hasProject');

        $this->assertFalse(DataInstanceAccess::centerMatch($user, $resource));
        $this->assertFalse(DataInstanceAccess::projectMatch($user, $resource));
        $this->assertFalse(
            DataInstanceAccess::centerAndProjectMatch($user, $resource)
        );
    }

    /**
     * Verify thrown getter exceptions fail closed.
     *
     * @return void
     */
    public function testThrowingGetterReturnsFalse(): void
    {
        $resource = new class () {
            /**
             * Throw to simulate broken accessor implementation.
             *
             * @return ?\ProjectID
             */
            public function getProjectID(): ?\ProjectID
            {
                throw new \RuntimeException('broken getter');
            }
        };

        $user = $this->getMockBuilder(\User::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['hasProject'])
            ->getMock();
        $user->expects($this->never())->method('hasProject');

        $this->assertFalse(DataInstanceAccess::projectMatch($user, $resource));
        $this->assertFalse(DataInstanceAccess::projectMatch($user, $resource, true));
    }
}
