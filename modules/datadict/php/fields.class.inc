<?php
namespace LORIS\datadict;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Return the dynamic field options for the data dictionary filter
 * as a JSON object.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link    https://github.com/aces/Loris
 */
class Fields extends \NDB_Page
{
    /**
     * Returns a list of instruments to use as the "Source From"
     * filter options as JSON.
     *
     * @param ServerRequestInterface $request The incoming request
     *
     * @return ResponseInterface
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        return new \LORIS\Http\Response\JSON\OK(
            ['sourceFrom' => \Utility::getAllInstruments()]
        );
    }
}
