<?php
ini_set('display_errors', FALSE);
ini_set('max_execution_time', 120);
ini_set('error_log', join(
		DIRECTORY_SEPARATOR,
		array(__DIR__, 'logs', 'error.log')
		)
		);

define('PROJECT_DIRECTORY', __DIR__);

set_include_path(
		get_include_path()
		. PATH_SEPARATOR
		. PROJECT_DIRECTORY
		. PATH_SEPARATOR
		. join(DIRECTORY_SEPARATOR,	array(PROJECT_DIRECTORY, 'libraries', 'FM_API_for_PHP_Standalone'))
		);


spl_autoload_register();