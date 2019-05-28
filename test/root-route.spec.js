import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);
const { expect } = chai;

describe('Root URL', () => {
  describe('App Root', () => {
    it('should return status 200 and a message attribute', (done) => {
      chai.request(app)
        .get('/')
        .end((err, res) => {
          const { message } = res.body;

          expect(res).to.have.status(200);
          expect(message).to.equal('Hello Books Deferral');
          done();
        });
    });
  });

  describe('API Root', () => {
    it('should return status 200 and a message attribute', (done) => {
      chai.request(app)
        .get('/api/v1')
        .end((err, res) => {
          const { message } = res.body;

          expect(res).to.have.status(200);
          expect(message).to.equal('Hello Books Deferral API Version 1');
          done();
        });
    });
  });
});
