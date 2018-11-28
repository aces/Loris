<?php
/**
 * The media download endpoint serves file attachments to users based on files
 * uploaded to the media module.
 *
 * It takes a filepath specified by $File and returns a corresponding attachment
 * assuming the request is valid and permitted.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Media
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\media;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

#require_once __DIR__ . '/MediaFileDownloadValidator.class.inc';

/**
 * Implements the media file download endpoint.
 *
 * @category Main
 * @package  Media
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

class MediaDownload extends \NDB_Page
{
    public $skipTemplate = true;
    /**
     * A user must have the media_write permission to download files.
     * FIXME this probably makes more sense as a read permission but for now
     * the write and download permissions are coupled.
     *
     * @return bool true iff the user has access to this page.
     */
    function _hasAccess()
    {
        return \User::singleton()->hasPermission('media_write');
    }
    /**
     * This acts as an AJAX endpoint that serves an attachment to the user based
     * on the uploads to the media module.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        // The parent handles things like hasAccess checks.
        $resp = parent::handle($request);
        switch ($resp->getStatusCode()) {
        case 200:
            // If it was a 200 code, it just means display was called and
            // access validated. We still need to do other validations
            // and add the result body.
            break;
        default:
            return $resp;
        }
        // Ensure it's a GET request.
        if ($request->getMethod() != "GET") {
            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "text/plain")
                ->withStatus(405)
                ->withHeader("Allow", "GET")
                ->withBody(
                    new \LORIS\Http\StringStream(
                        "Only GET requests are allowed"
                    )
                );
        }
        // Ensure filepath is passed.
        $gets = $request->getQueryParams();
        print_r($gets);
        if (!isset($gets['File'])) {
            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "text/plain")
                ->withStatus(400)
                ->withBody(
                    new \LORIS\Http\StringStream(
                        "Must provide a file path"
                    )
                );
        }
        $file = new MediaFileDownloadValidator($gets['File']);
        return (new \Zend\Diactoros\Response())
            ->withStatus(200)
            ->withBody(new \LORIS\Http\StringStream("hello"))
            ->withHeader("Content-Type", "text/plain")
            ->withHeader(
                'Content-Disposition', 'attachment; filename=' . 
                $file->getFilename()
            );
    }
}
