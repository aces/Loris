<?php declare(strict_types=1);
namespace LORIS\dataquery;

/**
 * A dataquery ActionWidget implements a new action that
 * can be performed in the "Next Steps" of the dataquery
 * module
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class ActionWidget implements \LORIS\GUI\Widget
{
    /**
     * Construct a new dataquery ActionWidget
     *
     * @param string $label      The label to display on the action button
     * @param string $tab        The tab to display the action on
     * @param string $jsurl      The javascript URL defining the callback
     * @param string $jscallback The name of the callback to call when the
     *                           button is clicked
     */
    public function __construct(
        public readonly string $label,
        public readonly string $tab,
        public readonly string $jsurl,
        public readonly string $jscallback,
    ) {
    }

    /**
     * Implement the \LORIS\GUI\Widget interface.
     * No-op.
     *
     * @return string
     */
    public function __toString()
    {
        return "";
    }


}
