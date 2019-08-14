<?php declare(strict_types=1);
/**
 * This implements the Pool endpoint class for the Biobank Module.
 *
 * PHP Version 7.2
 *
 * @category   API
 * @package    Loris
 * @subpackage Biobank
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.text GPLv3
 * @link       http://www.github.com/aces/Loris
 */
namespace LORIS\biobank;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Server\RequestHandlerInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * A class for handling the /biobank/pool/ endpoint.
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
class PoolEndpoint implements RequestHandlerInterface
{
    /**
     * Returns true if user has access to this endpoint.
     *
     * @param \User $user The user whose access is being checked.
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
                'POST',
                'OPTIONS',
               );
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
     * Handles endpoint requests.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $db       = \Database::singleton();
        $user     = $request->getAttribute('user');
        $poolCont = new PoolController($db, $user);

        try {
            $db->beginTransaction();
            switch($request->getMethod()) {
            case 'GET':
                $pools = $poolCont->getInstances();
                return new \LORIS\Http\Response\OK($pools);
            case 'POST':
                $pool = json_decode($request->getBody()->getContents(), true);
                $poolCont->createInstance($pool);
                return new \LORIS\Http\Response\OK();
            case 'OPTIONS':
                return (new \LORIS\Http\Response())
                    ->withHeader('Allow', $this->allowedMethods());
            }
        } catch (\BadRequest $e) {
            $db->rollBack();
            return new \LORIS\Http\Response\BadRequest($e->getMessage());
        } catch (\Forbidden $e) {
            $db->rollBack();
            return new \LORIS\Http\Response\Forbidden($e->getMessage());
        } catch (\TypeError $e) {
            $db->rollback();
            return new \LORIS\Http\Response\InternalServerError($e->getMessage());
        } catch (\DatabaseException $e) {
            $db->rollBack();
            return new \LORIS\Http\Response\InternalServerError($e->getMessage());
        } finally {
            if ($db->inTransaction()) {
                $db->commit();
            }
        }
    }
}
