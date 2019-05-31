import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import routes from './server/routes';
import swaggerDoc from './hello-books-swagger.json';
import { errorHandler, error404 } from './server/middlewares/errors';

dotenv.config();
const port = process.env.PORT || 4000;
const app = express();

const { log } = console;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello Books Deferral'
  });
});

app.use('/api/v1', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
<<<<<<< HEAD

app.all('/*', (req, res) => {
  res.status(404).json({
    error: 'Oops!! Page not found'
  });
});
=======
app.use(errorHandler, error404);
>>>>>>> Merge with develop

app.listen(port, () => {
  log(`Server started on port ${port}`);
});

export default app;
