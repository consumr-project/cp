exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: [
        '../test/e2e/init.js',
        '../test/e2e/admin-spec.js'
        // '../test/e2e/*-spec.js'
    ],

    multiCapabilities: [
        // https://itisatechiesworld.wordpress.com/2015/04/15/steps-to-get-selenium-webdriver-running-on-safari-browser/
        // { browserName: 'safari' },
        // { browserName: 'firefox' },
        { browserName: 'chrome' },
    ],

    user: {
        email: process.env.LINKEDIN_USER,
        pass: () => process.env.LINKEDIN_PASS,
        name: 'Marcos Minond',
    }
};
