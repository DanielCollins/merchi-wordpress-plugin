<?php
/**
 * @package MerchiPlugin
 */

namespace Inc\ShoppingCart;

use \Inc\Base\BaseController;

class ShoppingCartInject extends BaseController
{
    public function register()
    {
        // Inject Merchi cart into navigation
        add_action('wp_body_open', array( $this, 'inject_merchi_cart'), 98 );
    }

    public function inject_merchi_cart()
    {
        $id = get_option("merchi_url");
        // Need to provide a mountPointId or mountPointClass for merchi cart to render
        $mountPoint = get_option("merchi_mount_point_id");
        $content = "<script type='text/javascript' src='https://merchi.co/static/js/dist/load-component.js?component=RemoteShoppingCart&mountpointClass=$mountPoint&props={\"storeId\":$id, \"includeModalCss\":true, \"showOpenCartButton\": true, \"cartButtonWrappedInContainer\": true}'></script>";
        echo $content;
    }
}
