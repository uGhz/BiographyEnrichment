<?php
namespace control;

use models\BIUSanteBiographiesDAO;

class MainController {

	
	function process(HTTPRequest $httpRequest) {
		
		if (!empty($httpRequest->getGetData('test'))) {
			$refbiogr = $httpRequest->getGetData('refbiogr');
			$this->testAction($refbiogr);
		} else {
			$this->indexAction();
		}
		
	}
	
	function indexAction() {
	
		require join(
				DIRECTORY_SEPARATOR,
				array(PROJECT_DIRECTORY, 'views', 'entrance.php'));
	}
	
	function testAction($refbiogr) {
		echo "test action !";
		$bdao = new BIUSanteBiographiesDAO();
		echo "BIUSanteBiographyDAO created !";
		$bdao->test();
		// $result = $bdao->getBiographieByRefbiogr($httpRequest->getGetData('refbiogr'));
		
		$result = $bdao->getBiographieByRefbiogr($refbiogr);
		
		echo "result returned !";
		echo "result : " . var_dump($result);
		$biographie = $result;
		
		require join(
				DIRECTORY_SEPARATOR,
				array(PROJECT_DIRECTORY, 'views', 'test.php'));
	}
	

}

?>