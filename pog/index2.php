<?php

class Record {

	var $id = 'asdasd';
	var $fecha = '2019-01-01 00:00:00';
	var $proveedor = 'Prov1, Prov2';
}

$record = new Record();

echo json_encode($record);

?>