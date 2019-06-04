import sinon from 'sinon';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';
import inputs from './mockdata.test';
import pool from '../config/index';

chai.use(chaiHttp);

const { validSignUpInputs } = inputs;

describe('User Registration Test', () => {
  describe('POST /api/v1/auth/signup', () => {
    it('respond with token when successful', (done) => {
      chai.request(app).post('/api/v1/auth/signup')
        .send(validSignUpInputs[0])
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.data).to.have.property('token');
          done();
        });
    });

    it('500 internal error if server encounters error', (done) => {
      const stub = sinon.stub(pool, 'query')
        .rejects(new Error('Just testing'));
      chai.request(app).post('/api/v1/auth/signup')
        .send(validSignUpInputs[0]).end((err, res) => {
          expect(res).to.have.status(500);
          stub.restore();
          done();
        });
    });
  });
});
