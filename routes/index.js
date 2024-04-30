import { Router } from "express";
import * as ctrl from './controller.js';

const router = Router();

router.get('/', ctrl.home);

router.get('/login', ctrl.login);

router.get('/signin', ctrl.signin);

router.get('/detailedInquiry', ctrl.detailedInquiry);

router.get('/write', ctrl.wrtie);

router.get('/edit', ctrl.edit);

router.get('/profile', ctrl.profile);

router.get('/passwordEdit', ctrl.passwordEdit);

export default router;