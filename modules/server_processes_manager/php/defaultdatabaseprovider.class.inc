<?php
/**
 * Provides a default way to obtain access to the database for
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
namespace LORIS\server_processes_manager;

/**
 * A class for providing a default way to access the database.
 *
 * @category ServerProcessLauncher
 * @package  Loris
 * @author   Nicolas Brossard <nicolasbrossard.mni@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

class DefaultDatabaseProvider implements IDatabaseProvider
{
    /**
     * Gets access to the database through the Database::singleton() method.
     *
     * @return \Database an instance of the database.
     * @throws \DatabaseException if connection to the database cannot be established
     */
    public function getDatabase()
    {
        return \Database::singleton();
    }
}


