<?php
require_once __DIR__.'/../../../../tools/generic_includes.php';

class CouchDBSpecimenImporter
{
    var $SQLDB; // reference to the database handler, store here instead
    var $CouchDB; // reference to the CouchDB database handler
    var $factory;
    var $user;
    var $specimenController;
    var $containerController;

    function __construct()
    {
        $this->factory       = \NDB_Factory::singleton();
        $config        = \NDB_Config::singleton();
        $couchConfig   = $config->getSetting('CouchDB');
        $this->SQLDB   = $this->factory->Database();
        $this->user    = $this->factory->user('admin');
        $this->CouchDB = $this->factory->couchDB(
            $couchConfig['dbName'],
            $couchConfig['hostname'],
            intval($couchConfig['port']),
            $couchConfig['admin'],
            $couchConfig['adminpass']
        );
        // instanciate module to autoload classes;
        \Module::factory("biobank");
        $this->specimenController = new \LORIS\biobank\SpecimenController(
            $this->SQLDB,
            $this->user
        );
        $this->containerController = new \LORIS\biobank\ContainerController(
            $this->SQLDB,
            $this->user
        );

    }

    function run()
    {
        $this->UpdateDataDicts();
        $results = $this->UpdateCandidateDocs();
    }

    function cleanLabel(string $label)
    {
        $noSpaceLabel = preg_replace('/\s/', '_', $label);
        $noSpecialCharsLabel = preg_replace('/[^A-Za-z0-9\-_]/', '', $noSpaceLabel);

        return $noSpecialCharsLabel;
    }

    function UpdateDataDicts()
    {
        $specimenMetaData = $this->specimenController->getOptions();
        $containerMetaData = $this->containerController->getOptions();
        $dictionary = array ();

        $specimenTypes = $specimenMetaData['types'];
        $containerStati = $containerMetaData['stati'];

        foreach ($specimenTypes as $specimenType) {
            $typeLabel = $specimenType['label'];
            $typeLabelClean = $this->cleanLabel($typeLabel);

            $dictionary[$typeLabelClean."_total"] = array (
                'Description' => "Total number of $typeLabel samples",
                'Type' => 'varchar(255)'
            );
            foreach ($containerStati as $containerStatus) {
                $statusLabel = $containerStatus['label'];
                $statusLabelClean = $this->cleanLabel($statusLabel);
                $dictionary[$typeLabelClean."_".$statusLabelClean."_count"] = array (
                    'Description' => "Number of $statusLabel $typeLabel samples",
                    'Type' => 'varchar(255)'
                );
                $dictionary[$typeLabelClean."_".$statusLabelClean."_list"] = array (
                    'Description' => "List of $statusLabel $typeLabel samples",
                    'Type' => 'varchar(255)'
                );
            }

        }
        $this->CouchDB->replaceDoc(
            "DataDictionary:specimens",
            array(
                'Meta'           => array('DataDict' => true),
                'DataDictionary' => array("specimens" => $dictionary),
            )
        );
    }

    function UpdateCandidateDocs()
    {
//        $specimens = $this->specimenController->getInstances();
//        $containers = $this->containerController->getInstances();
//        $specimenMetaData = $this->specimenController->getOptions();
//        $containerMetaData = $this->containerController->getOptions();

        $query = "
        SELECT cc.PSCID, 
               ss.Visit_label, 
               st.Label as SpecimenType,
               cs.Label as Status,
               COUNT(c.Barcode) as count,
               GROUP_CONCAT(CONCAT(c.Barcode,' [',s.Quantity,'(',u.Label,')',' @ ',psc.Name,'/',p.Name,']')) as list
        FROM biobank_specimen s 
            JOIN biobank_specimen_type st USING(SpecimenTypeID)
            JOIN biobank_unit u USING(UnitID)
            JOIN biobank_container c USING(ContainerID)
            JOIN biobank_container_status cs USING(ContainerStatusID)
            JOIN biobank_container_project_rel cpr USING(ContainerID)
            JOIN Project p USING(ProjectID)
            JOIN psc ON (psc.CenterID=c.CurrentCenterID)
            JOIN session ss ON (ss.ID=s.SessionID)
            JOIN candidate cc ON (cc.CandID =ss.candID)
        GROUP BY cc.PSCID, ss.Visit_label, s.SpecimenTypeID, c.ContainerStatusID
        ";
        $rawData = $this->SQLDB->pselect($query,array());


        $derivedData = array();
        foreach ($rawData as $row) {
            $id=$row["PSCID"]."_".$row["Visit_label"];
            $typeLabelClean = $this->cleanLabel($row["SpecimenType"]);
            $statusLabelClean = $this->cleanLabel($row["Status"]);


            $derivedData[$id]["PSCID"] = $row["PSCID"];
            $derivedData[$id]["Visit_label"] = $row["Visit_label"];
            $derivedData[$id][$typeLabelClean."_".$statusLabelClean."_count"] = $row["count"];
            $derivedData[$id][$typeLabelClean."_".$statusLabelClean."_list"] = $row["list"];

            $derivedData[$id][$typeLabelClean."_total"] += $row["count"];
        }

        $this->CouchDB->beginBulkTransaction();

        foreach ($derivedData as $key=>$docData) {
            $id = "specimens_".$key;
            $pscid = $docData["PSCID"];
            $vl = $docData["Visit_label"];

            unset($docData["PSCID"]);
            unset($docData["Visit_label"]);

            print "Exporting data for $pscid @ $vl: ";
            $doc = array(
                'Meta' => array(
                    'DocType' => 'specimens',
                    'identifier' => array(
                        $pscid,
                        $vl,
                    ),
                ),
                'data' => $docData,
            );
            $this->CouchDB->replaceDoc($id, $doc);
	    print "Success!\n";
        }
        print $this->CouchDB->commitBulkTransaction();
    }
}


// Don't run if we're doing the unit tests, the unit test will call run..
if (!class_exists('UnitTestCase')) {
    $Runner = new CouchDBSpecimenImporter();
    $Runner->run();
}

