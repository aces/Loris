<?php declare(strict_types=1);

namespace LORIS\GUI;

/**
 * A LocalizeableString is a type of string that should be translated
 * on the LORIS frontend according to the user's locale. This allows
 * modules (mostly widgets) to defer to define the textdomain, singular,
 * and plural forms, but defer the rendering of the string until it
 * knows the n for which the data is referring.
 */
class LocalizableString
{
    /**
     * Construct a new LocalizableString
     *
     * @param readonly string $domain   The textdomain of the string
     * @param readonly string $singular The gettext singular form
     * @param readonly string $plural   The gettext singular form
     */
    public function __construct(
        public readonly string $textdomain,
        public readonly string $singular,
        public readonly string $plural
    ) {
    }

    /**
     * Render the string for a cardinality of "n"
     *
     * @param int $n The cardinality to get the translation for
     *
     * @return string
     */
    public function getN(int $n) : string
    {
        return dngettext($this->textdomain, $this->singular, $this->plural, $n);
    }
}
