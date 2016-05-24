<?php
namespace control;

class MainController {

	
	function process(HTTPRequest $httpRequest) {
		
		$this->indexAction();
		
		
	}
	
	function execute() {
		
		require join(
				DIRECTORY_SEPARATOR,
				array(OFFLINE_SOURCE_DIRECTORY, 'views', 'results.php'));
		
	}
	
	function indexAction() {
	
		
		
		
		require join(
				DIRECTORY_SEPARATOR,
				array(OFFLINE_SOURCE_DIRECTORY, 'views', 'entrance.php'));
	}
	

}

?>