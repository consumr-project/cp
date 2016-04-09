"use strict";
var utils_1 = require('../utils');
var Type = require('sequelize/lib/data-types');
module.exports = function (sequelize) {
    var Product = require('./product')(sequelize), Company = require('./company')(sequelize);
    var CompanyProduct = sequelize.define('company_products', utils_1.merge({
        company_id: {
            type: Type.UUID,
            allowNull: false
        },
        product_id: {
            type: Type.UUID,
            allowNull: false
        }
    }), utils_1.CONFIG);
    Product.belongsToMany(Company, { through: CompanyProduct });
    Company.belongsToMany(Product, { through: CompanyProduct });
    return CompanyProduct;
};
