<?php
ini_set('display_errors', FALSE);
ini_set('max_execution_time', 120);
ini_set('error_log', join(
	DIRECTORY_SEPARATOR,
	array($_SERVER['DOCUMENT_ROOT'], 'scripts', 'SitemapGenerator002', 'logs', 'error.log')));

define('OFFLINE_SOURCE_DIRECTORY', join(
	DIRECTORY_SEPARATOR,
	array($_SERVER['DOCUMENT_ROOT'], 'scripts', 'SitemapGenerator002')));

set_include_path(
get_include_path()
. PATH_SEPARATOR
. OFFLINE_SOURCE_DIRECTORY
. PATH_SEPARATOR
. join(DIRECTORY_SEPARATOR,	array(OFFLINE_SOURCE_DIRECTORY, 'libraries', 'FM_API_for_PHP_Standalone'))
);


spl_autoload_register();



use control\SitemapGeneratorController;
use control\HTTPRequest;

session_start();

$httpRequest = new HTTPRequest();


$controller = new SitemapGeneratorController();

$controller->process($httpRequest);

?>