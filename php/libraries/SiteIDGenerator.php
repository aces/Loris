<?php declare(strict_types=1);

/**
 * This file contains a class used to generate SiteIDs i.e. both PSCIDs and
 * ExternalIDs.
 *
 * PHP Version 8
 *
 * @category Main
 * @package  LORIS
 * @author   John Saigle <john.saigle@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

/**
 * This class is responsible for extracting configuration settings relating to
 * generation of SiteIDs and validates these values.
 *
 * @category Main
 * @package  LORIS
 * @author   John Saigle <john.saigle@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class SiteIDGenerator extends IdentifierGenerator
{
    private const LENGTH = 4;

    /**
     * Either 'PSCID' or 'ExternalID'
     *
     * @var string
     */
    protected $kind;

    /**
     * Creates a new instance of a SiteIDGenerator to create either PSCIDs or
     * ExternalIDs. Relevant properties are extracted from the config.xml file.
     *
     * @param string $siteAlias    To be appended to the ID value. Usually an
     *                             abbreviation for the name of a site.
     * @param string $projectAlias To be appended to the ID value. Usually an
     *                             abbreviation for the name of a project.
     *
     * @return void
     */
    public function __construct(string $siteAlias, string $projectAlias)
    {
        // Read config settings from project/config.xml to retrieve the
        // alphabet, length, and generation method (sequential or random) used
        // to create new IDs.
        $this->generationMethod = $this->_getGeneration();
        $this->length           = $this->_getLength();
        $this->alphabet         = $this->_getAlphabet();
        $this->padding          = $this->_getPadding();
        $this->minValue         = $this->_getMinValue();
        $this->maxValue         = $this->_getMaxValue();

        $this->siteAlias    = $siteAlias;
        $this->projectAlias = $projectAlias;

        $this->prefix = $this->_getPrefix();
        $this->validate();
    }

    /**
     * Throws an exception if values extracted from the configuration settings
     * are not well-formed.
     *
     * @throws \DomainException
     *
     * @return void
     */
    protected function validate(): void
    {
        if (empty($this->generationMethod)
            || empty($this->length)
            || empty($this->alphabet)
            || empty($this->minValue)
            || empty($this->maxValue)
            || empty($this->prefix)
        ) {
            throw new \DomainException(
                'Values not configured properly for ' . get_class($this) . '. '
                . 'Please correct your configuration file.'
                . "Length: `{$this->length}`\n"
                . "Alphabet: `" . implode($this->alphabet) . "`\n"
                . "Min: `{$this->minValue}`\n"
                . "Max: `{$this->maxValue}`\n"
                . "Length: `{$this->prefix}`\n"
                . "Generation: `{$this->generationMethod}`\n"
            );
        }
    }

    /**
     * Generates a new ID for use in the rest of LORIS.
     * This function should be updated to use PSCID and ExternalID classes when
     * they are created. See CandIDGenerator for an example.
     *
     * @return string
     */
    public function generate()
    {
        return $this->createNewID();
    }

    /**
     * {@inheritDoc}
     *
     * Get all existing IDs for a given site. The prefix will be stripped from
     * the IDs as the calling code will be interested in and aware of the Site
     * corresponding to the prefix. Returning the bare IDs allows for easier
     * processing.
     *
     * When using the 'numeric' generation method, IDs of a different alphabet,
     * such as 'alphanumeric', should be filtered out to prevent string
     * comparison confusion. For example if the database contains an
     * alphabetical ID, these will be considered greater than the upper bound
     * of a numerical ID (PHP says 'AAA' > '999').
     * This will result in a RANGE_FULL error if the values are not filtered.
     *
     * The parameters $kind and $prefix should never be user-controllable as
     * this creates a SQL injection risk.
     *
     * @return string[] The IDs retrieved from the database with the prefix
     *                      stripped. E.g. MON1234 becomes 1234.
     */
    protected function getExistingIDs(): array
    {
        $ids = \NDB_Factory::singleton()->database()->pselectCol(
            "SELECT substring($this->kind, LENGTH('{$this->prefix}') +1)
            from candidate
            WHERE {$this->kind} LIKE '{$this->prefix}%'",
            []
        );
        if (empty($ids)) {
            return [];
        }
        // Filter out non-numeric ids if using a numeric alphabet.
        if (empty(array_diff($this->alphabet, range('0', '9')))) {
            return array_filter($ids, 'is_numeric');
        }
        return $ids;
    }

    /**
     * Helper function used for extracting the values from the config
     * settings relating to the PSCID structure.
     *
     * @param string $setting One of: 'generation', 'length', 'alphabet',
     *                        'prefix', 'min', 'max', 'padding'.
     *
     * @return array<int,int|string>|string|null
     */
    private function _getIDSetting(
        string $setting
    ) {
        $config = \NDB_Factory::singleton()->config();
        $kind   = $config->getSetting($this->kind);

        if (!is_array($kind)) {
            throw new \LorisException("Invalid config for $this->kind");
        }

        if (preg_match(
            '/\{(SEQUENCE|RANDOM):(\d+)([^}]*)\}/i',
            $kind['structure'],
            $generation
        ) !== 1
        ) {
            throw new \ConfigurationException(
                "Invalid generation template for {$this->kind}."
            );
        }

        // Intermediate state where generation information is redundant
        // until the full identifier rework.
        $expected = $kind['generation'] === 'sequential' ? 'SEQUENCE' : 'RANDOM';

        if ($kind['generation'] !== 'user'
            && strtoupper($generation[1]) !== $expected
        ) {
            throw new \ConfigurationException("Generation methods do not match.");
        }

        if ($setting === 'generation') {
            return $kind['generation'];
        }

        if ($setting === 'length') {
            return $generation[2];
        }

        if ($setting === 'alphabet') {
            if (preg_match(
                '/(?:^|,)FORMAT:(alpha|numeric|alphanumeric)(?:,|$)/i',
                $generation[3],
                $match
            )
            ) {
                switch (strtolower($match[1])) {
                case 'alpha':
                    return range('A', 'Z');

                case 'alphanumeric':
                    return array_merge(
                        range('0', '9'),
                        range('A', 'Z')
                    );
                }
            }

            return range('0', '9');
        }

        if ($setting === 'prefix') {
            $position = strpos(
                $kind['structure'],
                $generation[0],
            );

            if ($position === false) {
                throw new \ConfigurationException(
                    "Invalid generation template for {$this->kind}."
                );
            }

            $prefix = substr(
                $kind['structure'],
                0,
                $position
            );

            $prefix = str_replace(
                ['{SITE:ALIAS}', '{PROJECT:ALIAS}'],
                [$this->siteAlias, $this->projectAlias],
                $prefix
            );

            return $prefix;
        }

        if ($setting === 'min') {
            if (preg_match('/(?:^|,)MIN:([^,]+)/i', $generation[3], $match)) {
                return $match[1];
            }
            return null;
        }

        if ($setting === 'max') {
            if (preg_match('/(?:^|,)MAX:([^,]+)/i', $generation[3], $match)) {
                return $match[1];
            }
            return null;
        }

        if ($setting === 'padding') {
            if (preg_match(
                '/(?:^|,)PADDING:([^,]+)/i',
                $generation[3],
                $match
            )
            ) {
                return $match[1];
            }
            return null;
        }

        return null;
    }

    /**
     * Iterate over each 'seq' value and return its setting if its value is
     * configured. Do error handling to make sure that there is exactly one
     * value corresponding to the requested setting.
     *
     * @param array<array<array<string>>> $idStructure Settings concerning ID
     *                                                 structure extracted from
     *                                                 project/config.sml
     * @param string                      $setting     The name of the variable
     *                                                 for which we want the
     *                                                 value.
     *
     * @throws \ConfigurationException
     *
     * @return ?string
     */
    static function getSeqAttribute(
        array $idStructure,
        string $setting
    ): ?string {
        /* Do validation on 'prefix' and 'alphabet' since they both are found in
         * 'type' attributes within 'seq' elements. See project/config.xml for
         * examples.
         */
        switch ($setting) {
        case 'alphabet':
            $seqAttributes = array_filter(
                self::_getSeqAttribute($idStructure, 'type'),
                function ($x) {
                    return $x === 'alpha'
                        || $x === 'alphanumeric'
                        || $x === 'numeric';
                }
            );
            break;
        case 'prefix':
            $seqAttributes = array_filter(
                self::_getSeqAttribute($idStructure, 'type'),
                function ($x) {
                    return $x === 'static'
                        || $x === 'siteAbbrev'
                        || $x === 'projectAbbrev';
                }
            );
            break;
        default:
            /* Other settings (i.e. 'length', 'min', 'max') can be extracted
             * directly as they are stored within distinct attributes.
             */
            $seqAttributes = self::_getSeqAttribute(
                $idStructure,
                $setting
            );
            break;
        }

        // Validation
        if (count($seqAttributes) > 1) {
            throw new \ConfigurationException(
                'Too many values found for config setting: ' . $setting
            );
        }

        $val = array_pop($seqAttributes);
        if ($val === null) {
            return null;
        }
        return strval($val);
    }

    /**
     * Traverse the $idStructure array and collect all values that exist
     * for $setting.
     *
     * @param array<array<array<string>>> $idStructure Settings concerning ID
     *                                                 structure extracted from
     *                                                 project/config.xml
     * @param string                      $setting     The name of the variable
     *                                                 for which we want the
     *                                                 value.
     *
     * @return array<int,string> The value(s) corresponding to $setting.
     */
    private static function _getSeqAttribute(
        array $idStructure,
        string $setting
    ): array {
        $seqAttributes = [];
        foreach ($idStructure as $seq) {
            if (isset($seq['@'][$setting])) {
                $seqAttributes[] = $seq['@'][$setting];
            }
        }
        return $seqAttributes;
    }

    /**
     * Initializes the alphabet property.
     *
     * @return array<int,int|float|string>
     */
    private function _getAlphabet(): array
    {
        $alphabet = $this->_getIDSetting('alphabet');
        if (!is_array($alphabet)) {
            throw new \ConfigurationException(
                'Expecting variable $alphabet to be an array but got '
                . gettype($this->alphabet)
            );
        }
        return $alphabet;
    }

    /**
     * Returns the value to be used for the length property.
     *
     * @return int
     */
    private function _getLength()
    {
        $length = $this->_getIDSetting('length') ?? self::LENGTH;
        return intval($length);
    }

    /**
     * Returns the value for the alphabet property.
     *
     * @return string
     */
    private function _getGeneration(): string
    {
        $generation = $this->_getIDSetting('generation');
        if (!in_array($generation, ['sequential', 'random'], true)) {
            throw new \ConfigurationException(
                'Generation method must be either `sequential` or `random`.'
            );
        }
        return $generation;
    }

    /**
     * Returns the prefix to be use for the prefix property.
     *
     * @return string
     */
    private function _getPrefix(): string
    {
        $val = $this->_getIDSetting('prefix');
        if (is_array($val)) {
            throw new \ConfigurationException(
                'Did not expect prefix to be an array'
            );
        }
        return strval($val);
    }

    /**
     * Returns the minimum value for the identifier.
     *
     * @return string
     */
    private function _getMinValue(): string
    {
        $val = $this->_getIDSetting('min');
        if (is_array($val)) {
            throw new \ConfigurationException(
                'Did not expect min to be an array'
            );
        }
        return strval(
            $val ??
            str_repeat(strval($this->alphabet[0]), intval($this->length))
        );
    }

    /**
     * Returns the maximum value for the identifier.
     *
     * @return string
     */
    private function _getMaxValue(): string
    {
        $val = $this->_getIDSetting('max');
        if (is_array($val)) {
            throw new \ConfigurationException(
                'Did not expect max to be an array'
            );
        }
        return strval(
            $val ??
            str_repeat(
                strval($this->alphabet[count($this->alphabet) - 1]),
                intval($this->length)
            )
        );
    }

    /**
     * Returns the padding character for the identifier.
     *
     * @return string
     */
    private function _getPadding(): string
    {
        $padding = $this->_getIDSetting('padding')
            ?? strval($this->alphabet[0]);

        if (!in_array($padding, $this->alphabet, true)) {
            throw new \ConfigurationException(
                "Padding character must be part of the configured alphabet."
            );
        }

        return $padding;
    }
}
