<?php declare(strict_types=1);
/**
 * This file contains a class used to generate ParentIDs for use in LORIS.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  LORIS
 * @author   Shen Wang <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
/**
 * This class defines functions used to generate valid ParentID identifiers in
 * LORIS.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  LORIS
 * @author   Shen Wang <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class ParentIDGenerator extends SiteIDGenerator
{
    /**
     * Generates ParentIDs.
     *
     * @param string $siteAlias    The site prefix to prepend to the ID value.
     * @param string $projectAlias The project prefix to prepend to the ID value.
     *
     * @return void
     */
    public function __construct(string $siteAlias, string $projectAlias)
    {
        $this->kind = 'ParentID';
        parent::__construct($siteAlias, $projectAlias);
    }
}
