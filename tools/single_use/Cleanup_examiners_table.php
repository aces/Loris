<?php
/**
 * This script is written to clean the examiners table of duplicate userIDs
 *
 *
 * PHP Version 7
 *
 * @category Main
 * @package Loris
 * @author Camille Beaudoin <camille.beaudoin@mcin.ca>
 * @license Loris license
 * @link https://www.github.com/aces/Loris-Trunk/
 */

require_once __DIR__."/../generic_includes.php";

// Remove duplicate users
$examiners = $DB->pselect(
	"SELECT full_name, userID FROM examiners WHERE userID IS NOT NULL",
	[], 
	'full_name'
);

// Get array of duplicate userIDs
// These are the result of a name change in user_accounts
// There should only exist one row per userID
$nonDuplicates = [];
$duplicates = [];
foreach ($examiners as $key => $data) {
	$id = $data['userID'];
	if (in_array($id, $nonDuplicates)) {
		$duplicates[] = $id;
	} else {
		$nonDuplicates[] = $id;
	}
}
$userIDString = implode(',', $duplicates);

if (!empty($userIDString)) {
	// Get the correct real name for each duplicate userID
	$real_names = $DB->pselectColWithIndexKey(
		"SELECT ID AS userID, Real_name FROM users WHERE ID IN ({$userIDString})",
		[],
		'userID'
	);

	// Remove rows that are duplicate userIDs
	// and do not have the correct full_name
	foreach($examiners as $key => $data) {
		$id = $data['userID'];
		if (
			in_array($id, $duplicates) && 
			$data['full_name'] !== $real_names[$id]
		) {
			print_r("Removing row for userID {$data['userID']} ".
				"with full name \"{$data['full_name']}\"\n");
			$DB->delete(
				'examiners', 
				['userID' => $id, 'full_name' => $data['full_name']]
			);
		}
	}
}
