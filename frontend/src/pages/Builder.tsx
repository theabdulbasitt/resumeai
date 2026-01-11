import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Eye, EyeOff, ArrowLeft, Sparkles } from 'lucide-react';
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
          setResumeData({ ...initialResumeData, ...res.data });
        }
      } catch (err) {
        console.error('Error fetching resume', err);
      }
    };

    fetchResume();
  }, [isLoaded, isSignedIn, getToken]);

  const handleSave = async (newData: ResumeData) => {
    setResumeData(newData);
    try {
      await resume.save(newData);
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

  const handleDownloadPDF = async () => {
    if (!resumeRef.current) {
      toast.error('Resume preview not ready');
      return;
    }

    const toastId = toast.loading('Generating PDF...');

    try {
      const element = resumeRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

      const finalWidth = imgWidth * ratio;
      const finalHeight = imgHeight * ratio;

      const x = (pdfWidth - finalWidth) / 2;
      const y = (pdfHeight - finalHeight) / 2;

      pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
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
              <Button variant="hero" size="sm" onClick={handleDownloadPDF}>
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>

      {/* Hidden full-scale resume for capture */}
      <div className="fixed -left-[9999px] top-0 pointer-events-none">
        <div
          ref={resumeRef}
          className="w-[210mm] min-h-[297mm] bg-white p-8"
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
              onChange={handleSave}
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