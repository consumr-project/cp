import { Config, Type, merge /* tracking */ } from '../utils';

import gen_company from './company';
import gen_product from './product';

export default sequelize => {
    var Product = gen_product(sequelize),
        Company = gen_company(sequelize);

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
