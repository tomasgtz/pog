<?php

class InventoryActions {

	public $SPREADSHEETID = '1o9sWYuYw0-4pSVlscCDw0Mj4Q1CHpSYlfzxia1WwoMU';
	public $sheetName = 'Hoja 1!';
	private $data;
	public $reservedItems;
	private $service;
	private $slots = [11=>'L',12=>'M',13=>'N',14=>'O',15=>'P',16=>'Q',17=>'R',18=>'S',19=>'T',20=>'U',21=>'V',22=>'W',23=>'X',24=>'Y',25=>'Z',26=>'AA',27=>'AB',28=>'AC',29=>'AD'];

	function getClient() {
		$client = new Google_Client();
		$client->setApplicationName('Google Sheets API PHP Quickstart');
		$client->setScopes(Google_Service_Sheets::SPREADSHEETS);
		$client->setAuthConfig('credentials2.json');
		$client->setAccessType('offline');
		$client->setPrompt('select_account consent');
		return $client;
	}

	function readSpreadSheet() {
/*
A 0 Código
B 1 Descripción Producto
C 2 Proveedor
D 3 Existencia Sistema
E 4 Existencia Físico Recibida
F 5 Ultimo Costo
G 6 Total Ult. Costo
H 7 Salidas
I 8 Entradas
J 9 Disponible
K 10 Ubicación
L 11 CRM
M 12 Cantidad
N 13 Fecha
O 14 CRM
P 15 Cantidad
Q 16 Fecha
R 17 CRM
S 18 Cantidad
T 19 Fecha
U 20 CRM
V 21 Cantidad
W 22 Fecha
X 23 CRM
Y 24 Cantidad
Z 25 Fecha
AA 26 CRM
AB 27 Cantidad
AC 28 Fecha
AD 29 CRM
AE 30 Cantidad
AF 31 Fecha */
		try
			{
				$client = $this->getClient();
				$this->service = new Google_Service_Sheets($client);

				$range = $this->sheetName.'A1:AF1200';
				$response = $this->service->spreadsheets_values->get($this->SPREADSHEETID, $range);
				$this->data = $response->getValues();

			}
		catch(Exception $e) {
			return false;
		}

		return true;

	}


	function writeDataSpreadSheet($values, $range) {
		
		try {

			$body = new Google_Service_Sheets_ValueRange([
							'values' => $values
						]);
			$params = [
				'valueInputOption' => 'USER_ENTERED'
			];
			$result = $this->service->spreadsheets_values->update($this->SPREADSHEETID, $range, $body, $params);

			return $result->getUpdatedCells();
		}	catch(Exception $e) {
			return false;
		}

	}


	function searchAndUpdateItems($items) {
		
		try {
			foreach($items as $id => $item) {
				$this->searchItem($item);		
			}

			return $this->reservedItems;
		}
		catch(Exception $e) {
			return false;
		}
	
	}


	function searchItem($item) {

		try {
			foreach($this->data as $id => $invItem ) {
				if($invItem[0] === $item['model']) {
				
					//echo "<br>Item found" . $item['model'] . " cantidad disponible = " . $invItem[9];
					$this->reserveItem($id, $item);

				}
			}
		} catch(Exception $e) {
			return false;
		}

	}
	

	function reserveItem($id, $item) {

		$invItem = $this->data[$id];
		$available_units = $invItem[9];
		$data_to_update = [];
		$reserved_qty = 0;

		if( $available_units > 0 ) {

			if( $available_units >= $item['quantity'] ) {
				$reserved_qty = $item['quantity'];
			} else {
				$reserved_qty = $available_units;
			}

			$slot = $this->checkAvailableSlot($invItem);

			if($slot !== false) {
				
				$values[0][0] = $item['oc'];
				$values[0][1] = $reserved_qty;
				$values[0][2] = date("Y-m-d");

				$range = $this->sheetName.$this->slots[$slot].($id+1).':'.$this->slots[$slot+2].($id+1);

				if($this->writeDataSpreadSheet($values, $range) !== false) {
					$this->reservedItems[] = ['model'=>$item['model'],'quantity'=>$reserved_qty];
				}
				
			}
			
		}
		
	}


	function checkAvailableSlot($invItem) {

		// check cols 11 14 17 20 23 26 29 to see which is free
		for($i = 11; $i < 29; $i = $i + 3) {
			
			if(!isset($invItem[$i]) || $invItem[$i] == '') {
				return $i;
			}
		}
		
		return false;
	}


	
}


?>