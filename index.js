import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import routes from './server/routes/index';
import swaggerDoc from './hello-books-swagger.json';
import { errorHandler, error404 } from './server/middlewares/errors';

dotenv.config();
const port = process.env.PORT || 4000;
const app = express();

const { log } = console;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use(errorHandler, error404);

app.listen(port, () => {
  log(`Server started on port ${port}`);
});

export default app;
