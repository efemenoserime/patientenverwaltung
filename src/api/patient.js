import { Router } from 'express';
import { listPatienten, erstellePatient } from '../controllers/patient';

const router = Router();

router.route('/').get(listPatienten).post(erstellePatient);

export default router;
