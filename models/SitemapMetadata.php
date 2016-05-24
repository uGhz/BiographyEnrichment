<?php
namespace models;

class SitemapMetadata {
	
	public $generationDuration;
	public $fileName;
	public $fileSize;
	public $nImageElements;
	public $fmRequestDuration;

	
	public function __construct($generationDuration, $fileName, $fileSize, $nImageElements, $fmRequestDuration) {
		$this->generationDuration  = $generationDuration;
		$this->fileName        = $fileName;
		$this->fileSize        = $fileSize;
		$this->nImageElements  = $nImageElements;
		$this->fmRequestDuration  = $fmRequestDuration;
	}
}
?>