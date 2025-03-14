<?php declare(strict_types=1);

namespace LORIS\imaging_browser;

use \LORIS\Data\Scope;
use \LORIS\Data\Type;
use \LORIS\Data\Cardinality;

/**
 * Describes a dictionary item for the imaging browser. Imaging browser items are
 * like normal items, but have a modality attached to them in order to build
 * modality-specific descriptions.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class MRICommentDictionaryItem extends ImagingDictionaryItem
{
    private $commentName;

    /**
     * Construct an ImagingDictionaryItem
     *
     * @param string      $name        The field name of the dictionary item
     * @param string      $desc        The dictionary item's description
     * @param Scope       $scope       The scope to which this DictionaryItem applies
     * @param Type        $t           The data type of this dictionary item
     * @param Cardinality $c           The data cardinality
     * @param string      $modality    The imaging modality that this item is for
     * @param string      $commentName Name of the comment (as per table
     *                                 feedback_mri_comment_types).
     */
    public function __construct(
        string $name,
        string $desc,
        Scope $scope,
        Type $t,
        Cardinality $c,
        string $modality,
        string $commentName
    ) {
        parent::__construct($name, $desc, $scope, $t, $c, $modality);
        $this->commentName = $commentName;
    }

    public function getCommentName() : string
    {
        return $this->commentName;
    }
}
