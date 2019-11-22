<?php declare(strict_types=1);
/**
 * PHP Version 7
 *
 * @category API
 * @package  LORIS
 * @author   Cecile Madjar <cecile.madjar@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\api\Endpoints\Candidate\Visit\Electrophysiology;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\api\Endpoint;

/**
 * This class handles request to a BIDS file related to a recording.
 *
 * @category API
 * @package  LORIS
 * @author   Cecile Madjar <cecile.madjar@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class BidsFile extends Endpoint
{
    /**
     * The requested recording
     *
     * @var \LORIS\Recording
     */
    private $_recording;

    /**
     * Contructor
     *
     * @param \LORIS\Recording $recording The requested recording
     */
    public function __construct(\LORIS\Recording $recording)
    {
        $this->_recording = $recording;
    }

    /**
     * Return which methods are supported by this endpoint.
     *
     * @return array supported HTTP methods
     */
    protected function allowedMethods() : array
    {
        return array('GET');
    }

    /**
     * Versions of the LORIS API which are supported by this endpoint.
     *
     * @return array a list of supported API versions.
     */
    protected function supportedVersions() : array
    {
        return array(
            'v0.0.3-dev',
        );
    }

    /**
     * Delegates the request to a specialized endpoint according to specified
     * the file wanted.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $pathparts = $request->getAttribute('pathparts');
        if (count($pathparts) !== 1) {
            return new \LORIS\Http\Response\JSON\NotFound();
        }

        $format = array_shift($pathparts);
        switch ($format) {
            case 'channels':
                $handler = new BidsFile\Channels($this->_recording);
                break;
            case 'electrodes':
                $handler = new BidsFile\Electrodes($this->_recording);
                break;
            case 'events.class':
                $handler = new BidsFile\Events($this->_recording);
                break;
            case 'archive':
                $handler = new BidsFile\Archive($this->_recording);
                break;
            default:
                return new \LORIS\Http\Response\JSON\UnsupportedMediaType();
        }

        $newrequest = $request
            ->withAttribute('pathparts', $pathparts);

        return $handler->process(
            $newrequest,
            $handler
        );
    }
}