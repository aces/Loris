<?php declare(strict_types=1);
/**
 * PHP Version 8
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\redcap\Endpoints;

use LORIS\redcap\RedcapHTTPClientHandler;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Http\Endpoint;
use \LORIS\redcap\notifications\RedcapNotification;
use \LORIS\redcap\notifications\RedcapNotificationHandler;

/**
 * This is the handler for redcap notifications
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Notifications extends Endpoint
{
    /**
     * A REDCap client handler.
     *
     * @var RedcapHTTPClientHandler
     */
    protected RedcapHTTPClientHandler $redcapClientHandler;

    /**
     * Construct an endpoint
     *
     * @param \LORIS\LorisInstance    $loris a Loris instance
     * @param REDCapHTTPClientHandler $rch   a REDCap client handler
     */
    public function __construct(
        protected \LORIS\LorisInstance $loris,
        protected RedcapHTTPClientHandler $rch
    ) {
        parent::__construct($loris);
        $this->redcapClientHandler = $rch;
    }

    /**
     * Return which methods are supported by this endpoint.
     *
     * Projects can only be retrieved, not created.
     *
     * @return array supported HTTP methods
     */
    protected function allowedMethods() : array
    {
        return [
            'POST',
        ];
    }

    /**
     * Handles a request to Resolved conflicts
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        switch ($request->getMethod()) {
        case 'POST':
            return $this->_handlePOST($request);

        case 'OPTIONS':
            return (new \LORIS\Http\Response())
                ->withHeader('Allow', $this->allowedMethods());

        default:
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(
                $this->allowedMethods()
            );
        }
    }

    /**
     * Handle POST request.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    private function _handlePOST(ServerRequestInterface $request): ResponseInterface
    {
        $db = $this->loris->getDatabaseConnection();

        // Try url-endoded first
        $data = $request->getParsedBody();
        if (empty($data)) {
            // Fallback to application/json
            $data = json_decode((string) $request->getBody(), true);
        }

        // timestamp
        $data['received_dt'] = new \DateTimeImmutable();

        try {
            $notification = new RedcapNotification($data);

            // should the notification be ignored?
            if ($this->_ignoreNotification($notification)) {
                return new \LORIS\Http\Response();
            }

            // Add to the database
            $db->insert(
                'redcap_notification',
                $notification->toDatabaseArray()
            );
        } catch (\UnexpectedValueException $e) {
            $body = (string) $request->getBody();
            $this->_createIssue(
                'Invalid notification received',
                $e->getMessage(),
                $body
            );
            return new \LORIS\Http\Response\JSON\BadRequest($e->getMessage());
        } catch (\DatabaseException $e) {
            $body = (string) $request->getBody();
            $this->_createIssue(
                'Database exception',
                $e->getMessage(),
                $body
            );
            return new \LORIS\Http\Response\JSON\InternalServerError();
        } catch (\Throwable $e) {
            $body = (string) $request->getBody();
            $this->_createIssue(
                'Unknown exception',
                $e->getMessage(),
                $body
            );
            return new \LORIS\Http\Response\JSON\InternalServerError();
        }

        // get a new redcap client based on the notification info
        try {
            $rc = $this->redcapClientHandler->getClientByURL(
                $notification->getRedcapURL(),
                $notification->getProjectId(),
            );
            $notification_handler = new RedcapNotificationHandler(
                $this->loris,
                $rc
            );
        } catch (\LorisException $le) {
            $this->_createIssue(
                'Instrument data not updated - REDCap client error',
                $le->getMessage(),
                ""
            );
            return new \LORIS\Http\Response\JSON\InternalServerError();
        }

        try {
            $notification_handler->handle($notification);
            error_log("notif handled");
        } catch (\DatabaseException $e) {
            $rec = "[redcap] Error: "
                . "PSCID: " . $notification->getRecord()
                . "Visit: " . $notification->getRedcapEventName()
                . "instrument: " . $notification->getInstrument();
            $this->_createIssue(
                'Instrument data not updated - Database exception',
                $e->getMessage(),
                $rec
            );
            return new \LORIS\Http\Response\JSON\InternalServerError();
        } catch (\DomainException $e) {
            $rec = "[redcap] Error: "
                . "PSCID: " . $notification->getRecord()
                . "Visit: " . $notification->getRedcapEventName()
                . "instrument: " . $notification->getInstrument();
            $this->_createIssue(
                'Instrument data not updated - Domain exception',
                $e->getMessage(),
                $rec
            );
            return new \LORIS\Http\Response\JSON\InternalServerError();
        } catch (\ConfigurationException $ce) {
            $this->_createIssue(
                'Instrument data not updated - Configuration/Permission exception',
                $ce->getMessage(),
                json_encode($notification->toDatabaseArray())
            );
            return new \LORIS\Http\Response\JSON\InternalServerError();
        } catch (\Throwable $e) {
            $this->_createIssue(
                'Instrument data not updated',
                $e->getMessage(),
                json_encode($notification->toDatabaseArray())
            );
            return new \LORIS\Http\Response\JSON\InternalServerError();
        }
        // ok
        return new \LORIS\Http\Response();
    }

    /**
     * Checks if notification should be ignored.
     * Ignored notifications will not trigger any issue creation.
     * Optionally prints an error in log on a case by case basis.
     *
     * @param RedcapNotification $notif the REDCap notification.
     *
     * @return true if the notification should be ignored, else false.
     */
    private function _ignoreNotification(RedcapNotification $notif): bool
    {
        $notifData = json_encode($notif->toDatabaseArray());

        // is that notification coming from a known instance/project?
        $sourceExists = $this->redcapClientHandler->hasInstanceProject(
            $notif->getRedcapURL(),
            $notif->getProjectId()
        );
        if (!$sourceExists) {
            error_log(
                "[redcap][notification:skip] unknown source/project: $notifData"
            );
            return true;
        }

        // get authorized instruments list
        $config    = $this->loris->getConfiguration();
        $authInstr = $config->getSetting('redcap_importable_instrument');

        // ignore instruments that are not in the authorized list
        if (!in_array($notif->getInstrument(), $authInstr, true)) {
            error_log(
                "[redcap][notification:skip] unauthorized instrument: $notifData"
            );
            return true;
        }

        // ignore notifications that are not 'complete'
        if (!$notif->isComplete()) {
            error_log(
                "[redcap][notification:skip] instrument not complete: $notifData"
            );
            return true;
        }

        // do not ignore
        return false;
    }

    /**
     * Create an issue in the issue tracker.
     *
     * @param string $title issue title
     * @param string $error error message
     * @param string $data  error data
     *
     * @return void
     */
    private function _createIssue(
        string $title,
        string $error,
        string $data
    ): void {
        $db = $this->loris->getDatabaseConnection();

        // get redcap module ID
        $redcapModuleID = $db->pselectOne(
            'SELECT m.ID FROM modules m WHERE m.Name = "redcap"',
            []
        );

        // add automated centerID for redcap issues
        $centerID = $db->pselectOne(
            'SELECT CenterID FROM psc WHERE Alias="DCC"',
            []
        );

        // get the main assignee from config
        $assignee = $this->redcapClientHandler->getAssignee();
        $username = $assignee->getUsername();

        // insert new issue
        $now = (new \DateTimeImmutable())->format('Y-m-d H:i:s');
        $issueData = [
            'title'         => $title,
            'reporter'      => $username,
            'assignee'      => $username,
            'status'        => 'assigned',
            'priority'      => 'normal',
            'module'        => $redcapModuleID,
            'dateCreated'   => $now,
            'lastUpdate'    => $now,
            'lastUpdatedBy' => $username,
            'sessionID'     => null,
            'centerID'      => $centerID,
            'candID'        => null,
            'category'      => 'Data Entry',
            'description'   => $error . " " . $data
        ];
        $db->insert('issues', $issueData);
        error_log("[redcap][issue:created] " . json_encode($issueData));
    }
}