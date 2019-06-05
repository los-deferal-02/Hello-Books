import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';
import inputs from './mockdata.test';
import pool from '../config/index';

chai.use(chaiHttp);

const {
  validSignUpInputs,
  invalidSignupInputs,
  validResetPasswordInput,
  invalidResetPasswordInput
} = inputs;

describe('Password reset tests', () => {
  it('respond with token when signup is successful', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send(validSignUpInputs[2])
      .end((err, res) => {
        expect(res).to.have.status(201);
        done();
      });
  });
  describe('POST /api/v1/auth/forgot', () => {
    it('Return a 404 for an Email that does not exist', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/forgot')
        .send({
          userLogin: invalidSignupInputs[0].email
        })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.data)
            .to.have.property('message')
            .to.deep.equal('Email does not exist');
          done();
        });
    });

    it('It should create a token for reseting a user password', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/forgot')
        .send({
          userLogin: validSignUpInputs[2].email
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.data).to.have.property('token');
          done();
        });
    });
  });
  describe('POST /api/v1/auth/reset/:token', () => {
    it('It should return a 401 if token is invalid', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/reset/0da3c6427f00c8a16470db9b2de1885a2ce1a1')
        .send(invalidResetPasswordInput)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.data)
            .to.have.property('message')
            .to.deep.equal('Token is not valid');
          done();
        });
    });

    it('return a 400 if confirmPassword and password differs', async () => {
      const user = await pool.query(
        `SELECT * FROM users
        WHERE email = '${validSignUpInputs[2].email}'`
      );
      chai
        .request(app)
        .post(`/api/v1/auth/reset/${user.rows[0].resetpasswordtoken}`)
        .send(invalidResetPasswordInput[0])
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.data)
            .to.have.property('message')
            .to.deep.equal('Confirm password and Password must match');
        });
    });

    it('It should return a 200 if input is valid', async () => {
      const user = await pool.query(
        `SELECT * FROM users
        WHERE email = '${validSignUpInputs[2].email}'`
      );
      chai
        .request(app)
        .post(`/api/v1/auth/reset/${user.rows[0].resetpasswordtoken}`)
        .send(validResetPasswordInput[0])
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.data)
            .to.have.property('message')
            .to.deep.equal('Password successfully changed');
        });
    });
  });
});
