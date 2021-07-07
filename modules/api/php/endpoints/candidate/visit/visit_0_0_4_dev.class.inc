<?php declare(strict_types=1);
/**
 * This implements the Visit endpoint class under Candidates/$candid
 *
 * PHP Version 7
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\api\Endpoints\Candidate\Visit;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * A class for handling the /candidates/$candidate/$visit_label endpoint.
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Visit_0_0_4_Dev extends Visit
{
    /**
     * Return which methods are supported by this endpoint.
     *
     * @return array supported HTTP methods
     */
    protected function allowedMethods() : array
    {
        return [
            'GET',
            'PATCH',
            'PUT',
        ];
    }

    /**
     * Versions of the LORIS API which are supported by this
     * endpoint.
     *
     * @return array a list of supported API versions.
     */
    protected function supportedVersions() : array
    {
        return [
            'v0.0.4-dev'
        ];
    }

    /**
     * Handles a PATCH request.
     * For now, only support a NextStageDate argument to start next stage.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    protected function handlePATCH(
        ServerRequestInterface $request
    ): ResponseInterface {
        $data          = json_decode((string) $request->getBody(), true);
        $nextStageDate = $data['NextStageDate'] ?? null;

        if ($this->_visit === null) {
            return new \LORIS\Http\Response\JSON\NotFound('Visit not found');
        }

        $response = $this->validatePUT($request);
        if ($response !== null) {
            return $response;
        }

        if (!isset($data['Visit'])
            || $data['Visit'] !== $this->_visit->getVisitLabel()
        ) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'The Visit field does not match this visit'
            );
        }

        if (!$nextStageDate) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'There is no stage date specified'
            );
        }

        $date_format = 'Y-m-d';
        $date        = \DateTime::createFromFormat($date_format, $nextStageDate);

        if (!($date && $date->format($date_format) === $nextStageDate)) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'The date specified is invalid. Date must be of the form YYYY-MM-DD'
            );
        }

        if ($nextStageDate > date($date_format)) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'The date specified must be not later than today'
            );
        }

        if ($this->_visit->getCurrentStage() !== 'Not Started') {
            return new \LORIS\Http\Response\JSON\Conflict(
                'This visit is already started'
            );
        }

        $newStage = $this->_visit->getNextStage();
        if (!$newStage) {
            return new \LORIS\Http\Response\JSON\Conflict(
                "Next stage is null"
            );
        }

        // start that stage
        $this->_visit->startStage($newStage);

        // set the date for the new stage
        $this->_visit->setData(["Date_".$newStage => $nextStageDate]);

        // create a new battery object && new battery
        $candidate = \Candidate::singleton($this->_visit->getCandID());

        // First visit ?
        $firstVisit = false;
        try {
            if ($candidate->getFirstVisit() == $this->_visit->getVisitLabel()) {
                $firstVisit = true;
            }
        } catch (\LorisException $e) {
        }

        $battery = new \NDB_BVL_Battery;
        // select a specific time point (sessionID) for the battery
        $battery->selectBattery($this->_visit->getSessionID());

        // add instruments to the time point
        $battery->createBattery(
            $request->getAttribute("loris"),
            $this->_visit->getSubprojectID(),
            $newStage,
            $this->_visit->getVisitLabel(),
            $this->_visit->getCenterID(),
            $firstVisit
        );

        return new \LORIS\Http\Response\JSON\OK();
    }
}
