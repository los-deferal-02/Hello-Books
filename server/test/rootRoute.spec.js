import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';

chai.use(chaiHttp);
const { expect } = chai;

describe('Root url Test', () => {
  describe('App Root', () => {
    it('should return status 200 and a message attribute', (done) => {
      chai
        .request(app)
        .get('/api/v1')
        .end((err, res) => {
          const { message } = res.body;
          expect(res).to.have.status(200);
          expect(message).to.deep.equal('Hello Books API');
          done();
        });
    });
  });

  describe('API Root', () => {
    it('should return status 200 and a message attribute', (done) => {
      chai
        .request(app)
        .get('/api/v1')
        .end((err, res) => {
          const { message } = res.body;
          expect(res).to.have.status(200);
          expect(message).to.equal('Hello Books API');
          done();
        });
    });
  });
});

describe('Undefined Routes', () => {
  it('should return status 404 and an error attribute', (done) => {
    chai
      .request(app)
      .get('/randomRoute')
      .end((err, res) => {
        const { message } = res.body;
        expect(res).to.have.status(404);
        expect(message).to.deep.equal('Oops!! Page not found');
        done();
      });
  });
});
