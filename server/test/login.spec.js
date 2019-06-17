import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';
import inputs from './mockdata.test';

chai.use(chaiHttp);

const { validSignUpInputs } = inputs;
const API_ROUTE = '/api/v1/auth/login';

describe('User Login Test', () => {
  it('respond with token when signup is successful', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send(validSignUpInputs[1])
      .end((err, res) => {
        expect(res).to.have.status(201);
        done();
      });
  });
  describe('POST /api/v1/auth/login', () => {
    it('respond with token if login is successful with email', (done) => {
      chai
        .request(app)
        .post(API_ROUTE)
        .send({
          userLogin: validSignUpInputs[1].email,
          password: validSignUpInputs[1].password
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.data).to.have.property('token');
          done();
        });
    });

    it('respond with token if login is successful with user name', (done) => {
      chai
        .request(app)
        .post(API_ROUTE)
        .send({
          userLogin: validSignUpInputs[1].userName,
          password: validSignUpInputs[1].password
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.data).to.have.property('token');
          done();
        });
    });

    it('respond with 404 error if user not found', (done) => {
      chai
        .request(app)
        .post(API_ROUTE)
        .send({
          userLogin: 'Ayodeji',
          password: validSignUpInputs[1].password
        })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.data)
            .to.have.property('message')
            .to.deep.equal('Invalid Login Details');
          done();
        });
    });

    it('respond with 401 error if user password is invalid', (done) => {
      chai
        .request(app)
        .post(API_ROUTE)
        .send({
          userLogin: validSignUpInputs[1].email,
          password: 'wrongPassword'
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.data)
            .to.have.property('message')
            .to.deep.equal('Invalid Login Details');
          done();
        });
    });

    it('respond with an error when a required field is missing', (done) => {
      chai
        .request(app)
        .post(API_ROUTE)
        .send({
          userLogin: '',
          password: ''
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.data)
            .to.have.property('userLogin')
            .to.deep.equal('Username or email is required');
          done();
        });
    });

    it('should redirect users to log in with Google account', (done) => {
      chai
        .request(app)
        .get('/api/v1/auth/google')
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });

    it('redirect users to log in with their FaceBook account', (done) => {
      chai
        .request(app)
        .get('/api/v1/auth/facebook')
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });

    it('500 internal error if server encounters error', (done) => {
      const stub = sinon.stub(pool, 'query').rejects(new Error('Just tesing'));
      chai
        .request(app)
        .post(API_ROUTE)
        .send(validLoginInputs[1])
        .end((err, res) => {
          expect(res).to.have.status(500);
          stub.restore();
          done();
        });
    });
  });
});
