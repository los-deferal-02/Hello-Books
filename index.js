import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import logger from 'morgan';
import routes from './server/routes';
import swaggerDoc from './hello-books-swagger.json';
import ResponseSpec from './server/responseSpec';

const { error404, serverError } = ResponseSpec;

dotenv.config();
const port = process.env.PORT || 4000;
const app = express();

const { log } = console;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger('dev'));

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello Books'
  });
});

app.use('/api/v1', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use(serverError, error404);

app.listen(port, () => {
  log(`Server started on port ${port}`);
});

export default app;
