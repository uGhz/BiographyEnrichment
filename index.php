<?php
include 'init.php';

use control\MainController;
use control\HTTPRequest;

session_start();

$httpRequest = new HTTPRequest();


$controller = new MainController();

$controller->process($httpRequest);

