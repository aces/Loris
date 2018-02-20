<?php
namespace LORIS\Router;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \Psr\Http\Server\RequestHandlerInterface;
use \LORIS\Http\FileStream;
use \LORIS\Http\StringStream;


class ModuleFileRouter implements RequestHandlerInterface {
    protected $module;
    protected $subdir;

    public function __construct($module, $moduledir, $subdir) {
        $this->module = $module;
        $this->moduledir = $moduledir;
        $this->subdir = $subdir;
    }
    public function handle(ServerRequestInterface $request) : ResponseInterface {
        $fullpath = $this->moduledir . "/" . $this->subdir . "/" . $request->getURI()->getPath();

        if (is_file($fullpath)) {
            return (new \Zend\Diactoros\Response)
                ->withStatus(200)
                ->withBody(new \Zend\Diactoros\Stream($fullpath));
        }
        return (new \Zend\Diactoros\Response())
            ->withStatus(404)
            ->withBody(new StringStream($fullpath . ": File not found"));
    }
}
