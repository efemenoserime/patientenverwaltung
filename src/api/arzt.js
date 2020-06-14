import { Router } from 'express';
import {
  listAerzte,
  erstelleArzt,
  getArzt,
  patientAnlegen,
} from '../controllers/arzt';

const router = Router();

router.route('/').get(listAerzte).post(erstelleArzt);

router.put('/:arzt_email/behandelt/:patient_email', patientAnlegen);

export default router;
