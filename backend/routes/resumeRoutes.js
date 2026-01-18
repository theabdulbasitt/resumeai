const express = require('express');
const router = express.Router();
const Resume = require('../models/Resume');
const auth = require('../middleware/auth');

// Get Resume
router.get('/', auth, async (req, res) => {
    try {
        const resume = await Resume.findOne({ user: req.user.id });
        res.json(resume || {});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Create or Update Resume
router.post('/', auth, async (req, res) => {
    try {
        const { userInfo, summary, education, skills, experience, projects, leadershipRoles, customSections, sectionOrder, templateSelected } = req.body;

        const resumeFields = {
            user: req.user.id,
            userInfo,
            summary,
            education,
            skills,
            experience,
            projects,
            leadershipRoles,
            customSections,
            sectionOrder,
            templateSelected
        };

        let resume = await Resume.findOne({ user: req.user.id });

        if (resume) {
            resume = await Resume.findOneAndUpdate(
                { user: req.user.id },
                { $set: resumeFields },
                { new: true }
            );
            return res.json(resume);
        }

        resume = new Resume(resumeFields);
        await resume.save();
        res.json(resume);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

const { generatePDF } = require('../utils/fileGenerator');

// Download Resume
router.post('/download/:format', auth, async (req, res) => {
    try {
        const resume = await Resume.findOne({ user: req.user.id });
        if (!resume) return res.status(404).json({ msg: 'Resume not found' });

        const format = req.params.format;
        const filename = `resume_${req.user.id}.${format}`;

        if (format === 'pdf') {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
            generatePDF(resume, res);
        } else {
            res.status(400).json({ msg: 'Invalid format' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
