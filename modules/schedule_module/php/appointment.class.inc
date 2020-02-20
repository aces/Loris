<?php
/**
 * This file loads the Edit file page
 *
 * PHP Version 7
 *
 * @category Loris
 * @package  Document_Repository
 * @author   Shen Wang <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\schedule_module;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
/**
 * Create the form for schedule_module/add page
 *
 * @category Loris
 * @package  Document_Repository
 * @author   Shen Wang <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

class Appointment extends \NDB_Page
{
    public $skipTemplate = true;
    /**
     * Check user permissions
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasPermission('schedule_module');
    }

    /**
     * Handle how to operate all the files.
     * PUT method updates a file's info.
     * DELETE method deletes a file.
     * POST method uploads a file.
     * GET method gets a file.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        switch ($request->getMethod()) {
        case "POST":
            $data = $request->getParsedBody();
            $this->addAppointment($data);
            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "text/plain")
                ->withStatus(200)
                ->withBody(
                    new \LORIS\Http\StringStream(
                        json_encode("appointment added")
                    )
                );
        case "PUT":
            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "text/plain")
                ->withStatus(200)
                ->withBody(
                    new \LORIS\Http\StringStream(
                        json_encode("put")
                    )
                );
        case "DELETE":
            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "text/plain")
                ->withStatus(200)
                ->withBody(
                    new \LORIS\Http\StringStream(
                        json_encode("file deleted")
                    )
                );
        case "GET":
            // todo get session or pscid or dcciid
            $url = $request->getUri()->getPath();
            $type = "DCCID";
            $id = basename($request->getUri()->getPath());
            if (strpos($url, 'PSCID') !== false) {
               $type = "PSCID";
            }
            $res = $this->getMetaForm($type,$id); 
            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "text/plain")
                ->withStatus(200)
                ->withBody(
                    new \LORIS\Http\StringStream(
                        json_encode($res)
                    )
                );
        default:
            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "text/plain")
                ->withStatus(405)
                ->withHeader("Allow", "GET,POST,PUT,DELETE");
        }
    }
    public function getMetaForm(string $type,string $id)
    {
        $factory = \NDB_Factory::singleton();
        $DB      = $factory->database();
// Check if candidate is valid (CandID/DCCID and PSCID must belong to same candidate)
    if ($type == "DCCID" ) { 
        $candidate = $DB->pselectRow(
        "
    	SELECT 
    	 	* 
        FROM 
    	  	candidate 
    	WHERE 
    		CandID = :candId
       ",
           array(
              "candId" => $id,
           )
         );
     $res = ['PSCID'=>$candidate['PSCID']];
     } else {
           $candidate = $DB->pselectRow(
           "
            SELECT 
                    * 
            FROM 
                    candidate 
            WHERE 
                    PSCID = :pscid
            ",
              array(
                 "pscid" => $id,
             )
         );
      $res = ['DCCID'=>$candidate['CandID']];
      }
          
    $sessionlist = $DB->pselect(
    "
        SELECT
            ID,
            Visit_label
        FROM
            session
        WHERE 
    		CandID =:Id
    ",
       array(
        'Id' => $candidate['CandID']
       )
    ); 
     $sessions = [];
     foreach($sessionlist as $session) {
         $k = $session['ID'];
         $v = $session['Visit_label'];
         $sessions[$k] = $v; 
     }
     $res['Session'] = $sessions;
     return $res;
    } // class 

    public function addAppointment(array $data)
    {
        $factory = \NDB_Factory::singleton();
        $DB      = $factory->database();
       $startAt = $data['AppointmentDate']." ".$data['AppointmentTime'].":00";

      // Check if Appointment Type is valid/exists
       $AppointmentTypeID = $DB->pselectOne(
       "
        SELECT 
            AppointmentTypeID 
        FROM 
            appointment_type 
        WHERE 
            Name = :name
       ",
        array("name" => $data['AppointmentType'])
       );

       
       $duplicate_check = $DB->pselectRow(
        "
           SELECT 
                * 
            FROM 
                appointment 
            WHERE 
                SessionID = :sessionId
            AND 
                AppointmentTypeID = :appointmentTypeId
            AND 
                StartsAt = :startsAt
        ",
        array(
            "sessionId" => $data["Session"],
            "appointmentTypeId" => $AppointmentTypeID,
            "startsAt" => $startAt,
        )
       ); // end of $duplicate_check
    if (!empty($duplicate_check)) {
    http_response_code(400);
    die(json_encode([
        "error" => "This appointment already exists."
    ]));
    }
// Insert appointment information
     $DB->insert(
        "appointment",
        array(
             "SessionId" => $data["Session"],
             "AppointmentTypeId" => $AppointmentTypeID,
             "StartsAt" => $startAt,     
         )
    );
      
  } // end add appointment   
}// end
