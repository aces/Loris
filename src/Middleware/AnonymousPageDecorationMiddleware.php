<?php
namespace LORIS\Middleware;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \Psr\Http\Server\MiddlewareInterface;
use \Psr\Http\Server\RequestHandlerInterface;

class AnonymousPageDecorationMiddleware implements MiddlewareInterface {
    protected $JSFiles;
    protected $CSSFiles;
    protected $Config;
    protected $BaseURL;

    public function __construct(string $baseurl, \NDB_Config $config, array $JS, array $CSS) {
        $this->JSFiles = $JS;
        $this->CSSFiles = $CSS;
        $this->Config = $config;
        $this->BaseURL = $baseurl;
    }

    /**
     * Displays a page to an anonymous (not logged in) user.
     *
     * @param ServerRequestInterface  $request The incoming PSR7 request
     * @param RequestHandlerInterface $handler The PSR15 handler to delegate to
     *
     * @return ResponseInterface The response with the page content
     */
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler) : ResponseInterface {
        // Basic page outline variables
        $tpl_data = array(
            'study_title' => $this->Config->getSetting('title'),
            'baseurl'     => $this->BaseURL,
            'currentyear' => date('Y'),
            'sandbox'     => ($this->Config->getSetting("sandbox") === '1'),
        );

        // I don't think anyone uses this. It's not really supported
        $tpl_data['css'] = $this->Config->getSetting('css');

        //Display the footer links, as specified in the config file
        $links =$this->Config->getExternalLinks('FooterLink');

        $tpl_data['links'] = array();
        foreach ($links as $label => $url) {
            $WindowName = md5($url);

            $tpl_data['links'][] = array(
                'url'        => $url,
                'label'      => $label,
                'windowName' => $WindowName,
            );
        }

        // Handle needs to be called before form action, because handle potentially
        // calls setup which modifies the $page->FormAction value (ie in the imaging
        // browser)
        $undecorated = $handler->handle($request);
        $contenttype = $undecorated->getHeaderLine("Content-Type");
        if ($contenttype != "" && strpos($contenttype, "text/html") === false) {
            // FIXME: This should explicitly check for text/html instead of implicitly treating
            // no content type as text/html, but most of our code doesn't add an appropriate
            // content type right now, so we default to assuming HTML.
            return $undecorated;
        }

        $undecorated = $handler->handle($request);
        // Finally, the actual content and render it..
        $tpl_data += array(
            'jsfiles'   => $this->JSFiles,
            'cssfiles'  => $this->CSSFiles,
            'workspace' => $undecorated->getBody(),
        );

        $smarty = new \Smarty_neurodb;
        $smarty->assign($tpl_data);

        return $undecorated->withBody(new \LORIS\Http\StringStream($smarty->fetch("public_layout.tpl")));
    }
}
