<?php
/**
 * Implements ModuleFileRouter, a class for routing to files
 * directly stored on the file system.
 *
 * PHP Version 7
 *
 * @category Router
 * @package  Router
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\Router;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \Psr\Http\Server\RequestHandlerInterface;


/**
 * A ModuleFileRouter is a type of RequestHandler which directly loads
 * files from the filesystem underneath the module's directory and turns
 * them into PSR7 streams.
 *
 * @category Router
 * @package  Router
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class ModuleFileRouter implements RequestHandlerInterface
{
    /**
     * The module which is being accessed.
     *
     * @var \Module
     */
    protected $module;

    /**
     * The subdirectory underneath the module to look up files in
     *
     * @var string
     */
    protected $subdir;

    protected $contenttype;
    /**
     * The constructor for a ModuleFileRouter takes the Module class,
     * the directory which the module is stored in, and the subdirectory of
     * the module which should be served by the handler.
     *
     * @param \Module $module    The module which is having its files served.
     * @param string  $moduledir The absolute path of the directory in which the
     *                           module lives.
     * @param string  $subdir    The subdirectory of moduledir to serve.
     */
    public function __construct(\Module $module, string $moduledir, string $subdir, string $contenttype)
    {
        $this->module    = $module;
        $this->moduledir = $moduledir;
        $this->subdir    = $subdir;
        $this->contenttype = $contenttype;
    }

    /**
     * Handle returns a StreamInterface of the file being requested (relative to
     * subdir) if it exists on the filesystem, otherwise it returns a 404.
     *
     * @param ServerRequestInterface $request The PSR7 request being handled
     *
     * @return ResponseInterface The PSR15 response.
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $fullpath = (
            $this->moduledir .
            "/" .
            $this->subdir .
            "/"
            . $request->getURI()->getPath()
        );

        if (is_file($fullpath)) {
            $resp = (new \Zend\Diactoros\Response)
                ->withStatus(200)
                ->withBody(new \Zend\Diactoros\Stream($fullpath));
            if ($this->contenttype != "") {
                $resp = $resp->withHeader("Content-Type", $this->contenttype);
            }
            return $resp;
        }
        return (new \LORIS\Http\Error(
            $request,
            404,
            $fullpath . ": File not found"))
            ->withHeader("Content-Type", "text/html");
    }
}
