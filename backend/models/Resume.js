const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    userInfo: {
        name: String,
        title: String,
        phone: String,
        email: String,
        linkedIn: String,
        github: String
    },
    summary: String,
    education: [{
        id: String,
        school: String,
        degree: String,
        location: String,
        startDate: String,
        endDate: String,
        bullets: [String]
    }],
    skills: [{
        category: String,
        items: String
    }],
    experience: [{
        id: String,
        company: String,
        jobTitle: String,
        location: String,
        startDate: String,
        endDate: String,
        bullets: [String]
    }],
    projects: [{
        id: String,
        name: String,
        description: String,
        startDate: String,
        endDate: String,
        url: String,
        bullets: [String]
    }],
    leadershipRoles: [{
        id: String,
        title: String,
        organization: String,
        startDate: String,
        endDate: String,
        description: String,
        bullets: [String]
    }],
    customSections: [{
        id: String,
        title: String,
        items: [{
            title: String,
            date: String,
            description: String
        }]
    }],
    sectionOrder: {
        type: [String],
        default: ['userInfo', 'summary', 'education', 'experience', 'projects', 'skills', 'leadership', 'custom']
    },
    templateSelected: {
        type: String,
        enum: ['classic', 'modern', 'minimal', 'harvard'],
        default: 'harvard'
    }
}, { timestamps: true });

module.exports = mongoose.model('Resume', ResumeSchema);
