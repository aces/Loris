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

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Http\Endpoint;
use \LORIS\redcap\RedcapNotificationHandler;
use \LORIS\redcap\RedcapQueries;
use \LORIS\redcap\config\RedcapConfig;
use \LORIS\redcap\config\RedcapConfigParser;
use \LORIS\redcap\client\RedcapHttpClient;
use \LORIS\redcap\client\models\RedcapNotification;

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
     * The REDCap issue assignee if it has been successfully parsed.
     *
     * @var ?\User
     */
    private ?\User $_issue_assignee = null;

    /**
     * Construct an endpoint
     *
     * @param \LORIS\LorisInstance $loris a Loris instance
     */
    public function __construct(
        protected \LORIS\LorisInstance $loris,
    ) {
        parent::__construct($loris);
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
        $db      = $this->loris->getDatabaseConnection();
        $queries = new RedcapQueries($this->loris);

        // Try url-encoded first
        $data = $request->getParsedBody();
        if (empty($data)) {
            // Fallback to application/json
            $data = json_decode((string) $request->getBody(), true);
        }

        try {
            $received_datetime = new \DateTimeImmutable();

            $redcap_notif = new RedcapNotification($data, $received_datetime);

            $this->_issue_assignee = $queries->getRedcapIssueAssignee();

            $config_parser = new RedcapConfigParser(
                $this->loris,
                $redcap_notif->instance_url,
                $redcap_notif->project_id,
            );

            $config = $config_parser->parse();

            // should the notification be ignored?
            if ($this->_ignoreNotification($redcap_notif, $config)) {
                return new \LORIS\Http\Response();
            }

            // Add to the database
            $db->insert(
                'redcap_notification',
                $redcap_notif->toDatabaseArray()
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
            $redcap_client = new RedcapHttpClient(
                $config->redcap_instance_url,
                $config->redcap_api_token,
            );

            $notification_handler = new RedcapNotificationHandler(
                $this->loris,
                $redcap_client,
                $redcap_notif,
                $config,
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
            $notification_handler->handle();
        } catch (\DatabaseException $e) {
            $rec = "[redcap] Error: "
                . "PSCID: " . $redcap_notif->record_id
                . "Visit: " . $redcap_notif->unique_event_name
                . "instrument: " . $redcap_notif->instrument_name;
            $this->_createIssue(
                'Instrument data not updated - Database exception',
                $e->getMessage(),
                $rec
            );
            return new \LORIS\Http\Response\JSON\InternalServerError();
        } catch (\DomainException $e) {
            $rec = "[redcap] Error: "
                . "PSCID: " . $redcap_notif->record_id
                . "Visit: " . $redcap_notif->unique_event_name
                . "instrument: " . $redcap_notif->instrument_name;
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
                json_encode($redcap_notif->toDatabaseArray())
            );
            return new \LORIS\Http\Response\JSON\InternalServerError();
        } catch (\Throwable $e) {
            $this->_createIssue(
                'Instrument data not updated',
                $e->getMessage(),
                json_encode($redcap_notif->toDatabaseArray())
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
     * @param RedcapNotification $redcap_notif The REDCap notification.
     * @param ?RedcapConfig      $config       The REDCap module configuration.
     *
     * @return bool if the notification should be ignored, else false.
     */
    private function _ignoreNotification(
        RedcapNotification $redcap_notif,
        ?RedcapConfig $config,
    ): bool {
        $notif_data = json_encode($redcap_notif->toDatabaseArray());

        if ($config === null) {
            error_log(
                "[redcap][notification:skip] unknown source/project: $notif_data"
            );
            return true;
        }

        // get authorized instruments list
        $config    = $this->loris->getConfiguration();
        $authInstr = $config->getSetting('redcap_importable_instrument');

        // ignore instruments that are not in the authorized list
        if (!in_array($redcap_notif->instrument_name, $authInstr, true)) {
            error_log(
                "[redcap][notification:skip] unauthorized instrument: $notif_data"
            );
            return true;
        }

        // ignore notifications that are not 'complete'
        if (!$redcap_notif->isComplete()) {
            error_log(
                "[redcap][notification:skip] instrument not complete: $notif_data"
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
        string $data,
    ): void {
        // Cannot create an issue if the issue assignee has not succesfully been
        // parsed.
        if ($this->_issue_assignee === null) {
            error_log("[redcap] $title $error $data");
            return;
        }

        // get the main assignee from config
        $username = $this->_issue_assignee->getUsername();

        $db = $this->loris->getDatabaseConnection();

        // get redcap module ID
        $redcap_module_id = $db->pselectOne(
            'SELECT m.ID FROM modules m WHERE m.Name = "redcap"',
            []
        );

        // add automated centerID for redcap issues
        $center_id = $db->pselectOne(
            'SELECT CenterID FROM psc WHERE Alias="DCC"',
            []
        );

        // insert new issue
        $dtNow     = new \DateTimeImmutable();
        $now       = $dtNow->format('Y-m-d H:i:s');
        $issueData = [
            'title'         => $title,
            'reporter'      => $username,
            'assignee'      => $username,
            'status'        => 'assigned',
            'priority'      => 'normal',
            'module'        => $redcap_module_id,
            'dateCreated'   => $now,
            'lastUpdate'    => $now,
            'lastUpdatedBy' => $username,
            'sessionID'     => null,
            'centerID'      => $center_id,
            'candID'        => null,
            'category'      => 'Data Entry',
            'description'   => "$error $data",
        ];
        $db->insert('issues', $issueData);

        error_log(
            "[redcap][issue:created][id:{$db->getLastInsertId()}] "
            . json_encode($issueData)
        );
    }
}
