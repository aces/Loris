<?php declare(strict_types=1);

namespace LORIS\biobank;

/**
 * Enum Permission
 *
 * Defines the allowed HTTP methods for accessing biobank resources.
 *
 * @license https://www.gnu.org/licenses/gpl-3.0.html GNU General Public License
 */
enum Permission: string
{
    case GET    = 'GET';
    case PUT    = 'PUT';
    case DELETE = 'DELETE';
    case POST   = 'POST';
}
