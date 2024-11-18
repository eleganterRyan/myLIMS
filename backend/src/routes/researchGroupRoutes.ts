import express from 'express';
import {
  createResearchGroup,
  getResearchGroups,
  updateResearchGroup,
  deleteResearchGroup
} from "../controllers/researchGroupController";

const router = express.Router();

router.post('/', createResearchGroup);
router.get('/', getResearchGroups);
router.put('/:id', updateResearchGroup);
router.delete('/:id', deleteResearchGroup);

export default router; 