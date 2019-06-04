import express from 'express';
import dotenv from 'dotenv';
import Debug from 'debug';
import swaggerUi from 'swagger-ui-express';
import routes from './server/routes';
import swaggerDoc from './hello-books-swagger.json';
import { errorHandler, error404 } from './server/middlewares/errors';

dotenv.config();
const port = process.env.PORT || 4000;
const app = express();

const debug = Debug('dev');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello Books'
  });
});

app.use('/api/v1', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use(errorHandler, error404);

app.listen(port, () => {
  debug(`Server started on port ${port}`);
});

export default app;
