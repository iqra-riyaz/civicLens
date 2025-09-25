import fs from 'fs';
import path from 'path';
import Report from '../models/Report.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

const uploadProvider = (process.env.UPLOAD_PROVIDER || 'cloudinary').toLowerCase();

export async function createReport(req, res) {
  try {
    const { title, description, category, urgency, lat, lng, customCategory } = req.body;
    if (!title || !description || !category || !urgency || !lat || !lng) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let imageUrl;
    let imagePublicId;
    if (req.file) {
      if (uploadProvider === 'cloudinary') {
        const result = await uploadToCloudinary(req.file.path);
        imageUrl = result.secure_url;
        imagePublicId = result.public_id;
        fs.unlinkSync(req.file.path);
      } else {
        imageUrl = `/uploads/${path.basename(req.file.path)}`;
      }
    }

    const report = await Report.create({
      title,
      description,
      category,
      // Save customCategory only if provided
      ...(customCategory ? { customCategory } : {}),
      urgency,
      location: { lat: Number(lat), lng: Number(lng) },
      imageUrl,
      imagePublicId,
      user: req.user._id,
    });
    res.status(201).json(report);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to create report' });
  }
}

export async function getReports(req, res) {
  try {
    const { category, urgency, status } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (urgency) filter.urgency = urgency;
    if (status) filter.status = status;
    const reports = await Report.find(filter).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(reports);
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch reports' });
  }
}

export async function getMyReports(req, res) {
  try {
    const reports = await Report.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch reports' });
  }
}

export async function updateReportStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['Pending', 'In Progress', 'Resolved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const report = await Report.findByIdAndUpdate(id, { status }, { new: true });
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (e) {
    res.status(500).json({ message: 'Failed to update status' });
  }
}


