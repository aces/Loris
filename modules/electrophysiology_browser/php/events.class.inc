<?php declare(strict_types=1);

namespace LORIS\electrophysiology_browser;

use LORIS\electrophysiology_browser\Models\DatasetTags;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use LORIS\electrophysiology_browser\Models\ElectrophysioEvents;

/**
 * Contains the Events class used for electrophysiological browser
 *
 * PHP Version 7
 *
 * @category Electrophysiology
 * @package  Electrophysiology
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Events extends \NDB_Page
{
    /**
     * Handle how to operate all the files.
     * GET method gets a file.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $user = $request->getAttribute('user');
        $db   = $request->getAttribute('loris')->getDatabaseConnection();

        switch ($request->getMethod()) {
        case 'GET':
            // TODO: Get official server-side solution + Add to documentation
            // set_time_limit(300);  // Increase request time limit to 5 minutes
            // ini_set('memory_limit', '1G'); // Increase memory allocation limit

            $parameters = $request->getQueryParams();
            $sessionID  = $db->pselectOne(
                'SELECT SessionID
                    FROM physiological_file
                    WHERE PhysiologicalFileID=:PFID',
                ['PFID' => $parameters['physioFileID']]
            );

            $timepoint = \NDB_Factory::singleton()->timepoint(
                new \SessionID(strval($sessionID))
            );

            if (!(($user->hasPermission('electrophysiology_browser_view_allsites')
                || ($user->hasCenter($timepoint->getCenterID())
                && $user->hasPermission('electrophysiology_browser_view_site')))
                && $user->hasProject($timepoint->getProject()->getId()))
            ) {
                return (new \LORIS\Http\Response\JSON\Unauthorized());
            }

            if (!isset($parameters['physioFileID'])
                || !isset($parameters['filePath'])
            ) {
                return (new \LORIS\Http\Response\JSON\BadRequest());
            }

            $physioFileID = intval($parameters['physioFileID']);
            (new ElectrophysioEvents($this->loris, $physioFileID))->updateFiles();

            $config       = \NDB_Factory::singleton()->config();
            $downloadpath = \Utility::appendForwardSlash(
                $config->getSetting("dataDirBasepath")
            );

            $file     = $parameters['filePath'] ?? null;
            $filename = urldecode(basename($file));
            $path     = dirname($file);

            $downloader = new \LORIS\FilesDownloadHandler(
                new \SPLFileInfo($downloadpath . $path)
            );

            return $downloader->handle(
                $request->withAttribute('filename', $filename)
            );
        case 'DELETE':
            $parameters = json_decode((string)$request->getBody(), true);

            if (!$user->hasPermission(
                'electrophysiology_browser_edit_annotations'
            )
            ) {
                return (new \LORIS\Http\Response\JSON\Unauthorized());
            }

            if (!isset($parameters['physioFileID'])
                || !isset($parameters['instance_id'])
            ) {
                return (new \LORIS\Http\Response\JSON\BadRequest());
            }

            return (new \LORIS\Http\Response\JSON\OK());
        case 'POST':
            // TODO: Better failure reporting
            $parameters = json_decode((string)$request->getBody(), true);

            if (!$user->hasPermission(
                'electrophysiology_browser_edit_annotations'
            )
            ) {
                return (new \LORIS\Http\Response\JSON\Unauthorized());
            }

            if (!isset($parameters['physioFileID'])
                || !isset($parameters['request_type'])
            ) {
                return (new \LORIS\Http\Response\JSON\BadRequest());
            }

            switch ($parameters['request_type']) {
            case 'event_update':
                $instance_data = $parameters['instance'];
                // $metadata      = $parameters['metadata'];
                // TODO: Figure out better description modeled on other derivatives
                $metadata = [
                    'description' => 'An event',
                    'sources'     => 'EEGNet LORIS',
                    'author'      => $user->getFullname()
                ];

                $instance_id = $parameters['instance_id'] ?
                    intval($parameters['instance_id']) : null;

                $updated_instance = (
                    new ElectrophysioEvents(
                        $this->loris,
                        intval($parameters['physioFileID'])
                    )
                )->update($instance_data, $metadata, $instance_id);

                if (count($updated_instance) > 0) {
                    return (new \LORIS\Http\Response\JSON\OK(
                        ['instance' => $updated_instance]
                    ));
                }
                return (new \LORIS\Http\Response\JSON\Unauthorized());
            case 'dataset_tags':
                $added_tags   = $parameters['added_tags'];
                $deleted_tags = $parameters['deleted_tags'];
                $edited_tags  = $parameters['edited_tags'];

                $dataset_tags = new DatasetTags(
                    $this->loris,
                    intval($parameters['physioFileID'])
                );
                $idMapping    = $dataset_tags->update(
                    $added_tags,
                    $deleted_tags,
                    $edited_tags
                );

                return (new \LORIS\Http\Response\JSON\OK(
                    ['mapping' => $idMapping]
                ));
            }
            default:
            return (new \LORIS\Http\Response\JSON\MethodNotAllowed(
                ["GET", "DELETE", "POST"]
            ));
        }
    }
}
