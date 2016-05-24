<?php
namespace models;

use models\BIUSanteImage as BIUSanteImage;

/*
 *  TODO. Implémenter une méthode de recherche multicritères correspondant au formulaire de saisie.
 *  TODO. Implémenter une méthode retournant le nombre de résultats d'une recherche multicritères saisie par le visiteur.
 *  TODO. Implémenter une méthode de récupération paginée de ces données. 
 */
class BIUSanteImageDAO {
	
	const FM_HOST_KEY 		= 'hostspec';
	const FM_DATABASE_KEY 	= 'database';
	const FM_USER_KEY 		= 'username';
	const FM_PASSWORD_KEY 	= 'password';
	
	// Constantes liées à la base "images"
	const FM_BASE_CONGRES_HOST 		= 'http://194.254.96.23';
	const FM_BASE_CONGRES_DATABASE 	= 'images';
	const FM_BASE_CONGRES_USER 		= 'BIUSanteSitemapGenerator';
	const FM_BASE_CONGRES_PASSWORD 	= 'BIUSanteSitemapGenerator';
	
	// Constantes liées au modèle "web_images" de la base "images"
	const FM_LAYOUT_WEB_IMAGES		= 'web_images';
	
	const FM_REFERENCE_FIELD_NAME 		= 'refphot';
	const FM_VISIBLE_FIELD_NAME 		= 'visible';
	const FM_COLLECTION_CODE_FIELD_NAME = 'orig';
	const FM_LICENCE_FIELD_NAME 		= 'licence';
	const FM_NB_IMG_FIELD_NAME 			= 'nbimg';
	const FM_TITRE_FIELD_NAME 			= 'titima';
	const FM_REFERENCE_FK_FIELD_NAME 	= 'fichiers::refphot';
	const FM_FILE_NAME_FIELD_NAME 		= 'fichiers::fichier';
	const FM_EXTENSION_FIELD_NAME 		= 'fichiers::img_online';
	// const FM_TITRE_SEARCH_FIELD_NAME 		= 'fichiers::img_brute';
	// const FM_TITRE_SEARCH_FIELD_NAME 		= 'fichiers::resolution';

	// Constantes liées au modèle "images" de la base "images"
	const FM_LAYOUT_IMAGES		= 'images';
	
	const FM_REFERENCE_IMAGES_FIELD_NAME 		= 'refphot';
	const FM_VISIBLE_IMAGES_FIELD_NAME 			= 'visible';
	const FM_STATUT_IMAGES_FIELD_NAME 			= 'statut';
	const FM_COLLECTION_CODE_IMAGES_FIELD_NAME 	= 'orig';
	const FM_LICENCE_IMAGES_FIELD_NAME 			= 'licence';
	const FM_NB_IMG_IMAGES_FIELD_NAME 			= 'nbimg';
	const FM_TITRE_IMAGES_FIELD_NAME 			= 'tous_titres2';
	const FM_REFERENCE_FK_IMAGES_FIELD_NAME 	= 'fichiers::refphot';
	const FM_FILE_NAME_IMAGES_FIELD_NAME 		= 'fichiers::fichier';
	const FM_EXTENSION_IMAGES_FIELD_NAME 		= 'fichiers::img_online';

	
	public function getImagesPaginedListFromImagesLayout(
			$critereCollection,
			$critereReference,
			$critereNbImg,
			$critereVisible,
			$taillePage,
			$numeroDePage) {
	
		// Validation des paramètres de méthode
		// Tester si $taillePage est un entier positif
		if (!is_int($taillePage) || ($taillePage < 1)) {
			throw new \InvalidArgumentException($message, $code, $previous);
		}
	
		if (!is_int($numeroDePage) || ($numeroDePage < 0)) {
			// Tester si $numeroDePage est un entier positif
			throw new \InvalidArgumentException($message, $code, $previous);
		}
		
		$imagePaginedList = NULL;
		$requestBeginningTimestamp = time();
		
		$fm = $this->getFileMakerInstance();
	
		$findCommand =& $fm->newFindCommand(self::FM_LAYOUT_IMAGES);
	
	
		// Prise en compte des critères de recherche par la requête FileMaker
		$findCommand->addFindCriterion(self::FM_COLLECTION_CODE_IMAGES_FIELD_NAME, $critereCollection);
		$findCommand->addFindCriterion(self::FM_REFERENCE_IMAGES_FIELD_NAME, $critereReference);
		$findCommand->addFindCriterion(self::FM_NB_IMG_IMAGES_FIELD_NAME, $critereNbImg);
		$findCommand->addFindCriterion(self::FM_VISIBLE_IMAGES_FIELD_NAME, $critereVisible);
	
		// Ajout de la règle de tri/
		$findCommand->addSortRule(self::FM_REFERENCE_IMAGES_FIELD_NAME, 1, FILEMAKER_SORT_ASCEND);
	
		// Définir la page de résultats désirée
		$nombreDEnregistrementsASauter = $taillePage * ($numeroDePage - 1);
		$findCommand->setRange($nombreDEnregistrementsASauter, $taillePage);
	
		$results = $findCommand->execute();
	
		if ($fm::isError($results)) {
			throw new \Exception('Erreur FileMaker : ' . $results->getMessage());
		}
	
		/*
		 * TODO. Adapter au nouvel objet.
		*
		*/
		if (isset($results) && ($results instanceof \FileMaker_Result)) {
	
			$imagesArray = $this->fmRecordsFromImagesLayoutToImagesArray($results->getRecords());
				
			$imagesPaginedList = new \models\BIUSanteImagesPaginedList(
					$numeroDePage,
					$taillePage,
					$results->getFoundSetCount(),
					$imagesArray);
	
		}
		
		error_log('Page de résultats : ' . $numeroDePage . '. Durée de la requête : ' . (time() - $requestBeginningTimestamp) . ' sec.');
		return $imagesPaginedList;
	
	}
	
	public function getBIUSanteImageByReference($critereReference) {
		
		$returnedBIUSanteImage = new \BIUSanteImage('', '', '');
		
		$fm = $this->getFileMakerInstance();
		
		$findCommand =& $fm->newFindCommand(self::FM_LAYOUT_WEB_IMAGES);
		
		
		// Prise en compte des critères de recherche par la requête FileMaker
		$findCommand->addFindCriterion(self::FM_REFERENCE_FIELD_NAME, $critereReference);
		
		$results = $findCommand->execute();
		
		if ($fm::isError($results)) {
			throw new \Exception('Erreur FileMaker : ' . $results->getMessage());
		}
		
		if (isset($results) && ($results instanceof \FileMaker_Result)) {
			
			$fmRecord = NULL;
			$fmRecord = $results->getFirstRecord();
			
			if (isset($fmRecord) && ($fmRecord instanceof \FileMaker_Record)) {
			
				$returnedBIUSanteImage->reference 		= $fmRecord->getField(self::FM_REFERENCE_FIELD_NAME);
				$returnedBIUSanteImage->url 			= 'http://www.biusante.parisdescartes.fr/images/banque/zoom/' . $fmRecord->getField(self::FM_REFERENCE_FIELD_NAME . '.jpg');
				$returnedBIUSanteImage->title 			= $fmRecord->getField(self::FM_TITRE_FIELD_NAME);
				$returnedBIUSanteImage->licenseUrl 		= $fmRecord->getField(self::FM_LICENCE_FIELD_NAME);
		
			}
		}
		
		return $returnedBIUSanteImage;
		
	}
	
	
	private function getFileMakerInstance() {
		
		$fm = new \FileMaker();

		//Spécifier l'hôte
		$fm->setProperty(self::FM_HOST_KEY, self::FM_BASE_CONGRES_HOST);
		
		//Spécifier la base de données FileMaker
		$fm->setProperty(self::FM_DATABASE_KEY, self::FM_BASE_CONGRES_DATABASE);

		// Spécifier le compte FileMaker utilisé
		$fm->setProperty(self::FM_USER_KEY, self::FM_BASE_CONGRES_USER);
		$fm->setProperty(self::FM_PASSWORD_KEY, self::FM_BASE_CONGRES_PASSWORD);
		
		return $fm;
	}
	
	private function fmRecordsFromImagesLayoutToImagesArray (array $imagesFileMakerRecords) {
	
		$imagesArray 	= array();
		$imageTemp		= NULL;
		$typeLicence 	= NULL;
		$urlLicenceTemp = NULL;
	
		foreach ($imagesFileMakerRecords as $record) {
			
			$typeLicence = $record->getField(self::FM_LICENCE_IMAGES_FIELD_NAME);
			if  ($typeLicence == 'Licence ouverte') {
				$urlLicenceTemp = 'http://www.etalab.gouv.fr/pages/Licence_ouverte_Open_licence-5899923.html';
			} elseif ($typeLicence == 'Domaine public') {
				$urlLicenceTemp = 'http://creativecommons.org/publicdomain/mark/1.0/deed.fr';
				
			} else {
				$urlLicenceTemp = '';
			} 
			
			$imageTemp = new BIUSanteImage(
					$record->getField(self::FM_REFERENCE_IMAGES_FIELD_NAME),
					'http://www.biusante.parisdescartes.fr/images/banque/zoom/' . $record->getField(self::FM_REFERENCE_IMAGES_FIELD_NAME) . '.jpg',
					$record->getField(self::FM_TITRE_IMAGES_FIELD_NAME),
					$urlLicenceTemp);
	
			$imagesArray[] = $imageTemp;
		}
	
		return $imagesArray;
	}
	
	
}