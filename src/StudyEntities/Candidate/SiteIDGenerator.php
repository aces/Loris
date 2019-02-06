<?php declare(strict_types=1);

namespace LORIS\StudyEntities\Candidate;

class SiteIDGenerator extends IdentifierGenerator
{
    /* Either 'PSCID' or 'ExternalID' */
    private const LENGTH     = 4;
    protected $kind;

    /**
     * Creates a new instance of a SiteIDGenerator to create either PSCIDs or
     * ExternalIDs. Relevant properties are extracted from the config.xml file.
     */
    public function __construct(?string $prefix = null)
    {
        // Read config settings from project/config.xml to retrieve the
        // alphabet, length, and generation method (sequential or random) used
        // to create new IDs.
        $this->generationMethod = $this->getIDSetting('generation');
        $this->length = $this->getIDSetting('length') ?? self::LENGTH;
        $this->alphabet = $this->getIDSetting('alphabet');
        // Initialize minimum and maximum allowed values for IDs. Set the values
        // to the lowest/highest character in $alphabet repeated $length times
        // if the min or max is not configured in project/config.xml
        $this->minValue         = $this->getIDSetting('min') ??
            str_repeat(strval($this->alphabet[0]), $this->length);
        $this->maxValue         = $this->getIDSetting('max') ??
            str_repeat(
                strval($this->alphabet[count($this->alphabet) - 1]), 
                $this->length
            );
        $this->prefix = $prefix ?? $this->getIDSetting('prefix');
        $this->validate();
    }

    protected function validate(): void {
        if (empty($this->generationMethod)
            || empty($this->length)
            || empty($this->alphabet)
            || empty($this->minValue)
            || empty($this->maxValue)
            || empty($this->prefix)
            || !is_array($this->alphabet)
        ) {
            throw new \DomainException(
                'Values not configured properly for ' . get_class($this) . '. '
                . 'Please correct your configuration file.'
                . "Length: `{$this->length}`\n"
                . "Alphabet: `{$this->alphabet}`\n"
                . "Min: `{$this->minValue}`\n"
                . "Max: `{$this->maxValue}`\n"
                . "Length: `{$this->prefix}`\n"
                . "Generation: `{$this->generationMethod}`\n"
                . ($this->alphabet instanceof Countable)
            );
        }
        if ($this->kind !== 'PSCID' && $this->kind !== 'ExternalID') {
            throw new DomainException(
                'Argument for "kind" variable must be either "PSCID", ' .
                '"ExternalID", or "CandID"'
            );
        }
    }

    /**
     * {@inheritDoc}
     *
     * The parameters $kind and $prefix should never be user-controllable as
     * this creates a SQL injection risk.
     */
    protected function getExistingIDs(): array
    {
        $ids = \Database::singleton()->pselectCol(
            "SELECT substring($this->kind, LENGTH('{$this->prefix}') +1)
            from candidate
            WHERE {$this->kind} LIKE '{$this->prefix}%'",
            array()
        );

        return !empty($ids) ? $ids : array();
    }
    /**
     * Helper function used for extracting the values from the config
     * settings relating to the PSCID structure.
     *
     * @param string $setting One of: 'generation', 'length', 'alphabet',
     * 'length', 'min', 'max'.
     *
     * @return array|int|string|null
     */
    private function getIDSetting(
        string $setting
    ) {
        // The generation setting can be easily extracted and returned.
        if ($setting == 'generation') {
            return \NDB_Factory::singleton()
                ->config()
                ->getSetting($this->kind)['generation'];
        }

        // Values other than 'generation' are found within 'seq' elements and
        // require more complex processing.
        $idStructure = \NDB_Factory::singleton()
            ->config()
            ->getSetting($this->kind)['structure']['seq'];

        if (!$idStructure[0]) {
            // There's only one seq tag so the param format
            // needs to be fixed
            $temp        = array();
            $temp[]      = $idStructure;
            $idStructure = $temp;
        }

        try {
            $seqValue = self::getSeqAttribute($idStructure, $setting);
        } catch (\ConfigurationException $e) {
            /* Throw a new exception so that we can inform developers whether
             * the ConfigurationException arose due to ExternalID or PSCID
             * settings.
             */
            throw new LorisException(
                "Cannot create new candidate because of a configuration " .
                "error in settings for {$this->kind} structure. Details: "
                . $e->getMessage()
            );
        }
        if ($setting === 'alphabet') {
            switch ($seqValue) {
            case 'alpha':
                return range('A', 'Z');
            case 'numeric':
                return range(0, 9);
            case 'alphanumeric':
                return array_merge(range(0, 9), range('A', 'Z'));
            }
        }

        if ($setting === 'prefix') {
            if ($seqValue === 'static') {
                // The 'static' seq attribute must also include a value which
                // will be a fixed string prefix to be prepended to IDs in
                // LORIS. This must be extracted manually.
                foreach ($idStructure as $seq) {
                    if ($seq['@']['type'] === 'static') {
                        // This index stores the prefix.
                        return $seq['#'];
                    }
                }
            } else {
                // The other option, 'siteAbbrev', indicates that the calling
                // code should prepend a Site Alias to the ID. Since the config
                // file does not know what this will be, return null.
                return null;
            }
        }
        // Min, max, and length values should be returned as integers or as
        // null if they are not set.
        return is_null($seqValue) ? $seqValue: intval($seqValue);
    }
    /**
     * Iterate over each 'seq' value and return its setting if its value is
     * configured. Do error handling to make sure that there is exactly one
     * value corresponding to the requested setting.
     *
     * @param array  $idStructure Settings concerning ID structure extracted
     *                  from project/config.sml
     * @param string $setting     The name of the variable for which we want the
     *                  value.
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
        switch($setting) {
        case 'alphabet':
            $seqAttributes = array_filter(
                self::extractSeqAttribute($idStructure, 'type'),
                function ($x) {
                    return $x === 'alpha'
                        || $x === 'alphanumeric'
                        || $x === 'numeric';
                }
            );
            break;
        case 'prefix':
            $seqAttributes = array_filter(
                self::extractSeqAttribute($idStructure, 'type'),
                function ($x) {
                    return $x === 'static' || $x === 'siteAbbrev';
                }
            );
            break;
        default:
            /* Other settings (i.e. 'length', 'min', 'max') can be extracted
             * directly as they are stored within distinct attributes.
             */
            $seqAttributes = self::extractSeqAttribute(
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
        return array_pop($seqAttributes);
    }

    /**
     * Traverse the $idStructure array and collect all values that exist
     * for $setting.
     *
     * @param array  $idStructure Settings concerning ID structure extracted
     *                  from project/config.sml
     * @param string $setting     The name of the variable for which we want the
     *                  value.
     *
     * @return array The value(s) corresponding to $setting.
     */
    private static function extractSeqAttribute(
        array $idStructure,
        string $setting
    ): array {
        $seqAttributes = array();
        foreach ($idStructure as $seq) {
            if (isset($seq['@'][$setting])) {
                $seqAttributes[] = $seq['@'][$setting];
            }
        }
        return $seqAttributes;
    }
}
