<?php
    require_once(__DIR__ . "/../../../../vendor/autoload.php");
    use PHPUnit\Framework\TestCase;
    
    class UtilityTest extends TestCase {
        public function testCrunch () {
            //Yes, this is what should happen if you pass
            //`true`, `false` into crunch()
            $this->assertEquals(
                Utility::crunch(true, false),
                "1`"
            );
            
            //empty(false) == true ...
            $this->assertEquals(
                Utility::crunch(false, true),
                true
            );
            
            $this->assertEquals(
                Utility::crunch(
                    array(100, 101, 102, 103, 104),
                    array(0, 1, 2, 3)
                ),
                "100`0"
            );
            
            //empty(0) == true ...
            $this->assertEquals(
                Utility::crunch(
                    array(0, 1, 2, 3),
                    array(100, 101, 102, 103, 104)
                ),
                100
            );
            
            $this->assertEquals(
                Utility::crunch(
                    false,
                    null
                ),
                null
            );
        }
        /**
         * @depends testCrunch
         */
        public function testReduce () {
            
        }
    }
?>