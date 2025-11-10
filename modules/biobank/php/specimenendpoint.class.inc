<?php declare(strict_types=1);

namespace LORIS\biobank;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Server\RequestHandlerInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * A class for handling the /biobank/specimens/ endpoint.
 *
 * PHP Version 8.2
 *
 * @category   Biobank
 * @package    Main
 * @subpackage Biobank
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.text GPLv3
 * @link       http://www.github.com/aces/Lors/
 */
class SpecimenEndpoint extends \NDB_Page implements RequestHandlerInterface
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
        return [
            'GET',
            'PUT',
            'POST',
            'OPTIONS',
        ];
    }

    /**
     * This function can be overridden in a module's page to load the necessary
     * resources to check the permissions of a user.
     *
     * @param \User                  $user    The user to load the resources for
     * @param ServerRequestInterface $request The PSR15 Request being handled
     *
     * @return void
     */
    public function loadResources(
        \User $user, ServerRequestInterface $request
    ) : void {
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
        ini_set('memory_limit', '-1');
        $db       = \NDB_Factory::singleton()->database();
        $user     = $request->getAttribute('user');
        $specCont = new SpecimenController($this->loris, $user);

        try {
            $db->beginTransaction();
            switch ($request->getMethod()) {
            case 'GET':
                $specimens = $specCont->getInstances();
                return new \LORIS\Http\Response\JSON\OK($specimens);
            case 'POST':
                $specimenArray = json_decode(
                    $request->getBody()->getContents(),
                    true
                );
                $specimens     = $specCont->createInstances($specimenArray);

                if (!empty($request->getUploadedFiles())) {
                    $response = $this->uploadFiles($request);
                    if ($response->getStatusCode() !== 200) {
                        $db->rollBack();
                        return $response;
                    }
                }
                return new \LORIS\Http\Response\JSON\OK($specimens);
            case 'PUT':
                $specimenArray = json_decode(
                    $request->getBody()->getContents(),
                    true
                );
                $specimen      = $specCont->updateInstance($specimenArray);
                return new \LORIS\Http\Response\JSON\OK([$specimen]);
            case 'OPTIONS':
                return (new \LORIS\Http\Response())
                    ->withHeader('Allow', $this->allowedMethods());
            }
        } catch (\NotFound $e) {
            $db->rollBack();
            return new \LORIS\Http\Response\JSON\NotFound($e->getMessage());
        } catch (\DatabaseException $e) {
            $db->rollBack();
            $message = $e->getMessage().'. If this error occurs again, please
                contact your administrator.';
            return new \LORIS\Http\Response\JSON\InternalServerError($message);
        } catch (\TypeError $e) {
            $db->rollBack();
            $message = $e->getMessage().'. If this error occurs again, please
                contact your administrator.';
            return new \LORIS\Http\Response\JSON\InternalServerError($message);
        } catch (\Error $e) {
            $db->rollBack();
            $message = $e->getMessage().'. If this error occurs again, please
                contact your administrator.';
            return new \LORIS\Http\Response\JSON\InternalServerError($message);
        } catch (\Exception $e) {
            $db->rollBack();
            // PUT SOMETHING HERE LATER
            return new \LORIS\Http\Response\JSON\InternalServerError(
                $e->getMessage()
            );
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
