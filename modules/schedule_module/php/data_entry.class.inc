<?php declare(strict_types=1);
namespace LORIS\schedule_module;
/**
 * Implement this interface for each Appointment Type
 *
 * @license Loris license
 */
interface DataEntryExpression
{
    /**
     * This function will return complete expression
     *
     * @return string get the complete expression
     */
    public function getCompleteExpression() : string;
    /**
     * This function will return inprogress expression
     *
     * @return string get the inprogress expression
     */
    public function getInProgressExpression() : string;
    /**
     * This function will return Not Started expression
     *
     * @return string get the NotStarted expression
     */
    public function getNotStartedExpression() : string;
}
