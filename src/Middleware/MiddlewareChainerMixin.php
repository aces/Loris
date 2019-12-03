<?php declare(strict_types=1);
/**
 * Defines a MiddlewareChainerMixin trait to aid in the
 * implementation of Middleware chains.
 *
 * PHP Version 7
 *
 * @category Helpers
 * @package  Middleware
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\Middleware;

/**
 * MiddlewareChainerMixin is a mixin to simplify implementation
 * of the MiddlewareChainer interface. Valid PSR15 middleware
 * can simply use this trait.
 *
 * @category Helpers
 * @package  Middleware
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
trait MiddlewareChainerMixin
{
    /**
     * The next middleware in this chain. This should be
     * protected, but since this is a mixin, we get errors about
     * not being able to access it in the mixin functions defined
     * below if it's anything other than public, unfortunately.
     *
     * @internal
     *
     * @var MiddlewareChainer | null
     */
    public $next = null;

    /**
     * Appends a middleware to the end of this middleware chain.
     *
     * @param MiddlewareChainer $next The middleware to append
     *
     * @return MiddlewareChainer A new middleware queue
     *                                              with $next appended
     */
    public function withMiddleware(MiddlewareChainer $next)
    {
        $new = clone $this;
        $cur = $new;

        while ($cur->next !== null) {
            $cur->next = clone $cur->next;
            $cur       = $cur->next;
        }

        // We know next is null from the above loop, so this is safe.
        $cur->next = $next;
        return $new;
    }
}
