jQuery(document).ready(function ($) {
  var embed = {
    featureImage: {},
    images: {},
    domain: { company: {} },
  };

  async function downloadMerchiImageReturnData(file) {
    var url = file.downloadUrl();
    return { src: url };
  }

  async function convertMerchiProductImages(merchiProduct) {
    return merchiProduct.images()
      ? merchiProduct.images().map(downloadMerchiImageReturnData)
      : [];
  }

  async function convertedMerchiProducts(products) {
    var _products = [],
      i;
    if (products) {
      for (i = 0; i < products.length; i++) {
        var merchiProduct = products[i],
          merchiProductImages;
        if (merchiProduct.json && merchiProduct.json === "product") {
          merchiProductImages = await convertMerchiProductImages(merchiProduct);
          console.log(merchiProductImages);
          _products.push({
            description: merchiProduct.description(),
            price: merchiProduct.unitPrice(),
            name: merchiProduct.name(),
            regular_price: merchiProduct.unitPrice(),
            images: merchiProductImages,
          });
        }
      }
    }
    return { create: _products };
  }

  async function addProductsToDatabase(data) {
    // on fetch merchi products success pass them to the
    // "create_merchi_products" endpoint so that they can be saved
    // into the products table
    console.log(data);
    var products = data,
      meta = data.meta,
      msgName = meta.available === 1 ? "product" : "products",
      msg = `${meta.available} Merchi ${msgName} have been fetched and saved into products.`,
      _products = await convertedMerchiProducts(products);
    $.ajax({
      type: "post",
      url: create_merchi_products.ajax_url,
      data: {
        action: "create_merchi_products",
        products: _products,
        _ajax_nonce: create_merchi_products.nonce,
      },
      success: function (data) {
        alert(msg);
        $("#merchi-fetch-button").html("Fetch");
        $("#merchi-fetch-button").prop("disabled", false);
      },
      error: function (MLHttpRequest, textStatus, errorThrown) {
        console.log(errorThrown);
      },
    });
  }

  function fetchProductError(data, code) {
    alert(
      "There was an error fetching products from Merchi" +
        "Please check the console for more info."
    );
    console.error(data, code);
  }

  $("#merchi-fetch-button").click(function () {
    $("#merchi-fetch-button").html("Fetching...");
    $("#merchi-fetch-button").prop("disabled", true);
    MERCHI_SDK.products.get(addProductsToDatabase, fetchProductError, {
      embed: embed,
      inDomain: merchiObject.merchiStoreName,
    });
  });
});

// testing images
var productz = {
  create: [
    {
      name: "product 1",
      type: "simplwwe",
      regular_price: "221.99",
      images: [
        {
          src:
            "http://demo.woothemes.com/woocommerce/wp-content/uploads/sites/56/2013/06/T_2_front.jpg",
        },
        // {
        //   src:
        //     "https://merchi-production.s3-accelerate.amazonaws.com/W7u3xHqKSZMbrraLTzLSDNQBhN1OdkTj9pKVPKQPv1o3CAR1tNDU3PjIslNhOiBX?AWSAccessKeyId=AKIAJVUUHFK32X3XPCNA&Signature=A9eiuHHmjRgaQ0BfBKxodLNyu7c%3D&Expires=1593056996",
        // },
      ],
    },
    {
      name: "product 2",
      type: "simple 1",
      regular_price: "2321.99",
    },
  ],
};
