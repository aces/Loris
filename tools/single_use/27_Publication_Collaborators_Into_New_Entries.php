<?php 
/**
 * 
 * This single use script updates the existing publication_collaborator entries in the database
 * to be unique for each publication.
 * 
 * PHP Version 8
 *
 * @category   Main
 * @package    Loris
 * @subpackage Tools
 * @author     Saagar Arya <saagar.arya@mcin.ca>
 * @license    Loris license
 * @link       https://www.github.com/aces/Loris-Trunk/
 * 
 */

require_once __DIR__ . "/../generic_includes.php";

$helper = new OutputWrapper();
$helper->enableLogging(basename($argv[0]));

$helper->printSuccess("########## UPDATING PUBLICATION COLLABORATORS ##########");
$existingPublicationCollaborators = $DB->pselect(
    "SELECT DISTINCT pcr.PublicationID, pc.Name, pc.Email
    FROM publication_collaborator_rel pcr
    JOIN publication_collaborator pc ON pc.PublicationCollaboratorID = pcr.PublicationCollaboratorID
    WHERE pcr.PublicationID IS NOT NULL
    AND pc.PublicationCollaboratorID IS NOT NULL",
    []
);

if (empty($existingPublicationCollaborators)) {
    $helper->printWarning("No existing publication collaborators found.");
    exit;
}

$helper->printWarning("There were " . count($existingPublicationCollaborators) . " existing publication collaborators found.");

$helper->printSuccess("########## DELETING ALL EXISTING PUBLICATION COLLABORATORS ##########");
$DB->run("DELETE FROM publication_collaborator_rel");
$DB->run("DELETE FROM publication_collaborator");

$helper->printSuccess("########## INSERTING PUBLICATION COLLABORATORS PROPERLY ##########");
foreach ($existingPublicationCollaborators as $publicationCollaborator) {
    $publicationID = $publicationCollaborator['PublicationID'];
    $name = $publicationCollaborator['Name'];
    $email = $publicationCollaborator['Email'];

    $helper->printSuccess("PublicationID: $publicationID, Name: $name, Email: $email");
    // Insert the new publication collaborator
    $DB->insert(
        "publication_collaborator",
        [
            'Name' => $name,
            'Email' => $email
        ]
    );

    $newPublicationCollaboratorID = $DB->getLastInsertId();

    // Insert the new publication collaborator relationship
    $DB->insert(
        "publication_collaborator_rel",
        [
            'PublicationID' => $publicationID,
            'PublicationCollaboratorID' => $newPublicationCollaboratorID
        ]
    );
}

$newPublicationCollaborators = $DB->pselect(
    "SELECT DISTINCT pcr.PublicationID, pc.Name, pc.Email
    FROM publication_collaborator_rel pcr
    JOIN publication_collaborator pc ON pc.PublicationCollaboratorID = pcr.PublicationCollaboratorID
    WHERE pcr.PublicationID IS NOT NULL
    AND pc.PublicationCollaboratorID IS NOT NULL",
    []
);

if (empty($newPublicationCollaborators)) {
    $helper->printWarning("No new publication collaborators found.");
    exit;
}
$helper->printWarning("There are now " . count($newPublicationCollaborators) . " publication collaborators.");