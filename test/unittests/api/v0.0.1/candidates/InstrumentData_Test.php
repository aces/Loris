<?php
namespace Loris\Tests\API;
require_once __DIR__ . '/../../../../../vendor/autoload.php';
require_once __DIR__ . '/../../../../../htdocs/api/v0.0.1/candidates/InstrumentData.php';
require_once __DIR__ . "/../BaseTestCase.php";

class InstrumentData_Test extends BaseTestCase
{
    function testValidMethods() {

        $this->markTestSkipped(
          'Skipping test until we remove dependency on Quickform'
        );

        try {
            // Get the candidate data for the candidate set up in the base
            // class. Since the instrument data portion uses all sorts of static
            // methods from NDB_BVL_Instrument, use the flags which only uses
            // database calls
            $API = new \Loris\API\Candidates\Candidate\InstrumentData(
                "GET",
                "123456",
                "VisitTwo",
                "Test",
                false,
                true 
            );
        } catch(\Loris\API\SafeExitException $e) {
            $API = $e->Object;
        }

        $this->assertEquals($API->AllowedMethods, ['GET', 'PUT', 'PATCH', 'OPTIONS']);
    }
}
?>
