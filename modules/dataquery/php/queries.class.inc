<?php
namespace LORIS\dataquery;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Handles requests to queries under the /queries/* endpoint of
 * the dataquery module.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class Queries extends \NDB_Page
{
    public $skipTemplate = true;

    /**
     * Access permissions checked by Module class. Return true
     * if we got to this point.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        return true;
    }

    /**
     * {@inheritDoc}
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $url    = $request->getURI()->getPath();
        $pieces = [];
        if (preg_match(
            "/queries$/",
            $url,
            $pieces
        ) === 1
        ) {
            return (new \LORIS\dataquery\endpoints\Queries($this->loris))
                ->handle($request);
        }
        if (preg_match(
            "/queries\/runs$/",
            $url,
            $pieces
        ) === 1
        ) {
            return (new \LORIS\dataquery\endpoints\queries\Runs($this->loris))
                ->handle($request);
        }
        if (preg_match(
            "/queries\/([0-9]+)$/",
            $url,
            $pieces
        ) === 1
        ) {
            $queryID = intval($pieces[1]);
            return (new \LORIS\dataquery\endpoints\queries\Query(
                $this->loris,
                $queryID
            )
            )->handle($request);
        }
        if (preg_match(
            "/queries\/([0-9]+)\/run$/",
            $url,
            $pieces
        ) === 1
        ) {
            $queryID = intval($pieces[1]);
            return (new \LORIS\Middleware\Compression())->process(
                $request,
                new \LORIS\dataquery\endpoints\queries\query\Run(
                    $this->loris,
                    $queryID
                )
            );
        }
        if (preg_match(
            "/queries\/([0-9]+)\/count$/",
            $url,
            $pieces
        ) === 1
        ) {
            $queryID = intval($pieces[1]);
            return (new \LORIS\dataquery\endpoints\queries\query\Count(
                $this->loris,
                $queryID
            ))->handle($request);
        }
        if (preg_match(
            "/queries\/([0-9]+)\/run\/([0-9]+)$/",
            $url,
            $pieces
        ) === 1
        ) {
            return new \LORIS\Http\Response\JSON\NotImplemented();
        }
        return new \LORIS\Http\Response\JSON\NotFound();
    }
}
