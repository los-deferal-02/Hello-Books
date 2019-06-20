import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';
import inputs from './mockdata.test';

chai.use(chaiHttp);

const { validAddBookInput } = inputs;

describe('User add book test', () => {
  describe('POST /api/v1/books', () => {
    it('Respond with a status of 201 and book details on successful book add',
      (done) => {
        chai
          .request(app)
          .post('/api/v1/books')
          .send(validAddBookInput)
          .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.has.property('data');
            done();
          });
      });
  });
});
