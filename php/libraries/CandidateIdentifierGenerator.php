<?php

declare(strict_types=1);

/**
 * Generates candidate identifiers from identifier type configuration.
 *
 * PHP Version 8
 *
 * @category Main
 * @package  CandidateIdentifiers
 * @author   Jad El Hachem <jad.elhachem@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

use LORIS\IdentifierType;

/**
 * Generates candidate identifiers using an IdentifierType.
 *
 * @category Main
 * @package  CandidateIdentifiers
 * @author   Jad El Hachem <jad.elhachem@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class CandidateIdentifierGenerator extends IdentifierGenerator
{
    /**
     * Constructor for CandidateIdentifierGenerator.
     *
     * @param Database       $database       Database connection
     * @param IdentifierType $identifierType Identifier type configuration
     * @param string         $siteAlias      Candidate site alias
     * @param string         $projectAlias   Candidate project alias
     */
    public function __construct(
        private readonly Database $database,
        private readonly IdentifierType $identifierType,
        string $siteAlias,
        string $projectAlias,
    ) {
        $this->siteAlias = $siteAlias;
        $this->projectAlias = $projectAlias;

        $this->_initializeFromFormat();
    }

    /**
     * Generates a new candidate identifier
     *
     * @return string
     */
    public function generate(): string
    {
        return $this->createNewID();
    }

    /**
     * Initializes generation settings from the identifier type format
     *
     * @return void
     *
     * @throws \ConfigurationException If the generation template is invalid
     */
    private function _initializeFromFormat(): void
    {
        if (
            preg_match(
                '/\{(SEQUENCE|RANDOM):(\d+)([^}]*)\}/i',
                $this->identifierType->format,
                $generation
            ) !== 1
        ) {
            throw new \ConfigurationException(
                'Invalid generation template for identifier type '
                    . $this->identifierType->name
            );
        }

        $this->generationMethod = match (strtoupper($generation[1])) {
            'SEQUENCE' => 'sequential',
            'RANDOM'   => 'random',
        };

        $this->length = intval($generation[2]);

        $this->alphabet = range('0', '9');

        if (
            preg_match(
                '/(?:^|,)FORMAT:(numeric|alphanumeric|alpha)(?:,|$)/i',
                $generation[3],
                $format
            ) === 1
        ) {
            switch (strtolower($format[1])) {
                case 'alpha':
                    $this->alphabet = range('A', 'Z');
                    break;

                case 'alphanumeric':
                    $this->alphabet = array_merge(
                        range('0', '9'),
                        range('A', 'Z')
                    );
                    break;
            }
        }

        $this->padding = strval($this->alphabet[0]);
        $this->minValue = str_repeat($this->alphabet[0], $this->length);
        $this->maxValue = str_repeat(
            $this->alphabet[count($this->alphabet) - 1],
            $this->length
        );

        if (
            preg_match(
                '/(?:^|,)MIN:([^,]+)/i',
                $generation[3],
                $min
            ) === 1
        ) {
            $this->minValue = $min[1];
        }

        if (
            preg_match(
                '/(?:^|,)MAX:([^,]+)/i',
                $generation[3],
                $max
            ) === 1
        ) {
            $this->maxValue = $max[1];
        }

        if (
            preg_match(
                '/(?:^|,)PADDING:([^,]+)/i',
                $generation[3],
                $padding
            ) === 1
        ) {
            $this->padding = $padding[1];

            if (!in_array($this->padding, $this->alphabet, true)) {
                throw new \ConfigurationException(
                    'Padding character must be part of the configured alphabet.'
                );
            }
        }

        $this->prefix = substr(
            $this->identifierType->format,
            0,
            strpos($this->identifierType->format, $generation[0])
        );

        $this->prefix = str_replace(
            ['{SITE:ALIAS}', '{PROJECT:ALIAS}'],
            [$this->siteAlias, $this->projectAlias],
            $this->prefix
        );
    }

    /**
     * Gets existing values for this identifier type
     *
     * @return string[]
     */
    protected function getExistingIDs(): array
    {
        if ($this->identifierType->candidateIdentifierTypeID === null) {
            throw new \LogicException(
                'Identifier type must be persisted before generating identifiers'
            );
        }

        return $this->database->pselectCol(
            "SELECT SUBSTRING(Value, LENGTH(:prefix) + 1)
         FROM candidate_identifiers
         WHERE CandidateIdentifierTypeID = :typeID
           AND Value LIKE CONCAT(:prefix, '%')",
            [
                'typeID' => $this->identifierType->candidateIdentifierTypeID,
                'prefix' => $this->prefix,
            ]
        );
    }
}
