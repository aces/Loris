<?php declare(strict_types=1);
namespace LORIS\schedule_module;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
/**
 * Create the form for schedule_module/add page
 * It includes three functions.
 * Post method handles updating and add an appointment.
 * Delete method handles deleting an appointment.
 * get method handles get an appointments.*
 * PHP Version 7
 *
 * @category Loris
 * @package  Schedule_Module
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
     * Handle how to operate all the appointments.
     * DELETE method deletes an appointment.
     * POST method uploads an appointment.
     * GET method gets an appointment.
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
            if ( isset($data["edit"]) && ($data["edit"] == "true") ) {
                $this->editAppointment($data);
            } else {
                $this->addAppointment($data);
            }
            return new \LORIS\Http\Response\JSON\OK(['appointment added']);
        case "GET":
            // todo get session or pscid or dcciid
            $url  = $request->getUri()->getPath();
            $type = "Edit";
            $id   = basename($request->getUri()->getPath());
            if (strpos($url, 'PSCID') !== false) {
                $type = "PSCID";
            }
            if (strpos($url, 'DCCID') !== false) {
                $type = "DCCID";
            }
            if ($type == "Edit") {
                $res = $this->getEditForm($id);
            } else {
                $res = $this->getMetaForm($type, $id);
            }
            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "text/plain")
                ->withBody(
                    new \LORIS\Http\StringStream(
                        json_encode($res)
                    )
                );
        case "DELETE":
            $id = basename($request->getUri()->getPath());
            $this->deleteAppointment($id);
            return new \LORIS\Http\Response\JSON\OK(['appointment deleted']);
        default:
            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "text/plain")
                ->withHeader("Allow", "GET,POST");
        }
    }
    /**
     * Handles the get all pscid, dccid relative data and session
     * ex. .../dccid/300001 will return pscid mtl001 and session id
     * ex. .../pscid/mtl001 will return dccid 300001 and session id
     *
     * @param string $type the tpye  (dccid or pscid)
     * @param string $id   the id   id of dccid or pscid
     *
     * @return array all the meta form
     */
    public function getMetaForm(string $type,string $id): array
    {
        $factory = \NDB_Factory::singleton();
        $DB      = $factory->database();
        // Check if candidate is valid
        // (CandID/DCCID and PSCID must belong to same candidate)
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
                [
                    "candId" => $id,
                ]
            );
            $res       = ['PSCID'=>$candidate['PSCID'] ?? ''];
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
                [
                    "pscid" => $id,
                ]
            );
            $res       = ['DCCID'=>$candidate['CandID'] ?? ''];
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
            [
                'Id' => $candidate['CandID'] ?? ''
            ]
        );
        $sessions    = [];
        foreach ($sessionlist as $session) {
            $k            = $session['ID'];
            $v            = $session['Visit_label'];
            $sessions[$k] = $v;
        }
        $res['Session'] = $sessions;
        return $res;
    }
    /**
     * Handles the appointment adding process
     *
     * @param array $data the request data
     *
     * @return void
     */
    public function addAppointment(array $data): void
    {
        $this->duplicateCheck($data);
        $factory = \NDB_Factory::singleton();
        $DB      = $factory->database();
        $startAt = $data['AppointmentDate']." ".$data['AppointmentTime'].":00";
        // Insert appointment information
        $DB->insert(
            "appointment",
            [
                "SessionId"         => $data["Session"],
                "AppointmentTypeId" => $data["AppointmentType"],
                "StartsAt"          => $startAt,
            ]
        );

    }
    /**
     * Handles the appointment editing process
     *
     * @param array $data the request data
     *
     * @return void
     */
    public function editAppointment(array $data): void
    {
        $this->duplicateCheck($data);
        $factory = \NDB_Factory::singleton();
        $DB      = $factory->database();
        $startAt = $data['AppointmentDate']." ".$data['AppointmentTime'].":00";

        $DB->update(
            "appointment",
            [
                "StartsAt"          => $startAt,
                "AppointmentTypeID" => $data["AppointmentType"],
            ],
            [
                "AppointmentId" => $data["AppointmentID"],
            ]
        );

    }
    /**
     * Handles the duplicateCheck
     *
     * @param array $data the request data
     *
     * @return void
     */
    public function duplicateCheck(array $data)
    {

        $startAt = $data['AppointmentDate']." ".$data['AppointmentTime'].":00";
        $factory = \NDB_Factory::singleton();
        $DB      = $factory->database();
        $duplicate_check = $DB->pselectRow(
            "
           SELECT 
                * 
            FROM 
                appointment 
            WHERE 
            SessionID = :sessionId
            And
            AppointmentTypeID = :typeId 
            And
            StartsAt = :startsAt
        ",
            [
                "sessionId" => $data["Session"],
                "typeId"    => $data["AppointmentType"],
                "startsAt"  => $startAt,
            ]
        );
        if (!empty($duplicate_check)) {
            http_response_code(400);
            die(
                json_encode(["error"=>"This appointment already exists."])
            );
        }
    }
    /**
     * Handles the appointment deleting process
     *
     * @param string $id the request id
     *
     * @return void
     */
    public function deleteAppointment(string $id): void
    {

        $factory = \NDB_Factory::singleton();
        $DB      = $factory->database();
        $DB->delete("appointment", ["AppointmentID" => $id]);
    }
}
