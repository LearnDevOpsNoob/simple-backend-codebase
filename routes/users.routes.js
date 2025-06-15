import express from 'express';
import { addUser, getUsers } from '../controllers/users.controller.js';

const router = express.Router();

router.get('/', getUsers);
router.post('/', addUser);

export default router;