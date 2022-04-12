<?php declare(strict_types=1);
/**
 * This implement the Shipment endpoint class for the Biobank Module.
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
 * A class for handling the /biobank/shipments/ endpoint.
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
class Shipments implements RequestHandlerInterface
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
        $this->db       = \Database::singleton();
        $this->user     = $request->getAttribute('user');

        $pathparts = $request->getAttribute('pathparts');

        // TODO: This entire thing NEEDS to have a try block wrapped around it!
        try {
            $this->db->beginTransaction();
            switch($request->getMethod()) {
            case 'GET':
                return $this->_handleGET($request);
            case 'POST':
                return $this->_handlePOST($request);
            case 'PUT':
                return $this->_handlePUT($request);
            case 'OPTIONS':
                return (new \LORIS\Http\Response())
                    ->withHeader('Allow', $this->allowedMethods());
            }
        } finally {
            if ($this->db->inTransaction()) {
                $this->db->commit();
            }
        }
    }

    private function _handleGET(ServerRequestInterface $request) : ResponseInterface
    {
        // TODO: This needs to be checked but should probably go somewhere else...
        // if (!$this->user->hasPermission('biobank_shipment_view')) {
        //     throw new \Forbidden('Shipment: View Permission Denied');
        // }
        $shipments = [];
        $dao = new ShipmentDAO($this->db);
        if ($this->user->hasPermission('access_all_profiles') === false) {
            $dao = $dao->filter(new \LORIS\Data\Filters\UserSiteMatch());
        }
        $shipmentIterator = $dao->execute($this->user);
        foreach ($shipmentIterator as $barcode=>$shipment) {
            $shipments[$barcode] = $shipment;
        }
        return new \LORIS\Http\Response\OK($shipments);
    }

    private function _handlePOST(ServerRequestInterface $request) : ResponseInterface
    {
        $shipmentArray   = json_decode($request->getBody()->getContents(), true);
        $shipmentHandler = new ShipmentHandler($shipmentArray, $this->db, $this->user);

        // TODO: A lot of what the handler does should ACTUALLY be done here.
        // Handlers should not know how operate multiple shipments, only 1 each!
        if (!$shipmentHandler->isValid()) {
            return new \LORIS\Http\Response\JsonResponse($shipmentHandler->getErrors(), 422);
        }
        
        return new \LORIS\Http\Response\JsonResponse($shipmentHandler->createInstance(), 200);
    }

    private function _handlePUT(ServerRequestInterface $request) : ResponseInterface
    {
        $shipmentArray   = json_decode($request->getBody()->getContents(), true);
        $shipmentHandler = new ShipmentHandler($shipmentArray, $this->db, $this->user);

        // TODO: A lot of what the handler does should ACTUALLY be done here.
        // Handlers should not know how operate multiple shipments, only 1 each!
        if (!$shipmentHandler->isValid()) {
            return new \LORIS\Http\Response\JsonResponse($shipmentHandler->getErrors(), 422);
        }
        
        return new \LORIS\Http\Response\JsonResponse($shipmentHandler->createInstance(), 200);
    }
}
