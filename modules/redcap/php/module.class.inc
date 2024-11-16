<?php declare(strict_types=1);
/**
 * This serves as a hint to LORIS that this module is a real module.
 * It does nothing but implement the module class in the module's namespace.
 *
 * PHP Version 8
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Behavioural
 * @author     Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\redcap;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\redcap\RedcapHTTPClientHandler;

/**
 * This sets specific bahaviours or the redcap module and provides
 * the initial request routing.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class Module extends \Module
{
    /**
     * REDcap client handler.
     *
     * @var RedcapHTTPClientHandler
     */
    private static RedcapHTTPClientHandler $redcapClientHandler;

    /**
     * This needs to be true since redcap wont authenticate.
     *
     * @return bool True
     */
    public function isPublicModule() : bool
    {
        return true;
    }

    /**
     * Return the long name of this module.
     *
     * @return string
     */
    public function getLongName() : string
    {
        return "REDCap";
    }

    /**
     * Get the current Redcap client handler
     *
     * @return RedcapHTTPClientHandler
     */
    protected static function getRedcapHandler(
        \Loris\LORISInstance $loris
    ): RedcapHTTPClientHandler
    {
        // load the redcap client handler once
        if (!isset(self::$redcapClientHandler)) {
            self::$redcapClientHandler = RedcapHTTPClientHandler::factory($loris, false);
        }
        return self::$redcapClientHandler;
    }

    /**
     * Perform routing for this module's endpoints.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface the outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        // udpate redcap client handler
        $redcapClientHandler = self::getRedcapHandler($this->loris);

        //
        $path = trim($request->getURI()->getPath(), "/");
        switch ($path) {
        case 'notifications':
            $handler = new Endpoints\Notifications(
                $request->getAttribute('loris'),
                $redcapClientHandler
            );
            break;
        // case 'dev_test':
        //     $body = (new Notifications\RedcapNotificationHandler(
        //         $request->getAttribute('loris')
        //     ))->test();
        //     return new \LORIS\Http\Response(new \LORIS\Http\StringStream($body));
        default:
            return parent::handle($request);
        }

        return $handler->process($request, $handler);
    }
}

