<?php
namespace LORIS\Router;

use \Psr\Http\Server\RequestHandlerInterface;
use \Psr\Http\Message\ResponseInterface;
use \Psr\Http\Message\ServerRequestInterface;

class NoopResponder implements RequestHandlerInterface
{
    protected $response;

    public function __construct(ResponseInterface $response)
    {
        $this->response = $response;
    }
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        return $this->response;
    }
}
