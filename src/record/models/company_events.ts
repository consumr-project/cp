import { Config, Type, merge /* tracking */ } from '../utils';

export = sequelize => {
    var Event = require('./event')(sequelize),
        Company = require('./company')(sequelize);

    var CompanyEvent = sequelize.define('company_event', merge({
        company_id: {
            type: Type.UUID,
            allowNull: false
        },

        event_id: {
            type: Type.UUID,
            allowNull: false
        }
    }), Config);

    Company.belongsToMany(Event, { through: CompanyEvent });
    Event.belongsToMany(Company, { through: CompanyEvent });

    return CompanyEvent;
};
