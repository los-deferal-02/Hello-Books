import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';
import inputs from './mockdata.test';

chai.use(chaiHttp);
const { userSignupInputforAuthor } = inputs;

let userToken;
describe('Author Routes Test', () => {
  describe("Users can favourite authors - POST '/api/v1/authors/:id/favorite'",
    () => {
      before(async () => {
        const res = await chai.request(app)
          .post('/api/v1/auth/signup').send(userSignupInputforAuthor);
        userToken = res.body.data.token;
      });
      it('respond with 404 when author is not found', async () => {
        const res = await chai.request(app)
          .post('/api/v1/authors/5/favourite')
          .set({ Authorization: `Bearer ${userToken}` });
        expect(res).to.have.status(404);
        expect(res.body.data.author).to.equal('Author Not Found');
      });

      it('respond with 201 when author is added to favourite list',
        async () => {
          const res = await chai.request(app)
            .post('/api/v1/authors/1/favourite')
            .set({ Authorization: `Bearer ${userToken}` });
          expect(res).to.have.status(201);
          expect(res.body.data.message).to
            .equal('Author added to your favourite list');
        });

      it('respond with 409 when author is already in favourite list',
        async () => {
          const res = await chai.request(app)
            .post('/api/v1/authors/1/favourite')
            .set({ Authorization: `Bearer ${userToken}` });
          expect(res).to.have.status(409);
          expect(res.body.data.author).to
            .equal('Author is already added as favourite');
        });
    });
});
