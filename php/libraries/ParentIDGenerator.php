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
namespace LORIS\StudyEntities\Candidate\ParentIDGenerator;
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
class ParentIDGenerator extends \CandIDGenerator
{

    /**
     * ParentIDs should always come from CandID generator with a prefix string.
     *
     * @var $prefix string
     */

    protected $prefix ;

    /**
     * Creates a new ParentIDs generator by initializing properties based on class
     * constants defined above.
     *
     * @param string $prefix the prefix string
     */
    public function __construct(string $prefix="Parent")
    {
        parent::__construct();
        $this->prefix = $prefix;
    }

    /**
     * Creates a new ParentID.
     *
     * @return string The new identifier.
     */
    public function generateParentID(): string
    {
        //  $generator = new \CandIDGenerator();
        $candID = parent::generate();
        return $this->prefix.(string)$candID;
    }

}
