<?php

namespace LORIS\electrophysiology_uploader;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

/**
 * This class implements the /upload endpoint
 * used to process the EEG files sent over HTTP to
 * the electrophysiology uploader
 *
 * PHP Version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Electrophysiology
 * @author     Loris team <info-loris.mni@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class Upload extends \NDB_Page
{
    /**
     * Return an array of valid HTTP methods for this endpoint
     *
     * @return string[] Valid versions
     */
    protected function allowedMethods(): array
    {
        return [
            'GET',
            'POST',
        ];
    }

    /**
     * This function will return a json response.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        // Ensure GET or POST request.
        switch ($request->getMethod()) {
        case 'GET':
            return $this->_handleGet($request);
        case 'POST':
            return $this->_handlePOST($request);
        default:
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(
                $this->allowedMethods()
            );
        }
    }

    /**
     * Handle an incoming HTTP GET request to download uploaded file.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    private function _handleGet(ServerRequestInterface $request) : ResponseInterface
    {
        $qParams = $request->getQueryParams();
        if (!isset($qParams['upload_id'])) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                "upload_id query parameter is required"
            );
        }

        $db   = $this->loris->getDatabaseConnection();
        $file = $db->pselectOne(
            "
            SELECT UploadLocation
            FROM electrophysiology_uploader
            WHERE UploadID = :uploadID
        ",
            ['uploadID' => $qParams['upload_id']]
        );

        if (empty($file)) {
            return new \LORIS\Http\Response\JSON\NotFound(
                "File not found."
            );
        }

        $filename      = urldecode(basename($file));
        $pos           = strrpos($file, '/');
        $file_rel_path = $pos === false ? '' : substr($file, 0, $pos);
        $config        = \NDB_Config::singleton();
        $upload_dir    = new \SplFileInfo(
            $config->getSetting('EEGUploadIncomingPath')
        );

        $downloader = new \LORIS\FilesDownloadHandler(
            new \SPLFileInfo($upload_dir . '/' . $file_rel_path)
        );

        return $downloader->handle(
            $request->withAttribute('filename', $filename)
        );
    }


    /**
     * Processes the values & saves to database and return a json response.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handlePOST(ServerRequestInterface $request) : ResponseInterface
    {
        $db = $this->loris->getDatabaseConnection();

        $uploadedFile = $request->getUploadedFiles()['eegFile'] ?? null;
        $values       = $request->getParsedBody();
        $pscid        = $values['pscid'] ?? null;
        $candID       = $values['candID'] ?? null;
        $visitLabel   = $values['visit'] ?? null;

        if (empty($request->getUploadedFiles()) && empty($values)) {
            $upload_max_size = \Utility::getMaxUploadSize();
            return new \LORIS\Http\Response\JSON\InternalServerError(
                "The uploaded file size exceeds the upload_max_filesize " .
                "or post_max_size directive in php.ini ($upload_max_size)"
            );
        }

        if (is_null($uploadedFile)) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'No file uploaded'
            );
        }

        $candStatus = $db->pselectOne(
            "
            SELECT Active
            FROM candidate
            WHERE CandID = :candID
            AND PSCID = :pscid
            ",
            [
                'candID' => $candID,
                'pscid'  => $pscid
            ]
        );

        if (is_null($candStatus)) {
            return new \LORIS\Http\Response\JSON\NotFound(
                'Candidate with matching CandID/PSCID pair does not exist'
            );
        }

        if ($candStatus !== 'Y') {
            return new \LORIS\Http\Response\JSON\BadRequest(
                "Candidate associated with CandID {$candID} is inactive."
            );
        }

        $session = $db->pselectRow(
            "
            SELECT ID, Active
            FROM session
            WHERE Visit_label = :visit
            AND CandID = :candID
            ",
            [
                'visit'  => $visitLabel,
                'candID' => $candID
            ]
        );

        if (is_null($session)) {
            return new \LORIS\Http\Response\JSON\NotFound(
                "Visit {$visitLabel} for candidate {$candID} does not exist"
            );
        }

        if ($session['Active'] !== 'Y') {
            return new \LORIS\Http\Response\JSON\BadRequest(
                "Visit {$visitLabel} for CandID {$candID} is inactive."
            );
        }

        $filename = urldecode($uploadedFile->getClientFilename());
        if ($filename !== "{$pscid}_{$candID}_{$visitLabel}_bids.tar.gz") {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'Filename does not match expected name, please verify.'
            );
        }

        $config    = \NDB_Config::singleton();
        $targetdir = new \SplFileInfo($config->getSetting('EEGUploadIncomingPath'));
        try {
            $uploader = (new \LORIS\FilesUploadHandler($targetdir));
        } catch (\Exception $e) {
            return new \LORIS\Http\Response\JSON\InternalServerError(
                $e->getMessage()
            );
        }

        // Check for an existing file
        // If found, add a timestamp suffix to avoid collision
        // with any other existing upload attempt
        // and move the renamed file in _EEGUploadIncomingPath_/archives/
        $filename   = urldecode($uploadedFile->getClientFilename());
        $targetPath = $targetdir->getPathname() . '/' . $filename;
        if (file_exists($targetPath)) {
            $archiveFilename = str_replace(
                '_bids',
                '_bids_'.time(),
                $filename
            );

            $archivesDir = $targetdir->getPathname() . '/archives/';
            if (!file_exists($archivesDir)) {
                mkdir($archivesDir);
            }

            $archivePath = $archivesDir . $archiveFilename;
            rename($targetPath, $archivePath);
            $db->update(
                'electrophysiology_uploader',
                ['UploadLocation' => "archives/$archiveFilename"],
                ['UploadLocation' => $filename]
            );
        }

        $response = $uploader->handle($request);
        if (!in_array($response->getStatusCode(), [200, 201], true)) {
            // Something went wrong. Return early to skip further processing.
            return $response;
        }

        $user = $request->getAttribute('user');

        $saveValues = [
            'UploadedBy'     => $user->getUsername(),
            'UploadDate'     => date('Y-m-d H:i:s'),
            'UploadLocation' => "$filename",
            'SessionID'      => $session['ID'],
        ];

        $db->insert('electrophysiology_uploader', $saveValues);

        // Send notification to eeg managers
        $emails    = $db->pselectCol(
            "SELECT Email
              FROM users u
              JOIN user_perm_rel upr ON upr.userID = u.ID
              JOIN permissions p ON upr.permID = p.permID
              WHERE p.code='monitor_eeg_uploads'",
            []
        );
        $timepoint = \TimePoint::singleton(new \SessionID($session['ID']));
        $msg_data  = [
            'Site'           => $timepoint->getPSC(),
            'PSCID'          => $pscid,
            'CandID'         => $candID,
            'VisitLabel'     => $visitLabel,
            'UploadedBy'     => $saveValues['UploadedBy'],
            'UploadDate'     => $saveValues['UploadDate'],
            'UploadLocation' => $saveValues['UploadLocation'],
            'UploadUrl'      => null,
        ];
        foreach ($emails as $email) {
            \Email::send(
                $email,
                'new_electrophysiology_upload.tpl',
                $msg_data
            );
        }

        return $response;
    }
}
