<?php
/**
 * @package sketch
 * @author Willem Dumee
 * @version 0.2
 */

require_once dirname( __FILE__ ) . '/vendor/autoload.php';

/* TODO add to autoload */
require_once dirname( __FILE__ ) . '/includes/Helpers.php';
require_once dirname( __FILE__ ) . '/includes/DrifterTwigExtension.php';

require_once dirname( __FILE__ ) . '/config.php';

/**
 * Router
 *
 *
 * Serve static resources as-is
 */

$req = parse_url( $_SERVER['REQUEST_URI'] );

if (preg_match('/\.(?:png|jpg|jpeg|gif|css|js|svg|woff|woff2|eot)$/', $req['path'])) {
    return false;
}

/* TODO create loader for stylesheets */
$loader = new Twig_Loader_Filesystem( 'src' );
$twig   = new Twig_Environment( $loader, array(
        'debug' => true
) );

$active_test = new Twig_SimpleTest( 'active', function ($value) {
    if (isset( $value ) && $value == $_GET['template']) {
        return true;
    }

    return false;
} );

$twig->addTest( $active_test );

$twig->addExtension( new Twig_Extension_Debug() );
$twig->addExtension( new DrifterTwigExtension() );

$template = $twig->loadTemplate( 'layouts/custom.rain' );

$templateData = '';
$protocol = 'http://';

if (isset( $_SERVER['HTTPS'] ) && $_SERVER['HTTPS'] != 'off') {
    $protocol = 'https://';
}


$uri = '';
if (isset( $_GET['path'] )) {
    $uri = $_GET['path'];
}

if (isset( $_SERVER['PATH_INFO'])) {
    $uri = $_SERVER['PATH_INFO'];

    if (preg_match('/^\//', $uri)) {
        $uri = str_replace('/', '', $uri);
    }
}

if (isset( $_SERVER['REQUEST_URI'])) {
    $uri = $_SERVER['REQUEST_URI'];

    if (preg_match('/^\//', $uri)) {
        $uri = preg_replace('/\//', '', $uri, 1);
    }
}

function loadRemoteContent($url)
{
    $uniq = md5($url);
    $cache_filename = CACHE_PATH . '/' . $uniq;
    $content = @file_get_contents($url);

    if (!$content && file_exists($cache_filename)) {
        return file_get_contents( $cache_filename);
    }

    file_put_contents( $cache_filename, $content);

    return $content;
}

$templateData = loadRemoteContent( INDEX_PAGE . $uri . '?format=json' );

if (false === $templateData) {
    // Redirect to home page
    $templateData = loadRemoteContent( INDEX_PAGE . '?format=json' );
}

$jsonTemplate = json_decode( $templateData, true );

// In case of redirect by lightspeed there is an html string that can not be encoded
// this happens when clicking on a link in headlines
if (json_last_error() > 0) {
    $templateData = loadRemoteContent( INDEX_PAGE . '?format=json' );
    $jsonTemplate = json_decode( $templateData, true );
}

// Working offline?
if (is_null($jsonTemplate)) {
    $jsonTemplate = [
        'template' => 'pages/index.rain'
    ];
}


$jsonTemplate['controller'] = $jsonTemplate;
$jsonTemplate['development'] = true;
$jsonTemplate['base_url'] = BASE_URL;

echo $template->render( $jsonTemplate );
