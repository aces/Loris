<?php
namespace LORIS\Router;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;


// Handles the root of a module install. It will mostly delegate to the
// module class.
class ModuleRouter extends Prefix
{
    protected $module = null;
    public function __construct(\Module $module, string $moduledir)
    {
        $this->module = $module;
        parent::__construct(
            new \ArrayIterator(
                [
                 "/css/"    => new ModuleFileRouter(
                     $module->getName(),
                     $moduledir,
                     "css"
                 ),
                 "/js/"     => new ModuleFileRouter(
                     $module->getName(),
                     $moduledir,
                     "js"
                 ),
                 "/static/" => new ModuleFileRouter(
                     $module->getName(),
                     $moduledir,
                     "static"
                 ),
                ]
            )
        );
    }

    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        if($this->module->isPublicModule() !== true) {
            // Add the authentication middleware for the current user (which was added by the
            // base router), and handle the request
            $authmiddleware = new \LORIS\Middleware\AuthMiddleware(
                new ModuleAuthenticator($request->getAttribute("user"), $this->module)
            );
            return $authmiddleware->withMiddleware(
                new \LORIS\Middleware\ResponseGenerator(
                )
            )->process($request, $this->module);
        }
        // Directly handle the request, because it was public anyways.
        return $this->module->handle($request);
    }
}
