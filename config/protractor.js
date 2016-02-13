exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: [
        '../test/e2e/utils.js',
        '../test/e2e/*-spec.js'
    ],

    user: {
        email: process.env.LINKEDIN_USER,
        pass: () => process.env.LINKEDIN_PASS,
        name: 'Marcos Minond',
    }
};
