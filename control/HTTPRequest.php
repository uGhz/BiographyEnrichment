<?php
namespace control;

class HTTPRequest {
	
	public function cookieData($key) {
		return isset($_COOKIE[$key]) ? $_COOKIE[$key] : NULL;
	}
	
	public function cookieExists($key) {
		return isset($_COOKIE[$key]);
	}
	
	public function getGetData($key) {
		return isset($_GET[$key]) ? $_GET[$key] : NULL;
	}
	
	public function getDataExists($key) {
		return isset($_GET[$key]);
	}
	
	public function getMethod() {
		return $_SERVER['REQUEST_METHOD'];
	}
	
	public function getPostData($key) {
		return isset($_POST[$key]) ? $_POST[$key] : NULL;
	}
	
	public function postDataExists($key) {
		return isset($_POST[$key]);
	}
	
	public function getRequestURI() {
		return $_SERVER['REQUEST_URI'];
	}
}