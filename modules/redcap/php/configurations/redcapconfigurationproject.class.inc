<?php declare(strict_types=1);
/**
 * PHP Version 8
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\redcap\configurations;

/**
 * This represents a REDCap project configuration.
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class RedcapConfigurationProject
{
    /**
     * A REDCap project ID.
     *
     * @var string
     */
    private string $_id;

    /**
     * A REDcap token to access this project.
     *
     * @var string
     */
    private string $_token;

    /**
     * Constructor.
     *
     * @param string $projectID the projectID
     * @param string $token     the token
     */
    public function __construct(string $projectID, string $token)
    {
        $this->_id    = $projectID;
        $this->_token = $token;
    }

    /**
     * Get the REDCap project ID.
     *
     * @return string
     */
    public function getProjectId(): string
    {
        return $this->_id;
    }

    /**
     * Get the REDCap token.
     *
     * @return string
     */
    public function getToken(): string
    {
        return $this->_token;
    }
}