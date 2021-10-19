<?php
/**
 * Describe a LORIS visit
 *
 * PHP Version 7
 *
 * @category Model
 * @package  Visits
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS;

/**
 * Representation of a Visit in LORIS
 *
 * @category Model
 * @package  Visits
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Visit
{
    /**
     * The ID of the visit in the DB
     */
    protected $id;

    /**
     * The visit name (formerly known as visit_label)
     */
    protected $name;

    /**
     * The visit label displayed in the browser
     */
    protected $label;

    /**
     * Variables holding Visit_Windows data
     */
    protected $WindowMinDays;
    protected $WindowMaxDays;
    protected $OptimumMinDays;
    protected $OptimumMaxDays;
    protected $WindowMidpointDays;

    /**
     * Variable holding ProjectSubprojectIDs affiliated with this visit
     *
     * This variable is null when the Visit object is lazy-loaded
     */
    protected $projectSubprojectIDs;


    /**
     * The constructor
     *
     * @param ?int   $id                 The visit id
     * @param string $name               The visit name
     * @param string $label              The visit label (Front-end)
     * @param ?int   $WindowMinDays      The minimum age of candidate to be
     *                                   within the PERMITTED range for
     *                                   this visit
     * @param ?int   $WindowMaxDays      The maximum age of candidate to be
     *                                   within the PERMITTED range for
     *                                   this visit
     * @param ?int   $OptimumMinDays     The minimum age of candidate to be
     *                                   within the OPTIMAL range for this
     *                                   visit
     * @param ?int   $OptimumMaxDays     The maximum age of candidate to be
     *                                   within the OPTIMAL range for this
     *                                   visit
     * @param ?int   $WindowMidpointDays Candidate's ideal age in days for
     *                                   a visit
     */
    public function __construct(
        ?int $id = null,
        string $name,
        string $label,
        ?int $WindowMinDays = null,
        ?int $WindowMaxDays = null,
        ?int $OptimumMinDays = null,
        ?int $OptimumMaxDays = null,
        ?int $WindowMidpointDays = null
    ) {
        //ID should only be null when creating a new visit
        $this->id            = $id;
        $this->name          = $name;
        $this->label         = $label;
        $this->WindowMinDays = $WindowMinDays;
        $this->WindowMaxDays = $WindowMaxDays;
        $this->OptimumMinDays     = $OptimumMinDays;
        $this->OptimumMaxDays     = $OptimumMaxDays;
        $this->WindowMidpointDays = $WindowMidpointDays;
    }

    /**
     * Getter for visit ID
     *
     * @return int The visit's Identifier
     */
    public function getID(): int
    {
        if ($this->id === null) {
            throw new \LorisException("No ID defined for Visit");
        }
        return $this->id;
    }

    /**
     * Getter for visit name
     *
     * @return string The visit's name
     */
    public function getName(): string
    {
        if ($this->name === null) {
            throw new \LorisException("No name defined for Visit");
        }
        return $this->name;
    }

    /**
     * Getter for visit label
     *
     * @return string The visit's label
     */
    public function getLabel(): string
    {
        if ($this->label === null) {
            throw new \LorisException("No label defined for Visit");
        }
        return $this->label;
    }

    /**
     * Getter for the window min days
     *
     * @return ?int The minimum age of candidate to be within the PERMITTED
     *                  range for this visit
     */
    public function getWindowMinDays(): ?int
    {
        return $this->WindowMinDays;
    }

    /**
     * Getter for the window max days
     *
     * @return ?int The maximum age of candidate to be within the PERMITTED
     *                  range for this visit
     */
    public function getWindowMaxDays(): ?int
    {
        return $this->WindowMaxDays;
    }

    /**
     * Getter for the optimum min days
     *
     * @return ?int The minimum age of candidate to be within the OPTIMAL
     *                  range for this visit
     */
    public function getOptimumMinDays(): ?int
    {
        return $this->OptimumMinDays;
    }

    /**
     * Getter for the optimum max days
     *
     * @return ?int The maximum age of candidate to be within the OPTIMAL
     *                  range for this visit
     */
    public function getOptimumMaxDays(): ?int
    {
        return $this->OptimumMaxDays;
    }

    /**
     * Getter for the window midpoint days
     *
     * @return ?int Candidate's ideal age in days for a visit
     */
    public function getWindowMidpointDays(): ?int
    {
        return $this->WindowMidpointDays;
    }

    /**
     * Getter for ProjectSubprojectIDs associated to this visit
     *
     * @return array
     */
    public function getProjectSubprojectIDs(): array
    {
        if ($this->projectSubprojectIDs === null) {
            throw new \LorisException(
                "The array defining ProjectSubproject associations for this visit
                is null, make sure to load these associations using the controller
                before querying them."
            );
        }
        return $this->projectSubprojectIDs;
    }

    /**
     * Setter for the visit label
     *
     * @param string $label Label of the visit
     *
     * @return void
     */
    public function setLabel(string $label)
    {
        $this->label =$label;
    }

    /**
     * Setter for the window min days
     *
     * @param ?int $WindowMinDays The minimum age of candidate to be within
     *                            the PERMITTED range for this visit
     *
     * @return void
     */
    public function setWindowMinDays(?int $WindowMinDays)
    {
        $this->WindowMinDays =$WindowMinDays;
    }

    /**
     * Setter for the window max days
     *
     * @param ?int $WindowMaxDays The maximum age of candidate to be within
     *                            the PERMITTED range for this visit
     *
     * @return void
     */
    public function setWindowMaxDays(?int $WindowMaxDays)
    {
        $this->WindowMaxDays =$WindowMaxDays;
    }

    /**
     * Setter for the optimum min days
     *
     * @param ?int $OptimumMinDays The minimum age of candidate to be within
     *                             the OPTIMAL range for this visit
     *
     * @return void
     */
    public function setOptimumMinDays(?int $OptimumMinDays)
    {
        $this->OptimumMinDays =$OptimumMinDays;
    }

    /**
     * Setter for the optimum max days
     *
     * @param ?int $OptimumMaxDays The maximum age of candidate to be within
     *                             the OPTIMAL range for this visit
     *
     * @return void
     */
    public function setOptimumMaxDays(?int $OptimumMaxDays)
    {
        $this->OptimumMaxDays =$OptimumMaxDays;
    }

    /**
     * Setter for the window midpoint days
     *
     * @param ?int $WindowMidpointDays Candidate's ideal age in days for a visit
     *
     * @return void
     */
    public function setWindowMidpointDays(?int $WindowMidpointDays)
    {
        $this->WindowMidpointDays = $WindowMidpointDays;
    }

    /**
     * Setter for ProjectSubprojectIDs associated to this visit
     *
     * @param array $projectSubprojectIDs Array of IDs to add to the visit object
     *
     * @return array
     */
    public function setProjectSubprojectIDs(array $projectSubprojectIDs)
    {
        return $this->projectSubprojectIDs = $projectSubprojectIDs;
    }

}
