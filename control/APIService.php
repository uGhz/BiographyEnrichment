<?php
use models\BIUSanteBiographiesDAO;

class APIService {
	
	
	function getBiographie($id) {
		$provider = new BIUSanteBiographiesDAO();
		return $provider->getBiographieByRefbiogr($id);
	}
	
}