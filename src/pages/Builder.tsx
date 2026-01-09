import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Eye, EyeOff, ArrowLeft, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ResumeForm } from '@/components/builder/ResumeForm';
import { ResumePreview } from '@/components/builder/ResumePreview';
import { TemplateSelector } from '@/components/builder/TemplateSelector';
import { initialResumeData, type ResumeData } from '@/types/resume';
import { toast } from 'sonner';

const Builder = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [showPreview, setShowPreview] = useState(true);
  const [enhanceCount, setEnhanceCount] = useState(0);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const maxFreeEnhancements = 1;

  const handleEnhance = async (text: string, callback: (enhanced: string) => void) => {
    if (enhanceCount >= maxFreeEnhancements) {
      toast.error('Free enhancement limit reached. Upgrade to Pro for unlimited enhancements!');
      return;
    }

    setIsEnhancing(true);
    
    // Simulate AI enhancement (will be replaced with real API call when Cloud is connected)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock enhanced text
    const enhanced = text.length > 0 
      ? `${text.charAt(0).toUpperCase()}${text.slice(1)}, resulting in 25% improvement in key metrics and increased team efficiency`
      : text;
    
    callback(enhanced);
    setEnhanceCount(prev => prev + 1);
    setIsEnhancing(false);
    toast.success('Bullet point enhanced with AI!');
  };

  const handleDownloadPDF = () => {
    toast.info('PDF download will be available once backend is connected.');
  };

  const handleDownloadDOCX = () => {
    toast.info('DOCX download will be available once backend is connected.');
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
                onClick={() => setShowPreview(!showPreview)}
                className="hidden md:flex"
              >
                {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadDOCX}>
                <Download className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">DOCX</span>
              </Button>
              <Button variant="hero" size="sm" onClick={handleDownloadPDF}>
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

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
              onChange={setResumeData}
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
                    <ResumePreview data={resumeData} />
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