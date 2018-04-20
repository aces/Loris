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
     * The visit name (formely known as visit_label)
     *
     * @var string
     */
    protected $visit;

    /**
     * The project name
     *
     * @var string
     */
    protected $project;

    /**
     * The subproject name
     *
     * @var string
     */
    protected $subproject;

    /**
     * The contructor
     *
     * @param string $visit      The visit name
     * @param string $project    The project name
     * @param string $subproject The subproject name
     */
    public function __construct(
        string $visit = null,
        string $project = null,
        string $subproject = null
    ) {
        $this->visit      = $visit;
        $this->project    = $project;
        $this->subproject = $subproject;
    }

    /**
     * Getter for visit name
     *
     * @return string The visit's name
     */
    public function getName(): string
    {
        return $this->visit;
    }
}
