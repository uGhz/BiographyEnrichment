<?php
namespace models;

use models\BIUSanteBiographie;

class BIUSanteBiographiesDAO {

	const FM_HOST_KEY 		= 'hostspec';
	const FM_DATABASE_KEY 	= 'database';
	const FM_USER_KEY 		= 'username';
	const FM_PASSWORD_KEY 	= 'password';

	// Constantes liées à la base "biographies"
	const FM_BASE_BIOGRAPHIES_HOST 		= 'http://194.254.96.23';
	const FM_BASE_BIOGRAPHIES_DATABASE 	= 'biographies';
	const FM_BASE_BIOGRAPHIES_USER 		= 'BiusanteAPI';
	const FM_BASE_BIOGRAPHIES_PASSWORD 	= 'BiusanteAPI';

	// Constantes liées au modèle "webbio2" de la base "biographies"
	const FM_LAYOUT_WEB_BIOGRAPHIES		= 'webbio2';

	const FM_FIELD_NAME_REFBIOGR 			= 'cle';
	const FM_FIELD_NAME_NOM 				= 'Nom';
	const FM_FIELD_NAME_NOM_COMPLET 		= 'nom_complet';
	const FM_FIELD_NAME_COMMENTAIRE 		= 'Commentaire';
	const FM_FIELD_NAME_NAISSANCE_ANNEE 	= 'naissance_annee';
	const FM_FIELD_NAME_NAISSANCE_LIEU 		= 'naissance_lieu';
	const FM_FIELD_NAME_DECES_ANNEE 		= 'deces_annee';
	const FM_FIELD_NAME_DECES_LIEU 			= 'deces_lieu';

	 public function test() {
	 	echo "TEST";
	 }
	 
	 
	public function getBiographieByRefbiogr($refbiogr) {

// 		echo "getBIUSanteBiographyByRefbiogr";

		$biographie = new BIUSanteBiographie();

		$fm = $this->getFileMakerInstance();
// 		echo "FileMakerInstance created : " . (($fm) ? 'true' : 'false');
		
		 $findCommand =& $fm->newFindCommand(self::FM_LAYOUT_WEB_BIOGRAPHIES);
// 		 echo "findCommand created : " . (($findCommand) ? 'true' : 'false');

		 // Prise en compte des critères de recherche par la requête FileMaker
		 $findCommand->addFindCriterion(self::FM_FIELD_NAME_REFBIOGR, $refbiogr);

		 $results = $findCommand->execute();
// 		 echo "results created : " . (($results) ? 'true' : 'false');
		 
		 // var_dump($results);
		 if ($fm::isError($results)) {
// 		 	echo "<br>ERROR !!!";
			throw new \Exception('Erreur FileMaker : ' . $results->getMessage());
			}

			if (isset($results) && ($results instanceof \FileMaker_Result)) {
				
			$fmRecord = NULL;
			$fmRecord = $results->getFirstRecord();
				
			if (isset($fmRecord) && ($fmRecord instanceof \FileMaker_Record)) {

				$biographie->refbiogr		= $fmRecord->getField(self::FM_FIELD_NAME_REFBIOGR);
				$biographie->nom			= $fmRecord->getField(self::FM_FIELD_NAME_NOM);
				$biographie->nomComplet		= $fmRecord->getField(self::FM_FIELD_NAME_NOM_COMPLET);
				$biographie->naissanceAnnee	= $fmRecord->getField(self::FM_FIELD_NAME_NAISSANCE_ANNEE);
				$biographie->naissanceLieu	= $fmRecord->getField(self::FM_FIELD_NAME_NAISSANCE_LIEU);
				$biographie->decesAnnee		= $fmRecord->getField(self::FM_FIELD_NAME_DECES_ANNEE);
				$biographie->decesLieu		= $fmRecord->getField(self::FM_FIELD_NAME_DECES_LIEU);
				$biographie->commentaire	= $fmRecord->getField(self::FM_FIELD_NAME_COMMENTAIRE);

			}
		}
		
		// var_dump($biographie);
		return $biographie;

	}


	private function getFileMakerInstance() {
		
		 $fm = new \FileMaker();

		 //Spécifier l'hôte
		 $fm->setProperty(self::FM_HOST_KEY, self::FM_BASE_BIOGRAPHIES_HOST);

		 //Spécifier la base de données FileMaker
		 $fm->setProperty(self::FM_DATABASE_KEY, self::FM_BASE_BIOGRAPHIES_DATABASE);

		 // Spécifier le compte FileMaker utilisé
		 $fm->setProperty(self::FM_USER_KEY, self::FM_BASE_BIOGRAPHIES_USER);
		 $fm->setProperty(self::FM_PASSWORD_KEY, self::FM_BASE_BIOGRAPHIES_PASSWORD);

		 return $fm;
		 
	}

}