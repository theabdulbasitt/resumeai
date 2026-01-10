import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const Hero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-hero pt-24 pb-16 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Resume Builder</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6"
          >
            Build Your Perfect Resume{' '}
            <span className="text-gradient-primary">in Minutes</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            Create professional, ATS-friendly resumes with AI-enhanced bullet points. 
            Stand out from the crowd and land your dream job.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Button variant="hero" size="xl" asChild>
              <Link to="/builder">
                Build Your Resume
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <a href="#templates">View Templates</a>
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>Free to start</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent" />
              <span>AI-powered enhancements</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>PDF & DOCX export</span>
            </div>
          </motion.div>
        </div>

        {/* Hero Image/Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 max-w-5xl mx-auto"
        >
          <div className="relative">
            {/* Browser frame */}
            <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
              {/* Browser header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-muted border-b border-border">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-accent/60" />
                  <div className="w-3 h-3 rounded-full bg-primary/60" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-background rounded-md px-4 py-1.5 text-xs text-muted-foreground">
                    resumeai.app/builder
                  </div>
                </div>
              </div>
              
              {/* Preview content */}
              <div className="p-8 bg-background">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Form preview */}
                  <div className="space-y-4">
                    <div className="h-8 w-48 bg-muted rounded animate-pulse" />
                    <div className="h-12 w-full bg-secondary rounded-lg" />
                    <div className="h-12 w-full bg-secondary rounded-lg" />
                    <div className="h-24 w-full bg-secondary rounded-lg" />
                    <div className="flex gap-2">
                      <div className="h-8 w-20 bg-primary/20 rounded-full" />
                      <div className="h-8 w-24 bg-primary/20 rounded-full" />
                      <div className="h-8 w-16 bg-primary/20 rounded-full" />
                    </div>
                  </div>
                  
                  {/* Resume preview */}
                  <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                    <div className="space-y-4">
                      <div className="h-6 w-40 bg-foreground/20 rounded" />
                      <div className="h-3 w-32 bg-muted-foreground/30 rounded" />
                      <div className="border-t border-border pt-4 space-y-2">
                        <div className="h-4 w-24 bg-primary/30 rounded" />
                        <div className="h-3 w-full bg-muted rounded" />
                        <div className="h-3 w-5/6 bg-muted rounded" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 w-20 bg-primary/30 rounded" />
                        <div className="flex flex-wrap gap-2">
                          <div className="h-6 w-16 bg-secondary rounded-full" />
                          <div className="h-6 w-20 bg-secondary rounded-full" />
                          <div className="h-6 w-14 bg-secondary rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 bg-card border border-border rounded-xl p-4 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-accent flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">AI Enhanced</div>
                  <div className="text-xs text-muted-foreground">Bullet improved!</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
