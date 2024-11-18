import express from 'express';
import { getUsers, getUsersByRole } from '../controllers/userController';

const router = express.Router();

router.get('/', getUsers);
router.get('/role/:role', getUsersByRole);

export default router; 