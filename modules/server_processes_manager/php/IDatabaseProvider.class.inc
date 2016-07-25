<?php
/**
 * Provides a way to obtain access to the database for
 * the classes related to the ServerProcessLauncher
 *
 * PHP Version 5
 *
 * @category ServerProcessLauncher
 * @package  Loris
 * @author   Nicolas Brossard <nicolasbrossard.mni@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */


/**
 * An interface for entities that provide a way to access the database.
 *
 * @category ServerProcessLauncher
 * @package  Loris
 * @author   Nicolas Brossard <nicolasbrossard.mni@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

interface IDatabaseProvider
{
    /**
      * Gets a database object used to access the database.
      *
      * @return a database object used to access the database.
      */
    function getDatabase();
}

?>
