'use strict';

var cloudinaryAPI = require('*/cartridge/scripts/api/cloudinaryApi');
var cloudinaryConstants = require('*/cartridge/scripts/util/cloudinaryConstants');
var cloudinaryModel = require('*/cartridge/scripts/model/cloudinaryModel');
var Logger = require('dw/system/Logger');
var Status = require('dw/system/Status');

exports.modifyGETResponse = function (product) {
    try {
        if (cloudinaryConstants.CLD_ENABLED) {
            var prd = product && product.hits && product.hits.length > 0 ? product.hits.toArray() : null;
            var item = null;

            if (!empty(prd)) {
                prd.forEach(function (key) {
                    item = key;
                    var cloudinaryImage = cloudinaryModel.getProductPrimaryImage(item.productId,
                        cloudinaryConstants.CLD_HIGH_RES_IMAGES_VIEW_TYPE, { pageType: cloudinaryConstants.PAGE_TYPES.PLP });
                    item.c_cloudinary = cloudinaryImage;
                    var imagePageTypeSetting = JSON.parse(cloudinaryConstants.CLD_IMAGE_PAGE_TYPE_SETTINGS);
                    item.c_cloudinary.c_autoResponsiveDimensions = imagePageTypeSetting.plp.autoResponsiveDimensions;
                    item.c_cloudinary.plpEnabled = cloudinaryConstants.CLD_IMAGE_PAGE_TYPE_SETTINGS_OBJECT.plp.enabled;
                });
            }

            // Get Search Refinement Swatches on PLP
            var refinements = product && product.refinements && product.refinements.length > 0 ? product.refinements.toArray() : null;
            
            if (!empty(refinements)) {
                refinements.forEach(function (elem) {
                    item = elem;
                    if (item.attributeId === 'c_color') {
                        var colorValues = item.values.length > 0 ? item.values.toArray() : null;
                        if (!empty(colorValues)) {
                            colorValues.forEach(function (ele) {
                                var key = ele;
                                cloudinaryAPI.getProductPrimaryImageURLUsingTagName(null, {
                                    pageType: cloudinaryConstants.PAGE_TYPES.CLD_PLP_SWATCH,
                                    isSwatch: true,
                                    variationAttrValueID: key.value
                                });
                            });
                        }
                    }
                });
            }
        }
    } catch (ex) {
        Logger.error('productSearch~modifyGETResponse -> There is an error while executing the file {0} at: line number {1}: {2}', ex.fileName, ex.lineNumber, ex.toString());
    }
    return new Status(Status.OK);
};
