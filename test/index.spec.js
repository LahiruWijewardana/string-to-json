import Assert from 'assert';
import Converter from '../lib/index';

describe('Converter test', () => {
  it('Should return simple json object', () => {
    Assert.deepEqual(
      Converter.converter('{ app_id: "MOB0006", serviceProvider: 5, chargin_cycle: 70 }'),
      { app_id: 'MOB0006', serviceProvider: 5, chargin_cycle: 70 }
    );
  });
});
