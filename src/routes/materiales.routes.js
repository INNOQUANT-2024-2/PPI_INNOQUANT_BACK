import { Router } from 'express';

import {getMaterials,createMaterials, updateMaterials, deleteMaterials, test} from '../controllers/materiales.controller.js';

const router = Router();

router.get('/materialsTest', test);

router.get('/materials', getMaterials);
router.post('/materials', createMaterials);
router.put('/materials/:codigo_mat', updateMaterials);
router.delete('/materials/:codigo_mat', deleteMaterials);

/* router.get('/projects/:id', getProject); */

export default router;