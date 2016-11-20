import { Config, Type, merge /* tracking */ } from '../utils';

export = sequelize => {
    var Product = require('./product')(sequelize),
        Company = require('./company')(sequelize);

    var CompanyProduct = sequelize.define('company_products', merge({
        company_id: {
            type: Type.UUID,
            allowNull: false
        },

        product_id: {
            type: Type.UUID,
            allowNull: false
        }
    }), Config);

    Product.belongsToMany(Company, { through: CompanyProduct });
    Company.belongsToMany(Product, { through: CompanyProduct });

    return CompanyProduct;
};
