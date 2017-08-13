<?php
// phpinfo();

class DBConnection {

    private $connectionParams = [
        'host' => 'localhost',
        'dbname' => 'crugedemo',
        'username' => 'root',
        'passwd' => '',
        'port' => 3306,
        'charset' => 'utf8',
        'options' => [PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
    ];

    private $dsn;
    private $pdo = null;

    private $pstmt;

    function __construct($args = null ) {
        $this->connectionParams['host'] = ( isset($args['host']) ) ? $args['host'] : $this->connectionParams['host'];
        $this->connectionParams['dbname'] = ( isset($args['dbname']) ) ? $args['dbname'] : $this->connectionParams['dbname'];
        $this->connectionParams['username'] = ( isset($args['username']) ) ? $args['username'] : $this->connectionParams['username'];
        $this->connectionParams['passwd'] = ( isset($args['passwd']) ) ? $args['passwd'] : $this->connectionParams['passwd'];

        try {

            $this->dsn = 'mysql:host='.
                    $this->connectionParams['host'].':'.$this->connectionParams['port'].
                    ';dbname='.$this->connectionParams['dbname'].
                    ';charset='.$this->connectionParams['charset'];

            $this->pdo = new PDO($this->dsn,
                $this->connectionParams['username'],
                $this->connectionParams['passwd'],
                $this->connectionParams['options']
            );

            print_r($args);

        }catch (PDOException $e){
            echo "Ha ocurrido una excepcion: " . $e->getMessage() . "<br/>";
            // die();
        }
        // return $this->pdo;
    }

    function executeRequest($query) {
        try{
//            $this->pstmt = $this->pdo->prepare($query, PDO::FETCH_ASSOC);
            return $this->pdo->query($query, PDO::FETCH_ASSOC);
//            return $this->pstmt->execute();
        }catch(PDOException $e){
            echo $e->getMessage() . "<b/r>";
            return null;
        }
    }



    function __destruct() {
//       echo "Destruyendo \n";
    }

}


?>