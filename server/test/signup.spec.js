import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';
import inputs from './mockdata.test';

chai.use(chaiHttp);

const { validSignUpInputs, invalidSignupInputs } = inputs;

const API_ROUTE = '/api/v1/auth/signup';

describe('User Registration Test', () => {
  describe('POST /api/v1/auth/signup', () => {
    it('sign user up when successful', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send(validSignUpInputs[0])
        .end((err, res) => {
          expect(res).to.have.status(201);
          done();
        });
    });

    it('Should return an error when a required field is missing', (done) => {
      chai
        .request(app)
        .post(API_ROUTE)
        .send(invalidSignupInputs[1])
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.data).to.have.property('userName');
          done();
        });
    });
  });
});
