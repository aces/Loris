<?php
namespace LORIS\Middleware;
use Psr\Http\Message\ServerRequestInterface;

// FIXME: This shouldn't be in the middleware namespace. There
// should be a LORIS authentication framework.
interface Authenticator
{
    public function Authenticate(ServerRequestInterface $request) : bool;
}
