<?php
namespace models;

class BIUSanteImagesPaginedList {
	
	public $numeroDePage;
	public $nombreMaxParPage;
	public $nombreTotalResultats;
	
	public $imagesArray;
	
	public function __construct($numeroDePage, $nombreMaxParPage, $nombreTotalResultats, array $imagesArray) {
		
		// TODO. Valider les paramètres.
		
		$this->numeroDePage 		= $numeroDePage;
		$this->nombreMaxParPage 	= $nombreMaxParPage;
		$this->nombreTotalResultats	= $nombreTotalResultats;
		$this->imagesArray			= $imagesArray;
	}
	
	public function getNombrePages() {
		
		$nombrePages = 1;
		$existeUnePageIncomplete = FALSE;
		
		if ($this->nombreTotalResultats % $this->nombreMaxParPage !== 0) {
			$existeUnePageIncomplete = TRUE;
		}
		
		$nombrePages = floor($this->nombreTotalResultats / $this->nombreMaxParPage);
		
		if ($existeUnePageIncomplete) {
			$nombrePages += 1;
		}
		
		return $nombrePages;
	}
	
	public function getFirstIndexInCurrentPage() {
		
		return (($this->numeroDePage - 1) * $this->nombreMaxParPage) + 1;
		
	}
	
	public function getLastIndexInCurrentPage() {
	
		return ((($this->numeroDePage - 1) * $this->nombreMaxParPage) + count($this->imagesArray));
	
	}
}