<?php

namespace LORIS\imaging_browser;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Server\RequestHandlerInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Page that returns an image file data as a Json.
 * Note that much of the code was extracted, or sometimes duplicated,
 * from `ViewSession`.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class GetFiles extends \NDB_Page
{
    /**
     * The database connection
     *
     * @var \Database
     */
    private $db;

    /**
     * The session ID
     */
    private $sessionID;

    /**
     * The file output type filter
     */
    private $output;

    /**
     * The selected filter
     */
    private $selected;

    /**
     * This function can be overridden in a module's page to load the necessary
     * resources to check the permissions of a user.
     *
     * @param \User                  $user    The user to load the resources for
     * @param ServerRequestInterface $request The PSR7 Request being handled
     *
     * @return void
     */
    public function loadResources(
        \User $user, ServerRequestInterface $request
    ) : void {
        $this->sessionID = intval($request->getQueryParams()['sessionID']);
        $this->selected  = $request->getQueryParams()['selected'];
        $this->output    = $request->getQueryParams()['output'];
    }

    /**
     * Returns true if user has access to this endpoint.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        $sessionID = $this->sessionID;
        $session   = \TimePoint::singleton(
            new \SessionID(strval($sessionID))
        );
        $candID    = $session->getCandID();
        $candidate = \Candidate::singleton($candID);

        if ($candidate->getEntityType() == 'Scanner') {
            return ($user->hasPermission('imaging_browser_phantom_allsites')
                || $user->hasCenterPermission(
                    'imaging_browser_phantom_ownsite',
                    $session->getCenterID()
                ))
                && ($user->hasProject($session->getProject()->getId()));
        } elseif ($candidate->getEntityType() == 'Human') {
            return ($user->hasPermission('imaging_browser_view_allsites')
                || $user->hasCenterPermission(
                    'imaging_browser_view_site',
                    $session->getCenterID()
                ))
                && $user->hasProject($session->getProject()->getId());
        }
        return false;
    }

    /**
     * This function passes the request to the handler. This is necessary since
     * the Endpoint bypass the Module class.
     *
     * XXX: This function should be extracted to a parent class.
     *
     * @param ServerRequestInterface  $request The PSR7 request.
     * @param RequestHandlerInterface $handler The request handler.
     *
     * @return ResponseInterface The outgoing PSR7 response.
     */
    public function process(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler
    ) : ResponseInterface {
        return $handler->handle($request);
    }

    /**
     * This acts as an Ajax enpoint that handles all action requests from the
     * Battery Manager Module.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $this->db = $this->loris->getDatabaseConnection();

        switch ($request->getMethod()) {
        case 'GET':
            return $this->_handleGET();
        default:
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(
                ['GET'],
                'Request must be GET'
            );
        }
    }

    /**
     * Returns a file's data as a Json response
     *
     * @return ResponseInterface The Json response.
     */
    private function _handleGET() : ResponseInterface
    {
        $row = $this->_getRow();
        return new \LORIS\Http\Response\JSON\OK($row);
    }

    /**
     * Returns a file's data as a Json response
     *
     * @return array The Json response.
     */
    private function _getRow()
    {
        $extra_where_string = "";
        if (!empty($this->selected)) {
            $extra_where_string .= " AND COALESCE(sel.Selected,'') <> ''";
        }
        $args = ['SID' => $this->sessionID];
        // To better support QC for CIVET output a couple of
        // additional conditions have been put in...

        if (!empty($this->output)) {
            $outputType = urldecode($this->output);
            if ($outputType=="processed") {
                $extra_where_string .= " AND OutputType != 'native' ";
            } else if ($outputType=="native") {
                $extra_where_string .= " AND OutputType='native'";
            } else if ($outputType=="skull_mask") {
                $extra_where_string .= " AND (OutputType='skull_mask'
                    OR  (OutputType='native' AND AcquisitionProtocolID='44') )";
            } else {
                $extra_where_string .= " AND (OutputType=:outputType
                    OR OutputType='linreg')";

                $args["outputType"] = $outputType;
            }
        }

        $files = $this->db->pselect(
            "SELECT files.FileID, files.ScannerID FROM files
             LEFT JOIN files_qcstatus as sel
             on (files.FileID=sel.FileID)
            WHERE SessionID=:SID AND (AcquisitionProtocolID IS NULL
            OR AcquisitionProtocolID not in (1, 2, 3, 52))
            $extra_where_string
            ORDER BY files.OutputType,
                     files.AcquisitionProtocolID,
                     files.File",
            $args
        );

        $row['fileIDs']
            = array_map(fn($file) => intval($file['FileID']), $files);

        return $row;
    }
}
