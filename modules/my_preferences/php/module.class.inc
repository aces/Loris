<?php declare(strict_types=1);
namespace LORIS\my_preferences;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
/**
 * Class module implements the basic LORIS module functionality
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class Module extends \Module
{
    /**
     * {@inheritDoc}
     *
     * @param \User $user The user whose access is being checked.
     *
     * @return bool whether access is granted
     */
    public function hasAccess(\User $user) : bool
    {
        return parent::hasAccess($user);
    }

    /**
     * {@inheritDoc}
     *
     * @return string The human readable name for this module
     */
    public function getLongName() : string
    {
        return "My Preferences";
    }
}
