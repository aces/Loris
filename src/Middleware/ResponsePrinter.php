<?php
/**
 * Implements the PostResponseQueuer middleware class
 *
 * PHP Version 7
 *
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
namespace LORIS\Middleware;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \Psr\Http\Server\MiddlewareInterface;
use \Psr\Http\Server\RequestHandlerInterface;

/**
 *
 */
class ResponsePrinter implements MiddlewareInterface, MiddlewareChainer
{
    use MiddlewareChainerMixin;

    /**
     * @param ServerRequestInterface  $request The incoming PSR7 request.
     * @param RequestHandlerInterface $handler The PSR15 handler to delegate
     *                                         content generation to.
     *
     * @return ResponseInterface the PSR15 response
     */
    public function process(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler
    ) : ResponseInterface {
error_log(__METHOD__);
        $response = $this->next->process($request, $handler);

        // Add the HTTP header line.
        header(
            "HTTP/" . $response->getProtocolVersion()
            . " " . $response->getStatusCode()
            . " " . $response->getReasonPhrase()
        );
        
        // Add the headers from the response.
        $headers = $response->getHeaders();
        foreach ($headers as $name => $values) {
            header($name . ': ' . implode(', ', $values));
        }
        
        // Include the body.
        $bodystream = $response->getBody();
        
        // First we need to disable any output buffering so that
        // it streams to the output instead of into the buffer
        // and uses up all the memory for large chunks of data.
        for ($i = ob_get_level(); $i != 0; $i = ob_get_level()) {
            ob_end_clean();
        }
        ob_implicit_flush();
        
        while ($bodystream->eof() == false) {
            // 64k oughta be enough for anybody.
            print $bodystream->read(1024*64);
        }
error_log('response printed');
        return $response;
    }
}
