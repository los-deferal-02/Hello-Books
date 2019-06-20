/* eslint-disable max-len */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';
import inputs from './mockdata.test';

chai.use(chaiHttp);
const { userSignupInputforAuthor } = inputs;

let userToken;
describe('Author Routes Test', () => {
  describe(`Users can favourite authors, 
    view favourite list and delete favourite`, () => {
    before(async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send(userSignupInputforAuthor);
      userToken = res.body.data.token;
    });

    before((done) => {
      chai
        .request(app)
        .post('/api/v1/books')
        .set('authorization', `Bearer ${userToken}`)
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

    it('respond with 404 when author is not found', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/authors/5/favourite')
        .set({ Authorization: `Bearer ${userToken}` });
      expect(res).to.have.status(404);
      expect(res.body.data.author).to.equal('Author Not Found');
    });

    it('respond with 404 when author name is not found', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/authors/JK/favourite')
        .set({ Authorization: `Bearer ${userToken}` });
      expect(res).to.have.status(404);
      expect(res.body.data.author).to.equal('Author Not Found');
    });

    it('respond with error 404 if user has no favourite author', async () => {
      const res = await chai
        .request(app)
        .get('/api/v1/authors/favourites')
        .set({ Authorization: `Bearer ${userToken}` });

      expect(res).to.have.status(404);
      expect(res.body.data.author).to.equal(
        'You have not yet favourited any author'
      );
    });

    it('respond with 201 when author is added to favourite list', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/authors/1/favourite')
        .set({ Authorization: `Bearer ${userToken}` });
      expect(res).to.have.status(201);
      expect(res.body.data.message).to.equal(
        'Author added to your favourite list'
      );
    });

    it('200 if user favourite author list is available', async () => {
      const res = await chai
        .request(app)
        .get('/api/v1/authors/favourites')
        .set({ Authorization: `Bearer ${userToken}` });

      expect(res).to.have.status(200);
      expect(res.body.data).to.be.an('array');
    });

    it('respond with 404 when author is not found', async () => {
      const res = await chai
        .request(app)
        .patch('/api/v1/authors/50/favourite')
        .set({ Authorization: `Bearer ${userToken}` });
      expect(res).to.have.status(404);
      expect(res.body.data.author).to.equal('Author Not Found');
    });

    it('respond with 409 when author is already in favourite list', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/authors/1/favourite')
        .set({ Authorization: `Bearer ${userToken}` });
      expect(res).to.have.status(409);
      expect(res.body.data.author).to.equal(
        'Author is already added as favourite'
      );
    });

    it('respond with 200 when author is deleted from favourite list', async () => {
      const res = await chai
        .request(app)
        .patch('/api/v1/authors/1/favourite')
        .set({ Authorization: `Bearer ${userToken}` });
      expect(res).to.have.status(200);
    });

    it(`respond with 404 when author is already 
      deleted from favourite list`, async () => {
      const res = await chai
        .request(app)
        .patch('/api/v1/authors/1/favourite')
        .set({ Authorization: `Bearer ${userToken}` });
      expect(res).to.have.status(404);
      expect(res.body.data.author).to.equal(
        'Author Not Found in your Favourite List'
      );
    });
  });
});
