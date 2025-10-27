import express from 'express';
import { uploadPassport, deletePassport } from '#controllers/upload.controller.js';

const uploadRouter = express.Router();

// Upload passport image
uploadRouter.post('/passport', uploadPassport);

// Delete passport image
uploadRouter.delete('/passport/:publicId', deletePassport);

export default uploadRouter;

