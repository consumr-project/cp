# getting started

run `./script/bootstrap test` to setup your app for testing. the following
targes are available: `test-e2e`, `test-integration`, `test-unit`, and `test`
which triggers the last two. the e2e tests require that webdriver be runnig
which can be done with `make test-start-webdriver`.

```bash
# runs unit and integration tests
make test
```

```bash
# runs e2e tests
make test-start-webdriver
make test-e2e
```

the following environment variables are required to put parts of the
application in "test" mode and allow additional authentication and database
methods (eg. api key logins, hard-deleteds, etc. a lot of tests will not work
without these features enabled) and point to an instance:

```bash
export CP_ALLOW_APIKEY_AUTH=        # enable apikey authentication
export CP_PURGE_KEY=                # random string used to allow DELETE
export CP_TEST_INSTANCE_URL=        # absolute url to instance you're testing
```

# structure

- `e2e` is for end-to-end tests building using protractor (so angular stuff)
- `extract` is for integration tests for external services (will need internet)
- `integration` is for integration tests for internal services (won't need internet)
- `src` is for unit tests
