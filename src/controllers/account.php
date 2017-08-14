<?php
header('Content-type: application/json');

include './db.php';

class Account extends DBConnection {
    
    private $db = null;
    private $pstmt;
    private $listObjects = [];
    private $jsonObject = [
        "success" => false,
        "data" => []
    ];

    function __constructor($p) {

    }

    function getAccounts() {
        $response = $this->executeRequest('SELECT * FROM account');
        foreach ( $response as $row ) {
            array_push( $this->listObjects, array( "username" => $row['username']) );
        }

        $this->jsonObject['success'] = true;
        $this->jsonObject['data'] = $this->listObjects;

        echo json_encode( $this->jsonObject );

    }

    function getAccount($id) {
        $response = $this->executeRequest('SELECT * FROM account WHERE id=?');
        foreach ( $response as $row ) {
            array_push( $this->listObjects, array( "username" => $row['username']) );
        }

        $this->jsonObject['success'] = true;
        $this->jsonObject['data'] = $this->listObjects;

        echo json_encode( $this->jsonObject );

    }
}

?>