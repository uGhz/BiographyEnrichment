<?php
namespace control;

class APIController {

	
	function process(HTTPRequest $httpRequest) {
		
		var_dump($httpRequest->getRequestURI());
		echo 'request contents : ' . $httpRequest->getGetData('request');
		echo $_SERVER['QUERY_STRING'];
		
	}
	

}

?>