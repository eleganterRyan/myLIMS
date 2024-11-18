import express from 'express';
import {
  createLaboratory,
  getLaboratories,
  updateLaboratory,
  deleteLaboratory
} from '../controllers/laboratoryController';

const router = express.Router();

router.post('/', createLaboratory);
router.get('/', getLaboratories);
router.put('/:id', updateLaboratory);
router.delete('/:id', deleteLaboratory);

export default router; 