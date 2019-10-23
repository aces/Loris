<?php declare(strict_types=1);
/**
 * This file contains an interface to describe a Candidate
 * in LORIS.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Main
 * @author   John Saigle <john.saigle@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

use LORIS\StudyEntities\Candidate\CandID;
/**
 * Interface for Candidate objects.
 *
 * This deals with properties that may be accessed regarding
 * a user.
 *
 * @category Main
 * @package  Main
 * @author   John Saigle <john.saigle@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
interface ICandidate
{
    /**
     * Creates a new candidate, assigning CandID and PSCID.
     *
     * @param int           $centerID              centerID of the site to which
     *                                             the candidate will belong
     * @param DateTime      $dateOfBirth           Date of Birth
     * @param string        $sex                   'Male' or 'Female'
     * @param int           $registrationProjectID The project ID
     * @param DateTime|null $edc                   estimated date of confinement
     * @param string|null   $PSCID                 PSCID specified by the user
     *
     * @return CandID   $candID      candidate id of the new candidate
     */
    public function __construct(
        int $centerID,
        DateTime $dateOfBirth,
        string $sex,
        int $registrationProjectID,
        ?DateTime $edc,
        ?string $PSCID = null
    ): CandID;

    /**
     * This returns a single Candidate object for the given
     * candID, and will only ever instantiate one object in
     * the event that it's called multiple times.
     *
     * @param CandID $candID A 6 digit Loris CandID that matches
     *                        a candidate in the candidate table
     *
     * @return Candidate the Candidate object
     * @static
     */
    static public function &singleton(CandID $candID);

    /**
     * This does the work of selecting the candidate and related
     * information from the database and populating it into the
     * Candidate object. Used by singleton method.
     *
     * @param CandID $candID The 6 digit Loris CandID
     *
     * @return void As a side-effect loads candidate into current
     *              object
     * @throws DatabaseException | LorisException
     */
    public function select(CandID $candID): void;


    /**
     * Writes a representation of the current state of this object into the
     * Database.
     *
     * @return void
     */
    public function update(): void;

    /**
     * Checks if candidate exist given a candidate ID and PSCID
     * Used to check that PSCID matches CandID when entered into the boxes
     * on the candidate_list form
     *
     * @param CandID $candID 6 digit Loris CandID
     * @param string $PSCID  project study center ID
     *
     * @return bool Whether that candidate exists in the database.
     */
    public static function candidateExists(CandID $candID, string $PSCID): bool;

    /**
     * Get a list of SessionIDs for which this Candidate has a corresponding
     * TimePoint.
     *
     * @return SessionID[]
     */
    public function getListOfTimePoints(): array;

    /**
     * Returns the sessionID for this Candidate's nth visit
     *
     * @param integer $visitNo The Nth visit for a Candidate.
     *
     * @return ?SessionID SessionID for visit specified by $visitNo
     */
    public function getSessionID(int $visitNo): ?SessionID;

    /**
     * Manages the parameter_candidate tableso that projects have a way to add
     * whatever data they want which is outside the scope of LORIS to their
     * candidates.
     *
     * @param string|null $var The type of data about the Candidate
     *                    to be returned
     *
     * @return     mixed The info requested
     * @deprecated
     */
    public function getData(?string $var = null);


    /**
     * Returns the ProjectID for the current candidate
     *
     * @return integer
     */
    public function getProjectID(): int;

    /**
     * Returns the name of the candidate's project from the
     * config file
     *
     * @return string Project name
     */
    public function getProjectTitle(): string;

    /**
     * Returns the CandID of this candidate
     *
     * @return CandID 6 digit CandID
     */
    public function getCandID();

    /**
     * Returns the PSCID of this candidate
     *
     * @return string The PSCID identifier for candidate
     */
    public function getPSCID(): string;

    /**
     * Returns the site of this candidate
     *
     * @return Site
     */
    public function getCandidateSite(): Site;


    /**
     * Returns the ID of this candidate's site
     *
     * @return int The numeric ID of the candidate's site
     */
    public function getCenterID(): int;

    /**
     * Returns the date of birth of this candidate
     *
     * @return ?DateTime
     */
    public function getCandidateDoB(): ?DateTime;

    /**
     * Returns the expect date of confinement (due date)
     * of this candidate.
     *
     * @return ?DateTime
     */
    public function getCandidateEDC(): ?DateTime;

    /**
     * Return the candidate's sex
     *
     * @return string|null Male|Female String describing the sex
     *                     and null if scanner
     */
    public function getCandidateSex(): ?string;

    /**
     * Return whether the candidate is active
     *
     * @return bool
     */
    public function isActive(): bool;

    /**
     * Return the user that registered (created) this candidate
     *
     * @return string UserID of user who created this candidate.
     */
    public function getRegisteredBy(): string;

    /**
     * Return the name of the user account that last changed this candidate.
     *
     * @return User
     */
    public function getLastModifiedBy(): User;

    /**
     * Getter method for entityType class variable.
     *
     * @return string The value of entityType. 'Human' or 'Scanner'.
     */
    public function getEntityType(): string;

    /**
     * Returns the list of visit labels w/ corresponding SessionID as key
     *
     * @return array<int,string> Associative array in the format
     *                              SessionID=>Visit_label
     */
    public function getListOfVisitLabels(): array;

    /**
     * Generates list of valid subprojects for a the selected Candidate's
     * project
     *
     * @return array<int,int> Array of the form SubprojectID => SubprojectID
     *
     * @throws DatabaseException
     */
    public function getValidSubprojects(): array;

    /**
     * Returns the Visit_label for a subject's first TimePoint.
     *
     * @return string The visit label for the candidate's first visit.
     *                  Returns an empty string if one doesn't exist.
     */
    public function getFirstVisit(): string;

    /**
     * Returns the next visit number that should be created for this
     * candidate.
     *
     * @return int The next visit number
     */
    public function getNextVisitNo() : int;

    /**
     * Returns list of consents and their respective statuses for this candidate
     *
     * @return array List of consents and their associated values for this candidate
     *               The keys of the arrays are the IDs of the consents
     */
    public function getConsents(): array;

    /**
     * Gets the participant_status options from participant_status_options
     * table. Used to populate LorisForm.
     *
     * @return string[]
     */
    static function getParticipantStatusOptions(): array;

    /**
     * Gets the participant_status options suboptions from participant_status_options
     *
     * @param int $parentID parent ID of the participant status option
     *
     * @return string[] Options array suitable for use in LorisForm select
     *               element
     */
    public static function getParticipantStatusSubOptions(int $parentID): array;

    /**
     * Sets generic data in this class to $newData.
     * Manages the parameter_candidate table so that projects have a way to add
     * whatever data they want which is outside the scope of LORIS to their
     * candidates.
     *
     * @param array $newData Key-value pair(s) of the field(s) to change and the
     *                              new value(s).
     *
     * @return void
     */
    public function setData(array $newData): void;

    /**
     * Validate's that a PSCID matches the format defined by project
     * config
     *
     * @param string $PSCID The PSCID to validate
     *
     * @return bool
     */
    public static function validatePSCID(string $PSCID): bool;

    /**
     * This is a function to supply data about the Candidate object to the
     * front-end. Many Smarty templates refer to the specific column names
     * and aliases used below.
     * This function exists to provide legacy support. It should not be used
     * by new code.
     *
     * @return string[]
     */
    public function toTPLArray(): array;
}

