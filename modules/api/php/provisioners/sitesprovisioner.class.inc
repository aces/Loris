<?php declare(strict_types=1);

/**
 * This file implements a data provisioner to get the site information
 * of all sites accessible to a given user.
 *
 * PHP Version 8
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\api\Provisioners;

use \LORIS\Data\Provisioners\DBObjectProvisioner;

/**
 * This class implements a data provisioner to get the site information
 * of all site accessible to a given user.
 *
 * PHP Version 8
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class SitesProvisioner extends DBObjectProvisioner
{
    /**
     * Create a RowProvisioner, which gets rows for sites/
     * endpoint.
     */
    function __construct()
    {
        parent::__construct(
            '
             SELECT
               CenterID as _id,
               Name as _name,
               Alias as _alias,
               MRI_alias as _mrialias,
               Study_site as _isstudysite
             FROM
               psc
            ',
            [],
            '\LORIS\api\Models\SitesRow'
        );
    }
}
