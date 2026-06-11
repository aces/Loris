<?php declare(strict_types=1);

 require_once __DIR__
    . "/../../../test/integrationtests/LorisIntegrationTest.class.inc";

/**
 * BiobankIntegrationTest automated integration tests
 *
 * PHP Version 8
 *
 * @category Test
 * @package  Loris
 * @author   Henri Rabalais <henri.j.rabalais@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class BiobankIntegrationTest extends LorisIntegrationTest
{
    /**
     * Ensures that the module loads if and only if the user has one of the
     * module permissions codes.
     *
     * @return void
     */
    public function testPermissions(): void
    {
        $this->checkPagePermissions(
            '/biobank/',
            [
                'biobank_specimen_view',
                'biobank_container_view',
                'biobank_pool_view',
            ],
            "Biobank"
        );
    }
}
