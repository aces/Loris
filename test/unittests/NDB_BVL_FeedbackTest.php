<?php

/**
 * NDB_BVL_Feedback class tests
 *
 * PHP Version 5
 *
 * @category Tests
 * @package  Test
 * @author   Karolina Marasinska <karolinam.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */


/**
 * Class NDB_BVL_FeedbackTest
 *
 * @category Tests
 * @package  Test
 * @author   Karolina Marasinska <karolinam.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class NDB_BVL_FeedbackTest extends Loris_PHPUnit_Database_TestCase
{

    /**
     * NDB_BVL_Feedback object used for testing
     *
     * @var NDB_BVL_Feedback
     */
    private $_feedbackObj;


    /**
     * Setup test
     *
     * @throws Exception
     * @return void
     */
    protected function setUp()
    {
        parent::setUp();
        $this->createLorisDBConnection();
        $this->_feedbackObj = NDB_BVL_Feedback::singleton("karo_test", null, 11);
    }

    /**
     * Test createFeedbackType passing an invalid name
     *
     * @covers NDB_BVL_Feedback::createFeedbackType
     * @throws LorisException
     * @return void
     */
    public function testCreateFeedbackTypeWithInvalidName()
    {
        $this->setExpectedException('LorisException');
        $this->_feedbackObj->createFeedbackType("");
    }

    /**
     * Test createFeedbackType: create a new valid feedback type
     *
     * @covers NDB_BVL_Feedback::createFeedbackType
     * @throws LorisException
     * @return void
     */
    public function testCreateNewFeedbackType()
    {
        $this->assertEquals(
            6,
            $this->_feedbackObj->createFeedbackType(
                'New Test Type',
                'Created from PHPUnit tests'
            )
        );
    }

    /**
     * Test getFeedbackTypeIdByName for existing name
     *
     * @covers NDB_BVL_Feedback::getFeedbackTypeIdByName
     * @return void
     */
    public function testGetFeedbackTypeIdByNameForExistingValue()
    {
        $this->assertEquals(
            5,
            $this->_feedbackObj->getFeedbackTypeIdByName('Other')
        );

    }

    /**
     * Test getFeedbackTypeIdByName for value which does not exist
     * in feedback_bvl_type table
     *
     * @covers NDB_BVL_Feedback::getFeedbackTypeIdByName
     * @return void
     */
    public function testGetFeedbackTypeIdByNameForNoneExistingValue()
    {
        $this->assertEmpty(
            $res = $this->_feedbackObj->getFeedbackTypeIdByName(
                'None existing value'
            )
        );
    }
}
