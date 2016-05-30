<?php 
// Example : http://viaf.org/viaf/102333412/justlinks.json
// $dataSourceBaseUrl = "http://www2.biusante.parisdescartes.fr/developpement/periodiques-electroniques/index.las";


function getWikimediaUrl($imageFilename) {
	
}

$datasource = $_GET["source"];
switch ($datasource) {
	case "viaf":
			$url = "http://viaf.org/viaf/" . $_GET["viaf-id"] . "/justlinks.json";
			break;
	case "wikidata":
		// https://www.wikidata.org/w/api.php?action=wbgetclaims&props=&entity=Q937&property=P18
		
			$url = "http://www.wikidata.org/wiki/Special:EntityData/" . $_GET["wikidata-id"] . ".json";
			break;
}


// echo $url;

//$opts = array('http' => array(
//		'method' => "GET",
//		'header' => "User-Agent:Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36\r\n"
//		. "Accept:text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8\r\n"
//		. "Accept-Encoding:gzip, deflate, sdch\r\n"
//		. "Accept-Language:fr-FR,fr;q=0.8,en-US;q=0.6,en;q=0.4\r\n"
//		. "Connection:keep-alive\r\n"
//		. "Host:your.domain.com\r\n"
//));

// $context = stream_context_create($opts);


// $responseString = file_get_contents($url, FALSE, $context); 
$responseString = file_get_contents($url, FALSE); 

echo $responseString;
?>