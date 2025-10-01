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

export async function updateReport(req, res) {
  try {
    const { id } = req.params;
    const { title, description, category, urgency, customCategory, location } = req.body;
    
    // Find report and verify ownership
    const report = await Report.findById(id);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    
    // Only allow users to edit their own reports
    if (report.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this report' });
    }
    
    // Update fields
    report.title = title || report.title;
    report.description = description || report.description;
    report.category = category || report.category;
    report.urgency = urgency || report.urgency;
    
    // Update location if provided
    if (location && location.lat && location.lng) {
      report.location = {
        lat: Number(location.lat),
        lng: Number(location.lng)
      };
    }
    
    if (category === 'Other' && customCategory) {
      report.customCategory = customCategory;
    }
    
    await report.save();
    res.json(report);
  } catch (e) {
    res.status(500).json({ message: 'Failed to update report' });
  }
}

export async function deleteReport(req, res) {
  try {
    const { id } = req.params;
    
    // Find report and verify ownership
    const report = await Report.findById(id);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    
    // Only allow users to delete their own reports
    if (report.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this report' });
    }
    
    await Report.findByIdAndDelete(id);
    res.json({ message: 'Report deleted successfully' });
  } catch (e) {
    res.status(500).json({ message: 'Failed to delete report' });
  }
}

export async function updateReportStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, proofText } = req.body;
    
    if (!['Pending', 'In Progress', 'Resolved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    // Prepare update object
    const updateData = {
      status,
      updatedAt: new Date()
    };
    
    // Handle proof data for 'In Progress' or 'Resolved' statuses
    if (['In Progress', 'Resolved'].includes(status)) {
      // Initialize proof object if proof text or image is provided
      if (proofText || req.file) {
        updateData.proof = {};
        
        // Add proof text if provided
        if (proofText) {
          updateData.proof.text = proofText;
        }
        
        // Handle image upload if provided
        if (req.file) {
          const result = await uploadToCloudinary(req.file.path);
          updateData.proof.imageUrl = result.secure_url;
          updateData.proof.imagePublicId = result.public_id;
          updateData.proof.uploadedAt = new Date();
          
          // Remove temporary file
          fs.unlinkSync(req.file.path);
        }
      }
    }
    
    // Update report with new status and proof data
    const report = await Report.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true }
    );
    
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to update status' });
  }
}

export async function upvoteReport(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    // Find report
    const report = await Report.findById(id);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    
    // Check if user already upvoted
    const userIndex = report.upvoters.indexOf(userId);
    
    if (userIndex !== -1) {
      // User already upvoted, so remove the upvote
      report.upvoters.splice(userIndex, 1);
      report.upvotes -= 1;
    } else {
      // Add user to upvoters and increment upvote count
      report.upvoters.push(userId);
      report.upvotes += 1;
    }
    
    await report.save();
    res.json(report);
  } catch (e) {
    res.status(500).json({ message: 'Failed to toggle upvote' });
  }
}


