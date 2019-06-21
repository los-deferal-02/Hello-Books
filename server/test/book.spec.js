/* eslint-disable max-len */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';
import inputs from './mockdata.test';

chai.use(chaiHttp);

const { validSignUpInputs } = inputs;

let authToken;
let nonAdminToken;
describe('User add book test', () => {
  before((done) => {
    const user = validSignUpInputs[5];
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        const { token } = res.body.data;
        authToken = `Bearer ${token}`;
        done();
      });
  });

  before((done) => {
    const user = validSignUpInputs[6];
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        const { token } = res.body.data;
        nonAdminToken = `Bearer ${token}`;
        done();
      });
  });

  before((done) => {
    chai
      .request(app)
      .post('/api/v1/books')
      .set('authorization', authToken)
      .send({
        title: 'A Song of Ice & Fire',
        body: 'The Game of Thrones',
        description:
          'The five kingdoms are at war and all houses are fighting for who will sit on the iron throne',
        genre: 'Fiction',
        hardcopy: true,
        pages: 1003,
        author: 'George RR Martin'
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.has.property('data');
        done();
      });
  });

  describe('POST /api/v1/books', () => {
    it('Respond with a status of 201 and book details on successful book add', (done) => {
      chai
        .request(app)
        .post('/api/v1/books')
        .send({
          title: 'Antman & The Wasp',
          body: 'Antman is back!',
          description:
            'Scott Lang teams up with the Wasp to save the world again',
          genre: 'Fantasy',
          hardcopy: true,
          pages: 70,
          author: 'Stan Lee'
        })
        .set('authorization', authToken)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.has.property('data');
          done();
        });
    });

    it('Should add a new book with existing author and genre', (done) => {
      chai
        .request(app)
        .post('/api/v1/books')
        .set('authorization', authToken)
        .send({
          title: 'X-Men: First Class',
          body: 'Travel back in time with the X-Men!',
          description:
            'The X-Men is born, a new breed of mutants save the world',
          genre: 'Fantasy',
          hardcopy: true,
          pages: 70,
          author: 'Stan Lee'
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.has.property('data');
          done();
        });
    });

    it('Should not add a new book if user is not admin or author', (done) => {
      chai
        .request(app)
        .post('/api/v1/books')
        .set('authorization', nonAdminToken)
        .send({
          title: 'X-Men: First Class',
          body: 'Travel back in time with the X-Men!',
          description:
            'The X-Men is born, a new breed of mutants save the world',
          genre: 'Fantasy',
          hardcopy: true,
          pages: 70,
          author: 'Stan Lee'
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body)
            .to.has.property('status')
            .eql('fail');
          expect(res.body)
            .to.have.nested.property('data.message')
            .eql('You are not authorized!');
          done();
        });
    });

    it('Should not add a book if a required field is missing', (done) => {
      chai
        .request(app)
        .post('/api/v1/books')
        .set('authorization', authToken)
        .send({
          title: 'X-Men',
          body: 'Travel back in time with the X-Men!',
          description:
            'The X-Men is born, a new breed of mutants save the world',
          genre: 'Fantasy',
          hardcopy: null,
          pages: 70,
          author: 'Stan Lee'
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.has.property('data');
          done();
        });
    });
  });

  it('Should return a single book with the details', (done) => {
    chai
      .request(app)
      .get('/api/v1/books/1')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.has.property('status')
          .eql('success');
        expect(res.body).to.have.nested.property('data.title');
        done();
      });
  });

  it('Should return a not-found error requesting a non-existent book', (done) => {
    chai
      .request(app)
      .get('/api/v1/books/80')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body)
          .to.has.property('status')
          .eql('fail');
        expect(res.body)
          .to.have.nested.property('data.bookId')
          .eql('Book not found');
        done();
      });
  });

  it('Should return all books with their details', (done) => {
    chai
      .request(app)
      .get('/api/v1/books')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.has.property('status')
          .eql('success');
        expect(res.body).to.have.property('data');
        done();
      });
  });

  it('Should modify the verification status of a book', (done) => {
    chai
      .request(app)
      .patch('/api/v1/books/1')
      .set('authorization', authToken)
      .send({
        verification: 'verified'
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.has.property('status')
          .eql('success');
        expect(res.body)
          .to.have.nested.property('data.verification')
          .eql('verified');
        done();
      });
  });

  it('Should not modify the verification status of a book if requested by non-admin', (done) => {
    chai
      .request(app)
      .patch('/api/v1/books/2')
      .set('authorization', nonAdminToken)
      .send({
        verification: 'verified'
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body)
          .to.has.property('status')
          .eql('fail');
        expect(res.body)
          .to.have.nested.property('data.message')
          .eql('You are not authorized!');
        done();
      });
  });

  it('Should not modify the verification status of a book if an invalid status is provided', (done) => {
    chai
      .request(app)
      .patch('/api/v1/books/2')
      .set('authorization', authToken)
      .send({
        verification: 'checked'
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body)
          .to.has.property('status')
          .eql('fail');
        expect(res.body).to.have.nested.property('data.verification');
        done();
      });
  });

  it('Should return a not-found error when modifying a non-existent book', (done) => {
    chai
      .request(app)
      .patch('/api/v1/books/80')
      .set('authorization', authToken)
      .send({
        verification: 'verified'
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body)
          .to.has.property('status')
          .eql('fail');
        expect(res.body)
          .to.have.nested.property('data.bookId')
          .eql('Book not found');
        done();
      });
  });

  it('Should delete a book', (done) => {
    chai
      .request(app)
      .delete('/api/v1/books/1')
      .set('authorization', authToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.has.property('status')
          .eql('success');
        expect(res.body)
          .to.have.nested.property('data.bookId')
          .eql('This book has been successfully deleted');
        done();
      });
  });

  it('Should delete a book', (done) => {
    chai
      .request(app)
      .delete('/api/v1/books/2')
      .set('authorization', authToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.has.property('status')
          .eql('success');
        expect(res.body)
          .to.have.nested.property('data.bookId')
          .eql('This book has been successfully deleted');
        done();
      });
  });

  it('Should return a not-found error if there are no books in the DB', (done) => {
    chai
      .request(app)
      .get('/api/v1/books')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body)
          .to.has.property('status')
          .eql('fail');
        expect(res.body)
          .to.have.nested.property('data.message')
          .eql('There are no books at this time');
        done();
      });
  });

  describe('POST /api/v1/books/:id/favourites', () => {
    it('Respond with a status of 200 if book is favoruted successfully', (done) => {
      chai
        .request(app)
        .post('/api/v1/books/3/favourites')
        .set('authorization', authToken)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.has.property('data');
          done();
        });
    });

    it('Respond with a status of 404 if book is not found', (done) => {
      chai
        .request(app)
        .post('/api/v1/books/13/favourites')
        .set('authorization', authToken)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.data.book).to.equal('Book Not Found');
          done();
        });
    });

    it('Respond with a status of 409 if book has already been added', (done) => {
      chai
        .request(app)
        .post('/api/v1/books/3/favourites')
        .set('authorization', authToken)
        .end((err, res) => {
          expect(res).to.have.status(409);
          expect(res.body.data.book).to.equal(
            'Book is already added as favourite'
          );
          done();
        });
    });
  });

  describe('GET /api/v1/books/all/favourites', () => {
    it('Respond with a status of 200 if favorite list is available', (done) => {
      chai
        .request(app)
        .get('/api/v1/books/all/favourites')
        .set('authorization', authToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.has.property('data');
          done();
        });
    });

    it('Respond with a status of 404 if favorite list is not available', (done) => {
      chai
        .request(app)
        .get('/api/v1/books/all/favourites')
        .set('authorization', nonAdminToken)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.data.book).to.equal(
            'You have not yet favourited any books'
          );
          done();
        });
    });
  });

  describe('DELETE /api/v1/books/:id/favourites', () => {
    it('Respond with a status of 200 if book is removed favourite list', (done) => {
      chai
        .request(app)
        .delete('/api/v1/books/3/favourites')
        .set('authorization', authToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.has.property('data');
          done();
        });
    });

    it('Respond with a status of 404 if book does not exist', (done) => {
      chai
        .request(app)
        .delete('/api/v1/books/89/favourites')
        .set('authorization', authToken)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.data.book).to.equal('Book Not Found');
          done();
        });
    });

    it('Respond with a status of 404 if book is not in favorite list', (done) => {
      chai
        .request(app)
        .delete('/api/v1/books/4/favourites')
        .set('authorization', authToken)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.data.book).to.equal(
            'Book Not Found in your Favourite List'
          );
          done();
        });
    });
  });
});
