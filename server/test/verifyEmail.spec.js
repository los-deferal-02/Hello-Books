import sinon from 'sinon';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';
import inputs from './mockdata.test';
import userModel from '../models/users';
import pool from '../config/index';
import encrypt from '../helpers/encrypt';

chai.use(chaiHttp);

const { generateToken } = encrypt;
const { validSignUpInputs } = inputs;

describe('Email verification test', () => {
  let emailConfirmCode;
  const { email } = validSignUpInputs[3];
  before(async () => {
    const code = generateToken(validSignUpInputs[3]);
    emailConfirmCode = code.slice(0, 64);
    const data = {
      emailConfirmCode,
      ...validSignUpInputs[3]
    };
    await userModel.create(data);
  });
  it('should verify email when user makes valid request', (done) => {
    chai
      .request(app)
      .patch(`/api/v1/verifyEmail/${email}/${emailConfirmCode}`)
      .send(validSignUpInputs[3])
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data).to.have.property('message');
        expect(res.body.data.message).to.equal('Email verified');
        done();
      });
  });

  it('should return a 404 if requested email does not exist', (done) => {
    chai
      .request(app)
      .patch(`/api/v1/verifyEmail/marsman@yahoo.com/${email}`)
      .send(validSignUpInputs[3])
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.status).to.equal('fail');
        expect(res.body.data.message).to.equal('User not found');
        done();
      });
  });

  it('should throw an error when verification code is wrong', (done) => {
    chai
      .request(app)
      .patch(`/api/v1/verifyEmail/${email}/${email}`)
      .send(validSignUpInputs[3])
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.body.status).to.equal('error');
        expect(res.body.message).to.equal(
          'Sorry, something unusual happened, we are working on a fix'
        );
        done();
      });
  });

  it('should throw 500 error if there is a server error', (done) => {
    const stub = sinon
      .stub(pool, 'query')
      .rejects(new Error('Test server error'));
    chai
      .request(app)
      .patch(`/api/v1/verifyEmail/${email}/${emailConfirmCode}`)
      .send(validSignUpInputs[3])
      .end((err, res) => {
        expect(res).to.have.status(500);
        stub.restore();
        done();
      });
  });
});
