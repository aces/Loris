<?php

require_once __DIR__ . "/LorisIntegrationTest.class.inc";

/**
 * This contains an abstract class for Loris tests to extend.
 * Insert testing data and delete testing data from database.
 * 
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
abstract class LorisIntegrationTestForDocRepo extends LorisIntegrationTest
{

    /**
     * Does basic setting up of Loris variables for this test,after testing
     * a test data, remove the testing data from database.
     * @return none
     */
    public function setUp()
    {
        parent::setUp();

    }

    public function tearDown() {
        $this->DB->delete("document_repository_categories", 
                      array('category_name' => 'TestTestTest','category_name' => 'test'));
        parent::tearDown();
    }
}
?>
