<?php declare(strict_types=1);

/**
 * PHP Version 8
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\redcap\client\models;

use LORIS\redcap\client\RedcapProps;

/**
 * This represents a redcap event.
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class RedcapSurveyParticipant
{
    /**
     * REDCap email.
     */
    public readonly ?string $email;

    /**
     * REDCap email occurrence.
     */
    public readonly int $email_occurrence;

    /**
     * REDCap identifier.
     */
    public readonly ?string $identifier;

    /**
     * REDCap record ID.
     */
    public readonly ?string $record;

    /**
     * REDCap invitation sent status.
     */
    public readonly bool $invitation_sent_status;

    /**
     * REDCap invitation sent time.
     */
    public readonly ?string $invitation_sent_time;

    /**
     * REDCap response status.
     */
    public readonly int $response_status;

    /**
     * REDCap survey access code.
     */
    public readonly ?string $survey_access_code;

    /**
     * REDCap survey link.
     */
    public readonly ?string $survey_link;

    /**
     * REDCap survey queue link.
     */
    public readonly string $survey_queue_link;

    /**
     * Constructor
     *
     * @param array $props The REDCap survey participant properties.
     */
    public function __construct(array $props)
    {
        $props = new RedcapProps('participantList', $props);

        $this->email            = $props->getStringNullable('email');
        $this->email_occurrence = $props->getInt('email_occurence');
        $this->identifier       = $props->getStringNullable('identifier');
        $this->record           = $props->getStringNullable('record');
        $this->invitation_sent_status = $props->getBool('invitation_sent_status');
        $this->invitation_sent_time   = $props->getStringNullable(
            'invitation_sent_time'
        );
        $this->response_status        = $props->getInt('survey_access_code');
        $this->survey_access_code     = $props->getStringNullable('survey_link');
        $this->survey_link            = $props->getStringNullable(
            'survey_queue_link'
        );
    }

    /**
     * Props array.
     *
     * @return array
     */
    public function toArray(): array
    {
        return [
            'email'                  => $this->email,
            'email_occurrence'       => $this->email_occurrence,
            'identifier'             => $this->identifier,
            'record'                 => $this->record,
            'invitation_sent_status' => $this->invitation_sent_status,
            'invitation_sent_time'   => $this->invitation_sent_time,
            'response_status'        => $this->response_status,
            'survey_access_code'     => $this->survey_access_code,
            'survey_link'            => $this->survey_link,
            'survey_queue_link'      => $this->survey_queue_link,
        ];
    }
}
