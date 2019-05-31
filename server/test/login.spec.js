import sinon from 'sinon';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';
import inputs from './mockdata.test';
import pool from '../config/index';

chai.use(chaiHttp);

const { validSignUpInputs } = inputs;

describe('User Login Test', () => {
  it('respond with token when signup is successful', (done) => {
    chai.request(app).post('/api/v1/auth/signup')
      .send(validSignUpInputs[1])
      .end((err, res) => {
        expect(res).to.have.status(201);
        done();
      });
  });
  describe('POST /api/v1/auth/login', () => {
    it('respond with token if login is successful with email', (done) => {
      chai.request(app).post('/api/v1/auth/login')
        .send({
          userLogin: validSignUpInputs[1].email,
          password: validSignUpInputs[1].password
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('token');
          done();
        });
    });

    it('respond with token if login is successful with user name', (done) => {
      chai.request(app).post('/api/v1/auth/login')
        .send({
          userLogin: validSignUpInputs[1].username,
          password: validSignUpInputs[1].password
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('token');
          done();
        });
    });

    it('respond with 404 error if user not found', (done) => {
      chai.request(app).post('/api/v1/auth/login')
        .send({
          userLogin: 'Ayodeji',
          password: validSignUpInputs[1].password
        })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('error')
            .to.deep.equal('Invalid Login Details');
          done();
        });
    });

    it('respond with 401 error if user password ids invalid', (done) => {
      chai.request(app).post('/api/v1/auth/login')
        .send({
          userLogin: validSignUpInputs[1].email,
          password: 'wrongPassword'
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('error')
            .to.deep.equal('Invalid Login Details');
          done();
        });
    });

    it('500 internal error if server encounters error', (done) => {
      const stub = sinon.stub(pool, 'query')
        .rejects(new Error('Just tesing'));
      chai.request(app).post('/api/v1/auth/login')
        .send(validSignUpInputs[1]).end((err, res) => {
          expect(res).to.have.status(500);
          stub.restore();
          done();
        });
    });
  });
});
