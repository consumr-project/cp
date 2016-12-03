import { Config, Type, merge /* tracking */ } from '../utils';
import { DbmsDevice } from '../../device/dbms';
import { UUID } from '../../lang';
import { Message, IdentifiableMessage, StampedMessage } from '../message';

import gen_company from './company';
import gen_product from './product';

export interface CompanyProductMessage extends IdentifiableMessage, StampedMessage {
    product_id: UUID;
    company_id: UUID;
}

export default (device: DbmsDevice) => {
    var Product = gen_product(device),
        Company = gen_company(device);

    var CompanyProduct = device.define<Message & CompanyProductMessage, CompanyProductMessage>('company_products', merge({
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
