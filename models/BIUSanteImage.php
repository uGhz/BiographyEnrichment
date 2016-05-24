<?php
namespace models;
 
 class BIUSanteImage {
 
  public $reference;
  public $url;
  public $title;
  public $licenseUrl;
 
  public function __construct($referenceParam, $urlParam, $titleParam, $licenseUrlParam) { 
        $this->reference  = $referenceParam;
  		$this->url        = $urlParam;
        $this->title      = $titleParam;
        $this->licenseUrl = $licenseUrlParam; 
  }
  
  public function reference() {
  	return $this->reference;
  }
    
  public function url() {
        return $this->url;
  }

  public function title() {
        return $this->title;
  }
  
  public function licenseUrl() {
        return $this->licenseUrl;
  }    
 
 }
?>