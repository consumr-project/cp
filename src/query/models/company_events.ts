import { CONFIG, merge } from '../utils';
// XXX import { CONFIG, TRACKING, merge } from '../utils';
import { DataTypes } from 'sequelize';

const Type: DataTypes = require('sequelize/lib/data-types');

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
    }), CONFIG);

    Company.belongsToMany(Event, { through: CompanyEvent });
    Event.belongsToMany(Company, { through: CompanyEvent });

    return CompanyEvent;
};
