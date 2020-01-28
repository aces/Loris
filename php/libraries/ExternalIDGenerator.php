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
     * @param string $siteAlias    To be appended to the ID value. Usually an
     *                             abbreviation for the name of a site.
     * @param string $projectAlias To be appended to the ID value. Usually an
     *                             abbreviation for the name of a project.
     *
     * @return void
     */
    public function __construct(string $siteAlias, string $projectAlias)
    {
        $this->kind = 'ExternalID';
        parent::__construct($siteAlias, $projectAlias);
    }
}
