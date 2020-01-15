<?php declare(strict_types=1);
namespace LORIS\GUI;

/**
 * A widget is a mechanism of loosely coupling module interactions
 * which affect the GUI.
 *
 * When serialized to a string, they should be serialized to the
 * format that should be rendered to the browser.
 */
interface Widget
{
    /**
     * Widgets must be serializeable to a string in order to
     * be displayed to the user.
     */
    public function __toString();
}
