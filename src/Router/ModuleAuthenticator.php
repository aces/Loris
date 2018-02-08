<?php
namespace LORIS\Router;
use Psr\Http\Message\ServerRequestInterface;

// FIXME: This shouldn't be in the middleware namespace. There
// should be a LORIS authentication framework.
class ModuleAuthenticator implements \LORIS\Middleware\Authenticator {
    public function __construct(\User $user, \Module $module) {
        $this->user = $user;
        $this->Module = $module;
    }
    public function authenticate(ServerRequestInterface $request) : bool {
        if ($this->Module->isPublicModule() === true) {
            return true;
        }

        return $this->Module->hasAccess($this->user);
    }
}
