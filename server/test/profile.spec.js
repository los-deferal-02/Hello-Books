import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';
import inputs from './mockdata.test';

chai.use(chaiHttp);
const { validLoginInputs } = inputs;

describe('View user profile routes', () => {
  const apiUrl = '/api/v1/userProfile';

  it('should return status 200 if request is successful', (done) => {
    chai
      .request(app)
      .get(`${apiUrl}/2`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data).to.have.property('userId');
        done();
      });
  });

  it('should return status 404 if profile does not exist', (done) => {
    chai
      .request(app)
      .get(`${apiUrl}/11`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.data.message).to.equal('Profile not found');
        done();
      });
  });
});

describe('Edit user profile routes', () => {
  const apiUrl = '/api/v1/userProfile';
  const data = {
    bio: 'Reading and Chilling',
    favoriteBook: 'You Dont Know JS',
    favoriteGenre: 'Code',
    favoriteAuthor: 'Kyle Simpson'
  };

  it('should return status 200 if request is successful', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send({
        userLogin: validLoginInputs[0].userLogin,
        password: validLoginInputs[0].password
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data).to.have.property('token');
        const { token } = res.body.data;
        const auth = `Bearer ${token}`;
        chai
          .request(app)
          .patch(`${apiUrl}/2`)
          .set('authorization', auth)
          .send(data)
          .end((err, response) => {
            expect(response).to.have.status(200);
            expect(response.body.data).to.have.property('userId');
            done();
          });
      });
  });

  it('should return status 401 profile is for another user', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send({
        userLogin: validLoginInputs[0].userLogin,
        password: validLoginInputs[0].password
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data).to.have.property('token');
        const { token } = res.body.data;
        const auth = `Bearer ${token}`;
        chai
          .request(app)
          .patch(`${apiUrl}/500`)
          .set('authorization', auth)
          .send(data)
          .end((err, response) => {
            expect(response).to.have.status(401);
            expect(response.body.data).to.have.property('message');
            expect(response.body.data.message).to.equal('Unauthorized access');
            done();
          });
      });
  });

  it('should return status 403 if no token', (done) => {
    chai
      .request(app)
      .patch(`${apiUrl}/1`)
      .send(data)
      .end((err, response) => {
        expect(response).to.have.status(403);
        expect(response.body.data).to.have.property('message');
        expect(response.body.data.message).to.equal('No token provided');
        done();
      });
  });

  it('should return status 403 if no token', (done) => {
    chai
      .request(app)
      .patch(`${apiUrl}/1`)
      .set('authorization', 'invalidToken')
      .send(data)
      .end((err, response) => {
        expect(response).to.have.status(401);
        expect(response.body.data).to.have.property('message');
        expect(response.body.data.message).to.equal(
          'Failed to authenticate token.'
        );
        done();
      });
  });
});
