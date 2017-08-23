<?php

namespace LorisScript;
/**
 *
 * PHP Version 7.0
 *
 * @category Tests
 * @package  Test
 * @author   Zain Virani <zvirani.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

/**
 * Class Loris_PHPUnit_Databse_TestCase
 *
 * @category Tests
 * @package  Test
 * @author   Zain Virani <zvirani.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class ParserTest extends \PHPUnit_Framework_TestCase
{
    public $scope;
    /**
     * Setup test
     *
     * @throws Exception
     * @return void
     */
    protected function setUp()
    {
        $this->scope = array(
            't1_arm_1'=>array(
                'site'=>'Montreal',
                'age_mths'=>144,
                'visit'=>'V1',
                'lang'=>array(
                    'en'=>true,
                    'fr'=>false
                ),
                4=>true,
            ),
            'a'=>1,
            'b'=>50,
            'c'=>100,
        );
        parent::setUp();
    }

    public function testNullString(){
        $equation = 'null';
        $expected = NULL;
        try {
            $res = Evaluator::evaluate($equation, $this->scope);
        } catch (Exception $e) {
            $res = "ERROR";
        }
        $this->assertEquals($res, $expected);
    }

    public function testAddition(){
        $equation = '10.842+3';
        $expected = 13.842;
        try {
            $res = Evaluator::evaluate($equation, $this->scope);
        } catch (Exception $e) {
            $res = "$e";
        }
        $this->assertEquals($res, $expected);
    }

	public function testSubtraction(){
        $equation = '10.842-3';
        $expected = '7.842';
        try {
            $res = Evaluator::evaluate($equation, $this->scope);
        } catch (Exception $e) {
            $res = "$e";
        }
        $this->assertEquals($res, $expected);
    }

	public function testNegative(){
        $equation = '10.842+(-3)';
        $expected = 7.842;
        try {
            $res = Evaluator::evaluate($equation, $this->scope);
        } catch (Exception $e) {
            $res = "$e";
        }
        $this->assertEquals($res, $expected);
    }

    public function testBooleanOps(){
        $equation = '(10>5) and not(10<5) and (50<>49.9999) and (true or false) and (10>=9) and (10=10) and (9<=9) and if(true, true, false) and if(false, false, true)';
        $expected = true;
        try {
            $res = Evaluator::evaluate($equation, $this->scope);
        } catch (Exception $e) {
            $res = "$e";
        }
        $this->assertEquals($res, $expected);
    }

    public function testMult(){
        $equation = '10*45';
        $expected = 450;
        try {
            $res = Evaluator::evaluate($equation, $this->scope);
        } catch (Exception $e) {
            $res = "$e";
        }
        $this->assertEquals($res, $expected);
    }

    public function testDiv(){
        $equation = '450/10';
        $expected = 45;
        try {
            $res = Evaluator::evaluate($equation, $this->scope);
        } catch (Exception $e) {
            $res = "$e";
        }
        $this->assertEquals($res, $expected);
    }

    public function testExp(){
        $equation = '10^3';
        $expected = 1000;
        try {
            $res = Evaluator::evaluate($equation, $this->scope);
        } catch (Exception $e) {
            $res = "$e";
        }
        $this->assertEquals($res, $expected);
    }

    public function testFact(){
        $equation = '5!';
        $expected = 120;
        try {
            $res = Evaluator::evaluate($equation, $this->scope);
        } catch (Exception $e) {
            $res = "$e";
        }
        $this->assertEquals($res, $expected);
    }

    public function testSqrt(){
        $equation = 'sqrt(25)';
        $expected = 5;
        try {
            $res = Evaluator::evaluate($equation, $this->scope);
        } catch (Exception $e) {
            $res = "$e";
        }
        $this->assertEquals($res, $expected);
    }

    public function testConstants(){
        $equation = 'E*PI';
        $expected = M_E*M_PI;
        try {
            $res = Evaluator::evaluate($equation, $this->scope);
        } catch (Exception $e) {
            $res = "$e";
        }
        $this->assertEquals($res, $expected);
    }

    public function testPer(){
        $equation = '45%';
        $expected = 0.45;
        try {
            $res = Evaluator::evaluate($equation, $this->scope);
        } catch (Exception $e) {
            $res = "$e";
        }
        $this->assertEquals($res, $expected);
    }

    public function testMod(){
        $equation = 'mod(51,7)';
        $expected = 2;
        try {
            $res = Evaluator::evaluate($equation, $this->scope);
        } catch (Exception $e) {
            $res = "$e";
        }
        $this->assertEquals($res, $expected);
    }

    public function testIsNaN(){
      $this->markTestSkipped("Following error must be fixed: is_nan() expects parameter 1 to be float, string given");
        $equation = '(isNan(45)=false) and (isNan("f")=true)';
        $expected = true;
        try {
            $res = Evaluator::evaluate($equation, $this->scope);
        } catch (Exception $e) {
            $res = "$e";
        }
        $this->assertEquals($res, $expected);
    }

    public function testRounding(){
        $equation = '(round(1.873524,3)=1.874) and (roundup(1.873,2)=1.88) and (rounddown(1.87,1)=1.8)';
        $expected = true;
        try {
            $res = Evaluator::evaluate($equation, $this->scope);
        } catch (Exception $e) {
            $res = "$e";
        }
        $this->assertEquals($res, $expected);
    }

    public function testAbs(){
        $equation = '(abs(1)=1) and (abs(-1)=1)';
        $expected = true;
        try {
            $res = Evaluator::evaluate($equation, $this->scope);
        } catch (Exception $e) {
            $res = "$e";
        }
        $this->assertEquals($res, $expected);
    }


    public function testMin(){
        $equation = 'min(10,9,-4,6,10,0,10)';
        $expected = -4;
        try {
            $res = Evaluator::evaluate($equation, $this->scope);
        } catch (Exception $e) {
            $res = "$e";
        }
        $this->assertEquals($res, $expected);
    }


    public function testMax(){
        $equation = 'max(10,9,-4,6,10,0,10)';
        $expected = 10;
        try {
            $res = Evaluator::evaluate($equation, $this->scope);
        } catch (Exception $e) {
            $res = "$e";
        }
        $this->assertEquals($res, $expected);
    }


    public function testMean(){
        $equation = 'mean(1,2,3,4,5)';
        $expected = 3;
        try {
            $res = Evaluator::evaluate($equation, $this->scope);
        } catch (Exception $e) {
            $res = "$e";
        }
        $this->assertEquals($res, $expected);
    }


    public function testMedian(){
        $equation = '(median(1,2,3,4,5)=3) and (median(4,3,2,5,1,6)=3.5)';
        $expected = true;
        try {
            $res = Evaluator::evaluate($equation, $this->scope);
        } catch (Exception $e) {
            $res = "$e";
        }
        $this->assertEquals($res, $expected);
    }

    public function testSum(){
        $equation = 'sum(1,2,3,4,5)';
        $expected = 15;
        try {
            $res = Evaluator::evaluate($equation, $this->scope);
        } catch (Exception $e) {
            $res = "$e";
        }
        $this->assertEquals($res, $expected);
    }

    public function testProduct(){
        $equation = 'product(1,2,3,4,5)';
        $expected = 120;
        try {
            $res = Evaluator::evaluate($equation, $this->scope);
        } catch (Exception $e) {
            $res = "$e";
        }
        $this->assertEquals($res, $expected);
    }

    public function testVariance(){
        $equation = 'variance(1,2,3,4,5)';
        $expected = 2;
        try {
            $res = Evaluator::evaluate($equation, $this->scope);
        } catch (Exception $e) {
            $res = "$e";
        }
        $this->assertEquals($res, $expected);
    }

    public function testStDev(){
        $equation = 'stdev(1,2,3,4,5)=sqrt(2)';
        $expected = true;
        try {
            $res = Evaluator::evaluate($equation, $this->scope);
        } catch (Exception $e) {
            $res = "$e";
        }
        $this->assertEquals($res, $expected);
    }

    public function testDateDiff(){
        $equation = 'datediff("2017-01-01","2018-07-01","y")';
        $expected = 1.5;
        try {
            $res = Evaluator::evaluate($equation, $this->scope);
        } catch (Exception $e) {
            $res = "$e";
        }
        $this->assertEquals($res, $expected);
    }

    public function testString(){
        $equation = '"STRINGS"';
        $expected = "STRINGS";
        try {
            $res = Evaluator::evaluate($equation, $this->scope);
        } catch (Exception $e) {
            $res = "$e";
        }
        $this->assertEquals($res, $expected);
    }

    public function testScope(){
		$equation = '[t1_arm_1][lang][en]';
        $expected = true;                                                                                                         
        try {                                                                                                                          
            $res = Evaluator::evaluate($equation, $this->scope);                                                                       
        } catch (Exception $e) {
            $res = "$e";
        }
        $this->assertEquals($res, $expected);                                                                                          
    }

    public function testNestedScope(){
        $equation = '[t1_arm_1(4)]';
        $expected = true;
        try {
            $res = Evaluator::evaluate($equation, $this->scope);
        } catch (Exception $e) {
            $res = "$e";
        }
        $this->assertEquals($res, $expected);
    }

    public function testNestedNestedScope(){
        $equation = '[t1_arm_1(lang)][fr]';
        $expected = false;
        try {
            $res = Evaluator::evaluate($equation, $this->scope);
        } catch (Exception $e) {
            $res = "$e";
        }
        $this->assertEquals($res, $expected);
    }
}
