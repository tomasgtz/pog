<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, Content-Type, Authorization, X-Auth-Token, Cache-Control');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS');

ini_set('display_errors', 'on');
error_reporting(E_ALL);
date_default_timezone_set('America/Monterrey');

define( 'API_ACCESS_KEY', '' );
define( 'USER', 'compras' );
define( 'PASS', '' );
define( 'DSN', 'sqlsrv:server=CRM-SDI;Database=COMPRAS;' );

define( 'USER2', 'sa' );
define( 'PASS2', '' );
define( 'DSN2', 'sqlsrv:server=SERVER\alactech;Database=ad1609SDI;' );

define( 'USER3', 'sa' );
define( 'PASS3', '' );
define( 'DSN3', 'sqlsrv:server=SERVER\alactech;Database=adDESARROLLO;' );




//require_once dirname(__FILE__) . '/vendor/PHPExcel-1.8/Classes/PHPExcel.php';
require_once  './InventoryActions.class.php';
require_once  './SDIMail.class.php';

require 'vendor/autoload.php';
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

$configuration = [
    'settings' => [
        'displayErrorDetails' => true,
    ],
];
$c = new \Slim\Container($configuration);
$app = new \Slim\App($c);


$app->post(
		'/Authentication', function(Request $request, Response $response) {

			try
			{

				$data = $request->getParsedBody();
				$data = json_decode($data['json']);

				$received_data = [];
				$email = filter_var($data->username, FILTER_SANITIZE_STRING);

				$cn=new PDO(DSN, USER, PASS);
				$cn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 

				$stmt = $cn->prepare("EXEC [dbo].[UserAuthorize] :1, :2;");
				$return = '';
				$stmt->bindParam(':1', $email ); 
				$stmt->bindParam(':2', $return, PDO::PARAM_STR|PDO::PARAM_INPUT_OUTPUT, 4000); 
				$stmt->execute();

				$response->getBody()->write( json_encode($return) );
				$cn = null;
			}
			catch(PDOException $e) {
				$response->getBody()->write( json_encode(array('error'=>$e->getMessage())));
			}			
		}
);

$app->post(
		'/SignUp', function(Request $request, Response $response) {

			try
			{

				$data = $request->getParsedBody();

				$data = json_decode($data['json']);
		
				$received_data = [];
				$email = filter_var($data->username, FILTER_SANITIZE_STRING);

				$cn=new PDO(DSN, USER, PASS);
				$cn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 

				$stmt = $cn->prepare("SELECT id FROM [COMPRAS].[dbo].[Users] WHERE username='$email'");
				$return = '';
				$stmt->execute();
				$return = $stmt->fetchAll(PDO::FETCH_ASSOC);

				if(empty($return)) {
					$stmt = $cn->prepare("INSERT INTO [COMPRAS].[dbo].[Users] (username, allowed) VALUES (:1,0)");
					$stmt->bindParam(':1', $email ); 

					$return = '';
					$stmt->execute();
					$return = $cn->lastInsertId();

					if(!empty($return) && $return > 0 ) {
						$response->getBody()->write( json_encode("ok") );
					}
				} else {
					$response->getBody()->write( json_encode("ok") );
				}
				$cn = null;
			}
			catch(PDOException $e) {
				$response->getBody()->write( json_encode(array('error'=>$e->getMessage())));
			}			
		}
);

$app->get(
		'/users', function(Request $request, Response $response) {
			
			try
			{
//				$data = $request->getParsedBody();
//				$data = json_decode($data['json']);

				$received_data = [];
								
				$cn=new PDO(DSN, USER, PASS);
				$cn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 

				$stmt = $cn->prepare("SELECT id, username, allowed FROM [COMPRAS].[dbo].[Users] ");
				$return = '';
				$stmt->execute();
				$return = $stmt->fetchAll(PDO::FETCH_ASSOC);
				$cn = null;
				
				$response->getBody()->write( json_encode($return) );
				
			}
			catch(PDOException $e) {
				$response->getBody()->write( json_encode(array('error'=>$e->getMessage())));
			}			
		}
);


$app->put(
		'/saveUsers', function(Request $request, Response $response) {
			
			try
			{

				$cn=new PDO(DSN, USER, PASS);
				$cn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 
				
				$data = json_decode($request->getBody(),true);
				$users = $data['users'];
				
				if(is_array($users) && count($users) > 0) {
					foreach($users as $id => $user) {
					
						$stmt = $cn->prepare("UPDATE [COMPRAS].[dbo].[Users] SET allowed = :1 WHERE id = :2");
						$stmt->bindParam(':1', $user['allowed'] ); 
						$stmt->bindParam(':2', $user['id'] ); 

						$return = '';
						$stmt->execute();
					
					}
				
				}
							
				$stmt = $cn->prepare("SELECT id, username, allowed FROM [COMPRAS].[dbo].[Users] ");
				$return = '';
				$stmt->execute();
				$return = $stmt->fetchAll(PDO::FETCH_ASSOC);
				$cn = null;
				$response->getBody()->write( json_encode($return) );
				
			}
			catch(PDOException $e) {
				$response->getBody()->write( json_encode(array('error'=>$e->getMessage())));
			}			
		}
);




$app->get(
		'/providers', function(Request $request, Response $response) {
			
			try
			{
				$data = $request->getParsedBody();
				$data = json_decode($data['json']);

				$received_data = [];
				//$email = filter_var($data->username, FILTER_SANITIZE_STRING);
				
				$cn=new PDO(DSN2, USER2, PASS2);
				$cn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 

				$stmt = $cn->prepare("SELECT CIDCLIENTEPROVEEDOR as contpaqId, CRAZONSOCIAL as name FROM [ad1609SDI].[dbo].[admClientes] 
				WHERE CTIPOCLIENTE=3 AND CESTATUS=1");
				$return = '';
				$stmt->execute();
				$return = $stmt->fetchAll(PDO::FETCH_ASSOC);
				$cn = null;
				$response->getBody()->write( json_encode($return) );

			}
			catch(PDOException $e) {
				$response->getBody()->write( json_encode(array('error'=>$e->getMessage())));
			}			
		}
);

$app->put(
		'/savePO', function(Request $request, Response $response) {
			
			try
			{
				
				$data = json_decode($request->getBody(),true);
//				$data = json_decode($data);
				//var_dump($data);die;
				$create_date = new DateTime($data['created_date']);
			
				$cn=new PDO(DSN, USER, PASS);
				$cn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 

				if($data['id'] == '') {

					$q = "INSERT INTO [COMPRAS].[dbo].[PurchaseOrders] 
					(CIDDOCUMENTODE,CIDCONCEPTODOCUMENTO,CFOLIO,CFECHA,CIDCLIENTEPROVEEDOR,CRAZONSOCIAL,CIDMONEDA,
					COBSERVACIONES,CNETO,CTOTALUNIDADES,CTEXTOEXTRA2,CIMPORTEEXTRA2,CUSUARIO,status,PROYECTO) 
					VALUES (17,19,0,'".$create_date->format('Y-m-d')."',".$data['provider'].",'',".(int)$data['currencyId'].",'" . $data['comments']."',".(float)$data['subtotal'].",0,'',0,'".$data['creator']."','draft','".$data['project']."')";

					$stmt = $cn->prepare($q);			

					$return = '';
					$stmt->execute();
					$return = $cn->lastInsertId();
	
				} else {
					
					$stmt = $cn->prepare("UPDATE [COMPRAS].[dbo].[PurchaseOrders] 
					SET CNETO = :4, CIDCLIENTEPROVEEDOR = :5, CIDMONEDA = :7,
					COBSERVACIONES = :8, CUSUARIO = :11, PROYECTO = :12 WHERE CIDDOCUMENTO = :13");
					
					$subtotal = $data['subtotal'];
					$stmt->bindParam(':4', $subtotal );
					$stmt->bindParam(':5', $data['provider'] );
					$stmt->bindParam(':7', $data['currencyId'] );
					$stmt->bindParam(':8', $data['comments'] );
					$stmt->bindParam(':11', $data['creator'] );
					$stmt->bindParam(':12', $data['project'] );
					$stmt->bindParam(':13', $data['id'] );
		
					$return = '';
					$stmt->execute();
					$return = $data['id'];
				}

				// delete all items
				$stmt = $cn->prepare("DELETE FROM [COMPRAS].[dbo].[PurchaseOrdersDetails] 
				WHERE CIDDOCUMENTO = :1");
				$stmt->bindParam(':1', $return );
				$stmt->execute();
				
				// insert all items
				$i = 0;
				if($data['lineItems'] != null && is_array($data['lineItems']) && count($data['lineItems']) > 0) {
					foreach($data['lineItems'] as $id => $item) {

						if($item['quantity'] == 0) {
							continue;
						}
						++$i;

						$stmt = $cn->prepare("INSERT INTO [COMPRAS].[dbo].[PurchaseOrdersDetails] 
							(CIDDOCUMENTO, CIDDOCUMENTODE, CNUMEROMOVIMIENTO, PRODUCTO, CDESCRIPTION, CUNIDADES, CPRECIO, CNETO, CTOTAL, 
							COBSERVAMOV, CFECHA, STATUS, CRMS) 
							VALUES (:21,:22,:23,:24,:25,:26,:27,:28,:29,:30,:31,:32,:33)");
						$stmt->bindParam(':21', $return );
						$a = 0;
						$stmt->bindParam(':22', $a );

						$stmt->bindParam(':23', $i );
						$stmt->bindParam(':24', $item['model'] );
						$stmt->bindParam(':25', $item['description'] );
						$stmt->bindParam(':26', $item['quantity'] );
						$stmt->bindParam(':27', $item['cost'] );
						$cneto = $item['cost'] * $item['quantity'];
						$stmt->bindParam(':28', $cneto);
						$ctotal = $item['cost'] * $item['quantity'];
						$stmt->bindParam(':29', $ctotal);
						$stmt->bindParam(':30', $item['comments'] );
						$c = $create_date->format('Y-m-d');
						$stmt->bindParam(':31', $c );
						$a = 1;
						$stmt->bindParam(':32', $a );

						$stmt->bindParam(':33',$item['oc'] );
						$stmt->execute();
					}
				}
					
				$cn = null;
				$response->getBody()->write( json_encode($return) );

			}
			catch(PDOException $e) {
				echo $e->getMessage();die;
				$response->getBody()->write( json_encode(array('error'=>$e->getMessage())));
			}			
		}
);

$app->get(
		'/po_drafts', function(Request $request, Response $response) {
			
			try
			{
				$data = $request->getParsedBody();
				$data = json_decode($data['json']);

				$received_data = [];
				//$email = filter_var($data->username, FILTER_SANITIZE_STRING);
				
				$cn=new PDO(DSN, USER, PASS);
				$cn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 

				$stmt = $cn->prepare("SELECT CIDDOCUMENTO as id, CFOLIO as folio, CONCAT(CONVERT(VARCHAR(10), CFECHA, 120),'T00:00:00.000Z') as created_date, 
				CIDCLIENTEPROVEEDOR as provider, CRAZONSOCIAL as provider_name, CIDMONEDA as currencyId, 
				COBSERVACIONES as comments, CNETO as subtotal, CTOTALUNIDADES, CTEXTOEXTRA2, CIMPORTEEXTRA2, 
				CUSUARIO as creator, PROYECTO as project, status FROM [COMPRAS].[dbo].[PurchaseOrders] 
				WHERE status='draft' ORDER BY id");
				$return = '';
				$stmt->execute();
				$return = $stmt->fetchAll(PDO::FETCH_ASSOC);

				if($return != null && is_array($return) && count($return) > 0) { 
					foreach($return as $i => &$draft) {
						$stmt = $cn->prepare("SELECT CNUMEROMOVIMIENTO, PRODUCTO as model, CDESCRIPTION as description, CUNIDADES as quantity, CPRECIO as cost, CPRECIO * CUNIDADES as subtotal, COBSERVAMOV as comments, CFECHA, STATUS as status, CRMs as oc FROM [COMPRAS].[dbo].[PurchaseOrdersDetails] 
						WHERE CIDDOCUMENTO=:1 ORDER BY CNUMEROMOVIMIENTO");
						$stmt->bindParam(':1', $draft['id']);
						$stmt->execute();
						$return2 = $stmt->fetchAll(PDO::FETCH_ASSOC);
						$draft['lineItems'] = $return2;
						
					}
				}
				$cn = null;
				$response->getBody()->write( json_encode($return) );

			}
			catch(PDOException $e) {
				$response->getBody()->write( json_encode(array('error'=>$e->getMessage())));
			}			
		}
);

$app->get(
		'/po_processed', function(Request $request, Response $response) {
			
			try
			{
				$data = $request->getParsedBody();
				$data = json_decode($data['json']);

				$received_data = [];
				//$email = filter_var($data->username, FILTER_SANITIZE_STRING);
				
				$cn=new PDO(DSN, USER, PASS);
				$cn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 

				$stmt = $cn->prepare("SELECT CIDDOCUMENTO as id, CFOLIO as folio, CFECHA as created_date, 
				CIDCLIENTEPROVEEDOR as provider, CRAZONSOCIAL as provider_name, CIDMONEDA as currencyId, 
				COBSERVACIONES as comments, CNETO as subtotal, CTOTALUNIDADES, CTEXTOEXTRA2, CIMPORTEEXTRA2, 
				CUSUARIO as creator, PROYECTO as project, status FROM [COMPRAS].[dbo].[PurchaseOrders] 
				WHERE status='sent' AND CFECHA >= getdate() - 7 ORDER BY created_date DESC");
				$return = '';
				$stmt->execute();
				$return = $stmt->fetchAll(PDO::FETCH_ASSOC);

				if($return != null && is_array($return) && count($return) > 0) { 
					foreach($return as $i => &$draft) {
						$stmt = $cn->prepare("SELECT CNUMEROMOVIMIENTO, PRODUCTO as model, CDESCRIPTION as description, CUNIDADES as quantity, CPRECIO as cost, COBSERVAMOV as comments, CFECHA, STATUS as status, CRMs as oc FROM [COMPRAS].[dbo].[PurchaseOrdersDetails] 
						WHERE CIDDOCUMENTO=:1 ORDER BY CNUMEROMOVIMIENTO");
						$stmt->bindParam(':1', $draft['id']);
						$stmt->execute();
						$return2 = $stmt->fetchAll(PDO::FETCH_ASSOC);
						$draft['lineItems'] = $return2;
						
					}
				}
				$cn = null;
				$response->getBody()->write( json_encode($return) );

			}
			catch(PDOException $e) {
				$response->getBody()->write( json_encode(array('error'=>$e->getMessage())));
			}			
		}
);

$app->get(
		'/checkProductsInContpaq', function(Request $request, Response $response) {
			
			try
			{
				$MissingProducts = [];
				/*$data = $request->getParsedBody();
				$data = json_decode($data['json']);

				$received_data = [];*/
				//$email = filter_var($data->username, FILTER_SANITIZE_STRING);
				
				$cn=new PDO(DSN, USER, PASS);
				$cn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 

				$stmt = $cn->prepare("SELECT DISTINCT PRODUCTO FROM [COMPRAS].[dbo].[PurchaseOrdersDetails] WHERE INCONTPAQ = 0 ");
				$return = '';
				$stmt->execute();
				$return = $stmt->fetchAll(PDO::FETCH_ASSOC);

				if($return != null && is_array($return) && count($return) > 0) { 

					$cn1=new PDO(DSN2, USER2, PASS2);
					$cn1->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 

					foreach($return as $i => $prod) {

						$return2 = '';
						$stmt = $cn1->prepare("SELECT CCODIGOPRODUCTO FROM [ad1609SDI].[dbo].[admProductos] WHERE CSTATUSPRODUCTO = 1 AND CCODIGOPRODUCTO = :1 ");
						$stmt->bindParam(':1', $prod['PRODUCTO']);
						$stmt->execute();
						$return2 = $stmt->fetchAll(PDO::FETCH_ASSOC);
						
						if($return2 != null && is_array($return2) && count($return2) > 0) { 
						
							$stmt = $cn->prepare("UPDATE [COMPRAS].[dbo].[PurchaseOrdersDetails] SET INCONTPAQ = 1 WHERE PRODUCTO = :1 ");
							$stmt->bindParam(':1', $return2[0]['CCODIGOPRODUCTO']);
							$stmt->execute();
						} else {
							$MissingProducts[] = $prod['PRODUCTO'];
						}
					}
				}

				//var_dump($MissingProducts);
				$cn = null;
				$mail = new SDIMail(); 
				$mail->sendEmailWithMissingProducts( $MissingProducts );

				if(count($MissingProducts) > 0) { 
					$response->getBody()->write( json_encode("Missing products were notified by email") );
				} else {
					$response->getBody()->write( json_encode("All products exist in CONTPAQ") );
				}
			}
			catch(Exception $e) {
				$response->getBody()->write( json_encode(array('error'=>$e->getMessage())));
			}			
		}
);

$app->post(
		'/saveExcel', function(Request $request, Response $response) {

			try
			{

				$data = $request->getParsedBody();
//				var_dump($data);
				
				$inv = new InventoryActions();
				
				$values = $inv->readSpreadSheet();

				if ($values !== true) {
					throw new Exception("No inventory data found.");
				} 

				$reservedItems = $inv->searchAndUpdateItems($data);

				$mail = new SDIMail(); 
				$mail->sendEmail( $reservedItems );
				
				if(isset($reservedItems) && is_array($reservedItems) && count($reservedItems) > 0 ) {
					$response->getBody()->write( json_encode(array('items'=>$reservedItems)));
				} else {
					$response->getBody()->write( json_encode("no items"));
				}

			} catch(Exception $e) {
				$response->getBody()->write( json_encode(array('error'=>$e->getMessage())));
			}

		}
);


$app->get(
		'/sendToContpaq', function(Request $request, Response $response) {
		
		//$db = "adDESARROLLO";
		$db = "ad1609SDI";
		try {
			$data = $request->getQueryParams();
			
			if(!isset($data['id']) || empty($data['id'])) {
				throw new Exception("no id");
			}

			$id = $data['id'];
			
			$cn=new PDO(DSN, USER, PASS);
			$cn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 
			$cn->beginTransaction();
			
			$q = "SELECT [CIDDOCUMENTO],[CIDDOCUMENTODE],[CIDCONCEPTODOCUMENTO],[CFOLIO],[CFECHA],[CIDCLIENTEPROVEEDOR],[CRAZONSOCIAL],[CIDMONEDA],[COBSERVACIONES],[CNETO],[CTOTALUNIDADES],[CTEXTOEXTRA2],[CIMPORTEEXTRA2],[CUSUARIO],[status],[PROYECTO] FROM [COMPRAS].[dbo].[PurchaseOrders] WHERE CIDDOCUMENTO = $id";
			
			$stmt = $cn->prepare($q);
			$stmt->execute();
			$return = $stmt->fetchAll(PDO::FETCH_ASSOC);

			if($return == null || !is_array($return) || count($return) <= 0) {
				throw new Exception("no po found");
			}

			$PO = $return[0];


			$q = "SELECT [CIDMOVIMIENTO],[CIDDOCUMENTO],[CNUMEROMOVIMIENTO][CIDDOCUMENTODE],[PRODUCTO],[CDESCRIPTION],[CUNIDADES],[CPRECIO],[CNETO],[CTOTAL],[COBSERVAMOV],[CFECHA],[STATUS],[INCONTPAQ],[CRMS]  FROM [COMPRAS].[dbo].[PurchaseOrdersDetails ]WHERE CIDDOCUMENTO = $id";
			$stmt = $cn->prepare($q);
			$stmt->execute();
			$POD = $stmt->fetchAll(PDO::FETCH_ASSOC);
			
			if($POD == null || !is_array($POD) || count($POD) <= 0) {
				throw new Exception("PO with no items");
			}

			$cn1=new PDO(DSN3, USER3, PASS3);
			$cn1->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 

			$cn1->beginTransaction();
			$q = "UPDATE [$db].[dbo].[admConceptos] SET CNOFOLIO = CNOFOLIO + 1.0 WHERE CIDCONCEPTODOCUMENTO = 19";
			$stmt = $cn1->prepare($q);
			$stmt->execute();

			$q = "SELECT CNOFOLIO FROM [$db].[dbo].[admConceptos] WHERE CIDCONCEPTODOCUMENTO = 19";
			$stmt = $cn1->prepare($q);
			$return = '';
			$stmt->execute();
			$return = $stmt->fetchAll(PDO::FETCH_ASSOC);
			
			if($return == null || !is_array($return) || count($return) <= 0) {
				$cn1->rollBack();
				throw new Exception("Error adding folio number");
			}

			$folio = (int)$return[0]['CNOFOLIO'];

			$q = "SELECT * FROM [$db].[dbo].[admClientes] WHERE CIDCLIENTEPROVEEDOR = " . $PO['CIDCLIENTEPROVEEDOR'];

			$stmt = $cn1->prepare($q);
			$return = '';
			$stmt->execute();
			$return = $stmt->fetchAll(PDO::FETCH_ASSOC);
			if($return == null || !is_array($return) || count($return) <= 0) {
				
				throw new Exception("Error no provider found");
			}

			$provider = $return[0];

			$q = "SELECT MAX([CIDDOCUMENTO]) + 1 as sig FROM [$db].[dbo].[admDocumentos]";

			$stmt = $cn1->prepare($q);
			$return = '';
			$stmt->execute();
			$return = $stmt->fetchAll(PDO::FETCH_ASSOC);
			
			if($return == null || !is_array($return) || count($return) <= 0) {
				
				throw new Exception("Error no next ID found");
			}

			$CIDDOCUMENTO = $return[0]['sig'];

			$folio_crm = calculateCRMFolio($PO['COBSERVACIONES']);

			$q = "INSERT INTO [$db].[dbo].[admDocumentos] (
			CIDDOCUMENTO, CIDDOCUMENTODE, CIDCONCEPTODOCUMENTO, CSERIEDOCUMENTO, CFOLIO, CFECHA, CIDCLIENTEPROVEEDOR, CRAZONSOCIAL, CRFC, CIDAGENTE, CFECHAVENCIMIENTO, 
			CFECHAENTREGARECEPCION, CFECHAPRONTOPAGO, CFECHAULTIMOINTERES, CIDMONEDA, CTIPOCAMBIO, CREFERENCIA, COBSERVACIONES, CNATURALEZA, CIDDOCUMENTOORIGEN, CPLANTILLA, CUSACLIENTE, 
			CUSAPROVEEDOR, CAFECTADO, CIMPRESO, CCANCELADO, CDEVUELTO, CIDPREPOLIZA, CIDPREPOLIZACANCELACION, CESTADOCONTABLE, CNETO, CIMPUESTO1, CIMPUESTO2, CIMPUESTO3, CRETENCION1, 
			CRETENCION2, CDESCUENTOMOV, CDESCUENTODOC1, CDESCUENTODOC2, CGASTO1, CGASTO2, CGASTO3, CTOTAL, CPENDIENTE, CTOTALUNIDADES, CDESCUENTOPRONTOPAGO, CPORCENTAJEIMPUESTO1, 
			CPORCENTAJEIMPUESTO2, CPORCENTAJEIMPUESTO3, CPORCENTAJERETENCION1, CPORCENTAJERETENCION2, CPORCENTAJEINTERES, CTEXTOEXTRA1, CTEXTOEXTRA2, CTEXTOEXTRA3, CFECHAEXTRA, 
			CIMPORTEEXTRA1, CIMPORTEEXTRA2, CIMPORTEEXTRA3, CIMPORTEEXTRA4, CDESTINATARIO, CNUMEROGUIA, CMENSAJERIA, CCUENTAMENSAJERIA, CNUMEROCAJAS, CPESO, CBANOBSERVACIONES, 
			CBANDATOSENVIO, CBANCONDICIONESCREDITO, CBANGASTOS, CUNIDADESPENDIENTES, CTIMESTAMP, CIMPCHEQPAQ, CSISTORIG, CIDMONEDCA, CTIPOCAMCA, CESCFD, CTIENECFD, CLUGAREXPE, 
			CMETODOPAG, CNUMPARCIA, CCANTPARCI, CCONDIPAGO, CNUMCTAPAG, CGUIDDOCUMENTO, CUSUARIO, CIDPROYECTO, CIDCUENTA, CTRANSACTIONID ) 
			VALUES ( 
			$CIDDOCUMENTO, 
			17, 
			19, 
			'OC', 
			$folio, 
			'" . $PO['CFECHA'] . "', 
			" . $PO['CIDCLIENTEPROVEEDOR'] . ", 
			'" . $provider['CRAZONSOCIAL'] . "', 
			'" . $provider['CRFC'] . "', 
			0, 
			(SELECT CONVERT(Datetime, '".$PO['CFECHA']."', 120) + ".$provider['CDIASCREDITOCLIENTE']." ), 
			(SELECT CONVERT(Datetime, '".$PO['CFECHA']."', 120) + ".$provider['CDIASEMBARQUEPROVEEDOR']." ), 
			(SELECT CONVERT(Datetime, '".$PO['CFECHA']."', 120) + ".$provider['CDIASEMBARQUEPROVEEDOR']." ), 
			(SELECT CONVERT(Datetime, '".$PO['CFECHA']."', 120) + ".$provider['CDIASCREDITOCLIENTE']." ), 
			" . $PO['CIDMONEDA'] . ", 
			(SELECT ISNULL((SELECT CIMPORTE FROM [$db].[dbo].[admTiposCambio] WHERE CFECHA = '".$PO['CFECHA']."' AND CIDMONEDA = " . $PO['CIDMONEDA'] . "),0)), 
			'', 
			'". $PO['COBSERVACIONES']."', 
			2, 
			0, 
			0, 
			0, 
			1, 
			1, 
			0, 
			0, 
			0, 
			0, 0, 1, ". $PO['CNETO'] . ", ". ($PO['CNETO'] * ($provider['CIMPUESTOPROVEEDOR1'] / 100)). ", ". $PO['CNETO'] * ($provider['CIMPUESTOPROVEEDOR2'] / 100). ", 
			". $PO['CNETO'] * ($provider['CIMPUESTOPROVEEDOR3'] / 100). ", ". $PO['CNETO'] * ($provider['CRETENCIONPROVEEDOR1'] / 100). ", 
			". $PO['CNETO'] * ($provider['CRETENCIONPROVEEDOR2'] / 100). ", 0, 0, 0, 0, 0, 0, 
			". ($PO['CNETO'] + ($PO['CNETO'] * ($provider['CIMPUESTOPROVEEDOR1'] / 100)) + ($PO['CNETO'] * ($provider['CIMPUESTOPROVEEDOR2'] / 100)) + ($PO['CNETO'] * ($provider['CIMPUESTOPROVEEDOR3'] / 100)) - ($PO['CNETO'] * ($provider['CRETENCIONPROVEEDOR1'] / 100)) - ($PO['CNETO'] * ($provider['CRETENCIONPROVEEDOR2'] / 100))).",  ". ($PO['CNETO'] + ($PO['CNETO'] * ($provider['CIMPUESTOPROVEEDOR1'] / 100)) + ($PO['CNETO'] * ($provider['CIMPUESTOPROVEEDOR2'] / 100)) + ($PO['CNETO'] * ($provider['CIMPUESTOPROVEEDOR3'] / 100)) - ($PO['CNETO'] * ($provider['CRETENCIONPROVEEDOR1'] / 100)) - ($PO['CNETO'] * ($provider['CRETENCIONPROVEEDOR2'] / 100))).", 
			". $PO['CTOTALUNIDADES'] . ", ". ($PO['CNETO'] * ($provider['CDESCUENTOPRONTOPAGO'] / 100)) .", 0, 0, 0, 0, 0, ". ($PO['CNETO'] * ($provider['CINTERESMORATORIO'] / 100)) .", 
			'', '". $PO['CUSUARIO'] . "', '', '1899-12-30', 0, ".$folio_crm.", 0, 0, '', '', '', '', 0, 0, 0, 0, 0, 0, ". $PO['CTOTALUNIDADES'] . ", getdate(), 
			0, 205, 0, 0, 0, 0, '', '', 0, 0, '', '', (select newid()), 'COMPRAS', 
			(SELECT isnull((SELECT [CIDPROYECTO] FROM [$db].[dbo].[admProyectos] WHERE [CCODIGOPROYECTO] = '" . $PO['PROYECTO']. "'),0)), 0, '' )";
//echo $q;die;
			$stmt = $cn1->prepare($q);
			$stmt->execute();

			$no_mov = 1;
			foreach($POD as $idx => $item) {

				$q = "SELECT TOP 1 CIDPRODUCTO FROM [$db].[dbo].[admProductos] WHERE [CCODIGOPRODUCTO] = '" . $item['PRODUCTO'] . "'";

				$stmt = $cn1->prepare($q);
				$return = '';
				$stmt->execute();
				$return = $stmt->fetchAll(PDO::FETCH_ASSOC);		

				if($return == null || !is_array($return) || count($return) <= 0) {					
					throw new Exception("Error no product found " . $item['PRODUCTO']);
				}

				$product = $return[0];

				$row_neto	= $item['CUNIDADES'] * $item['CPRECIO'];
				$row_taxes1 = $row_neto * $provider['CIMPUESTOPROVEEDOR1'] / 100;
				$row_taxes2 = $row_neto * $provider['CIMPUESTOPROVEEDOR2'] / 100;
				$row_taxes3 = $row_neto * $provider['CIMPUESTOPROVEEDOR3'] / 100;
				$row_ret1	= $row_neto * $provider['CRETENCIONPROVEEDOR1'] / 100;
				$row_ret2	= $row_neto * $provider['CRETENCIONPROVEEDOR2'] / 100;
				$row_total	= $row_neto - $row_taxes1 - $row_taxes2 - $row_taxes3 + $row_ret1 + $row_ret2;

				$q = "INSERT INTO [$db].[dbo].[admMovimientos] (CIDMOVIMIENTO,CIDDOCUMENTO,CNUMEROMOVIMIENTO,CIDDOCUMENTODE,CIDPRODUCTO,CIDALMACEN,CUNIDADES,CUNIDADESNC,CUNIDADESCAPTURADAS,CIDUNIDAD,CIDUNIDADNC,CPRECIO,CPRECIOCAPTURADO,CCOSTOCAPTURADO,CCOSTOESPECIFICO,CNETO,CIMPUESTO1,CPORCENTAJEIMPUESTO1,CIMPUESTO2,CPORCENTAJEIMPUESTO2,CIMPUESTO3,CPORCENTAJEIMPUESTO3,CRETENCION1,CPORCENTAJERETENCION1,CRETENCION2,CPORCENTAJERETENCION2,CTOTAL,CPORCENTAJECOMISION,CREFERENCIA,COBSERVAMOV,CAFECTAEXISTENCIA,CAFECTADOSALDOS,CAFECTADOINVENTARIO,CFECHA,CMOVTOOCULTO,CIDMOVTOOWNER,CIDMOVTOORIGEN,CUNIDADESPENDIENTES,CUNIDADESNCPENDIENTES,CUNIDADESORIGEN,CUNIDADESNCORIGEN,CTIPOTRASPASO,CIDVALORCLASIFICACION,CTEXTOEXTRA1,CTEXTOEXTRA2,CTEXTOEXTRA3,CFECHAEXTRA,
				CIMPORTEEXTRA1,CIMPORTEEXTRA2,CIMPORTEEXTRA3,CIMPORTEEXTRA4,CTIMESTAMP,CGTOMOVTO,CSCMOVTO,CCOMVENTA,CIDMOVTODESTINO,CNUMEROCONSOLIDACIONES) 
				VALUES ((SELECT MAX(CIDMOVIMIENTO) + 1 FROM [$db].[dbo].[admMovimientos]),$CIDDOCUMENTO,$no_mov,17," . $product['CIDPRODUCTO']. ",1,".$item['CUNIDADES'].",0,".$item['CUNIDADES'].",1,0,".$item['CPRECIO'].",".$item['CPRECIO'].",0,0," . round($row_neto,2) . "," . round($row_taxes1, 2) . "," . $provider['CIMPUESTOPROVEEDOR1'] . "," . round($row_taxes2, 2) . "," . $provider['CIMPUESTOPROVEEDOR2'] . "," . round($row_taxes3, 2) . "," . $provider['CIMPUESTOPROVEEDOR3'] . "," . round($row_ret1, 2) . "," . $provider['CRETENCIONPROVEEDOR1'] . "," . round($row_ret2, 2) . "," . $provider['CRETENCIONPROVEEDOR2'] . "," . round($row_total , 2) . ",0,'','".$item['COBSERVAMOV']."',3,1,0,'".$item['CFECHA']."',0,0,0,'".$item['CUNIDADES']."',0,0,0,1,0,'','','','1899-12-30 00:00:00.000',0,0,0,0,'',0,'',0,0,0)";
				$no_mov++;

				$stmt = $cn1->prepare($q);
				$stmt->execute();
			
			}

			// get total of units
			$q = "SELECT SUM(CUNIDADES) as units FROM [$db].[dbo].[admMovimientos] WHERE CIDDOCUMENTO = $CIDDOCUMENTO";
			$stmt = $cn1->prepare($q);
			$stmt->execute();
			$return = $stmt->fetchAll(PDO::FETCH_ASSOC);
		
			// update sales order in contpaq with the total of units
			$q = "UPDATE [$db].[dbo].[admDocumentos] SET CTOTALUNIDADES = ".(int)$return[0]['units'].", CUNIDADESPENDIENTES = ".(int)$return[0]['units']." WHERE CIDDOCUMENTO = $CIDDOCUMENTO";
			$stmt = $cn1->prepare($q);
			$stmt->execute();
			
			// update in POG the order as sent and save the folio just created in contpaq
			$q = "UPDATE [COMPRAS].[dbo].[PurchaseOrders] SET [status] = 'sent', CFOLIO = $folio WHERE CIDDOCUMENTO = $id";
			$stmt = $cn->prepare($q);
			$stmt->execute();

			
			$response->getBody()->write( json_encode(array( 'id' => $folio )));
		
		} catch(Exception $e) {

			if(isset( $cn1) && $cn1->inTransaction()) {
				$cn1->rollBack();
			}

			if(isset( $cn) && $cn->inTransaction()) {
				$cn->rollBack();
			}
			
			$response->getBody()->write( json_encode(array('error'=>$e->getMessage())));
			return;
		}

		$cn1->commit();
		$cn->commit();
		
		$cn = null;
		$cn1 = null;
	}

	
);

$app->get(
		'/delete_po', function(Request $request, Response $response) {
			
			try
			{
				$data = $request->getQueryParams();
			
				if(!isset($data['id']) || empty($data['id'])) {
					throw new Exception("no id");
				}

				$id = $data['id'];
				
				$cn=new PDO(DSN, USER, PASS);
				$cn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 
				$q = "DELETE FROM [COMPRAS].[dbo].[PurchaseOrdersDetails] WHERE [CIDDOCUMENTO] = $id";
				$stmt = $cn->prepare($q);
				$stmt->execute();

				$q = "DELETE FROM [COMPRAS].[dbo].[PurchaseOrders] WHERE [CIDDOCUMENTO] = $id";
				
				$stmt = $cn->prepare($q);
				$stmt->execute();

				$return = ['success' => 'ok'];
				$cn = null;
			
				$response->getBody()->write( json_encode($return) );

			}
			catch(Exception $e) {
								
				$response->getBody()->write( json_encode(array('error'=>$e->getMessage())));
				return;
			}			
		}
);


$app->post(
		'/check_crm', function(Request $request, Response $response) {
			
			try
			{
				$data = $request->getParsedBody();

				$products = json_decode($data['products']);

				if(!isset($data['folio']) || empty($data['folio'])) {
					throw new Exception("no folio to check");
				}
	
				if(!isset($products) || empty($products) || !is_array($products) || count($products) == 0) {
					throw new Exception("no products to check");
				}

				$folio = $data['folio'];
				$count_prod = count($products);
				$products = "'".implode("','", $products) . "'";
				
				$cn=new PDO(DSN, USER, PASS);
				$cn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 
				$q = "SELECT COUNT(PRODUCTO) as total_prod_found FROM [COMPRAS].[dbo].[PurchaseOrdersDetails] WHERE [CIDDOCUMENTO] IN (
						SELECT CIDDOCUMENTO FROM [COMPRAS].[dbo].[PurchaseOrders] WHERE CFECHA >= DATEADD(DAY, -3, GETDATE()) AND COBSERVACIONES like '%".$folio."%')
						AND PRODUCTO IN ($products) ";

				$stmt = $cn->prepare($q);
				$stmt->execute();

				$return = $stmt->fetchAll(PDO::FETCH_ASSOC);

				if(is_array($return)) { 

					$responseObj = ['crm' => $folio];

					if(count($return) == 0 || $return[0]['total_prod_found'] == 0) {
						$responseObj['success'] = 'empty';
					} else if($count_prod <= $return[0]['total_prod_found']) {
						$responseObj['success'] = 'complete';
					} else {
						$responseObj['success'] = 'partial';
					}

				} else {
					$responseObj = ['error' => 'Error at query: '.$q];
					
				}
				
				$cn = null;
				$response->getBody()->write( json_encode($responseObj) );

			}
			catch(Exception $e) {
								
				$response->getBody()->write( json_encode(array('error'=>$e->getMessage())));
				return;
			}			
		}
);


$app->post(
		'/saveCRM', function(Request $request, Response $response) {
		
		try {
			$data = $request->getParsedBody();
			$crm = json_decode($data['crm']);
			
			//var_dump($data);
			//var_dump($crm);
			
			if(!isset($crm) || empty($crm)) {
				return;
			}

			$cn=new PDO(DSN, USER, PASS);
			$cn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
				
			$items = [];
			$items_s = '';
			
			if(!is_array($crm->lineItems) || count($crm->lineItems) == 0) {
				return;
			}
			
			foreach($crm->lineItems as $ix => $item) {
				if($item->model == 'YV-FLETE' || 
					$item->model == 'YV-INSTAL' || 
					$item->model == 'YV-ADMONXPS' || 
					$item->model == 'YV-PARTEXTRA' || 
					$item->model == 'YV-SERVICIOLIMPIEZA' || 
					$item->model == 'YV-CERTIFICADO' || 
					$item->model == 'YV-CURSOBASICO' || 
					$item->model == 'YV-CURSOAVANZADO' 
				) {
					continue;
				}
				$items[] = $item->model ;
			}

			$items_s = '["' . implode('","', $items) . '"]';

			//var_dump($items);
			//var_dump($items_s);

			$q = "INSERT INTO [COMPRAS].[dbo].[Crms] (crm, id_crm, status, products) VALUES ('".$crm->folio_c."', '".$crm->sugarId."', 0, '".$items_s."') ";
			
			try {
				$stmt = $cn->prepare($q);
				$stmt->execute();
			} catch(Exception $e) {
				
			}

			$cn = null;
			
		} catch(Exception $e) {
								
			$response->getBody()->write( json_encode(array('error'=>$e->getMessage())));
			return;
		}

});


$app->get(
		'/update_so_status', function(Request $request, Response $response) {

		$cn=new PDO(DSN, USER, PASS);
		$cn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		
		$q = "SELECT crm, products FROM [COMPRAS].[dbo].[Crms]  ";
		$stmt = $cn->prepare($q);
		$stmt->execute();
		set_time_limit(90);
		$return = $stmt->fetchAll(PDO::FETCH_ASSOC);
		
		if($return != null && is_array($return) && count($return) > 0) { 

			$client = new GuzzleHttp\Client(['headers' => ['Content-Type' => 'application/x-www-form-urlencoded']]);

			foreach($return as $i => $crm) {
				//var_dump($crm);
								
				$promise = $client->postAsync('http://192.168.1.122:82/compras/pog/index.php/check_crm', [ 'form_params' => [
						'folio' => $crm['crm'],
						'products' => json_encode(json_decode($crm['products']))
					]
				])->then(function ($response) {
					
					if($response) {

						$res = json_decode($response->getBody());
						//var_dump($res);
						
						if(isset($res->success)) {

							$status = 0;
							
							if('partial' == $res->success) {
								$status = 1;
							} else if('complete' == $res->success) {
								$status = 2;
							}

							$cn=new PDO(DSN, USER, PASS);
							$cn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

							$q = "UPDATE [COMPRAS].[dbo].[Crms] SET status = '$status' WHERE crm = '".$res->crm."' ";
							//echo $q."<br>";
							$stmt = $cn->prepare($q);
							$stmt->execute();

							$cn = null;
						}
					}
				});
				
				$promise->wait();
			}
		}
	}
);


$app->get(
		'/get_so_status', function(Request $request, Response $response) {
	
	try {

		$cn=new PDO(DSN, USER, PASS);
		$cn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		
		$data = $request->getQueryParams();

		if(!isset($data['folio']) || empty($data['folio'])) {
			throw new Exception("no folio to check");
		}

		$q = "SELECT status FROM [COMPRAS].[dbo].[Crms] WHERE crm = '" . $data['folio'] . "' ";
		
		$stmt = $cn->prepare($q);
		$stmt->execute();

		$return = $stmt->fetchAll(PDO::FETCH_ASSOC);

		if(is_array($return) && count($return) > 0) { 

			if($return[0]['status'] == 0) {
				$responseObj['success'] = 'unattended';
			} else if($return[0]['status'] == 1) {
				$responseObj['success'] = 'attendedp';
			} else if($return[0]['status'] == 2) {
				$responseObj['success'] = 'attended';
			}

		} else {
			$responseObj = ['success' => 'notattended'];
			
		}

		$cn = null;

		$response->getBody()->write( json_encode($responseObj) );

	} catch(Exception $e) {
								
		$response->getBody()->write( json_encode(array('error'=>$e->getMessage())));
		return;
	}
});





$app->get(
		'/update_so_sugar', function(Request $request, Response $response) {

		$cn=new PDO(DSN, USER, PASS);
		$cn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		
		$q = "SELECT crm, id_crm, CONVERT(varchar, getdate(), 23) as fecha FROM [COMPRAS].[dbo].[Crms] WHERE status = 2 AND (status_crm is NULL or status_crm = '')";
		$stmt = $cn->prepare($q);
		$stmt->execute();

		$return = $stmt->fetchAll(PDO::FETCH_ASSOC);
		
		if($return != null && is_array($return) && count($return) > 0) { 

			$client = new GuzzleHttp\Client(['headers' => ['Content-Type' => 'application/x-www-form-urlencoded']]);

			foreach($return as $i => $crm) {
				
				$provs_name = getProviders($crm['crm']);

				$q = "SELECT DISTINCT CFOLIO FROM [COMPRAS].[dbo].[PurchaseOrders] WHERE COBSERVACIONES like '%".$crm['crm']."%' ";
				$stmt = $cn->prepare($q);
				$stmt->execute();
				$return_f = $stmt->fetchAll(PDO::FETCH_ASSOC);
				$folios_contpaq = '';
						
				foreach($return_f as $i => $folio) {
					$folios_contpaq .= $folio['CFOLIO']." / ";
				}
				
				$folios_contpaq = substr($folios_contpaq, 0, -3);
				
				if($folios_contpaq == '' || $folios_contpaq == '0' || strlen($folios_contpaq) === 0) {
					break;
				}
				
				//var_dump($crm['id_crm']);				
				//var_dump($crm['fecha']);
				//var_dump($provs_name);

				$body = ["id" => $crm['id_crm'], "fecha" => $crm['fecha'], "proveedor" => $provs_name, "folios_contpaq" => $folios_contpaq];
				
				$promise = $client->postAsync('https://prod-11.southcentralus.logic.azure.com:443/workflows/857b6042fbb14447862d1822ac884084/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=w6-3NotJPj04XcQcbkqunj2EW4P7RQembouX5zDz7Ws', 
					[ 'json' => json_encode($body)
					], ['headers' => [
							'Content-Type' => 'application/json'
						  ]]
					)->then(function ($response) {
					
					if($response) {

						$res = json_decode($response->getBody());

						if(is_object($res) && $res->id != '') {
							$cn=new PDO(DSN, USER, PASS);
							$cn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
							$q = "UPDATE [COMPRAS].[dbo].[Crms] SET status_crm = 'processed' WHERE crm = '".$res->folio_c."' ";
							
							$stmt = $cn->prepare($q);
							$stmt->execute();			
							$cn = null;
						}
					}
				});
				
				$promise->wait();
			}
		}
	}
);



$app->run();


function getProviders($crm) {

	try {

		$cn=new PDO(DSN, USER, PASS);
		$cn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

		$cn2=new PDO(DSN2, USER2, PASS2);
		$cn2->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 

		$q = "SELECT DISTINCT CIDCLIENTEPROVEEDOR FROM [COMPRAS].[dbo].[PurchaseOrders] WHERE COBSERVACIONES like '%".$crm."%' ";
		$stmt = $cn->prepare($q);
		$stmt->execute();
		$return_p = $stmt->fetchAll(PDO::FETCH_ASSOC);
		$provs_id = '';
				
		foreach($return_p as $i => $prov) {
			$provs_id .= "'".$prov['CIDCLIENTEPROVEEDOR']."',";
		}

		$provs_id = substr($provs_id, 0, -1);

		$qp = "SELECT CRAZONSOCIAL as name FROM [ad1609SDI].[dbo].[admClientes] WHERE CTIPOCLIENTE=3 AND CESTATUS=1 AND CIDCLIENTEPROVEEDOR IN ($provs_id)";
		$stmt = $cn2->prepare($qp);
		$stmt->execute();
		$return_p = $stmt->fetchAll(PDO::FETCH_ASSOC);
		$provs_name = '';
		
		foreach($return_p as $i => $prov) {
			$provs_name .= $prov['name']."/ ";
		}
		
		$provs_name = substr($provs_name, 0, -2);
		$cn = null;
		$cn2 = null;
	} catch (Exception $e) {
	
		return '';
	}

	return $provs_name;


}


function calculateCRMFolio($txt) {
	
	$re = '/\s([\d]+[\/]?[\d])+\b/m';

	preg_match_all($re, $txt, $matches, PREG_SET_ORDER, 0);
	
	if(null != $matches && is_array($matches) && count($matches) > 0 ) {
		$ids = explode('/', $matches[0][0]);
		return trim($ids[0]);
	} else {
		return 0;
	}

}

?>