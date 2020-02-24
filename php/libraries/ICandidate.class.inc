<?php declare(strict_types=1);
use LORIS\StudyEntities\Candidate\CandID;
/**
 * Interface for Candidate objects.
 *
 * This deals with properties that may be accessed regarding
 * a candidate.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
interface ICandidate
{
    /**
     * Get this candidate TimePoints.
     *
     * @return \TimePoint[]
     */
    public function getTimepoints(): array;

    /**
     * Gets a list of candidate parameters (extra properties) relevant to this
     * candidate across all of its timepoints, such as race/ethnicity,
     * comorbidities, blood type, and IDs from other studies.
     *
     * @param ?array $parameterTypes Subset of data.
     *
     * @return array
     *
     * @see https://github.com/aces/Loris/wiki/Candidate-Parameters
     */
    public function getParameters(?array $parameterTypes = null): array;


    /**
     * Returns the Project for which this Candidate was registered.
     *
     * @return \Project
     */
    public function getRegistrationProject(): \Project;

    /**
     * Returns the CandID of this candidate
     *
     * @return CandID
     */
    public function getCandID(): CandID;

    /**
     * Returns the PSCID of this Candidate.
     *
     * TODO Replace with PSCID when this class is added.
     *
     * @return string
     */
    public function getPSCID(): string;

    /**
     * Returns the Site of this Candidate.
     *
     * @return \Site
     */
    public function getRegistrationCenter(): \Site;

    /**
     * Returns the date of birth of this Candidate.
     *
     * @return ?DateTime
     */
    public function getDateOfBirth(): ?DateTime;

    /**
     * Returns the expect date of confinement (due date for a pregnancy)
     * of this Candidate. Only applies when the "useEDC" configuration setting
     * is enabled.
     *
     * @return ?DateTime
     */
    public function getEstimatedDateOfConfinement(): ?DateTime;

    /**
     * Return the candidate's sex
     *
     * @return string|null Male|Female String describing the sex
     *                     and null if scanner
     */
    public function getCandidateSex(): ?string;

    /**
     * Getter method for entityType class variable.
     *
     * TODO Replace with EntityType when that class exists in LORIS.
     *
     * @return string The value of entityType. 'Human' or 'Scanner'.
     */
    public function getEntityType(): string;

    /**
     * Returns this candidate's first TimePoint.
     *
     * @return string The visit label for the candidate's first visit.
     *                  Returns an empty string if one doesn't exist.
     */
    public function getFirstVisit(): string;

    /**
     * Sets generic data in this object to $candidateParameters.
     * Manages the parameter_candidate table so that projects have a way to add
     * whatever data they want which is outside the scope of LORIS to their
     * candidates.
     *
     * @param array $candidateParameters Key-value pair(s) of the field(s) to
     *                                   change and the new value(s).
     *
     * @return void
     */
    public function setCandidateParameters(array $candidateParameters): void;
}

