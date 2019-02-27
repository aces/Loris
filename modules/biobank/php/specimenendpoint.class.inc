<?php declare(strict_types=1);
/**
 * This implement the Specimen endpoint class for the Biobank Module.
 *
 * PHP Version 7.2
 *
 * @category   API
 * @package    Loris
 * @subpackage Biobank
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.text GPLv3
 * @link       http://www.github.com/aces/Loris/
 */
namespace LORIS\biobank;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Server\RequestHandlerInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * A class for handling the /biobank/specimens/ endpoint.
 *
 * PHP Version 7.2
 *
 * @category   Biobank
 * @package    Main
 * @subpackage Biobank
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.text GPLv3
 * @link       http://www.github.com/aces/Lors/
 */
class SpecimenEndpoint implements RequestHandlerInterface
{
    /**
     * Returns true if user has acces to this Controller.
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
     * Return which methods are supported by this endpoint.
     *
     * @return array supported HTTP methods
     */
    protected function allowedMethods() : array
    {
        return [
                'GET',
                'PUT',
                'POST',
               ];
    }

    /**
     * This function passes the request to the handler. This is necessary since
     * the Endpoint bypass the Module class.
     *
     * TODO: This function should be extracted to a parent class.
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
     * Handles Controller requests
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $response;
        $db       = \Database::singleton();
        $user     = $request->getAttribute('user');
        $specCont = new SpecimenController($db, $user);

        try {
            switch($request->getMethod()) {
            case 'GET':
                $specimens = $specCont->getInstances();
                return new \LORIS\Http\Response\OK($specimens);
            case 'POST':
                $specimens = json_decode($request->getBody()->getContents(), true);
                $specCont->createInstances($specimens);
                $fileResponse = $specCont->uploadFiles($request);
                if ($fileResponse->getStatusCode() !== 200) {
                    return $fileResponse;
                }
                return new \LORIS\Http\Response\OK();
            case 'PUT':
                $specimens = json_decode($request->getBody()->getContents(), true);
                $specCont->updateInstances($specimens, $files);
                $fileResponse = $specCont->uploadFiles($request);
                if ($fileResponse->getStatusCode() !== 200) {
                    return $fileResponse;
                }
                return new \LORIS\Http\Response\OK();
            case 'OPTIONS':
                return (new \LORIS\Http\Response())
                    ->withHeader('Allow', $this->allowedMethods());
            }

        } catch (\BadRequest $e) {
            return \LORIS\Http\Response\BadRequest($e->getMessage());
        } catch (\Forbidden $e) {
            return \LORIS\Http\Response\Forbidden($e->getMessage());
        }
    }
}
