import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import routes from './routes/index';

dotenv.config();
const port = process.env.PORT || 4000;
const app = express();

const { log } = console;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/v1', routes);

app.use('*', (req, res) => {
  res.status(404).json({
    message: 'O0ps!!, the page you are looking for cannot be found',
  });
});

app.listen(port, () => {
  log(`Server started on port ${port}`);
});

export default app;
