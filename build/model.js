function model(name, conn) {
    return require('./models/' + name)(conn, require('sequelize/lib/data-types'));
}
module.exports = function (conn) {
    return {
        Company: model('company', conn),
        CompanyEvent: model('company_events', conn),
        CompanyFollower: model('company_followers', conn),
        Event: model('event', conn),
        EventSource: model('event_source', conn),
        EventTag: model('event_tag', conn),
        Tag: model('tag', conn),
        User: model('user', conn)
    };
};
