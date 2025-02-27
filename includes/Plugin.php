<?php
/**
 * Main Plugin class.
 *
 * @package LuxVoyages/Plugin
 * @since   1.0.0
 */

namespace LuxVoyages;

class Plugin {

	/**
	 * Plugin version.
	 *
	 * @var string
	 */
	public string $version;

	/**
	 * Returns the instance of the plugin.
	 *
	 * @return void
	 */
	public static function execute() {
		$instance = new self();
		if ( ! self::meets_requirements() ) {
			add_action( 'admin_notices', array( $instance, 'admin_notice' ) );
			return;
		}
		$instance->define_constants();
		$instance->register_hooks();
	}

	/**
	 * Admin notice.
	 *
	 * @return void
	 */
	public function admin_notice(): void {
		echo '<div class="notice notice-error"><p>'.__( 'WP Travel Engine - Lux Voyages requires WP Travel Engine 6.3.9 or higher.', 'wptravelengine-lux-voyages' ).'</p></div>';
	}

	/**
	 * Check if the plugin meets the requirements.
	 *
	 * @return bool
	 */
	public static function meets_requirements(): bool {
		return defined( 'WP_TRAVEL_ENGINE_VERSION' ) && version_compare( WP_TRAVEL_ENGINE_VERSION, '6.3.9', '>=' );
	}

	/**
	 * Define constants.
	 */
	public function define_constants(): void {
		$this->version = WPTRAVELENGINE_LUX_VOYAGES_VERSION;
		define( 'WPTRAVELENGINE_LUX_VOYAGES_DATE_PLUGIN_PATH', plugin_dir_path( WPTRAVELENGINE_LUX_VOYAGES_PLUGIN_FILE ) );
		define( 'WPTRAVELENGINE_LUX_VOYAGES_DATE_PLUGIN_URL', plugin_dir_url( WPTRAVELENGINE_LUX_VOYAGES_PLUGIN_FILE ) );
	}

	/**
	 * Load plugin textdomain.
	 *
	 * @return void
	 */
	public function load_textdomain(): void {
		unload_textdomain( 'wptravelengine-lux-voyages' );
		load_plugin_textdomain( 'wptravelengine-lux-voyages', WPTRAVELENGINE_LUX_VOYAGES_DATE_PLUGIN_PATH . 'languages' );
	}

	/**
	 * Register hooks.
	 */
	public function register_hooks(): void {
		// add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_assets' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_public_assets' ) );
		add_action( 'init', array( $this, 'load_textdomain' ) );
		// add_filter( 'wptravelengine_settings_ui_config', array( $this, 'add_settings_ui_config' ) );
	}

	/**
	 * Add settings UI config.
	 *
	 * @param array $settings_ui_config Settings UI config.
	 * @return array
	 * TODO: Add settings UI config if required.
	 */
	public function add_settings_ui_config( array $settings_ui_config ): array {
		$settings_ui_config[] = array(
			'title'    => esc_html__( 'Lux Voyages', 'wptravelengine-lux-voyages' ),
			'order'    => 50,
			'sub_tabs' => array(
				array(
					'title'  => __( 'Checkout', 'wptravelengine-lux-voyages' ),
					'order'  => 10,
					'id'     => 'checkout-page',
					'fields' => array(
						array(
							'label'      => __( 'Title', 'wptravelengine-lux-voyages' ),
							'field_type' => 'TEXT',
							'name'       => 'accommodation.title',
						),
						array(
							'label'      => __( 'Description', 'wptravelengine-lux-voyages' ),
							'field_type' => 'TEXTAREA',
							'name'       => 'accommodation.description',
						),
					),
				)
			),
			'icon'     => 'customs',
			'id'       => 'lux-voyages',
		);
		return $settings_ui_config;
	}

	/**
	 * Enqueue public assets.
	 * 
	 * @return void
	 */
	public function enqueue_public_assets(): void {
		wp_enqueue_script(
			'wptravelengine-lux-voyages-public',
			WPTRAVELENGINE_LUX_VOYAGES_DATE_PLUGIN_URL . 'dist/public.js',
			array( 'wptravelengine-exports' ),
			filemtime( WPTRAVELENGINE_LUX_VOYAGES_DATE_PLUGIN_PATH . 'dist/public.js' ),
			true
		);
	}

	/**
	 * Enqueue admin assets.
	 * 
	 * @return void
	 */
	public function enqueue_admin_assets(): void {
		wp_enqueue_script(
			'wptravelengine-lux-voyages-admin',
			WPTRAVELENGINE_LUX_VOYAGES_DATE_PLUGIN_URL . 'dist/admin.js',
			array( 'wptravelengine-exports' ),
			filemtime( WPTRAVELENGINE_LUX_VOYAGES_DATE_PLUGIN_PATH . 'dist/admin.js' ),
			true
		);
	}
}
