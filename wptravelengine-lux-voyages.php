<?php
/**
 * Plugin Name: WP Travel Engine - Lux Voyages
 * Description: Adds lux voyages customization to WP Travel Engine.
 * Version: 1.0.0
 * Author: WP Travel Engine
 * Author URI: https://wptravelengine.com/
 * Text Domain: wptravelengine-lux-voyages
 * Requires PHP: 7.4
 * Requires Plugins: wp-travel-engine
 * Tested up to: 6.7
 * WTE tested up to: 6.3.9
 * WTE requires at least: 6.3.9
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

defined( 'WPTRAVELENGINE_LUX_VOYAGES_VERSION' ) || define( 'WPTRAVELENGINE_LUX_VOYAGES_VERSION', '1.0.0' );
defined( 'WPTRAVELENGINE_LUX_VOYAGES_PLUGIN_FILE' ) || define( 'WPTRAVELENGINE_LUX_VOYAGES_PLUGIN_FILE', __FILE__ );

require __DIR__ . '/vendor/autoload.php';

add_action(
	'plugins_loaded',
	function () {
		LuxVoyages\Plugin::execute();
	},
	10
);
