import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';
import inputs from './mockdata.test';
import BookModel from '../models/books';
import UserModel from '../models/users';

chai.use(chaiHttp);

const {
  userTableSeed,
  validAddBookInput,
  validNewBookRequestInput,
  duplicateNewBookRequestInput
} = inputs;

describe('Books Resource Endpoints', () => {
  describe('POST /api/v1/books', () => {
    it('Respond with a status of 201 and book details on successful book add',
      (done) => {
        chai.request(app).post('/api/v1/books')
          .send(validAddBookInput)
          .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.has.property('data');
            done();
          });
      });
  });

  describe('POST /api/v1/books/request', () => {
    before('Setup database for new book request test', async () => {
      await UserModel.create(userTableSeed);
      await BookModel.createBookRequest(duplicateNewBookRequestInput);
    });

    it('should fail if a duplicate book request is made', (done) => {
      chai.request(app).post('/api/v1/books/request')
        .send(duplicateNewBookRequestInput)
        .end((err, res) => {
          const { status, data } = res.body;

          expect(res).to.have.status(409);
          expect(res.body).to.have.keys('status', 'data');
          expect(status).to.match(/fail/i);
          expect(data.message)
            .to.match(/request has already been made for this book/i);
          done();
        });
    });

    it('should be successful if a new book request is made', (done) => {
      chai.request(app).post('/api/v1/books/request')
        .send(validNewBookRequestInput)
        .end((err, res) => {
          const { status, data } = res.body;
          const { bookRequest } = res.body.data;

          expect(res).to.have.status(201);
          expect(res.body).to.have.keys('status', 'data');
          expect(status).to.match(/success/i);
          expect(data).to.be.an('object').that.has.key('bookRequest');
          expect(bookRequest).to.be.an('object');
          expect(bookRequest).to.have.keys('id', 'userId', 'title', 'author');
          done();
        });
    });
  });
});
