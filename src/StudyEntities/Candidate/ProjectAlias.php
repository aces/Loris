<?php declare(strict_types=1);
/**
 * Implementation of a ProjectAlias value object that is used as a shorthand to
 * refer to a Project in LORIS.
 *
 * PHP Version 7
 *
 * @category StudyEntities
 * @package  LORIS
 * @author   John Saigle <john.saigle@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\StudyEntities\Candidate;

/**
 * ValidatableIdentifier with the default constructor that call validate
 *
 * @category StudyEntities
 * @package  LORIS
 * @author   John Saigle <john.saigle@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class ProjectAlias extends Alias
{
    /*
     * The maxiumum length of the identifier.
     *
     * @var int
     */
    protected const MAX_LENGTH = 5;

    /*
     * The minimum length of the identifier.
     *
     * @var int
     */
    protected const MIN_LENGTH = 3;

    /**
     * {@inheritDoc}
     *
     * @return string
     */
    public function getType(): string
    {
        return 'ProjectAlias';
    }
}
