import {Router} from 'express';
import {home,createUser, getUsers,  updateUser, deleteUser, loginUser /* search */} from '../controllers/auth.controller.js';
import {validateToken} from "../middlewares/validateToken.js";

/* import { authRequired } from '../middlewares/validateToken.js'; */


const router = Router();

router.get('/users', /* validateToken, */ getUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.post('/usersLogin', loginUser);
/* router.get('/users', search); */


/* router.get('/users/:id', getUser); */




/* router.post('/login', login)
router.post('/logout', logout)

router.get('/profile', authRequired, profile) */




/* router.post('/logout', logout)*/

export default router;