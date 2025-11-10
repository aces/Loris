<?php declare(strict_types=1);

namespace LORIS\Middleware;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \Psr\Http\Server\MiddlewareInterface;
use \Psr\Http\Server\RequestHandlerInterface;

/**
 * The language middleware tries to get the most appropriate locale for
 * a user.
 *
 * By priority:
 *  1. First it will check if a "lang" get attribute is passed so
 *         that it can be overridden on a page dropdown
 *      2. Next, it will check the user's preference and use their preferred
 *         language if they haven't chosen another for this page load
 *      3. Finally, a best attempt based on the request Accept-Language header
 *         is made
 *
 * Otherwise, the request will fall back on the default locale.
 *
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class Language implements MiddlewareInterface, MiddlewareChainer
{
    use MiddlewareChainerMixin;

    public static function detectLocale(\LORIS\LorisInstance $loris, ServerRequestInterface $request) : ?string
    {
        $DB = $request->getAttribute("loris")->getDatabaseConnection();

        $validLocales = $DB->pselectCol(
            "SELECT language_code FROM language",
            [],
        );

        $params = $request->getQueryParams();
        if (isset($params['lang'])
            && in_array($params['lang'], $validLocales)) {
            return $params['lang'];
        }

        $user     = $request->getAttribute("user");
        $userpref = $user->getLanguageCode();
        if ($userpref !== ""
            && in_array($userpref, $validLocales)) {
            return $userpref;
        }

        // This doesn't necessarily work if the user has multiple languages
        // accepted because the potential match is based on the system's
    // locales, not the LORIS language table. It also may not be available
    // depending on PHP versions
        if (function_exists('\locale_accept_from_http')) {
            $fromheader = \locale_accept_from_http($request->getHeaderLine('Accept-Language'));
            if ($fromheader !== false
            && in_array($fromheader, $validLocales)) {
                return $fromheader;
            }
        }
        return null;
    }
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
        $loris = $request->getAttribute("loris");
        $lang  = self::detectLocale($loris, $request);
        if ($lang !== null) {
            \setlocale(LC_MESSAGES, $lang . '.utf8');
             putenv("LANG=$lang");
             putenv("LANGUAGE=$lang");
            // Set the default_locale for intl to match the user preference,
            // so that date formatting works correctly.
            // PHPCS complains about ini_set not being allowed, but there
            // does not seem to be any other way to do this.
            //phpcs:ignore
            ini_set('intl.default_locale', $lang);
            return $this->next->process(
                $request->withAttribute("locale", $lang),
                $handler
            );
        }
        return $this->next->process($request, $handler);
    }
}
