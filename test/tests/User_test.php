<?php
require_once __DIR__ . '/../test_includes.php';
require_once 'simpletest/autorun.php';
require_once 'NDB_Factory.class.inc';

Mock::generate('SocketWrapper');

class TestOfUser extends UnitTestCase {
    function setUp() {
        $this->Factory = NDB_Factory::singleton();
        $this->Factory->setTesting(true);
    }
    function tearDown() {
        $this->Factory->reset();
    }

    function testCreateCouchUser() {
        Mock::generatePartial('User', 'MockUserUsername', array('getUsername'));
        $user = new MockUserUsername();
        $user->returns('getUsername', 'TestUser');
        $this->Factory->setUser($user);
        $couchdb = $this->Factory->CouchDB();
        $smock = new MockSocketWrapper();
        $couchdb->SocketHandler = $smock;

        $config = $this->Factory->Config();
        $config->returns(
            'getSetting',
            array(
                'SyncAccounts' => 'true',
                'admin' => 'adminuser',
                'adminpass' => 'adminpass'
            ),
            array('CouchDB')
        );

        $config->expectOnce('getSetting');
        $smock->returns('eof', false);
        $smock->returnsAt(0, 'gets', "HTTP/1.0 201 Created\r\n");
        $smock->returnsAt(1, 'gets', "\r\n");
        $smock->returnsAt(2, 'gets', "I created a user\r\n");
        $smock->returnsAt(3, 'eof', true);

        $user->expectOnce('getUsername');

        $auth = array('Authorization' => 'Basic ' . base64_encode( 'adminuser:adminpass'));
        // First test when CouchDB user doesn't exist
        $couchdb->returns("_getURL", '{"error" : "not_found", "reason" : "deleted" }');
        $couchdb->expectOnce('_getURL', array('/_users/org.couchdb.user:TestUser', 'GET', $auth));
        $couchdb->expectOnce('_postURL', array('PUT /_users/org.couchdb.user:TestUser', 
            json_encode( array(
                '_id' => 'org.couchdb.user:TestUser',
                'type' => 'user',
                'name' => 'TestUser',
                'roles' => array('dqg'),
                'password' => 'password123'
            )),
            $auth
        ));

        $user->updateCouchUser('password123');
    }

    function testUpdateCouchDBUser() {
        Mock::generatePartial('User', 'MockUserUsername', array('getUsername'));
        $user = new MockUserUsername();
        $user->returns('getUsername', 'TestUser');
        $this->Factory->setUser($user);
        $couchdb = $this->Factory->CouchDB();
        $smock = new MockSocketWrapper();
        $couchdb->SocketHandler = $smock;

        $config = $this->Factory->Config();
        $config->returns(
            'getSetting',
            array(
                'SyncAccounts' => 'true',
                'admin' => 'adminuser',
                'adminpass' => 'adminpass'
            ),
            array('CouchDB')
        );

        $config->expectOnce('getSetting');
        $smock->returns('eof', false);
        $smock->returnsAt(0, 'gets', "HTTP/1.0 201 Created\r\n");
        $smock->returnsAt(1, 'gets', "\r\n");
        $smock->returnsAt(2, 'gets', "I created a user\r\n");
        $smock->returnsAt(3, 'eof', true);

        $user->expectOnce('getUsername');

        $auth = array('Authorization' => 'Basic ' . base64_encode( 'adminuser:adminpass'));
        // First test when CouchDB user doesn't exist
        $couchdb->returns("_getURL", '{"_id" : "org.couchdb.user:TestUser", "_rev" : "abc", "type" : "user", "name" : "TestUser", "roles":["dqg"], "password_sha":"abc123", "salt": "abc"}');
        $couchdb->expectOnce('_getURL', array('/_users/org.couchdb.user:TestUser', 'GET', $auth));
        $couchdb->expectOnce('_postURL', array('PUT /_users/org.couchdb.user:TestUser', 
            json_encode( array(
                '_id' => 'org.couchdb.user:TestUser',
                '_rev' => 'abc',
                'type' => 'user',
                'name' => 'TestUser',
                'roles' => array('dqg'),
                'password_sha' => 'abc123',
                'salt' => 'abc',
                'password' => 'password123'
            )),
            $auth
        ));

        $user->updateCouchUser('password123');
    }
}
