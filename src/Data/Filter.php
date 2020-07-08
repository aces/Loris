<?php
/**
 * This file contains a definition of the Filter interface.
 *
 * PHP Version 7
 *
 * @category   Data
 * @package    Main
 * @subpackage Data
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

/**
 * The LORIS\Data namespace contains interfaces and classes used to extract and
 * filter data. It implements the framework for permission based filtering.
 */
namespace LORIS\Data;

/**
 * A Filter represents a ruleset for whether or not data should be filtered out
 * of a Provisioner. It generally is used for things like verifying permissions
 * in a Provisioner.
 *
 * @category   Data
 * @package    Main
 * @subpackage Data
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
interface Filter
{
    /**
     * Filter returns true IFF the resource should be filtered out of the results
     * displayed to user.
     *
     * @param \User        $user     The user that the data is being filtered on
     *                               on behalf of.
     * @param DataInstance $resource The Instance being filtered.
     *
     * @return bool true if and only if the user should see the resource Instance
     */
    public function filter(\User $user, DataInstance $resource) : bool;
}
