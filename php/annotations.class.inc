<?php declare(strict_types=1);
namespace LORIS\electrophysiology_browser;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use LORIS\electrophysiology_browser\Models\ElectrophysioAnnotations;

/**
 * Contains the Annotations class used for electrophysiological browser
 *
 * PHP Version 7
 *
 * @category Electrophysiology
 * @package  Electrophysiology
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Annotations extends \NDB_Page
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
        // ##################### EEGNET OVERRIDE START ################## //
        /*$parameters = $request->getQueryParams();*/
        // ##################### EEGNET OVERRIDE END ################## //
        $factory    = \NDB_Factory::singleton();
        $user       = $factory->user();
        $db         = $factory->database();

        switch ($request->getMethod()) {
        case 'GET':
            // ##################### EEGNET OVERRIDE START ################## //
            $parameters = $request->getQueryParams();
            // ##################### EEGNET OVERRIDE END ################## //
            $sessionID = $db->pselectOne(
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
            (new ElectrophysioAnnotations($physioFileID))->updateFiles();

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
            // ##################### EEGNET OVERRIDE START ################## //
            $parameters = json_decode((string) $request->getBody(), true);
            // ##################### EEGNET OVERRIDE END ################## //
            if (!$user->hasPermission('electrophysiology_browser_edit_annotations')
            ) {
                return (new \LORIS\Http\Response\JSON\Unauthorized());
            }

            if (!isset($parameters['physioFileID'])
                || !isset($parameters['instance_id'])
            ) {
                return (new \LORIS\Http\Response\JSON\BadRequest());
            }

            (new ElectrophysioAnnotations(intval($parameters['physioFileID'])))
                ->delete(intval($parameters['instance_id']));
                
            return (new \LORIS\Http\Response\JSON\OK());
        case 'POST':
            // ##################### EEGNET OVERRIDE START ################## //
            $parameters = json_decode((string) $request->getBody(), true);
            // ##################### EEGNET OVERRIDE END ################## //
            if (!$user->hasPermission('electrophysiology_browser_edit_annotations')
            ) {
                return (new \LORIS\Http\Response\JSON\Unauthorized());
            }

            if (!isset($parameters['physioFileID'])) {
                return (new \LORIS\Http\Response\JSON\BadRequest());
            }

            $instance_data = $parameters['instance'];
            // ##################### EEGNET OVERRIDE START ################## //
            // $metadata      = $parameters['metadata'];
            // TODO: Figure out a better description modeled on other derivatives
            $metadata = [
                'description' => 'An annotation',
                'sources' => 'EEGNet LORIS',
                'author' => $user->getFullname()
            ];
            
            $instance_id   = $parameters['instance_id'] ? 
                (int) $parameters['instance_id'] :  null;
            // ##################### EEGNET OVERRIDE END ################## //
            $parameter_id  = $parameters['parameter_id'] ?? null;

            // ##################### EEGNET OVERRIDE START ################## //
            (new ElectrophysioAnnotations(intval($parameters['physioFileID'])))
                ->update($instance_data, $metadata, $instance_id, $parameter_id);

            // if new annotation, get instanceID
            if (is_null($instance_id)) {
                $instance_id = $db->pselectOne(
                    "SELECT MAX(AnnotationInstanceID) 
                    FROM physiological_annotation_instance",
                    []
                );
            }

            return (new \LORIS\Http\Response\JSON\OK(
                ['instance_id' => $instance_id]
            ));
            // ##################### EEGNET OVERRIDE END ################## //
        default:
            return (new \LORIS\Http\Response\JSON\MethodNotAllowed(
                ["GET", "DELETE", "POST"]
            ));
        }
    }
}
