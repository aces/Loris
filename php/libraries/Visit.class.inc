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
     * @var ?string
     */
    protected $name;

    /**
     * The contructor
     *
     * @param ?string $name The visit name
     */
    public function __construct(
        ?string $name = null
    ) {
        $this->name = $name;
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
}
