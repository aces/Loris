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
     * Returns true if user has acces to this Endpoint.
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
        return array(
                'GET',
                'PUT',
                'POST',
                'OPTIONS',
               );
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
     * Handles Endpoint requests
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $db       = \Database::singleton();
        $user     = $request->getAttribute('user');
        $specCont = new SpecimenController($db, $user);

        try {
            $db->beginTransaction();
            switch($request->getMethod()) {
            case 'GET':
                $specimens = $specCont->getInstances();
                return new \LORIS\Http\Response\OK($specimens); 
            case 'POST':
                $specimens = json_decode($request->getBody()->getContents(), true);
                $specCont->createInstances($specimens);
                return new \LORIS\Http\Response\OK(); 
            case 'PUT':
                $test = $request->getBody()->getContents();
                print_r($request->getParsedBody());
                $specimens = json_decode($request->getBody()->getContents(), true);
                $specCont->updateInstance($specimens);
                return new \LORIS\Http\Response\OK(); 
            case 'OPTIONS':
                return (new \LORIS\Http\Response())
                    ->withHeader('Allow', $this->allowedMethods());
            }

            // I would like to move this logic into the controller, but the only
            // way to do that while maintaining 
            $response = $this->uploadFiles($request);
            if ($response->getStatusCode() !== 200) {
                $db->rollBack();
                return $response;
            }
        } catch (\BadRequest $e) {
            $db->rollBack();
            return new \LORIS\Http\Response\BadRequest($e->getMessage());
        } catch (\Forbidden $e) {
            $db->rollBack();
            return new \LORIS\Http\Response\Forbidden($e->getMessage());
        } catch (\NotFound $e) {
            $db->rollBack();
            return new \LORIS\Http\Response\NotFound($e->getMessage());
        } catch (\Exception $e) {
            $db->rollBack();
            // PUT SOMETHING HERE LATER
        } finally {
            if ($db->inTransaction()) {
                $db->commit();
            }
        }
    }

    /**
     * Validates and Uploades files
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *                                        containg the files to be uploaded.
     *
     * @return ResponseInterface
     */
    public function uploadFiles(ServerRequestInterface $request) : ResponseInterface
    {
        $config = \NDB_Config::singleton();
        $path   = $config->getSetting('biobankPath');

        if (!isset($path)) {
            throw new \NotFound('Biobank File Upload Path is not configured');
        }
        $targetdir = new \SplFileInfo($path);

        $uploader = (new \LORIS\FilesUploadHandler($targetdir))
            ->withPermittedMIMETypes(
                'text/plain'
            );

        return $uploader->handle($request);
    }
}
