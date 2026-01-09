import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useState } from 'react';

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary design with bold accents',
    features: ['Color accents', 'Modern typography', 'Section dividers'],
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional and professional layout',
    features: ['Clean lines', 'Serif headings', 'Timeless design'],
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and ATS-optimized',
    features: ['Maximum readability', 'ATS-friendly', 'Elegant spacing'],
  },
];

export const Templates = () => {
  const [activeTemplate, setActiveTemplate] = useState('modern');

  return (
    <section id="templates" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Professional{' '}
            <span className="text-gradient-accent">Templates</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose from our carefully crafted templates designed by hiring experts.
          </p>
        </motion.div>

        {/* Template selection */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Template list */}
          <div className="w-full lg:w-1/3 space-y-4">
            {templates.map((template) => (
              <motion.button
                key={template.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                onClick={() => setActiveTemplate(template.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                  activeTemplate === template.id
                    ? 'bg-card border-primary shadow-lg'
                    : 'bg-card/50 border-border hover:border-primary/50'
                }`}
              >
                <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                  {template.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {template.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {template.features.map((feature) => (
                    <span
                      key={feature}
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground"
                    >
                      <CheckCircle className="w-3 h-3 text-primary" />
                      {feature}
                    </span>
                  ))}
                </div>
              </motion.button>
            ))}
          </div>

          {/* Template preview */}
          <motion.div
            key={activeTemplate}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-1 bg-card border border-border rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-8">
              {/* Resume preview based on template */}
              <div className={`
                ${activeTemplate === 'modern' ? 'border-l-4 border-primary pl-6' : ''}
                ${activeTemplate === 'classic' ? 'border-b-2 border-foreground/20 pb-4' : ''}
                ${activeTemplate === 'minimal' ? '' : ''}
              `}>
                <h3 className={`
                  font-bold text-foreground mb-1
                  ${activeTemplate === 'modern' ? 'text-2xl font-display' : ''}
                  ${activeTemplate === 'classic' ? 'text-2xl font-serif' : ''}
                  ${activeTemplate === 'minimal' ? 'text-xl font-medium tracking-wide' : ''}
                `}>
                  Sarah Johnson
                </h3>
                <p className={`
                  text-muted-foreground mb-4
                  ${activeTemplate === 'modern' ? 'text-primary font-medium' : ''}
                  ${activeTemplate === 'classic' ? 'italic' : ''}
                  ${activeTemplate === 'minimal' ? 'text-sm uppercase tracking-widest' : ''}
                `}>
                  Senior Software Engineer
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span>sarah@email.com</span>
                  <span>•</span>
                  <span>(555) 123-4567</span>
                  <span>•</span>
                  <span>linkedin.com/in/sarahj</span>
                </div>
              </div>

              <div className="mt-8 space-y-6">
                {/* Summary */}
                <div>
                  <h4 className={`
                    font-semibold text-foreground mb-2
                    ${activeTemplate === 'modern' ? 'text-primary uppercase text-sm tracking-wider' : ''}
                    ${activeTemplate === 'classic' ? 'border-b border-foreground/20 pb-1' : ''}
                    ${activeTemplate === 'minimal' ? 'text-sm uppercase tracking-widest' : ''}
                  `}>
                    Summary
                  </h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Results-driven software engineer with 8+ years of experience building scalable web applications. 
                    Led teams of 5-10 engineers to deliver products used by millions of users.
                  </p>
                </div>

                {/* Experience */}
                <div>
                  <h4 className={`
                    font-semibold text-foreground mb-3
                    ${activeTemplate === 'modern' ? 'text-primary uppercase text-sm tracking-wider' : ''}
                    ${activeTemplate === 'classic' ? 'border-b border-foreground/20 pb-1' : ''}
                    ${activeTemplate === 'minimal' ? 'text-sm uppercase tracking-widest' : ''}
                  `}>
                    Experience
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h5 className="font-medium text-foreground">Senior Software Engineer</h5>
                        <span className="text-sm text-muted-foreground">2020 - Present</span>
                      </div>
                      <p className="text-sm text-primary/80 mb-2">TechCorp Inc.</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li className="flex items-start gap-2">
                          <span className={`mt-2 w-1 h-1 rounded-full flex-shrink-0 ${activeTemplate === 'modern' ? 'bg-primary' : 'bg-muted-foreground'}`} />
                          Led development of microservices architecture serving 10M+ daily requests
                        </li>
                        <li className="flex items-start gap-2">
                          <span className={`mt-2 w-1 h-1 rounded-full flex-shrink-0 ${activeTemplate === 'modern' ? 'bg-primary' : 'bg-muted-foreground'}`} />
                          Reduced API response time by 40% through database optimization
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h4 className={`
                    font-semibold text-foreground mb-2
                    ${activeTemplate === 'modern' ? 'text-primary uppercase text-sm tracking-wider' : ''}
                    ${activeTemplate === 'classic' ? 'border-b border-foreground/20 pb-1' : ''}
                    ${activeTemplate === 'minimal' ? 'text-sm uppercase tracking-widest' : ''}
                  `}>
                    Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'TypeScript', 'Node.js', 'Python', 'AWS'].map((skill) => (
                      <span
                        key={skill}
                        className={`
                          text-sm px-3 py-1 rounded-full
                          ${activeTemplate === 'modern' ? 'bg-primary/10 text-primary' : ''}
                          ${activeTemplate === 'classic' ? 'bg-secondary text-secondary-foreground' : ''}
                          ${activeTemplate === 'minimal' ? 'border border-border text-muted-foreground' : ''}
                        `}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
