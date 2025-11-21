<?php declare(strict_types=1);

/**
 * This implements the Shipment endpoint class for the Biobank Module.
 *
 * PHP Version 8.2
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
 * PHP Version 8.2
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

    private \LORIS\LorisInstance $loris;
    private \Database $db;
    private \User $user;

    /**
     * Returns true if user has access to this Endpoint.
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
        $this->db   = \NDB_Factory::singleton()->database();
        $this->user = $request->getAttribute('user');

        try {
            $this->db->beginTransaction();
            switch ($request->getMethod()) {
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
        } catch (\Exception $e) {
            $this->db->rollBack();
            // PUT SOMETHING HERE LATER
            return new \LORIS\Http\Response\JSON\InternalServerError(
                $e->getMessage()
            );
        } finally {
            if ($this->db->inTransaction()) {
                $this->db->commit();
            }
        }
    }

    /**
     * Handle the logic of an incoming HTTP GET request
     *
     * @return ResponseInterface
     */
    private function _handleGET() : ResponseInterface
    {
        // if (!$this->user->hasPermission('biobank_shipment_view')) {
        //     return new \Forbidden('Shipment: View Permission Denied');
        // }
        $shipments = [];
        $dao       = (new ShipmentDAO($this->db))
          ->filter(new \LORIS\Data\Filters\UserSiteMatch());
        $shipmentIterator = $dao->execute($this->user);
        foreach ($shipmentIterator as $barcode=>$shipment) {
            $shipments[$barcode] = $shipment;
        }
        return new \LORIS\Http\Response\JSON\OK($shipments);
    }

    /**
     * Handle the logic of an incoming HTTP POST request
     *
     * @param ServerRequestInterface $request The PSR7 request
     *
     * @return ResponseInterface
     */
    private function _handlePOST(ServerRequestInterface $request) : ResponseInterface
    {
        $shipmentArray   = json_decode($request->getBody()->getContents(), true);
        $shipmentHandler = new ShipmentHandler(
            $shipmentArray,
            $this->db,
            $this->user,
        );

        if (!$shipmentHandler->isValid()) {
            return new \LORIS\Http\Response\JsonResponse(
                $shipmentHandler->getErrors(),
                422
            );
        }

        return new \LORIS\Http\Response\JsonResponse(
            $shipmentHandler->createInstance(),
            200
        );
    }

    /**
     * Logic to handle an incoming HTTP PUT request
     *
     * @param ServerRequestInterface $request the PSR7 request
     *
     * @return ResponseInterface
     */
    private function _handlePUT(
        ServerRequestInterface $request
    ) : ResponseInterface {
        $shipmentArray   = json_decode($request->getBody()->getContents(), true);
        $shipmentHandler = new ShipmentHandler(
            $shipmentArray,
            $this->db,
            $this->user,
        );

        if (!$shipmentHandler->isValid()) {
            return new \LORIS\Http\Response\JsonResponse(
                $shipmentHandler->getErrors(),
                422,
            );
        }

        return new \LORIS\Http\Response\JsonResponse(
            $shipmentHandler->updateInstance(),
            200,
        );
    }
}
