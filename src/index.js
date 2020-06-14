import express from 'express';
import aerzteRoutes from './api/arzt';
import patientenRoutes from './api/patient';
import swaggerDoc from '../swagger.json';
import swaggerUi from 'swagger-ui-express';

const app = express();

app.use(express.json());

app.use('/aerzte', aerzteRoutes);
app.use('/patienten', patientenRoutes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.get('/', (req, res) => {
  res.status(200).send({ version: 0.1 });
});

app.listen(8080, () => console.log(`Server is running..`));
