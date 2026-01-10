import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      'Basic resume creation',
      '1 AI enhancement per resume',
      '2 template options',
      'PDF & DOCX export',
    ],
    cta: 'Get Started',
    variant: 'heroOutline' as const,
    popular: false,
  },
  {
    name: 'Pro',
    price: '$4.99',
    period: '/month',
    description: 'For serious job seekers',
    features: [
      'Everything in Free',
      'Unlimited AI enhancements',
      'All premium templates',
      'Priority support',
      'Resume analytics',
    ],
    cta: 'Upgrade to Pro',
    variant: 'hero' as const,
    popular: true,
  },
];

export const Pricing = () => {
  return (
    <section id="pricing" className="py-24 bg-background">
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
            Simple,{' '}
            <span className="text-gradient-primary">Transparent</span> Pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            Start for free, upgrade when you need more power.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`flex-1 relative bg-card border rounded-2xl p-8 ${
                plan.popular
                  ? 'border-primary shadow-xl shadow-primary/10'
                  : 'border-border'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-primary text-primary-foreground text-xs font-medium">
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="font-display text-4xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button variant={plan.variant} size="lg" className="w-full" asChild>
                <Link to="/builder">{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
