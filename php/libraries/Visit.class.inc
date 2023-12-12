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
     * The visit label displayed in the browser
     *
     * @var ?string
     */
    protected $label;

    /**
     * The contructor
     *
     * @param ?string $name  The visit name
     * @param ?string $label The visit label (Front-end)
     */
    public function __construct(
        ?string $name = null,
        ?string $label = null
    ) {
        $this->name  = $name;
        $this->label = $label;
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
}
