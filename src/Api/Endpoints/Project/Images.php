<?php declare(strict_types=1);
/**
 * This implements the Images page class under Project
 *
 * PHP Version 7
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\Api\Endpoints\Project;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Api\Endpoint;

/**
 * A class for handling the /projects/$projectname/images endpoint.
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */
class Images extends Endpoint implements \LORIS\Middleware\ETagCalculator
{
    /**
     * A cache of the results of the endpoint, so that
     * it doesn't need to be recalculated for the ETag and handler
     */
    protected $responseCache = array();

    /**
     * The requested project
     */
    protected $project;

    /**
     * Contructor
     *
     * @param \Project $project The requested project
     */
    public function __construct(\Project $project)
    {
        $this->project = $project;
    }

    /**
     * Return which methods are supported by this endpoint.
     *
     * @return array supported HTTP methods
     */
    protected function allowedMethods() : array
    {
        return ['GET'];
    }

    /**
     * Versions of the LORIS API which are supported by this
     * endpoint.
     *
     * @return array a list of supported API versions.
     */
    protected function supportedVersions() : array
    {
        return ["v0.0.3-dev"];
    }

    /**
     * Handles a request that starts with /projects/$projectname/candidates
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $pathparts = $request->getAttribute('pathparts');
        if (count($pathparts) > 1) {
            return new \LORIS\Http\Response\NotFound();
        }

        return (new \LORIS\Http\Response())
            ->withHeader("Content-Type", "application/json")
            ->withBody(
                new \LORIS\Http\StringStream(
                    json_encode(
                        $this->toArray($request)
                    )
                )
            );
    }

    /**
     * Create an array representation of this endpoint's reponse body
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return array|\Psr\Http\Message\ResponseInterface
     */
    private function toArray(ServerRequestInterface $request)
    {
        $projectname = $this->project->getName();

        $datestring = $request->getQueryParams()['since'] ?? '1970-01-01';
        try {
            $since = new \DateTime($datestring);
        } catch (\Exception $e) {
            return (new \LORIS\Http\Response())
                    ->withStatus(400)
                    ->withBody(
                        new \LORIS\Http\StringStream($e->getMessage())
                    );
        }

        if (!isset($this->responseCache[$projectname])) {
            $provisioner = new \LORIS\api\ProjectImagesRowProvisioner(
                $this->project,
                $since
            );

            $user = $request->getAttribute('user');
            if (!$user->hasPermission('imaging_browser_view_allsites')) {
                if ($user->hasPermission('imaging_browser_view_site')) {
                    $provisioner = $provisioner->filter(
                        new \LORIS\Data\Filters\UserSiteMatch()
                    );
                } else {
                    $provisioner = $provisioner->filter(
                        new \LORIS\Data\Filters\OnlyPhantoms()
                    );
                }
            }

            if (!$user->hasPermission('imaging_browser_phantom_allsites')) {
                if ($user->hasPermission('imaging_browser_phantom_ownsite')) {
                    $provisioner = $provisioner->filter(
                        new \LORIS\Data\Filters\UserSiteMatch()
                    );
                } else {
                    $provisioner = $provisioner->filter(
                        new \LORIS\Data\Filters\NoPhantoms()
                    );
                }
            }

            $images = (new \LORIS\Data\Table())
                ->withDataFrom($provisioner)
                ->toArray($user);

            $this->responseCache[$projectname] = array('Images' => $images);
        }
        return $this->responseCache[$projectname];
    }

    /**
     * Implements the ETagCalculator interface
     *
     * @param ServerRequestInterface $request The PSR7 incoming request.
     *
     * @return string etag summarizing value of this request.
     */
    public function ETag(ServerRequestInterface $request) : string
    {
        return md5(json_encode($this->toArray($request)));
    }
}
