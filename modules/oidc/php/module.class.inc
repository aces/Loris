<?php

namespace LORIS\oidc;

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
     * @return bool true
     */
    public function isPublicModule() : bool
    {
        return true;
    }

    /**
     * {@inheritDoc}
     *
     * @return string The human readable name for this module
     */
    public function getLongName() : string
    {
        return 'OpenID Connect';
    }
}
