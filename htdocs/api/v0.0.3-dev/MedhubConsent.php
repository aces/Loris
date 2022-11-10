<?php


namespace Loris\API;
use http\Env\Response;

set_include_path(get_include_path() . ":" . __DIR__);
require_once 'APIBase.php';



class MedhubConsent extends APIBase {



    var $requestData;


    /**
     *  Candidates request handler
     *
     * @param string $method The HTTP request method of the request
     * @param array  $data   The data that was POSTed to the request
     */



    public function __construct($method, $data=null)
    {




        $this->AllowedMethods = [
            'PUT'
        ];

        $this->RequestData    = $data;

        parent::__construct($method);
    }



    public function handlePUT()
    {

        $token = null;
        $consentList = null;
        $candid = null;

        $data   = $this->RequestData;
        if ($data === null) {
            $this->header("HTTP/1.1 400 Bad Request");
            $this->error("Can't parse data");
            $this->safeExit(0);
        }


        if (!isset($data['Token'])) {
            $this->header("HTTP/1.1 400 Bad Request");
            $this->error("There is no Token object in the PUT data");
            $this->safeExit(0);
        }

        if (!isset($data['ConsentList'])) {
            $this->header("HTTP/1.1 400 Bad Request");
            $this->error("There is no Consent List object in the PUT data");
            $this->safeExit(0);
        }

        //Tries to select CandID + entry date for the given token --> later throws and error and dies if nothing found
        $token = $data['Token'];
        $consentList = $data['ConsentList'];

        $candidTimeUsed = $this->DB->pselectRow(
            "SELECT CandidateID, EntryDate, AlreadyUsed
                FROM medhub_token
             WHERE Token = :to
                ",
            ['to' => $token]
        );

        if (!isset($candidTimeUsed['EntryDate'],$candidTimeUsed['CandidateID'] )or isset($candidTimeUsed['AlreadyUsed'])){
            error_log("Error: No candidate found for token $token");
            $this->header("HTTP/1.1 400 Bad Request");
            $this->safeExit(0);
        }


        $entryDate = $candidTimeUsed['EntryDate'];
        $candid = $candidTimeUsed['CandidateID'];

        //Sets the already used marker in the token table
        $AlreadyUsed = array ('AlreadyUsed' => 'TRUE');
        $this->DB->update('medhub_token', $AlreadyUsed,['CandidateID' => $candid] );





        //Checks if token more than a ~month old
        if((time()-(60*60*24*30)) > strtotime($entryDate)){
            error_log("The Given Token is expired: we are unable to connect this to a file");
            $this->header("HTTP/1.1 400 Bad Request");
            $this->safeExit(0);
        }



        //TODO: Incude validation to make sure the consent object is complete (IE 9 rows), and that every row is complete!


        //Gets the mapping of consent IDs, Names, and Labels from the DB
        $consentIDLabel = $this->DB->pselectWithIndexKey(
            "SELECT ConsentID, Name, Label
                FROM consent" ,
        [], Name
        );


      foreach ($consentList as $conName => $conInfo){

          $consentID = $consentIDLabel[$conName]['ConsentID'];
          $consentLabel = $consentIDLabel[$conName]['Label'];

          $consentArray = [];

          $consentArray['ConsentName'] = $conName;
          $consentArray['ConsentLabel'] = $consentLabel;
          $consentArray['Status'] = $conInfo['Response'];
          $consentArray['DateGiven'] = $conInfo['Date'];
          $consentArray['ConsentID'] = $consentID;

          \Candidate::singleton($candid)->editConsentStatusFields($consentArray);


        }


        $this->header("HTTP/1.1 201 Created");

        /*TODO:Add Verification for TOKEN(?) and Consent List*/


        /* Creation Code for token table
         * CREATE TABLE `medhub_token` (
    `CandidateID` int(6) NOT NULL,
    `Token` varchar(255) NOT NULL,
    'AlreadyUsed' varchar(255) NOT NULL,
    `EntryDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `PK_medhub_token` PRIMARY KEY (`CandidateID`,`Token`),
    CONSTRAINT `FK_medhub_token_CandidateID` FOREIGN KEY (`CandidateID`) REFERENCES `candidate` (`CandID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;





        INSERT INTO medhub_token (CandidateID, Token) VALUES ('908028', 'Token765Yup');

        */




        /*TODO: For Loop: for all consents, loop thru, and call the singleton update consent (need to match consent param object)*/


        // create empty consent param array obj --> add candID, find consentID via name, answer = answer, date = date
        //Is consent history necessary?? could that be why I had problems??







    }


    function calculateETag()
    {

        $ETagCriteria = $this->DB->pselectRow(
            "SELECT MAX(TestDate) as Time,
                    COUNT(DISTINCT CandID) as NumCandidates
             FROM candidate WHERE Active='Y'",
            array()
        );
        return md5(
            'MedhubConsent:'
            . $ETagCriteria['Time']
            . ':' . $ETagCriteria['NumCandidates']
        );
    }


}

if (isset($_REQUEST['PrintCandidates'])) {
    if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $fp   = fopen("php://input", "r");
        $data = '';
        while (!feof($fp)) {
            $data .= fread($fp, 1024);
        }
        fclose($fp);

        $obj = new MedhubConsent($_SERVER['REQUEST_METHOD'], json_decode($data, true));
    } else {
        $obj = new MedhubConsent($_SERVER['REQUEST_METHOD']);
    }
    print $obj->toJSONString();
}












