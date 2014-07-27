'use strict';

module.exports = function (context, option) {
    // console.info('this == ' + this);

    var productSpace = context.data.root.productGlobal,
        productObject = productSpace[this];

        if (!productObject.isActive) {
            return false;
        } else {
            return context.fn(productSpace[this]);
        }

};


