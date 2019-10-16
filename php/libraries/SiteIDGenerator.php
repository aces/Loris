<?php declare(strict_types=1);
/**
 * This file contains a class used to generate SiteIDs i.e. both PSCIDs and
 * ExternalIDs.
 *
 * PHP Version 7
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
    /* Either 'PSCID' or 'ExternalID' */
    private const LENGTH = 4;

    protected $kind;
    protected $siteAlias;
    protected $projectAlias;

    /**
     * Creates a new instance of a SiteIDGenerator to create either PSCIDs or
     * ExternalIDs.
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
        $config = \NDB_Factory::singleton()->config();
        // Get alphabet, length, and generation method (sequential or random)
        // used to create new IDs.
        $this->generationMethod = $config->getSetting('idGenerationMethod');
        $configLength           = intval($config->getSetting('idLength'));
        // Length should not be greater than the value of the constant.
        $this->length = (self::LENGTH < $configLength) ?
            self::LENGTH
            : $configLength;

        // get alphabet setting
        switch ($config->getSetting('idAlphabet')) {
        case 'alpha':
            $this->alphabet = range('A', 'Z');
            break;
        case 'numeric':
            $this->alphabet = range('0', '9');
            break;
        case 'alphanumeric':
            $this->alphabet = array_merge(range('0', '9'), range('A', 'Z'));
            break;
        }

        // Initialize minimum and maximum allowed values for IDs. Set the values
        // to the lowest/highest character in $alphabet repeated $length times
        // if the min or max is not configured in the Config table.
        $this->minValue = $config->getSetting('idMinValue') ??
            str_repeat(
                strval($this->alphabet[0]),
                $this->length
            );
        $this->maxValue = $config->getSetting('idMaxValue') ??
            str_repeat(
            strval($this->alphabet[count($this->alphabet) - 1]),
            $this->length
        );
        $this->siteAlias    = $siteAlias;
        $this->projectAlias = $projectAlias;
        // Determine prefix to be used for the ID.
        switch ($config->getSetting('idPrefixMethod')) {
        case 'static':
            $this->prefix = $config->getSetting('idStaticPrefix');
            break;
        case 'alias':
            $this->prefix = $siteAbbrevPrefix;
            break;
        default:
            // Will throw exception
            $this->prefix = null;
        }
        $this->validate();
    }

    /**
     * Throws an exception if values extracted from the configuration settings
     * are not well-formed.
     *
     * @throws \ConfigurationException
     *
     * @return void
     */
    protected function validate(): void
    {
        // Make sure values supplied as minValue and maxValue are of the correct
        // character set as determined by the alphabet setting.
        $this->_validateCharset($this->minValue);
        $this->_validateCharset($this->maxValue);

        if (empty($this->generationMethod)
            || empty($this->length)
            || empty($this->alphabet)
            || empty($this->prefix)
            || ! ($this->length > 0)
            || !is_array($this->alphabet)
        ) {
            throw new \ConfigurationException(
                'Values not configured properly for ' . get_class($this) . '. '
                . 'Please correct your configuration settings.'
                . "Length: `{$this->length}`\n"
                . "Alphabet: `" . implode($this->alphabet) . "`\n"
                . "Min value: `{$this->minValue}`\n"
                . "Max value: `{$this->maxValue}`\n"
                . "Length: `{$this->prefix}`\n"
                . "Generation: `{$this->generationMethod}`\n"
            );
        }
    }

    /**
     * Generates a new ID for use in the rest of LORIS.
     * TODO This function should be updated to use PSCID and ExternalID classes
     * when they are created. See CandIDGenerator for an example.
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
        $ids = \Database::singleton()->pselectCol(
            "SELECT substring($this->kind, LENGTH('{$this->prefix}') +1)
            from candidate
            WHERE {$this->kind} LIKE '{$this->prefix}%'",
            array()
        );
        if (empty($ids)) {
            return array();
        }
        // Filter out non-numeric ids if using a numeric alphabet.
        if ($this->alphabet === range('0', '9')) {
            return array_filter($ids, 'is_numeric');
        }
        return $ids;
    }

    /**
     * Ensures a supplied value fits within the character set given by the
     * 'idAlphabet' config setting.
     *
     * @param string $value The value to check.
     *
     * @return void
     *
     * @throws \ConfigurationException
     */
    private function _validateCharset(string $value): void
    {
        $ok      = false;
        $charset = \NDB_Factory::singleton()->config()->getSetting('idAlphabet');

        switch ($charset) {
        case 'alpha':
            $ok = ctype_alpha($value);
            break;
        case 'alphanumeric':
            $ok = ctype_alnum($value);
            break;
        case 'numeric':
            $ok = is_numeric($value);
            break;
        }

        if (! $ok) {
            throw new \ConfigurationException(
                "Alphabet is set as type $charset but $value contains " .
                "characters outside of that character set."
            );
        }
    }
}
