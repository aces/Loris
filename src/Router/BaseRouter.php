<?php
namespace LORIS\Router;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;
use \Psr\Http\Server\RequestHandlerInterface;
use LORIS\Http\StringStream;

// Handles the root of a LORIS install. It will mostly delegate to the
// module router.
// FIXME: Add other things in .htaccess here.
class BaseRouter extends Prefix implements RequestHandlerInterface {
    protected $projectdir;
    protected $moduledir;
    protected $user;

    public function __construct(\User $user, string $projectdir, string $moduledir) {
        $this->user = $user;
        $this->projectdir = $projectdir;
        $this->moduledir = $moduledir;
    }

    public function handle(ServerRequestInterface $request) : ResponseInterface {
        $uri = $request->getUri();
        $path = $uri->getPath();
        // Replace multiple slashes in the URL with a single slash
        $path = preg_replace("/\/+/", "/", $path);
        // Remove a training slash remaining, so that foo/ and foo are the same
        // route
        $path = preg_replace("/\/$/", "", $path);
        $request = $request->withAttribute("user", $this->user);
        if ($path == "/" || $path == "") {
            if ($this->user instanceof \LORIS\AnonymousUser) {
                $modulename = "login";
            }  else {
                $modulename = "dashboard";
            }
            $request = $request->withURI($uri->withPath("/"));
        } else if ($path[0] === "/") {
            $path = substr($path, 1);
            $request = $request->withURI($uri->withPath($path));
        }

        if (empty($modulename)) {
            $components = preg_split("/\/+?/", $path);
            $modulename = $components[0];
        }
        if (is_dir($this->moduledir . "/" . $modulename)) {
            $uri = $request->getURI();
            $suburi = $this->stripPrefix($modulename, $uri);
            $module = \Module::factory($modulename);

            // Calculate the base path by stripping off the module from the original.
            $path = $uri->getPath();
            $baseurl = substr($path, 0, strpos($path, $modulename));
            $baseurl = $uri->withPath($baseurl)->withQuery("");
            $request = $request->withAttribute("baseurl", $baseurl->__toString());
            $mr = new ModuleRouter($module, $this->moduledir);
            $request = $request->withURI($suburi);
            return $mr->handle($request);
        }

        // Legacy from .htaccess. A CandID goes to the timepoint_list
        // FIXME: This should all be one candidates module, not a bunch
        // of hacks in the base router.
        if (preg_match("/^([0-9]{6})$/", $components[0])) {
            // FIXME: This assumes the baseURL is under /
            $path = $uri->getPath();
            $baseurl = $uri->withPath("/")->withQuery("");
            switch (count($components)) {
            case 1:
                $request= $request
                    ->withAttribute("baseurl", $baseurl->__toString())
                    ->withAttribute("CandID", $components[0]);
                $module = \Module::factory("timepoint_list");
                $mr = new ModuleRouter($module, $this->moduledir);
                return $mr->handle($request);
            case 2:
                // CandID/SessionID, inherited from htaccess
                $request= $request
                    ->withAttribute("baseurl", $baseurl->__toString())
                    ->withAttribute("CandID", $components[0]);
                // FIXME: Validate 
                $request= $request
                    ->withAttribute("TimePoint", \TimePoint::singleton($components[1]));
                $module = \Module::factory("instrument_list");
                $mr = new ModuleRouter($module, $this->moduledir);
                return $mr->handle($request);
            default:
                // Fall through to 404. We don't have any routes that go farther
                // than 2 levels..
            }
        }

        // FIXME: Use 404 from smarty template.
        return (new \Zend\Diactoros\Response())
            ->withStatus(404)
            ->withBody(new StringStream("Not Found"));
    }
}
