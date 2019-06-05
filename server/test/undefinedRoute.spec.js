import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';

chai.use(chaiHttp);
const { expect } = chai;

describe('Undefined Routes', () => {
  it('should return status 404 and an error attribute', (done) => {
    chai
      .request(app)
      .get('/randomRoute')
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
});
