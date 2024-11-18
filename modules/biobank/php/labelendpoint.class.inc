<?php declare(strict_types=1);

/**
 * This implements the Container endpoint class for the Biobank Module.
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
 * A class for handling the /biobank/containers/ endpoint.
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
class LabelEndpoint implements RequestHandlerInterface
{
    /**
     * Returns true if user has access to this endpoint.
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
     * Return HTTP methods allowed at this endpoint
     *
     * @return string[]
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
     * XXX: This function should be extracted to a parent class.
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
     * Handles Endpoint requests.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        // TODO: Place a try catch here in case printing doesn't work for some
        // reason.
        switch ($request->getMethod()) {
        case 'POST':
            $params = json_decode($request->getBody()->getContents(), true);;
            foreach ($params as $param) {
                $barcode = $param['barcode'];
                $type    = $param['type'];
                $zpl     = "^XA,^FO330,80^BY1,^BCN,100,Y,Y,N,^CFA,"
                    . "20^A0N,30,29^BCN,100,Y,Y,N^FD$barcode^FS,"
                    . "^FO323,190,^CFA,20^A0N,30,29^FD$type^XZ";
                $config  = \NDB_Config::singleton();
                $path    = $config->getSetting('labelPrintingPath');
                $path    = $path.'barcode.zpl';
                $fp      = fopen($path, 'w');
                fwrite($fp, $zpl);
                fclose($fp);
                shell_exec('lp -d ZDesigner -o raw '.escapeshellarg($path));
            }
            return new \LORIS\Http\Response\JSON\OK();
        }
    }
}
