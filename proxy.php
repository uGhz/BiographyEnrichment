<?php 
// Example : http://viaf.org/viaf/102333412/justlinks.json
// $dataSourceBaseUrl = "http://www2.biusante.parisdescartes.fr/developpement/periodiques-electroniques/index.las";


function getWikimediaUrl($imageFilename) {
	
}

$datasource = $_GET["source"];
switch ($datasource) {
	case "viaf-links":
			$url = "http://viaf.org/viaf/" . $_GET["viaf-id"] . "/justlinks.json";
			break;
	case "viaf-file":
			$url = "http://viaf.org/viaf/" . $_GET["viaf-id"] . "/viaf.xml";
			break;
	case "wikidata":
			$url = "https://www.wikidata.org/w/api.php?action=wbgetclaims&props=&entity=" . $_GET["wikidata-id"] . "&property=P18&format=json";
		
			// $url = "http://www.wikidata.org/wiki/Special:EntityData/" . $_GET["wikidata-id"] . ".json";
			break;
	case "wikidata-entity":
				$url = "https://www.wikidata.org/w/api.php?action=wbgetentities&languages=fr&languagefallback=&ids=" . $_GET["wikidata-id"] . "&format=json";
				// https://www.wikidata.org/w/api.php?action=wbgetentities&languages=fr&languagefallback=&ids=Q42&format=json
			
				// $url = "http://www.wikidata.org/wiki/Special:EntityData/" . $_GET["wikidata-id"] . ".json";
				break;
	case "viaf-autosuggest":
				// echo "Github Lookup !";
			$url = "http://viaf.org/viaf/AutoSuggest?query=" . $_GET["query"];
			// echo "URL to fetch : " . $url;
			break;
	case "biusante-biographies":
		$url = "http://172.22.100.140/api-draft/public/biographies/" . $_GET["refbiogr"];
		break;
// 	case "github":
// 		// echo "Github Lookup !";
// 		$url = "https://api.github.com/search/repositories?q=" . $_GET["github-query"];
// 			break;
}


// echo $url;

// $options = array('http' => array(
// 		'method' => "GET",
// 		'user_agent'=> $_SERVER['HTTP_USER_AGENT'],
// 		'header' => "User-Agent:Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36\r\n"
// 		. "Accept:text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8\r\n"
// 		. "Accept-Encoding:gzip, deflate, sdch\r\n"
// 		. "Accept-Language:fr-FR,fr;q=0.8,en-US;q=0.6,en;q=0.4\r\n"
// 		. "Connection:keep-alive\r\n"
// ));
// $context  = stream_context_create($options);


$options  = array('http' => array(
					'user_agent'=> $_SERVER['HTTP_USER_AGENT'],
					'header'=>'Access-Control-Allow-Origin: *')
);
$context = stream_context_create($options);

$responseString = file_get_contents($url, FALSE, $context); 

// header('Access-Control-Allow-Origin: *');
echo $responseString;
?>