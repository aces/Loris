<?php

require_once __DIR__ . "/LorisIntegrationTest.class.inc";

/**
 * This contains an abstract class for Loris tests to extend.
 * It sets up the database handler, creates a user, creates a
 * webDriver instance, and logs in so that tests can focus on
 * the module being tested and not the overhead of logging in
 * to Loris.
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Test
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

require_once __DIR__ . "/LorisIntegrationTest.class.inc";
/**
 * Implementation of LorisIntegrationTest helper class.
 *
 * @category Test
 * @package  Test
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
abstract class LorisIntegrationTestDashboardWithPermission extends LorisIntegrationTest
{

    /**
     * Does basic setting up of Loris variables for this test, such as
     * instantiting the config and database objects, creating a user
     * to user for the tests, and logging in, and creating a candidate
     * with a session
     *
     * @return none
     */
   
    public function removePermissionFrom($id){
        $this->DB->delete("user_perm_rel", array('userID' => '900000','permID' => $id));
    }
}
?>
