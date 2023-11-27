<?php
/**
 * This serves as a hint to LORIS that this module is a real module.
 * It handles the basic routing for the module.
 *
 * PHP Version 8
 *
 * @category   API
 * @package    Mindlogger
 * @author     Dzmitry Yahur <dyagur@scnsoft.com>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

namespace LORIS\mindlogger;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;


/**
 * Class module implements the basic Mindlogger module functionality
 *
 * @category   API
 * @package    Mindlogger
 * @author     Dzmitry Yahur <dyagur@scnsoft.com>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class Module extends \Module
{
    /**
     * @return bool
     */
    public function isPublicModule(): bool
    {
        return true;
    }

    const VERSION_PATTERN = "/^\/?(v[0-9]+)\/(.*)/";

    protected function validateAndParseUrl(string $url): array
    {
        $url_pieces = [];
        // Requests sent to this module must start with /mindlogger/$version
        if (preg_match(self::VERSION_PATTERN, $url, $url_pieces) !== 1) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'You must specify a version of the API to use in the URL'
            );
        };

        return $url_pieces;
    }

    /**
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $url = $request->getURI()->getPath();
        [$_, $version, $endpoint] = $this->validateAndParseUrl($url);

        $newurl = $request->getURI()->withPath($endpoint);

        $pathparts = explode('/', $endpoint);

        $newrequest = $request
            ->withURI($newurl)
            ->withAttribute("Mindlog-API-Version", $version)
            ->withAttribute('pathparts', $pathparts);

        $handlername = $pathparts[0];

        switch ($handlername) {
            case 'schema':
                $handler = new \LORIS\mindlogger\Endpoints\Schema($this->loris);
                break;
            default:
                return new \LORIS\Http\Response\JSON\NotFound();
        }


        return $handler->process($newrequest, $handler);
    }

    /**
     * @return string
     */
    public function getLongName(): string
    {
        return '';
    }

    /**
     * {@inheritDoc}
     *
     * @return bool Whether an api schema is available from this module.
     */
    public function hasAPISpecification(): bool
    {
        return false;
    }
}
