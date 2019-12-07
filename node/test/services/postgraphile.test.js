const assert = require('assert');
const app = require('../../src/app');

describe('\'postgraphile\' service', () => {
  it('registered the service', () => {
    const service = app.service('graphql_schema');

    assert.ok(service, 'Registered the service');
  });
});
