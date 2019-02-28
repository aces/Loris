<?php declare(strict_types=1);
/**
 * This file contains a class used to generate PSCIDs for use in LORIS.
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
 * This class is a simple extension of SiteIDGenerator and is used by calling
 * code to generate PSCIDs.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  LORIS
 * @author   John Saigle <john.saigle@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class ExternalIDGenerator extends SiteIDGenerator
{
    /**
     * Generates ExternalIDs.
     *
     * @param ?string $prefix The site prefix to prepend to the ID value.
     *
     * @return void
     */
    public function __construct(?string $prefix = null)
    {
        $this->kind = 'ExternalID';
        parent::__construct($prefix);
    }
}
