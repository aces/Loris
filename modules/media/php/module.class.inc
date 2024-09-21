<?php
namespace LORIS\media;
use LORIS\candidate_profile\CandidateWidget;

/**
 * {@inheritDoc}
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class Module extends \Module
{
    /**
     * {@inheritDoc}
     *
     * @param \User $user The user whose access is being checked.
     *
     * @return bool whether access is granted
     */
    public function hasAccess(\User $user) : bool
    {
        return parent::hasAccess($user) &&
            $user->hasAnyPermission(['media_read', 'media_write']);
    }

    /**
     * {@inheritDoc}
     *
     * @return string The menu category for this module
     */
    public function getMenuCategory() : string
    {
        return "Clinical";
    }

    /**
     * {@inheritDoc}
     *
     * @return string The human readable name for this module
     */
    public function getLongName() : string
    {
        return "Media";
    }

    /**
     * {@inheritDoc}
     *
     * @param string $type    The type of widgets to get.
     * @param \User  $user    The user widgets are being retrieved for.
     * @param array  $options A type dependent list of options to provide
     *                        to the widget.
     *
     * @return \LORIS\GUI\Widget[]
     */
    public function getWidgets(string $type, \User $user, array $options) : array
    {
        switch ($type) {
        case 'candidate':
            $factory   = \NDB_Factory::singleton();
            $baseurl   = $factory->settings()->getBaseURL();
            $candidate = $options['candidate'];
            if ($candidate === null) {
                return [];
            }
            $db = $factory->database();

            $media = $db->pselect(
                "SELECT file_name as Filename, last_modified as LastModified
                 FROM media m
                    JOIN session s ON (m.session_id=s.ID)
                 WHERE s.CandID=:cid
                    AND hide_file=false",
                ['cid' => $candidate->getCandID()],
            );
            if (count($media) === 0) {
                return [];
            }
            return [
                new CandidateWidget(
                    "Candidate Media",
                    $baseurl . "/media/js/CandidateMediaWidget.js",
                    "lorisjs.media.CandidateMediaWidget.default",
                    [ 'Files' => iterator_to_array($media)],
                    1,
                    1,
                )
            ];
        }
        return [];
    }
}
