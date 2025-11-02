<?php declare(strict_types=1);

/**
 * This file contains code to import MRI data into
 * DQT
 *
 * PHP Version 8
 *
 * @category Main
 * @package  Main
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
require_once 'generic_includes.php';
require_once 'importers/CouchDB_MRI_Importer.php';

$Runner = new CouchDBMRIImporter();
$Runner->run();
