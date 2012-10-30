<?php
require_once 'simpletest/autorun.php';
require_once 'CouchDB.class.inc';

Mock::generatePartial('CouchDB', 'MockCouchDBWrap', array('_getRelativeURL', '_postRelativeURL'));
Mock::generate('SocketWrapper');


class TestOfCouchDBWrapper extends UnitTestCase {
    function setUp() {
        $this->config = NDB_Config::singleton();
        $this->db = $this->config->getSetting('CouchDB');
    }
    function testSingleton() {
        $db = CouchDB::singleton();
        $this->assertIsA($db, 'CouchDB');

        $db2 = CouchDB::singleton();

        $this->assertReference($db, $db2);
    }

    function testGetRelativeURL() {
        $couch = CouchDB::singleton();
        $smock = new MockSocketWrapper();
        $smock->returns('eof', false);
        $smock->returnsAt(0, 'gets', "HTTP/1.0 200 OK\n");
        $smock->returnsAt(1, 'gets', "Server: FakeNotRealServer/1.0\n");
        $smock->returnsAt(2, 'gets', "\r\n");
        $smock->returnsAt(3, 'gets', "\r\n");
        $smock->returnsAt(4, 'gets', "hello\n");
        $smock->returnsAt(5, 'eof', true);
        $couch->SocketHandler = $smock;

        
        $smock->expectOnce('setHost', array($this->db['hostname']));
        $smock->expectOnce('setPort', array($this->db['port']));
        $file = $couch->_getRelativeURL("/hello.txt");
        $this->assertEqual($file, "hello");
    }
    function testPostRelativeURL() {
        $couch = CouchDB::singleton();
        $smock = new MockSocketWrapper();
        $smock->expectOnce('setHost', array($this->db['hostname']));
        $smock->expectOnce('setPort', array($this->db['port']));
        $smock->returns('eof', false);
        $smock->returnsAt(0, 'gets', "HTTP/1.0 201 Created\r\n");
        $smock->returnsAt(1, 'gets', "\r\n");
        $smock->returnsAt(2, 'gets', "I created it\r\n");
        $smock->returnsAt(3, 'eof', true);

        $url = $couch->_constructURL('POST', 'hello.txt');
        $smock->expectAt(0, 'write', array("$url HTTP/1.0\r\n")); // write the POST 
        $smock->expectAt(1, 'write', array("Content-Length: 3\r\n"));
        $smock->expectAt(2, 'write', array("Content-type: application/json\r\n\r\n")); // Write the length
        $smock->expectAt(3, 'write', array("abc"));
        $smock->expectCallCount('write', 4);
        $couch->SocketHandler = $smock;
        $file = $couch->_postRelativeURL("hello.txt", "abc");
        $this->assertEqual($file, "I created it");
   }

    function testPostURL() {
        $couch = CouchDB::singleton();
        $smock = new MockSocketWrapper();
        $smock->expectOnce('setHost', array($this->db['hostname']));
        $smock->expectOnce('setPort', array($this->db['port']));
        $smock->returns('eof', false);
        $smock->returnsAt(0, 'gets', "HTTP/1.0 201 Created\r\n");
        $smock->returnsAt(1, 'gets', "\r\n");
        $smock->returnsAt(2, 'gets', "I created it\r\n");
        $smock->returnsAt(3, 'eof', true);

        $smock->expectAt(0, 'write', array("POST /users/abc HTTP/1.0\r\n")); // write the POST 
        $smock->expectAt(1, 'write', array("Content-Length: 3\r\n\r\n")); // Write the length
        $smock->expectAt(2, 'write', array("abc"));
        $smock->expectCallCount('write', 3);
        $couch->SocketHandler = $smock;
        $file = $couch->_postURL("/users/abc", "abc");
        $this->assertEqual($file, "I created it");
   }
    function testConstructURL() {
        $CouchDB = $this->config->getSetting("CouchDB");
        $Couch = CouchDB::singleton();

        $url = $Couch->_constructURL("GET", "asdf");
        $this->assertEqual($url, "GET /$CouchDB[database]/asdf");
    }

    function testGetDoc() {
        $DataCouchDB = new MockCouchDBWrap();
        $EmptyCouchDB = new MockCouchDBWrap();

        $DataCouchDB->returns("_getRelativeURL", '{ "_id": "test", "_rev": "3-adffff", "a": 123, "b": 333 }');
        $val = $DataCouchDB->getDoc("test");
        $this->assertEqual($val, array('_id' => 'test', '_rev' => '3-adffff', 'a' => 123, 'b' => 333));

        $EmptyCouchDB->returns("_getRelativeURL", '{ "error": "not_found", "reason": "missing"');
        $val = $EmptyCouchDB->getDoc("test");
        $this->assertEqual($val, array());
    }



    function testDeleteDoc() {
        $Mock = new MockCouchDBWrap();
        $id = "Demographics_Session_UNC0219_V06";
        $Mock->returns("_getRelativeURL", '{"ok":true,"id":"Demographics_Session_UNC0219_V06","rev":"2-c78967e246008b55daed336e61cb8342"}');
        $result = $Mock->deleteDoc($id);
        $this->assertTrue($result);

        $Mock = new MockCouchDBWrap();
        $Mock->returns("_getRelativeURL", '{"error":"not_found","reason":"missing"}');
        $result = $Mock->deleteDoc($id);
        $this->assertFalse($result);
    }

    function testPutDoc() {
        $data = array('a' => 'b');
        $data_json = json_encode($data);
        $Mock = new MockCouchDBWrap();
        $Mock->returns("_postRelativeURL", '{"ok":true,"id":"abc","rev":"2-c78967e246008b55daed336e61cb8342"}');
        $Mock->expectOnce("_postRelativeURL", array("abc", $data_json, 'PUT'));
        $result = $Mock->putDoc("abc", array('a' => 'b'));
        

    }

    function testPostDoc()
    {
        $data = array('a' => 'b');
        $data_json = json_encode($data);
        $Mock = new MockCouchDBWrap();
        $Mock->returns("_postRelativeURL", '{"ok":true,"id":"abc","rev":"2-c78967e246008b55daed336e61cb8342"}');
        $Mock->expectOnce("_postRelativeURL", array("", $data_json, 'POST'));
        $result = $Mock->postDoc(array('a' => 'b'));
    }

    function testCreateDoc() 
    {
        $data = array('a' => 'b');
        $data_json = json_encode($data);
        $Mock = new MockCouchDBWrap();

        $Mock->returns("_postRelativeURL", '{"ok":true,"id":"abc","rev":"2-c78967e246008b55daed336e61cb8342"}');
        $Mock->expectOnce("_postRelativeURL", array("", $data_json, 'POST'));

        $result = $Mock->createDoc($data);
        print "Result is $result\n";
        // Assert seems to use == instead of ===, so using
        // assertTrue instead
        //$this->assertEqual($result, "abc");
        $this->assertTrue($result === "abc", "createDoc did not return new document id");
    }
    function testReplaceDoc() {
        $data = array ('a' => 'b');
        $Mock = new MockCouchDBWrap();
        // Doc Doesn't exist
        $Mock->returns("_getRelativeURL", '{"error":"not_found","reason":"missing"}');
        $Mock->expectOnce("_postRelativeURL", array("abc", json_encode($data), 'PUT'));
        $Mock->replaceDoc("abc", $data);

        // Doc is already set
        $ExistsMock = new MockCouchDBWrap();
        $ExistsMock->returns("_getRelativeURL", '{"_id":"abc","_rev":"1-4b8a35d3f70a5962f86c6dd06ceb599c","a":"b"}');
        $val = $ExistsMock->replaceDoc("abc", $data);
        $this->assertEqual($val, 'unchanged');

        // Doc changed
        $ExistsMock = new MockCouchDBWrap();
        $ExistsMock->returns("_getRelativeURL", '{"_id":"abc","_rev":"1-4b8a35d3f70a5962f86c6dd06ceb599c","a":"c"}');
        $val = $ExistsMock->replaceDoc("abc", $data);
        $this->assertEqual($val, 'modified');
    }

    function testQueryView() {
        $Mock = new MockCouchDBWrap();
        $Mock->returns("_getRelativeURL", '{"error":"not_found","reason":"missing"}');

        $this->assertEqual($Mock->QueryView('test', 'test', array()), array());

        $Mock = new MockCouchDBWrap();
        $Mock->returns("_getRelativeURL", '{"total_rows":3,"offset":343,"rows":[ {"id":"Demographics_Session_PHI0000_V06","key":["demographics","Site","PHI"],"value":["PHI0000","V06"]}, {"id":"Demographics_Session_PHI0000_V12","key":["demographics","Site","PHI"],"value":["PHI0000","V12"]}, {"id":"Demographics_Session_PHI0000_V36","key":["demographics","Site","PHI"],"value":["PHI0000","V36"]}]}');
        $this->assertEqual($Mock->QueryView('test','test', array('startkey' => 'hello', 'endkey' => 'goodbye')), array(
            0 => array('id' => 'Demographics_Session_PHI0000_V06',
                       'key' => array('demographics', 'Site', 'PHI'),
                       'value' => array('PHI0000', 'V06')
                    ),
            1 => array('id' => 'Demographics_Session_PHI0000_V12',
                       'key' => array('demographics', 'Site', 'PHI'),
                       'value' => array('PHI0000', 'V12')
                    ),
            2 => array('id' => 'Demographics_Session_PHI0000_V36',
                       'key' => array('demographics', 'Site', 'PHI'),
                       'value' => array('PHI0000', 'V36')
                    )
        ));
    }
}
?>
