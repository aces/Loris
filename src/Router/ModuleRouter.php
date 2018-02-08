<?php
namespace LORIS\Router;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;


// Handles the root of a module install. It will mostly delegate to the
// module class.
class ModuleRouter extends Prefix {
    protected $module = null;
    public function __construct(\Module $module, string $moduledir) {
        $this->module = $module;
        parent::__construct(new \ArrayIterator([
            "/css/" => new ModuleFileRouter($module->getName(), $moduledir, "css"),
            "/js/" => new ModuleFileRouter($module->getName(), $moduledir, "js"),
            "/static/" => new ModuleFileRouter($module->getName(), $moduledir, "static"),
        ]
        ));
    }

    public function handle(ServerRequestInterface $request) : ResponseInterface {
        // FIXME: Add Authentication middleware if the module isn't public.
        if($this->module->isPublicModule() !== true) {
            // FIXME: This whole thing should be in the module class?
            return (new \LORIS\Middleware\AuthMiddleware(new ModuleAuthenticator($request->getAttribute("user"), $this->module)))->withMiddleware(new \LORIS\Middleware\ResponseGenerator())->process($request, $this->module);
        }
        return $this->module->handle($request);
    }
}
