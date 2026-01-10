import { motion } from 'framer-motion';
import { Sparkles, FileDown, Layout, Zap, Shield, Clock } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Enhancement',
    description: 'Transform ordinary bullet points into impactful, quantified achievements with one click.',
    gradient: 'from-primary to-primary/60',
  },
  {
    icon: Layout,
    title: 'Professional Templates',
    description: 'Choose from beautifully designed templates that are ATS-friendly and recruiter-approved.',
    gradient: 'from-accent to-accent/60',
  },
  {
    icon: FileDown,
    title: 'Multiple Export Formats',
    description: 'Download your resume as PDF or DOCX, perfectly formatted for any application.',
    gradient: 'from-primary to-accent',
  },
  {
    icon: Zap,
    title: 'Instant Preview',
    description: 'See your changes in real-time as you build your resume section by section.',
    gradient: 'from-accent to-primary',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your data is encrypted and secure. We never share your personal information.',
    gradient: 'from-primary to-primary/60',
  },
  {
    icon: Clock,
    title: 'Save Time',
    description: 'Create a professional resume in minutes, not hours. Focus on what matters.',
    gradient: 'from-accent to-accent/60',
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-24 bg-background">
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
            Everything You Need to{' '}
            <span className="text-gradient-primary">Stand Out</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features designed to help you create the perfect resume and land your dream job.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>

              {/* Content */}
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
