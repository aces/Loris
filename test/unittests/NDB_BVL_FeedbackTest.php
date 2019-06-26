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
    protected function setUp(): void
    {
        parent::setUp();
        $this->createLorisDBConnection();
        $this->_feedbackObj = NDB_BVL_Feedback::singleton("karo_test", null, 11);
    }


    /**
     * Returns test data set.
     * Populates table feedback_bvl_type.
     *
     */
    protected function getDataSet()
    {
        $ds1 = $this->createMySQLXMLDataSet(
            TABLE_FIXTURES_PATH . 'feedback_bvl_type.xml'
        );
        $ds2 = $this->createMySQLXMLDataSet(
            TABLE_FIXTURES_PATH . 'psc.xml'
        );
        $ds3 = $this->createMySQLXMLDataSet(
            TABLE_FIXTURES_PATH . 'NDB_BVL_FeedbackTest.xml'
        );

        $compositeDs = new PHPUnit_Extensions_Database_DataSet_CompositeDataSet();
        $compositeDs->addDataSet($ds1);
        $compositeDs->addDataSet($ds2);
        $compositeDs->addDataSet($ds3);

        return $compositeDs;
    }

    /**
     * Test createFeedbackType passing an invalid name
     *
     * @covers NDB_BVL_Feedback::createFeedbackType
     * @throws LorisException
     * @return void
     */
    public function testCreateFeedbackTypeWithInvalidName(): void
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
    public function testCreateNewFeedbackType(): void
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
    public function testGetFeedbackTypeIdByNameForExistingValue(): void
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
    public function testGetFeedbackTypeIdByNameForNoneExistingValue(): void
    {
        $this->assertEmpty(
            $res = $this->_feedbackObj->getFeedbackTypeIdByName(
                'None existing value'
            )
        );
    }
}
