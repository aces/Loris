<?php declare(strict_types=1);

namespace LORIS\Middleware;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \Psr\Http\Server\RequestHandlerInterface;

/**
 * A ContentSecurityPolicy middleware is a chainable type of PSR15-based middleware
 * which takes a response and adds an appropriate Content-Security-Policy header
 * for the LORIS instance.
 *
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class ContentSecurityPolicy implements MiddlewareChainer
{
    use MiddlewareChainerMixin;

    /**
     * {@inheritDoc}
     *
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
        $loris  = $request->getAttribute("loris");
        $config = $loris->getConfiguration();

        $config_additions = $config->getSetting("CSPAdditionalHeaders");
        $CaptchaDomains   ="";
        // Get reCATPCHA keys
        $reCAPTCHAPrivate = $config->getSetting('reCAPTCHAPrivate');
        $reCAPTCHAPublic  = $config->getSetting('reCAPTCHAPublic');
        // Display reCAPTCHA if both private and public keys are set
        if ($reCAPTCHAPrivate && $reCAPTCHAPublic) {
            $CaptchaDomains ="www.google.com  www.gstatic.com";
        }

        // Content-Security policy for LORIS
        // 1. By default, only allow things that are self-hosted
        // 2. Allow inline CSS and JS (inline JS is required for
        //    the Loris base class to load smarty variables
        // 3. Allow unsafe-eval because jQuery requires it to load
        //    our menus. It will be fixed in jQuery 3.0.0.
        //    See: https://github.com/jquery/jquery/issues/2012
        // 4. Allow data URLs for fonts, because our bootstrap theme
        //    seems to load a font that way.
        // 5. Allow reCAPTCHA domains only if the CAPTCHA keys were set
        //    up by the project
        $response = $this->next->process($request, $handler);
        return $response->withHeader(
            "Content-Security-Policy",
            "default-src 'self' 'unsafe-inline'; "
            . "script-src 'self' 'unsafe-inline' 'unsafe-eval' $CaptchaDomains; "
            . "font-src 'self' data:; "
            . "img-src 'self' https://images.loris.ca data:; "
            . "frame-ancestors 'none'; "
            . "form-action 'self'; "
            . $config_additions
        );
    }
}
