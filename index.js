import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import routes from './server/routes';
import swaggerDoc from './hello-books-swagger.json';

dotenv.config();
const port = process.env.PORT || 4000;
const app = express();

const { log } = console;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Oops!!, the page you are looking for cannot be found'
  });
});

app.listen(port, () => {
  log(`Server started on port ${port}`);
});

export default app;
