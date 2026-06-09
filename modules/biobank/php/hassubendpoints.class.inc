<?php declare(strict_types=1);

namespace LORIS\biobank;

/**
 * HasSubEndpoints interface to be implemented by endpoints that needs to route to a
 * sub-endpoint.
 *
 * @package    LORIS
 * @subpackage Biobank
 * @author     Henri Rabalais <henri.j.rabalais@gmail.com>
 * @license    https://www.gnu.org/licenses/gpl-3.0.html GNU General Public
 *             License
 */
interface HasSubEndpoints
{
    /**
     * Returns a sub-endpoint for a given subpath
     *
     * @param string $subpath The subpath to check for a sub-endpoint.
     *
     * @return Endpoint The sub-endpoint for the subpath
     */
    public function getSubEndpoint(string $subpath): Endpoint;
}
