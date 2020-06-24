const Assert = require('assert');
const Converter = require('../lib/index');

describe('Converter test', async () => {
  it('Should return simple json object', async () => {
    Assert.deepEqual(
      await Converter.convertJson('{ app_data: { value: 1 }, app_id: "MOB0006" }'),
      { app_data: { value: 1 }, app_id: 'MOB0006' }
    );
  });
});
