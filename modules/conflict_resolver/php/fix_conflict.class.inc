<?php declare(strict_types=1);
namespace LORIS\conflict_resolver;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Server\RequestHandlerInterface;
use \Psr\Http\Message\ResponseInterface;
 
class Fix_Conflict implements RequestHandlerInterface
{
    public function _hasAccess() : bool
    {
        return true;
    }

    public function process(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler
    ): ResponseInterface {
        return $this->handle($request);
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $body = json_decode((string) $request->getBody(), true);
        error_log(print_r($body, true));
        return new \LORIS\Http\Response\JsonResponse(array(1,2,3));
    }
}

