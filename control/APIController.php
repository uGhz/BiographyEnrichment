<?php
namespace control;

class APIController {
	
	private function supportedEntities() {
		$supportedEntities = array('biographies');
	}
	
	function process(HTTPRequest $httpRequest) {
		
		$apiRawRequest = $httpRequest->getGetData('request');
		$verb = $httpRequest->getMethod();
// 		echo 'VERB : ' . $verb;
// 		echo 'request contents : ' . $httpRequest->getGetData('request');
		
		$requestParts = explode("/", $apiRawRequest);
// 		var_dump($requestParts);
		$responseData = null;
		
		if (!empty($requestParts)) {
			$entity = $requestParts[0];
// 			echo 'entity : ' . $entity;
			switch ($entity) {
				case 'biographies';
					if (!empty($requestParts[1])) {
						$id = $requestParts[1];
// 						echo 'id : ' . $id;
						if (strcasecmp($verb, "GET") == 0) {
							$service = new \APIService();
							$responseData = $service->getBiographie($id);
						}
					}
				break;
			}
		}
		
		if (!empty($responseData)) {
			echo json_encode($responseData);
		}
		
	}
	

}

?>