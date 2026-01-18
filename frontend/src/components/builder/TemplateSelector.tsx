import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import type { ResumeData } from '@/types/resume';

interface TemplateSelectorProps {
  selected: ResumeData['templateSelected'];
  onSelect: (template: ResumeData['templateSelected']) => void;
}

const templates = [
  {
    id: 'harvard' as const,
    name: 'Harvard',
    description: 'Ivy League standard',
    preview: {
      headerStyle: 'border-b border-gray-900 pb-1',
      titleStyle: 'font-serif text-center',
    },
  },
];

export const TemplateSelector = ({ selected, onSelect }: TemplateSelectorProps) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      {templates.map((template) => (
        <motion.button
          key={template.id}
          onClick={() => onSelect(template.id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`relative p-3 rounded-lg border-2 transition-all text-left ${selected === template.id
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50'
            }`}
        >
          {selected === template.id && (
            <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
              <CheckCircle className="w-3 h-3 text-primary-foreground" />
            </div>
          )}

          {/* Mini preview */}
          <div className="bg-white rounded border border-gray-200 p-2 mb-2 min-h-[60px]">
            <div className={template.preview.headerStyle}>
              <div className="w-16 h-2 bg-gray-800 rounded mb-1" />
              <div className="w-12 h-1.5 rounded bg-gray-400" />
            </div>
            <div className="mt-2 space-y-1">
              <div className="w-full h-1 bg-gray-200 rounded" />
              <div className="w-3/4 h-1 bg-gray-200 rounded" />
            </div>
          </div>

          <h4 className="font-medium text-sm text-foreground">{template.name}</h4>
          <p className="text-xs text-muted-foreground">{template.description}</p>
        </motion.button>
      ))}
    </div>
  );
};