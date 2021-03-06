import express from 'express';
import passport from 'passport';
import dotenv from 'dotenv';
import Debug from 'debug';
import swaggerUi from 'swagger-ui-express';
import logger from 'morgan';
import routes from './server/routes/index';
import swaggerDoc from './hello-books-swagger.json';
import ResponseSpec from './server/responseSpec';

const { error404, serverError } = ResponseSpec;

dotenv.config();
const port = process.env.PORT || 4000;
const app = express();

const debug = Debug('dev');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(logger('dev'));

app.use('/api/v1', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use(serverError, error404);

app.listen(port, () => {
  debug(`Server started on port ${port}`);
});

export default app;
