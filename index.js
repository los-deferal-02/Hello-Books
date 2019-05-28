import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import routes from './routes';

dotenv.config();
const port = process.env.PORT || 4000;
const app = express();

const { log } = console;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello Books Deferral'
  });
});

app.use('/api/v1/', routes);

app.all('/*', (req, res) => {
  res.status(404).json({
    error: 'Oops!! Page not found'
  });
});

app.listen(port, () => {
  log(`Server started on port ${port}`);
});

export default app;
