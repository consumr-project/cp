import { CONFIG, TRACKING, merge } from '../utils';
import { DataTypes } from 'sequelize';

const Type: DataTypes = require('sequelize/lib/data-types');

export = sequelize => {
    var Product = require('./product')(sequelize),
        Company = require('./company')(sequelize);

    var CompanyProduct = sequelize.define('company_products', merge(TRACKING(), {
        company_id: {
            type: Type.UUID,
            allowNull: false
        },

        product_id: {
            type: Type.UUID,
            allowNull: false
        }
    }), CONFIG);

    Product.belongsToMany(Company, { through: CompanyProduct });
    Company.belongsToMany(Product, { through: CompanyProduct });

    return CompanyProduct;
};
