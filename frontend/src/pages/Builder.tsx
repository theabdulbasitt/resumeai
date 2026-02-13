import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileText, Download, Eye, EyeOff, ArrowLeft, Sparkles, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ResumeForm } from '@/components/builder/ResumeForm';
import { ResumePreview } from '@/components/builder/ResumePreview';
import { TemplateSelector } from '@/components/builder/TemplateSelector';
import { initialResumeData, type ResumeData } from '@/types/resume';
import { toast } from 'sonner';
import { resume, ai, setApiToken } from '@/services/api';
import { ThemeToggle } from '@/components/ThemeToggle';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useClerk, useAuth, UserButton } from '@clerk/clerk-react';


const pdfFormatDate = (dateStr: string) => {
  if (!dateStr) return 'Present';
  const [year, month] = dateStr.split('-');
  if (year && month) {
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }
  return dateStr;
};


const pdfRenderDateRange = (startDate?: string, endDate?: string) => {
  if (!startDate) return '';
  const start = pdfFormatDate(startDate);
  const end = pdfFormatDate(endDate);
  return `${start} – ${end}`;
};


const Builder = () => {
  const { signOut } = useClerk();
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [showPreview, setShowPreview] = useState(true);
  const [enhanceCount, setEnhanceCount] = useState(0);
  const [isCompact, setIsCompact] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  const maxFreeEnhancements = 4;

  const [isEnhancing, setIsEnhancing] = useState(false);

  const { getToken, isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    const fetchResume = async () => {
      if (!isLoaded || !isSignedIn) return;

      try {
        const token = await getToken();
        if (token) {
          setApiToken(token);
        }

        const res = await resume.get();
        if (res.data && Object.keys(res.data).length > 0) {
          // Merge with initial data to ensure all fields exist
          const mergedData = { ...initialResumeData, ...res.data };

          // Data Migration: Ensure 'education' is in sectionOrder if missing
          if (mergedData.sectionOrder && !mergedData.sectionOrder.includes('education')) {
            const summaryIdx = mergedData.sectionOrder.indexOf('summary');
            const newOrder = [...mergedData.sectionOrder];
            if (summaryIdx >= 0) {
              newOrder.splice(summaryIdx + 1, 0, 'education');
            } else {
              newOrder.push('education');
            }
            mergedData.sectionOrder = newOrder;
          }

          // Data Migration: Ensure leadership roles have bullets
          if (mergedData.leadershipRoles) {
            mergedData.leadershipRoles = mergedData.leadershipRoles.map((role: any) => ({
              ...role,
              bullets: role.bullets || ['', '', '']
            }));
          }

          setResumeData(mergedData);
        }
      } catch (err) {
        console.error('Error fetching resume', err);
      }
    };

    fetchResume();
  }, [isLoaded, isSignedIn, getToken]);

  const handleUpdatePreview = (newData: ResumeData) => {
    setResumeData(newData);
  };

  const handleFinalSave = async () => {
    try {
      const token = await getToken();
      if (token) setApiToken(token);
      await resume.save(resumeData);
      toast.success('Changes saved successfully');
    } catch (err) {
      console.error('Error saving resume', err);
      toast.error('Failed to save changes');
    }
  };

  const handleEnhance = async (text: string, callback: (enhanced: string) => void) => {
    if (enhanceCount >= maxFreeEnhancements) {
      toast.error('Free enhancement limit reached. Upgrade to Pro for unlimited enhancements!');
      return;
    }

    setIsEnhancing(true);

    try {
      const token = await getToken();
      if (token) setApiToken(token);
      const res = await ai.enhance(text);
      callback(res.data.enhanced);
      setEnhanceCount(prev => prev + 1);
      toast.success('Bullet point enhanced with AI!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to enhance text');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleDownloadTextPDF = () => {
    const doc = new jsPDF();

    // Set Font to Times New Roman (Serif) to match Harvard
    doc.setFont("times", "normal");

    let yPos = 15;
    const margin = 12;
    const pageWidth = doc.internal.pageSize.getWidth();
    const contentWidth = pageWidth - (margin * 2);

    // Helpers
    const checkPageBreak = (heightNeeded: number) => {
      if (yPos + heightNeeded > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        yPos = margin;
      }
    };

    const addSectionHeader = (title: string) => {
      checkPageBreak(15);
      yPos += 2;
      doc.setFontSize(11);
      doc.setFont("times", "bold");
      doc.text(title.toUpperCase(), margin, yPos);
      yPos += 1;
      doc.setLineWidth(0.5);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 5;
    };

    const addEntry = (line1Left: string, line1Right: string, line2?: string, bullets?: string[], line2Italic: boolean = true, indentLine2: boolean = false, url?: string) => {
      checkPageBreak(15);

      // Line 1: Bold title left, Date right
      doc.setFontSize(11);
      doc.setFont("times", "bold");

      // Wrap line1Left Case: Reserve space for date (approx 35% of page)
      const leftWidth = contentWidth * 0.65;
      const wrappedLeft = doc.splitTextToSize(line1Left, leftWidth);

      if (url) {
        doc.setTextColor(0, 0, 0);
        doc.text(wrappedLeft, margin, yPos);
        const linkUrl = url.startsWith('http') ? url : `https://${url}`;
        // Apply link to each line of the wrapped title
        wrappedLeft.forEach((line: string, i: number) => {
          const lineWidth = doc.getTextWidth(line);
          doc.link(margin, yPos + (i * 5) - 4, lineWidth, 5, { url: linkUrl });
        });
      } else {
        doc.text(wrappedLeft, margin, yPos);
      }

      doc.setFont("times", "normal");
      if (line1Right) {
        doc.text(line1Right, pageWidth - margin, yPos, { align: 'right' });
      }
      yPos += (wrappedLeft.length * 5);

      // Line 2: wrapped (subtitle or description)
      if (line2) {
        // Normalize text to prevent early wrapping from copied newlines
        const cleanLine2 = line2.replace(/\s+/g, ' ').trim();
        doc.setFontSize(10);
        doc.setFont("times", line2Italic ? "italic" : "normal");
        const xOffset = indentLine2 ? margin + 2 : margin;
        const entryWidth = indentLine2 ? contentWidth - 2 : contentWidth;
        const lines = doc.splitTextToSize(cleanLine2, entryWidth);
        checkPageBreak(lines.length * 4.5);
        doc.text(lines, xOffset, yPos);
        yPos += (lines.length * 4.5);
      }

      // Bullets
      if (bullets && bullets.length > 0) {
        doc.setFont("times", "normal");
        doc.setFontSize(10);
        bullets.forEach(bullet => {
          if (!bullet.trim()) return;
          const cleanBullet = bullet.replace(/\s+/g, ' ').trim();
          const bulletText = `• ${cleanBullet}`;
          const lines = doc.splitTextToSize(bulletText, contentWidth - 2);
          checkPageBreak(lines.length * 4);
          doc.text(lines, margin + 2, yPos);
          yPos += (lines.length * 4.5);
        });
        yPos += 2;
      } else {
        yPos += 2;
      }
    };

    // Header
    doc.setFontSize(16);
    doc.setFont("times", "bold");
    doc.text(resumeData.userInfo.name.toUpperCase(), pageWidth / 2, yPos, { align: 'center' });
    yPos += 7;
    if (resumeData.userInfo.title) {
      doc.setFontSize(11);
      doc.setFont("times", "normal");
      doc.text(resumeData.userInfo.title, pageWidth / 2, yPos, { align: 'center' });
      yPos += 5;
    }

    // Contact Info with Clickable Links
    doc.setFontSize(10);
    doc.setFont("times", "normal");

    const contactItems = [
      { text: resumeData.userInfo.email, link: `mailto:${resumeData.userInfo.email}` },
      { text: resumeData.userInfo.phone, link: null },
      { text: resumeData.userInfo.linkedIn?.replace(/^https?:\/\/(www\.)?/, ''), link: resumeData.userInfo.linkedIn },
      { text: resumeData.userInfo.github?.replace(/^https?:\/\/(www\.)?/, ''), link: resumeData.userInfo.github }
    ].filter(item => item.text);

    let currentX = margin;
    // Calculate total width of all items + separators to center them
    const separator = " • ";
    const sepWidth = doc.getTextWidth(separator);
    const totalWidth = contactItems.reduce((acc, item, i) => {
      let w = acc + doc.getTextWidth(item.text);
      if (i < contactItems.length - 1) w += sepWidth;
      return w;
    }, 0);

    currentX = (pageWidth - totalWidth) / 2;

    contactItems.forEach((item, i) => {
      const itemWidth = doc.getTextWidth(item.text);
      if (item.link) {
        doc.setTextColor(0, 0, 0);
        doc.text(item.text, currentX, yPos);
        const linkUrl = item.link.startsWith('http') || item.link.startsWith('mailto') ? item.link : `https://${item.link}`;
        doc.link(currentX, yPos - 4, itemWidth, 5, { url: linkUrl });
      } else {
        doc.text(item.text, currentX, yPos);
      }
      currentX += itemWidth;

      if (i < contactItems.length - 1) {
        doc.text(separator, currentX, yPos);
        currentX += sepWidth;
      }
    });

    yPos += 10;

    resumeData.sectionOrder.forEach(section => {
      if (section === 'userInfo') return;

      if (section === 'summary' && resumeData.summary) {
        addSectionHeader('Professional Summary');
        doc.setFont("times", "normal");
        doc.setFontSize(10);
        const cleanSummary = resumeData.summary.replace(/\s+/g, ' ').trim();
        const lines = doc.splitTextToSize(cleanSummary, contentWidth);
        checkPageBreak(lines.length * 4);
        doc.text(lines, margin, yPos);
        yPos += (lines.length * 4.5) + 3;
      }
      else if (section === 'education' && resumeData.education.length > 0) {
        addSectionHeader('Education');
        resumeData.education.forEach(edu => {
          addEntry(
            `${edu.school}${edu.location ? ` – ${edu.location}` : ''}`,
            pdfRenderDateRange(edu.startDate, edu.endDate),
            edu.degree,
            edu.bullets,
            true
          );
        });
      }
      else if (section === 'experience' && resumeData.experience.length > 0) {
        addSectionHeader('Experience');
        resumeData.experience.forEach(exp => {
          addEntry(
            `${exp.jobTitle}${exp.company ? ` – ${exp.company}` : ''}`,
            pdfRenderDateRange(exp.startDate, exp.endDate),
            exp.location,
            exp.bullets,
            true
          );
        });
      }
      else if (section === 'projects' && resumeData.projects.length > 0) {
        addSectionHeader('Projects');
        resumeData.projects.forEach(proj => {
          const title = proj.url ? `${proj.name} (Link)` : proj.name;
          addEntry(
            title,
            pdfRenderDateRange(proj.startDate, proj.endDate),
            proj.description,
            proj.bullets,
            false,
            true, // Indent description
            proj.url
          );
        });
      }
      else if (section === 'leadership' && resumeData.leadershipRoles.length > 0) {
        addSectionHeader('Leadership');
        resumeData.leadershipRoles.forEach(role => {
          addEntry(
            `${role.title}${role.organization ? ` – ${role.organization}` : ''}`,
            pdfRenderDateRange(role.startDate, role.endDate),
            role.description,
            role.bullets,
            false,
            true // Indent description
          );
        });
      }
      else if (section === 'skills' && resumeData.skills.length > 0) {
        addSectionHeader('Skills');
        doc.setFontSize(10);
        resumeData.skills.forEach(skill => {
          const category = `${skill.category}: `;
          const items = skill.items.replace(/\s+/g, ' ').trim();
          const fullLine = category + items;

          const lines = doc.splitTextToSize(fullLine, contentWidth);
          checkPageBreak(lines.length * 4.5);

          // Draw first line with partial bolding
          doc.setFont("times", "bold");
          doc.text(category, margin, yPos);

          const categoryWidth = doc.getTextWidth(category);
          doc.setFont("times", "normal");

          // The rest of the first line
          const firstLineItems = lines[0].substring(category.length);
          doc.text(firstLineItems, margin + categoryWidth, yPos);

          // Subsequent lines
          if (lines.length > 1) {
            yPos += 4.5;
            for (let i = 1; i < lines.length; i++) {
              doc.text(lines[i], margin, yPos);
              if (i < lines.length - 1) yPos += 4.5;
            }
          }

          yPos += 4.5; // Space after each skill row
        });
        yPos += 3;
      }
    });

    doc.save(`${resumeData.userInfo.name || 'resume'}_text.pdf`);
    toast.success('Text PDF downloaded');
  };


  const handleDownloadPDF = async () => {
    if (!resumeRef.current) {
      toast.error('Resume preview not ready');
      return;
    }


    const toastId = toast.loading('Generating PDF...');

    try {

      const container = resumeRef.current;
      if (!container) throw new Error('Preview container not found');

      // Find all visible page elements inside the capture container
      // Note: ResumePreview renders .a4-page elements.
      // The capture container is "inline-block", so we look for children with class .a4-page
      const pages = Array.from(container.querySelectorAll('.a4-page'));

      if (pages.length === 0) {
        // Fallback if pagination hasn't happened yet or something is wrong
        // Just capture the whole container
        pages.push(container as Element);
      }

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < pages.length; i++) {
        if (i > 0) {
          pdf.addPage();
        }

        const pageElement = pages[i] as HTMLElement;
        const canvas = await html2canvas(pageElement, {
          scale: 3, // Higher scale for better quality
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          windowWidth: pageElement.scrollWidth, // Ensure full width capture
          windowHeight: pageElement.scrollHeight
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        // Calculate functionality fits to PDF page 1:1 since we enforce A4 sizing
        // But we keep ratio logic just in case
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        // const ratio = pdfWidth / imgWidth; // If we trust width alignment

        const finalWidth = imgWidth * ratio;
        const finalHeight = imgHeight * ratio;

        // For A4 content, x and y should roughly be 0, margin handled by css
        // But if aspect ratio differs slightly, center it
        const x = (pdfWidth - finalWidth) / 2;
        const y = 0; // Top align for pages

        pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);

        // Add clickable links
        const links = pageElement.querySelectorAll('a');
        const containerRect = pageElement.getBoundingClientRect();
        const scale = 3; // Must match html2canvas scale

        links.forEach((link) => {
          const linkRect = link.getBoundingClientRect();

          // Calculate relative position to the PAGE container in CSS pixels
          const relativeLeft = linkRect.left - containerRect.left;
          const relativeTop = linkRect.top - containerRect.top;

          // Convert to PDF coordinates
          const pdfLinkX = x + (relativeLeft * scale * ratio);
          const pdfLinkY = y + (relativeTop * scale * ratio);
          const pdfLinkW = linkRect.width * scale * ratio;
          const pdfLinkH = linkRect.height * scale * ratio;

          pdf.link(pdfLinkX, pdfLinkY, pdfLinkW, pdfLinkH, { url: link.href });
        });
      }

      pdf.save(`${resumeData.userInfo.name || 'resume'}.pdf`);
      toast.success('PDF downloaded successfully', { id: toastId });
    } catch (err) {
      console.error('PDF Generation Error:', err);
      toast.error('Failed to download PDF', { id: toastId });
    }
  };




  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </Link>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <FileText className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-display font-semibold text-foreground">Resume Builder</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCompact(!isCompact)}
              >
                {isCompact ? "Normal Spacing" : "Compact Mode"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="hidden md:flex"
              >
                {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showPreview ? 'Hide' : 'Preview'}
              </Button>

              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="hero" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    Download
                    <ChevronDown className="w-3 h-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleDownloadPDF} className="gap-2 cursor-pointer">
                    <FileText className="w-4 h-4" />
                    <span>Visual PDF (Image)</span>
                    <span className="text-xs text-muted-foreground ml-auto">Best Layout</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDownloadTextPDF} className="gap-2 cursor-pointer">
                    <FileText className="w-4 h-4" />
                    <span>ATS PDF (Text)</span>
                    <span className="text-xs text-muted-foreground ml-auto">Selectable</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>

      {/* Hidden full-scale resume for capture */}
      <div className="fixed -left-[9999px] top-0 pointer-events-none">
        <div
          ref={resumeRef}
          className="inline-block"
        >
          <ResumePreview data={resumeData} isCompact={isCompact} />
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Template Selector */}
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-display font-semibold text-lg text-foreground mb-4">
                Choose Template
              </h3>
              <TemplateSelector
                selected={resumeData.templateSelected}
                onSelect={(template) => setResumeData({ ...resumeData, templateSelected: template })}
              />
            </div>

            {/* AI Enhancement Banner */}
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">AI Enhancement</h4>
                  <p className="text-sm text-muted-foreground">
                    Click "Enhance" on any bullet point to make it more impactful.
                    {enhanceCount >= maxFreeEnhancements ? (
                      <span className="text-accent font-medium"> Upgrade to Pro for unlimited enhancements!</span>
                    ) : (
                      <span className="text-primary font-medium"> {maxFreeEnhancements - enhanceCount} free enhancement remaining.</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Resume Form */}
            <ResumeForm
              data={resumeData}
              onChange={handleUpdatePreview}
              onSave={handleFinalSave}
              onEnhance={handleEnhance}
              enhanceDisabled={enhanceCount >= maxFreeEnhancements || isEnhancing}
              enhanceCount={enhanceCount}
            />
          </motion.div>

          {/* Preview Section */}
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="hidden lg:block"
            >
              <div className="sticky top-24">
                <div className="bg-muted rounded-xl p-4 overflow-auto max-h-[calc(100vh-8rem)]">
                  <h3 className="font-display font-semibold text-lg text-foreground mb-4">
                    Live Preview
                  </h3>
                  <div className="transform scale-[0.6] origin-top-left w-[166.67%]">
                    <ResumePreview data={resumeData} isCompact={isCompact} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};


export default Builder;