<?php
namespace LORIS\Middleware;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \Psr\Http\Message\URIInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use \LORIS\Http\ServerResponse;
use \LORIS\Http\StringStream;
use \LORIS\Http\FileStream;
use \LORIS\Http\EmptyStream;

class AuthMiddleware implements MiddlewareInterface, MiddlewareChainer {
    use MiddlewareChainerMixin;

    protected $authenticator;
    public function __construct(Authenticator $auth) {
        $this->authenticator = $auth;
    }

    public function process(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler
    ) : ResponseInterface {
        if ($this->authenticator->authenticate($request) === true) {
            return $this->next->process($request, $handler);
        }
        // FIXME: Use smarty template.
        return (new \Zend\Diactoros\Response())
           ->withStatus(403)
          ->withBody(new \LORIS\Http\StringStream("Permission denied"));

    }
}
