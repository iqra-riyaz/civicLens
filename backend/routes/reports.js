import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware.js';
import { createReport, getReports, getMyReports, updateReportStatus, updateReport, deleteReport, upvoteReport } from '../controllers/reportController.js';

const router = Router();

// Multer setup - local storage fallback
const uploadDir = process.env.LOCAL_UPLOAD_DIR || 'uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.get('/', getReports);
router.get('/mine', requireAuth, getMyReports);
router.post('/', requireAuth, upload.single('image'), createReport);
router.patch('/:id/status', requireAuth, requireAdmin, updateReportStatus);
router.put('/:id', requireAuth, updateReport);
router.delete('/:id', requireAuth, deleteReport);
router.post('/:id/upvote', requireAuth, upvoteReport);

export default router;


