<?php
namespace LORIS\mri_violations;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
/**
 * Implement an endpoint to handle the downloading of files that
 * are contained in the mri violations module.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class File extends \NDB_Page
{
    /**
     * Determine who has access to this page. At the moment, tied to
     * access to the Mri_Violation module.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true if access is permitted
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasAnyPermission(
            [
                'violated_scans_view_allsites',
                'violated_scans_view_ownsite'
            ]
        );
    }

    /**
     * {@inheritDoc}
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface the outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $url     = $request->getURI()->getPath();
        $matches = [];

        if (!preg_match('#file/(.+)/(\d+)#', $url, $matches)) {
                return new \LORIS\Http\Response\JSON\NotFound();
        }

        $ftype = $matches[1];
        $id    = $matches[2];
        switch ($ftype) {
        case 'protocolviolation':
            $query = "SELECT minc_location
                        FROM mri_protocol_violated_scans
                      WHERE ID = :LogID";
            break;
        case 'checkviolation':
            $query = "SELECT MincFile
                         FROM mri_violations_log
                      WHERE LogID=:LogID";
            break;
        case 'candidateerror':
            $query = "SELECT MincFile
                         FROM MRICandidateErrors
                      WHERE ID=:LogID";
            break;
        default:
            return new \LORIS\Http\Response\JSON\NotFound();
        }

        $db   = $this->loris->getDatabaseConnection();
        $file = $db->pselectOne($query, ['LogID' => $id]);

        if (empty($file)) {
            return new \LORIS\Http\Response\JSON\NotFound();
        }

        $downloadhandler = new \LORIS\FilesDownloadHandler(
            new \SplFileInfo($this->_getImagePath())
        );

        $request = $request->withAttribute("filename", $file);
        return $downloadhandler->handle($request);
    }

    /**
     * Returns the image path that images downloaded are
     * relative to.
     *
     * @return string
     */
    private function _getImagePath() : string
    {
        $config = $this->loris->getConfiguration();
        $paths  = $config->getSetting('paths');

        return $paths['imagePath'];
    }
}
