const PDFDocument = require('pdfkit');

const formatDate = (dateStr) => {
    if (!dateStr) return 'Present';
    const parts = dateStr.split('-');
    if (parts.length === 2) {
        const [year, month] = parts;
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
    return dateStr;
};

const generatePDF = (resumeData, stream) => {
    const isCompact = resumeData.isCompact || false;
    const doc = new PDFDocument({
        margin: isCompact ? 30 : 50,
        size: 'A4'
    });
    doc.pipe(stream);

    const template = resumeData.templateSelected || 'modern';
    const primaryColor = template === 'modern' ? '#2563eb' : '#000000';

    const lineGap = isCompact ? 0.5 : 2;
    const sectionSpacing = isCompact ? 0.4 : 0.8;
    const itemSpacing = isCompact ? 0.2 : 0.4;

    // Helper for Section Headers
    const drawSectionHeader = (title) => {
        doc.moveDown(sectionSpacing);

        if (template === 'modern') {
            doc.fontSize(12).font('Helvetica-Bold').fillColor(primaryColor).text(title.toUpperCase(), { characterSpacing: 1 });
            doc.moveTo(isCompact ? 30 : 50, doc.y - 2).lineTo(560, doc.y - 2).strokeColor('#e5e7eb').stroke();
        } else if (template === 'classic') {
            doc.fontSize(13).font('Helvetica-Bold').fillColor('#1f2937').text(title);
            doc.moveTo(isCompact ? 30 : 50, doc.y).lineTo(560, doc.y).strokeColor('#9ca3af').stroke();
        } else if (template === 'minimal') {
            doc.fontSize(10).font('Helvetica-Bold').fillColor('#374151').text(title.toUpperCase(), { characterSpacing: 2 });
        }

        doc.fillColor('black').strokeColor('black');
        doc.moveDown(itemSpacing);
    };

    // Helper for Item Headers
    const drawItemHeader = (left, right) => {
        const y = doc.y;
        doc.fontSize(11).font('Helvetica-Bold').text(left);
        if (right) {
            doc.y = y;
            doc.fontSize(10).font('Helvetica').text(right, { align: 'right' });
        }
    };

    // Header per template
    if (template === 'modern') {
        const startY = doc.y;
        doc.moveTo(isCompact ? 30 : 50, startY).lineTo(isCompact ? 30 : 50, startY + 60).strokeColor(primaryColor).lineWidth(4).stroke();
        doc.lineWidth(1).strokeColor('black');

        doc.x = (isCompact ? 30 : 50) + 15;
        doc.fontSize(24).font('Helvetica-Bold').text(resumeData.userInfo.name || 'Your Name');
        if (resumeData.userInfo.title) {
            doc.fontSize(14).font('Helvetica-Bold').fillColor(primaryColor).text(resumeData.userInfo.title);
        }
        doc.fillColor('black');
    } else if (template === 'classic') {
        doc.fontSize(22).font('Helvetica-Bold').text(resumeData.userInfo.name || 'Your Name', { align: 'center' });
        if (resumeData.userInfo.title) {
            doc.fontSize(12).font('Helvetica-Oblique').text(resumeData.userInfo.title, { align: 'center' });
        }
    } else {
        doc.fontSize(20).font('Helvetica-Bold').text(resumeData.userInfo.name || 'Your Name', { align: 'left' });
        if (resumeData.userInfo.title) {
            doc.fontSize(10).font('Helvetica').fillColor('#6b7280').text(resumeData.userInfo.title.toUpperCase(), { align: 'left', characterSpacing: 1 });
        }
    }

    // Contact
    doc.x = isCompact ? 30 : 50;
    doc.moveDown(0.3);
    const contactInfo = [
        resumeData.userInfo.email,
        resumeData.userInfo.phone,
        resumeData.userInfo.linkedIn,
        resumeData.userInfo.github
    ].filter(Boolean).join('  \u2022  ');

    doc.fontSize(9).font('Helvetica').fillColor('#4b5563').text(contactInfo, {
        align: template === 'minimal' ? 'left' : 'center'
    });
    doc.fillColor('black');
    doc.moveDown(isCompact ? 0.5 : 1);

    const sections = resumeData.sectionOrder || ['summary', 'skills', 'experience', 'projects', 'leadership'];

    sections.forEach(sectionKey => {
        if (sectionKey === 'userInfo') return;

        if (sectionKey === 'summary' && resumeData.summary) {
            drawSectionHeader('Summary');
            doc.fontSize(10).font('Helvetica').text(resumeData.summary, { align: 'justify', lineGap: lineGap });
        } else if (sectionKey === 'skills' && resumeData.skills && resumeData.skills.length > 0) {
            drawSectionHeader('Skills');
            resumeData.skills.forEach(skillGroup => {
                doc.fontSize(10).font('Helvetica-Bold').text(skillGroup.category + ': ', { continued: true });
                doc.font('Helvetica').text(skillGroup.items);
            });
        } else if (sectionKey === 'experience' && resumeData.experience && resumeData.experience.length > 0) {
            drawSectionHeader('Experience');
            resumeData.experience.forEach(exp => {
                const dateStr = `${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}`;
                drawItemHeader(exp.jobTitle, dateStr);

                const subColor = template === 'modern' ? primaryColor : '#4b5563';
                doc.fontSize(10).font('Helvetica-Oblique').fillColor(subColor).text(`${exp.company}${exp.location ? ' | ' + exp.location : ''}`);
                doc.fillColor('black');

                if (exp.bullets && exp.bullets.length > 0) {
                    exp.bullets.filter(b => b.trim()).forEach(bullet => {
                        const bulletColor = template === 'modern' ? primaryColor : '#9ca3af';
                        const startY = doc.y;
                        doc.fillColor(bulletColor).text('\u2022', (isCompact ? 30 : 50) + 12, startY);
                        doc.fillColor('black').text(bullet, (isCompact ? 30 : 50) + 25, startY, {
                            width: (isCompact ? 565 : 545) - ((isCompact ? 30 : 50) + 25),
                            align: 'left',
                            lineGap: lineGap
                        });
                        doc.moveDown(0.1);
                    });
                    doc.x = isCompact ? 30 : 50;
                }
                doc.moveDown(itemSpacing);
            });
        } else if (sectionKey === 'projects' && resumeData.projects && resumeData.projects.length > 0) {
            drawSectionHeader('Projects');
            resumeData.projects.forEach(proj => {
                const dateStr = (proj.startDate || proj.endDate) ? `${formatDate(proj.startDate)} - ${formatDate(proj.endDate)}` : '';
                drawItemHeader(proj.name, dateStr);

                if (proj.url) {
                    const cleanUrl = proj.url.replace(/^https?:\/\//, '');
                    doc.fontSize(9).font('Helvetica').fillColor(primaryColor).text('Link: ' + cleanUrl, {
                        link: proj.url.startsWith('http') ? proj.url : 'https://' + proj.url,
                        underline: true
                    });
                    doc.fillColor('black');
                }

                if (proj.description) {
                    const descColor = template === 'modern' ? primaryColor : '#4b5563';
                    doc.fontSize(10).font('Helvetica').fillColor(descColor).text(proj.description);
                    doc.fillColor('black');
                }

                if (proj.bullets && proj.bullets.length > 0) {
                    proj.bullets.filter(b => b.trim()).forEach(bullet => {
                        const bulletColor = template === 'modern' ? primaryColor : '#9ca3af';
                        const startY = doc.y;
                        doc.fillColor(bulletColor).text('\u2022', (isCompact ? 30 : 50) + 12, startY);
                        doc.fillColor('black').text(bullet, (isCompact ? 30 : 50) + 25, startY, {
                            width: (isCompact ? 565 : 545) - ((isCompact ? 30 : 50) + 25),
                            align: 'left',
                            lineGap: lineGap
                        });
                        doc.moveDown(0.1);
                    });
                    doc.x = isCompact ? 30 : 50;
                }
                doc.moveDown(itemSpacing);
            });
        } else if (sectionKey === 'leadership' && resumeData.leadershipRoles && resumeData.leadershipRoles.length > 0) {
            drawSectionHeader('Leadership');
            resumeData.leadershipRoles.forEach(role => {
                const dateStr = `${formatDate(role.startDate)} - ${formatDate(role.endDate)}`;
                drawItemHeader(role.title, dateStr);
                doc.fontSize(10).font('Helvetica-Oblique').fillColor('#4b5563').text(role.organization);
                doc.fillColor('black');
                if (role.description) {
                    doc.fontSize(10).font('Helvetica').text(role.description);
                }
                doc.moveDown(itemSpacing);
            });
        }
    });

    doc.end();
};

module.exports = { generatePDF };
