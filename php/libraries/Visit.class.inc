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
     * The visit ID
     *
     * @var int
     */
    protected $id;

    /**
     * The visit name (formely known as visit_label)
     *
     * @var string
     */
    protected $name;

    /**
     * The contructor
     *
     * @param string|null $name The visit name
     * @param string|null $id   The ID of the visit
     */
    public function __construct(
        ?string $name = null,
        ?string $id   = null
    ) {
        $this->name = $name;
        $this->id   = $id;
    }

    /**
     * Getter for visit name
     *
     * @return string The visit's name
     */
    public function getName(): string
    {
        return $this->name;
    }
}
