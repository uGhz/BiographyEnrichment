<?php
namespace models;

use models\BIUSanteImagesPaginedList;
use models\BIUSanteImage;
use models\SitemapMetadata;

class SitemapGenerator {
	
	function generateSitemap($collectionCode) {
		
		$pageSize = 100;
		$beginningTimestamp = time();
		$biuSanteImageDAO = new BIUSanteImageDAO();
		
		$nInsertedImageElements = 0;
		$currentPage = 1;
		
		// Initialisation du DOM XML
		$root = $this->initializeSitemapDocument();
		
		do {
			set_time_limit(60);
			
			// Récupération sous forme de BIUSanteImagesPaginedList des résultats d'une requête.
			$biuSanteImagesPaginedList = $biuSanteImageDAO->getImagesPaginedListFromImagesLayout($collectionCode, '', '1', 'oui', $pageSize, $currentPage);

			$nPages = $biuSanteImagesPaginedList->getNombrePages();
			$currentPage++;
			
			// Ajout des noeuds XML au DOM
			foreach ($biuSanteImagesPaginedList->imagesArray as $biuSanteImage) {
				$urlElement = $this->createUrlNode($root, 'http://www.biusante.parisdescartes.fr/histmed/image?' . $biuSanteImage->reference);
				$this->attachBIUSanteImage($urlElement, $biuSanteImage);
				$nInsertedImageElements++;
			}
			
			error_log('$nInsertedImageElements : ' . $nInsertedImageElements . '.');
		
		} while ($currentPage <= $nPages);
		
		// Calcul du nom du fichier Sitemap
		$sitemapfileName = 	$this->getSitemapName($collectionCode);
	
		// Ecriture du fichier XML physique
		$xmlFilePath = join(
				DIRECTORY_SEPARATOR,
				array(OFFLINE_SOURCE_DIRECTORY, 'generated', $sitemapfileName));
		$fileSize = $root->ownerDocument->save($xmlFilePath);
	
		return new SitemapMetadata(
				(time() - $beginningTimestamp),
				$sitemapfileName,
				$fileSize,
				$nInsertedImageElements,
				0);
	}
	
	function getSitemapName($nameParam) {
		return 'sitemap-images-collection-' . $nameParam . '-' . date('Ymd-His') . '.xml';
	}
	
	function attachBIUSanteImage($parentElementParam, $biuSanteImageParam) {
	
		// Controler que $parentElementParam est un DOMElement valide
		if (!($parentElementParam instanceof \DOMElement) || !($biuSanteImageParam instanceof BIUSanteImage)) {
			return NULL;
		}
		 
		$tempDocument = $parentElementParam->ownerDocument;
		 
		// Cr�ation et attachement de l'�l�ment "image"
		$tempImageElement = $tempDocument->createElement('image:image');
		$tempImageElement = $parentElementParam->appendChild($tempImageElement);
		 
		// Cr�ation et attachement de l'�l�ment "image:loc"
		$tempSubElement = $tempDocument->createElement('image:loc', $biuSanteImageParam->url);
		$tempSubElement = $tempImageElement->appendChild($tempSubElement);
		 
		// Cr�ation et attachement de l'�l�ment "image:title"
		$tempSubElement = $tempDocument->createElement('image:title', $biuSanteImageParam->title);
		$tempSubElement = $tempImageElement->appendChild($tempSubElement);
		 
		// Cr�ation et attachement de l'�l�ment "image:license"
		$tempSubElement = $tempDocument->createElement('image:license', $biuSanteImageParam->licenseUrl);
		$tempSubElement = $tempImageElement->appendChild($tempSubElement);
		 
	}
	
	function initializeSitemapDocument() {
	
		// Cr�ation du document XML
		$doc = new \DOMDocument('1.0', 'utf-8');
		// Nous voulons un bel affichage
		$doc->formatOutput = true;
		 
		// Cr�ation de la racine XML
		$root = $doc->createElementNS('http://www.sitemaps.org/schemas/sitemap/0.9', 'urlset');
		$root->setAttributeNS('http://www.w3.org/2000/xmlns/' ,'xmlns:image', 'http://www.google.com/schemas/sitemap-image/1.1');
		$root = $doc->appendChild($root);
		 
		return $root;
		 
	}
	
	function createUrlNode($parentElementParam, $urlParam) {
	
		if (!($parentElementParam instanceof \DOMElement)) {
			return NULL;
		}
	
		// TODO : Controler que $rootElementParam est un DOMElement valide
		$tempDocument = $parentElementParam->ownerDocument;
		 
		// Cr�ation et attachement de l'�l�ment "url"
		$urlElement = $tempDocument->createElement('url');
		$urlElement = $parentElementParam->appendChild($urlElement);
		 
		// Cr�ation et attachement de l'�l�ment "loc"
		$locElement = $tempDocument->createElement('loc', $urlParam);
		$locElement = $urlElement->appendChild($locElement);
		 
		return $urlElement;
		 
	}
	
}