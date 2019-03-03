<?php  

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

//Load Composer's autoloader
require_once 'vendor/autoload.php';

class SDIMail {

	var $linkStockFile = "https://docs.google.com/spreadsheets/d/1o9sWYuYw0-4pSVlscCDw0Mj4Q1CHpSYlfzxia1WwoMU/edit?usp=sharing";

	function sendEmail($listOfProducts) {

		if( is_array($listOfProducts) && count($listOfProducts) > 0 ) {
			$mail = new PHPMailer(true);                              // Passing `true` enables exceptions
			
			try {
				//Server settings
				$mail->SMTPDebug = 0;                                 // Enable verbose debug output
				$mail->isSMTP();                                      // Set mailer to use SMTP
				$mail->Host = 'smtp.gmail.com';  // Specify main and backup SMTP servers
				$mail->SMTPAuth = true;                               // Enable SMTP authentication
				$mail->Username = 'no-reply@sdindustrial.com.mx';                 // SMTP username
				$mail->Password = 'sdinor3357';                           // SMTP password
				$mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
				$mail->Port = 587;                                    // TCP port to connect to

				//Recipients
				$mail->setFrom('no-reply@sdindustrial.com.mx', 'POG');
				$mail->addAddress('tomas@sdindustrial.com.mx', 'Tom');     // Add a recipient
	//			$mail->addAddress('ellen@example.com');               // Name is optional
	//			$mail->addReplyTo('info@example.com', 'Information');
				$mail->addCC('kacosta@sdindustrial.com.mx');
				$mail->addCC('avaldez@sdindustrial.com.mx');
				$mail->addCC('jalmora@sdindustrial.com.mx');
	//			$mail->addCC('cc@example.com');
	//			$mail->addBCC('bcc@example.com');

				//Attachments
	//			$mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
	//			$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name

				//Content
				$products = '';
				foreach($listOfProducts as $id => $product) {
					$products .= '<br>' . $product['model']. ' ' . $product['quantity'];
				}
				
				$mail->isHTML(true);                                  // Set email format to HTML
				$mail->Subject = 'POG - Aviso de separacion de material';
				$mail->Body    = 'Estimado usuario(a): <br><br>
									Se ha creado una separacion de material en el archivo de inventario<br><br>
									Puedes revisar en: <a href="'.$this->linkStockFile.'">ARCHIVO DE INVENTARIO</a>
									<br><br>El material separado es: <br>' .$products;

				$mail->AltBody = 'Estimado usuario(a): Se ha creado una separacion de material en el archivo de inventario. Favor de revisarla';

				$mail->send();
				
			} catch (Exception $e) {
				echo 'Message could not be sent. Mailer Error: ', $mail->ErrorInfo;
			}
		}
	
	}


	function sendEmailWithMissingProducts($products) {

		if( is_array($products) && count($products) > 0 ) {
			$mail = new PHPMailer(true);                              // Passing `true` enables exceptions
			
			try {
				//Server settings
				$mail->SMTPDebug = 0;                                 // Enable verbose debug output
				$mail->isSMTP();                                      // Set mailer to use SMTP
				$mail->Host = 'smtp.gmail.com';  // Specify main and backup SMTP servers
				$mail->SMTPAuth = true;                               // Enable SMTP authentication
				$mail->Username = 'no-reply@sdindustrial.com.mx';                 // SMTP username
				$mail->Password = 'sdinor3357';                           // SMTP password
				$mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
				$mail->Port = 587;                                    // TCP port to connect to

				//Recipients
				$mail->setFrom('no-reply@sdindustrial.com.mx', 'POG');
				$mail->addAddress('tomas@sdindustrial.com.mx', 'Tom');     // Add a recipient
				$mail->addCC('kacosta@sdindustrial.com.mx');
				$mail->addCC('avaldez@sdindustrial.com.mx');
	//			$mail->addAddress('ellen@example.com');               // Name is optional
	//			$mail->addReplyTo('info@example.com', 'Information');
	//			$mail->addCC('cc@example.com');
	//			$mail->addBCC('bcc@example.com');

				//Attachments
	//			$mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
	//			$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name

				//Content
				$listOfProducts = implode('<br>', $products);
				$listOfProductsTXT = implode(', ', $products);
								
				$mail->isHTML(true);                                  // Set email format to HTML
				$mail->Subject = 'POG - Aviso de productos faltantes en CONTPAQ';
				$mail->Body    = 'Estimado usuario(a): <br><br>
									Los siguientes productos no existen en contpaq:<br><br>' .$listOfProducts;

				$mail->AltBody = 'Estimado usuario(a): Los siguientes productos no existen en contpaq' . $listOfProductsTXT;

				$mail->send();
				
			} catch (Exception $e) {
				echo 'Message could not be sent. Mailer Error: ', $mail->ErrorInfo;
			}
		
		}
	
	}

}



?>