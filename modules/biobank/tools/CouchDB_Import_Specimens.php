<?php
require_once __DIR__.'/../../../../tools/generic_includes.php';
require_once __DIR__.'/../php/specimencontroller.class.inc';
require_once __DIR__.'/../php/containercontroller.class.inc';

/**
 * Class to handle the importing of specimens to the DQT
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class CouchDBSpecimenImporter
{
    public \Database $SQLDB; // reference to the database handler, store here instead
    public \CouchDB $CouchDB; // reference to the CouchDB database handler
    public \NDB_Factory $factory;
    public \User $user;
    public \LORIS\biobank\SpecimenController $specimenController;
    public \LORIS\biobank\ContainerController $containerController;

    /**
     * Constructor
     */
    function __construct()
    {
        $this->factory = \NDB_Factory::singleton();
        $config        = \NDB_Config::singleton();
        $couchConfig   = $config->getSetting('CouchDB');
        $this->SQLDB   = $this->factory->Database();
        $this->user    = $this->factory->user();
        $this->CouchDB = $this->factory->couchDB(
            $couchConfig['dbName'],
            $couchConfig['hostname'],
            intval($couchConfig['port']),
            $couchConfig['admin'],
            $couchConfig['adminpass']
        );
        // instanciate module to autoload classes;
        \Module::factory("biobank");
        $this->specimenController  = new \LORIS\biobank\SpecimenController(
            $this->SQLDB,
            $this->user
        );
        $this->containerController = new \LORIS\biobank\ContainerController(
            $this->SQLDB,
            $this->user
        );

    }

    /**
     * Begin the data import
     *
     * @return void
     */
    function run()
    {
        $this->updateDataDicts();
        $this->updateCandidateDocs();
    }

    /**
     * Remove special characters in a label
     *
     * @param string $label The label
     *
     * @return string
     */
    function cleanLabel(string $label)
    {
        $noSpaceLabel        = preg_replace('/\s/', '_', $label);
        $noSpecialCharsLabel = preg_replace(
            '/[^A-Za-z0-9\-_]/',
            '',
            $noSpaceLabel ?? '',
        );

        return $noSpecialCharsLabel ?? '';
    }

    /**
     * Update the data dictionary for specimens on the CouchDB server
     *
     * @return void
     */
    function updateDataDicts()
    {
        $specimenMetaData  = $this->specimenController->getOptions();
        $containerMetaData = $this->containerController->getOptions();
        $dictionary        =  [];

        $specimenTypes  = $specimenMetaData['types'];
        $containerStati = $containerMetaData['stati'];

        foreach ($specimenTypes as $specimenType) {
            $typeLabel      = $specimenType['label'];
            $typeLabelClean = $this->cleanLabel($typeLabel);

            $dictionary[$typeLabelClean."_total"] =  [
                'Description' => "Total number of $typeLabel samples",
                'Type'        => 'varchar(255)'
            ];
            foreach ($containerStati as $containerStatus) {
                $statusLabel      = $containerStatus['label'];
                $statusLabelClean = $this->cleanLabel($statusLabel);
                $dictionary[$typeLabelClean."_".$statusLabelClean."_count"] =  [
                    'Description' => "Number of $statusLabel $typeLabel samples",
                    'Type'        => 'varchar(255)'
                ];
                $dictionary[$typeLabelClean."_".$statusLabelClean."_list"]  =  [
                    'Description' => "List of $statusLabel $typeLabel samples",
                    'Type'        => 'varchar(255)'
                ];
            }

        }
        $this->CouchDB->replaceDoc(
            "DataDictionary:specimens",
            [
                'Meta'           => ['DataDict' => true],
                'DataDictionary' => ["specimens" => $dictionary],
            ]
        );
    }

    /**
     * Update the docs on the CouchDB server
     *
     * @return void
     */
    function updateCandidateDocs()
    {
        //        $specimens = $this->specimenController->getInstances();
        //        $containers = $this->containerController->getInstances();
        //        $specimenMetaData = $this->specimenController->getOptions();
        //        $containerMetaData = $this->containerController->getOptions();

        $query   = "
        SELECT cc.PSCID, 
               ss.Visit_label, 
               st.Label as SpecimenType,
               cs.Label as Status,
               COUNT(c.Barcode) as count,
               GROUP_CONCAT(
                CONCAT(
                    c.Barcode,
                    ' [',
                    s.Quantity,
                    '(',
                    u.Label,
                    ')',
                    ' @ ',
                    psc.Name,
                    '/',
                    p.Name,
                    ']'
                 )
               ) as list
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
        $rawData = $this->SQLDB->pselect($query, []);

        $derivedData = [];
        foreach ($rawData as $row) {
            $id =$row["PSCID"]."_".$row["Visit_label"];
            $typeLabelClean   = $this->cleanLabel($row["SpecimenType"]);
            $statusLabelClean = $this->cleanLabel($row["Status"]);

            $derivedData[$id]["PSCID"]       = $row["PSCID"];
            $derivedData[$id]["Visit_label"] = $row["Visit_label"];

            $derivedData[$id][$typeLabelClean."_".$statusLabelClean."_count"]
                = $row["count"];

            $derivedData[$id][$typeLabelClean."_".$statusLabelClean."_list"]
                = $row["list"];

            $derivedData[$id][$typeLabelClean."_total"] += $row["count"];
        }

        $this->CouchDB->beginBulkTransaction();

        foreach ($derivedData as $key=>$docData) {
            $id    = "specimens_".$key;
            $pscid = $docData["PSCID"];
            $vl    = $docData["Visit_label"];

            unset($docData["PSCID"]);
            unset($docData["Visit_label"]);

            print "Exporting data for $pscid @ $vl: ";
            $doc = [
                'Meta' => [
                    'DocType'    => 'specimens',
                    'identifier' => [
                        $pscid,
                        $vl,
                    ],
                ],
                'data' => $docData,
            ];
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

