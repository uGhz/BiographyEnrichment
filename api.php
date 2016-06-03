<?php
include 'init.php';

use control\APIController;
use control\HTTPRequest;

$httpRequest = new HTTPRequest();
$controller = new APIController();

$controller->process($httpRequest);