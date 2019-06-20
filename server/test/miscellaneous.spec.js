import { expect } from 'chai';
import isEmpty from '../helpers/isEmpty';

describe('Helper Function test', () => {
  it('Should return true for an empty string', () => {
    const emptyString = isEmpty(' ');
    expect(emptyString).to.equal(true);
  });
});
