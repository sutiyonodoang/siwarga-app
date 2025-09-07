<?php
// Redirect to public folder
$uri = $_SERVER['REQUEST_URI'];
$root = '/siwarga-app';

// Remove root from URI
if (strpos($uri, $root) === 0) {
    $uri = substr($uri, strlen($root));
}

// If empty, set to root
if (empty($uri) || $uri === '/') {
    $uri = '/';
}

// Set document root to public
$_SERVER['DOCUMENT_ROOT'] = __DIR__ . '/public';
$_SERVER['SCRIPT_NAME'] = '/index.php';
$_SERVER['REQUEST_URI'] = $uri;

// Include public index
require_once __DIR__ . '/public/index.php';
?>
