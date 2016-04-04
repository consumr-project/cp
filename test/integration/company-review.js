'use strict';

const cp = require('base-service/test/utils');
const clone = require('lodash').clone;
const config = require('acm');
const fixture = clone(config('fixtures'));

// for (var i = 0; i < 10; i++)
cp.tapes('company review', t => {
    t.plan(1);

    cp.login(fixture.user.admin.auth_apikey).end((err, res) => {
        t.error(err);

        fixture.company.created_by = res.body.id;
        fixture.company.updated_by = res.body.id;
    });

    clean_up();

    t.test('setup', st => {
        st.plan(2);

        cp.post('/companies', fixture.company).end((err, res) =>
            st.ok(res.body.meta.ok, 'created test company'));

        cp.post('/users', fixture.user.user).end((err, res) =>
            st.ok(res.body.meta.ok, 'created test user'));
    });

    t.test('create reviews', st => {
        st.plan(fixture.reviews.length);

        fixture.reviews.forEach((review, i) => setTimeout(() =>
            cp.post(`/companies/${fixture.company.id}/reviews`, review).end((err, res) =>
                st.ok(res.body.meta.ok, 'created test review')), 200 * ++i));
    });

    t.test('set usefulness flags', st => {
        st.plan(fixture.review_usefulness.length);

        fixture.review_usefulness.forEach(review_usefulness =>
            cp.patch(`/reviews/${review_usefulness.review_id}/usefull`, review_usefulness)
                .end((err, res) => st.ok(res.body.meta.ok, 'created test review usefull flag')));
    });

    t.test('usefulness flags have a min and max', st => {
        var review_usefulness = clone(fixture.review_usefulness[0]);

        st.plan(2);

        review_usefulness.score = -2;
        cp.patch(`/reviews/${review_usefulness.review_id}/usefull`, review_usefulness).end((err, res) => {
            st.notOk(res.body.meta.ok);
        });

        review_usefulness.score = 2;
        cp.patch(`/reviews/${review_usefulness.review_id}/usefull`, review_usefulness).end((err, res) => {
            st.notOk(res.body.meta.ok);
        });
    });

    t.test('get reviews', st => {
        st.plan(6);

        cp.get(`/companies/${fixture.company.id}/reviews`).end((err, res) => {
            st.ok(res.body.meta.ok, 'can retrieve a company\'s reviews');
            st.equal(fixture.reviews[0].id, res.body.body[4].id);
            st.equal(fixture.reviews[1].id, res.body.body[3].id);
            st.equal(fixture.reviews[2].id, res.body.body[2].id);
            st.equal(fixture.reviews[3].id, res.body.body[1].id);
            st.equal(fixture.reviews[4].id, res.body.body[0].id);
        });
    });

    t.test('get reviews for user', st => {
        st.plan(11);

        cp.get(`/companies/${fixture.company.id}/reviews?user_id=${fixture.user.user.id}`).end((err, res) => {
            st.ok(res.body.meta.ok, 'can retrieve a company\'s reviews for a user');

            st.equal(fixture.reviews[0].id, res.body.body[4].id);
            st.equal(fixture.reviews[1].id, res.body.body[3].id);
            st.equal(fixture.reviews[2].id, res.body.body[2].id);
            st.equal(fixture.reviews[3].id, res.body.body[1].id);
            st.equal(fixture.reviews[4].id, res.body.body[0].id);

            st.equal(res.body.body[0].already_found_useful, true);
            st.equal(res.body.body[1].already_found_useful, true);
            st.equal(res.body.body[2].already_found_useful, false);
            st.equal(res.body.body[3].already_found_useful, false);
            st.equal(res.body.body[4].already_found_useful, false);
        });
    });

    t.test('get reviews summary', st => {
        st.plan(5);

        cp.get(`/companies/${fixture.company.id}/reviews/summary`).end((err, res) => {
            st.ok(res.body.meta.ok, 'can retrieve a company\'s reviews summary');
            st.deepLooseEqual(res.body.body[0], { score: 1, score_count: 1, score_percentage: 20 });
            st.deepLooseEqual(res.body.body[1], { score: 2, score_count: 1, score_percentage: 20 });
            st.deepLooseEqual(res.body.body[2], { score: 3, score_count: 1, score_percentage: 20 });
            st.deepLooseEqual(res.body.body[3], { score: 5, score_count: 2, score_percentage: 40 });
        });
    });

    t.test('get reviews score summary', st => {
        st.plan(2);

        cp.get(`/companies/${fixture.company.id}/reviews/score`).end((err, res) => {
            st.ok(res.body.meta.ok, 'can retrieve a company\'s score summary');
            st.deepLooseEqual(res.body.body, { count: 5, average: 3.2 });
        });
    });

    clean_up();

    function clean_up() {
        t.test('clean up', st => {
            st.plan(1 + fixture.reviews.length + fixture.review_usefulness.length);

            cp.purge(`/companies/${fixture.company.id}`).end((err, res) =>
                st.ok(res.body.meta.ok, 'deleted test company'));

            fixture.review_usefulness.forEach(review_usefulness =>
                cp.purge(`/reviews/${review_usefulness.review_id}/usefull/${review_usefulness.user_id}`)
                    .end((err, res) => st.ok(res.body.meta.ok, 'deleted test review flag')));

            fixture.reviews.forEach((review, i) => setTimeout(() =>
                cp.purge(`/reviews/${review.id}`).end((err, res) =>
                    st.ok(res.body.meta.ok, 'deleted test review')), 200 * ++i))
        });

        t.test('clean up', st => {
            st.plan(1);

            cp.purge(`/users/${fixture.user.user.id}`).end((err, res) =>
                st.ok(res.body.meta.ok, 'deleted test user'));
        });
    }
});
