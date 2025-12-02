<?php declare(strict_types=1);

/**
 * A Language object represents the concept of a language that has been
 * configured on this LORIS instance.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class Language
{
    /**
     * Construct a Language object
     *
     * @param string $label The display label for the language
     * @param string $code  The language code for the language.
     */
    public function __construct(
        public readonly string $label,
        public readonly string $code
    ) {
    }
}
