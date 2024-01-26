<?php declare(strict_types=1);
/**
 * This file contains a class used to generate ParticipantIDs for use in LORIS.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  LORIS
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
/**
 * This class defines functions used to generate valid ParticipantID identifiers in
 * LORIS.
 *
 * PHP Version 8
 *
 * @category Main
 * @package  LORIS
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class ParticipantIDGenerator extends SiteIDGenerator
{
    /**
     * Generates ParticipantIDs.
     *
     * @param string $siteAlias    The site prefix to prepend to the ID value.
     * @param string $projectAlias The project prefix to prepend to the ID value.
     *
     * @return void
     */
    public function __construct(string $siteAlias, string $projectAlias)
    {
        $this->kind = 'ParticipantID';
        parent::__construct($siteAlias, $projectAlias);
    }
}
