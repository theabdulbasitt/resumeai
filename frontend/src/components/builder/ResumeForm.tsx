import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { ResumeData, Experience, Project, LeadershipRole, CustomSection, CustomItem } from '@/types/resume';

interface ResumeFormProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  onEnhance: (text: string, callback: (enhanced: string) => void) => void;
  enhanceDisabled?: boolean;
  enhanceCount?: number;
}

// Generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

export const ResumeForm = ({ data, onChange, onEnhance, enhanceDisabled, enhanceCount = 0 }: ResumeFormProps) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    userInfo: true,
    summary: true,
    skills: true,
    experience: true,
    projects: true,
    leadership: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const updateUserInfo = (field: keyof ResumeData['userInfo'], value: string) => {
    onChange({
      ...data,
      userInfo: { ...data.userInfo, [field]: value },
    });
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: generateId(),
      company: '',
      jobTitle: '',
      location: '',
      startDate: '',
      endDate: '',
      bullets: ['', '', ''],
    };
    onChange({ ...data, experience: [...data.experience, newExp] });
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    onChange({
      ...data,
      experience: data.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const removeExperience = (id: string) => {
    onChange({
      ...data,
      experience: data.experience.filter(exp => exp.id !== id),
    });
  };

  const addProject = () => {
    const newProj: Project = {
      id: generateId(),
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      bullets: ['', '', ''],
    };
    onChange({ ...data, projects: [...data.projects, newProj] });
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    onChange({
      ...data,
      projects: data.projects.map(proj =>
        proj.id === id ? { ...proj, [field]: value } : proj
      ),
    });
  };

  const removeProject = (id: string) => {
    onChange({
      ...data,
      projects: data.projects.filter(proj => proj.id !== id),
    });
  };

  const addLeadership = () => {
    const newRole: LeadershipRole = {
      id: generateId(),
      title: '',
      organization: '',
      startDate: '',
      endDate: '',
      description: '',
    };
    onChange({ ...data, leadershipRoles: [...data.leadershipRoles, newRole] });
  };

  const updateLeadership = (id: string, field: keyof LeadershipRole, value: string) => {
    onChange({
      ...data,
      leadershipRoles: data.leadershipRoles.map(role =>
        role.id === id ? { ...role, [field]: value } : role
      ),
    });
  };

  const removeLeadership = (id: string) => {
    onChange({
      ...data,
      leadershipRoles: data.leadershipRoles.filter(role => role.id !== id),
    });
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...data.sectionOrder];
    if (direction === 'up' && index > 0) {
      [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
    } else if (direction === 'down' && index < newOrder.length - 1) {
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    }
    onChange({ ...data, sectionOrder: newOrder });
  };

  const addCustomSection = () => {
    const newSection: CustomSection = {
      id: generateId(),
      title: 'New Section',
      items: []
    };
    onChange({
      ...data,
      customSections: [...data.customSections, newSection],
      sectionOrder: [...data.sectionOrder, 'custom:' + newSection.id] // Use ID to identify custom sections
    });
    setExpandedSections(prev => ({ ...prev, [`custom:${newSection.id}`]: true })); // Expand new custom section
  };

  const updateCustomSection = (id: string, field: keyof CustomSection, value: any) => {
    onChange({
      ...data,
      customSections: data.customSections.map(s => s.id === id ? { ...s, [field]: value } : s)
    });
  };

  const addCustomItem = (sectionId: string) => {
    const newItem: CustomItem = {
      title: '',
      date: '',
      description: ''
    };
    onChange({
      ...data,
      customSections: data.customSections.map(s =>
        s.id === sectionId ? { ...s, items: [...s.items, newItem] } : s
      )
    });
  };

  const updateCustomItem = (sectionId: string, itemIndex: number, field: keyof CustomItem, value: string) => {
    onChange({
      ...data,
      customSections: data.customSections.map(s => {
        if (s.id === sectionId) {
          const newItems = [...s.items];
          newItems[itemIndex] = { ...newItems[itemIndex], [field]: value };
          return { ...s, items: newItems };
        }
        return s;
      })
    });
  };

  const removeCustomItem = (sectionId: string, itemIndex: number) => {
    onChange({
      ...data,
      customSections: data.customSections.map(s =>
        s.id === sectionId ? { ...s, items: s.items.filter((_, i) => i !== itemIndex) } : s
      )
    });
  };

  const removeCustomSection = (id: string) => {
    onChange({
      ...data,
      customSections: data.customSections.filter(s => s.id !== id),
      sectionOrder: data.sectionOrder.filter(s => s !== 'custom:' + id)
    });
  };

  const SectionHeader = ({ title, section, index, isCustom = false, onDelete }: { title: string; section: string; index: number; isCustom?: boolean; onDelete?: () => void }) => (
    <div className="flex items-center gap-2 mb-2">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0"
        disabled={index === 0}
        onClick={(e) => {
          e.stopPropagation();
          moveSection(index, 'up');
        }}
      >
        <ChevronUp className="h-4 w-4" />
      </Button>

      <button
        onClick={() => toggleSection(section)}
        className="flex-1 flex items-center justify-between p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
      >
        <h3 className="font-display font-semibold text-lg text-foreground">{title}</h3>
        {expandedSections[section] ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {isCustom && onDelete && (
        <Button
          variant="destructive"
          size="icon"
          className="h-full w-10 ml-1"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );

  const [enhancedBullets, setEnhancedBullets] = useState<Set<string>>(new Set());

  const markAsEnhanced = (id: string) => {
    setEnhancedBullets(prev => new Set(prev).add(id));
  };

  const maxFreeEnhancements = 4;
  const currentUsage = enhancedBullets.size;

  const EnhanceButton = ({ text, id, onUpdate }: { text: string; id: string; onUpdate: (enhanced: string) => void }) => {
    const isEnhanced = enhancedBullets.has(id);
    const limitReached = currentUsage >= maxFreeEnhancements;
    const isDisabled = isEnhanced || (!isEnhanced && limitReached) || !text.trim();

    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={isDisabled}
        onClick={() => onEnhance(text, (enhanced) => {
          onUpdate(enhanced);
          markAsEnhanced(id);
        })}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs gap-1"
      >
        <Sparkles className="w-3 h-3" />
        {isEnhanced ? 'Enhanced' : limitReached ? 'Limit Reached' : `${currentUsage}/${maxFreeEnhancements}`}
      </Button>
    );
  };

  const renderSectionContent = (sectionKey: string) => {
    if (sectionKey === 'userInfo') {
      return (
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={data.userInfo.name}
                onChange={e => updateUserInfo('name', e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label htmlFor="title">Professional Title</Label>
              <Input
                id="title"
                value={data.userInfo.title}
                onChange={e => updateUserInfo('title', e.target.value)}
                placeholder="Full Stack Developer"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={data.userInfo.email}
                onChange={e => updateUserInfo('email', e.target.value)}
                placeholder="john@example.com"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={data.userInfo.phone}
                onChange={e => updateUserInfo('phone', e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
            <div>
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input
                id="linkedin"
                value={data.userInfo.linkedIn}
                onChange={e => updateUserInfo('linkedIn', e.target.value)}
                placeholder="linkedin.com/in/johndoe"
              />
            </div>
            <div>
              <Label htmlFor="github">GitHub URL</Label>
              <Input
                id="github"
                value={data.userInfo.github}
                onChange={e => updateUserInfo('github', e.target.value)}
                placeholder="github.com/johndoe"
              />
            </div>
          </div>
        </div>
      );
    }
    if (sectionKey === 'summary') {
      return (
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="relative">
            <Textarea
              value={data.summary}
              onChange={e => onChange({ ...data, summary: e.target.value })}
              placeholder="Write a brief professional summary..."
              rows={4}
            />
            <EnhanceButton
              text={data.summary}
              id="summary"
              onUpdate={(enhanced) => onChange({ ...data, summary: enhanced })}
            />
          </div>
        </div>
      );
    }
    if (sectionKey === 'skills') {
      return (
        <div className="bg-card border border-border rounded-xl p-4 space-y-4">
          {data.skills.map((skillGroup, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start bg-secondary/20 p-4 rounded-lg">
              <div className="md:col-span-4">
                <Label>Category</Label>
                <Input
                  placeholder="e.g. Languages"
                  value={skillGroup.category}
                  onChange={(e) => {
                    const newSkills = [...data.skills];
                    newSkills[index].category = e.target.value;
                    onChange({ ...data, skills: newSkills });
                  }}
                />
              </div>
              <div className="md:col-span-7">
                <Label>Skills (Comma separated)</Label>
                <Input
                  placeholder="e.g. Java, Python, JavaScript"
                  value={skillGroup.items}
                  onChange={(e) => {
                    const newSkills = [...data.skills];
                    newSkills[index].items = e.target.value;
                    onChange({ ...data, skills: newSkills });
                  }}
                />
              </div>
              <div className="md:col-span-1 pt-6 text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newSkills = data.skills.filter((_, i) => i !== index);
                    onChange({ ...data, skills: newSkills });
                  }}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          <Button
            onClick={() => {
              onChange({
                ...data,
                skills: [...data.skills, { category: '', items: '' }]
              });
            }}
            variant="outline"
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Skill Category
          </Button>
        </div>
      );
    }
    if (sectionKey === 'experience') {
      return (
        <div className="bg-card border border-border rounded-xl p-4 space-y-4">
          {data.experience.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-secondary/30 rounded-lg space-y-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground">Experience {index + 1}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExperience(exp.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              {/* ... Inputs for Experience ... */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Company</Label>
                  <Input value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} placeholder="Company Name" />
                </div>
                <div>
                  <Label>Job Title</Label>
                  <Input value={exp.jobTitle} onChange={e => updateExperience(exp.id, 'jobTitle', e.target.value)} placeholder="Software Engineer" />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input value={exp.location} onChange={e => updateExperience(exp.id, 'location', e.target.value)} placeholder="San Francisco, CA" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Start Date</Label>
                    <Input type="month" value={exp.startDate} onChange={e => updateExperience(exp.id, 'startDate', e.target.value)} />
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <Input type="month" value={exp.endDate} onChange={e => updateExperience(exp.id, 'endDate', e.target.value)} placeholder="Present" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Bullet Points (AI Enhanceable)</Label>
                {exp.bullets.map((bullet, bulletIndex) => (
                  <div key={bulletIndex} className="relative">
                    <Input
                      value={bullet}
                      onChange={e => {
                        const newBullets = [...exp.bullets];
                        newBullets[bulletIndex] = e.target.value;
                        updateExperience(exp.id, 'bullets', newBullets);
                      }}
                      placeholder={`Bullet point ${bulletIndex + 1}`}
                      className="pr-24"
                    />
                    <EnhanceButton
                      text={bullet}
                      id={`exp-${exp.id}-${bulletIndex}`}
                      onUpdate={(enhanced) => {
                        const newBullets = [...exp.bullets];
                        newBullets[bulletIndex] = enhanced;
                        updateExperience(exp.id, 'bullets', newBullets);
                      }}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
          <Button onClick={addExperience} variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
          </Button>
        </div>
      );
    }
    if (sectionKey === 'projects') {
      return (
        <div className="bg-card border border-border rounded-xl p-4 space-y-4">
          {data.projects.map((proj, index) => (
            <motion.div
              key={proj.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-secondary/30 rounded-lg space-y-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground">Project {index + 1}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeProject(proj.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label>Project Name</Label>
                  <Input value={proj.name} onChange={e => updateProject(proj.id, 'name', e.target.value)} placeholder="Project Name" />
                </div>
                <div className="md:col-span-2">
                  <Label>Project Link (Optional)</Label>
                  <Input
                    value={proj.url || ''}
                    onChange={e => updateProject(proj.id, 'url', e.target.value)}
                    placeholder="https://github.com/username/project"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Technologies / Description</Label>
                  <Input value={proj.description} onChange={e => updateProject(proj.id, 'description', e.target.value)} placeholder="React, Node.js, MongoDB" />
                </div>
                <div>
                  <Label>Start Date</Label>
                  <Input type="month" value={proj.startDate} onChange={e => updateProject(proj.id, 'startDate', e.target.value)} />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input type="month" value={proj.endDate} onChange={e => updateProject(proj.id, 'endDate', e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Bullet Points</Label>
                {proj.bullets.map((bullet, bulletIndex) => (
                  <div key={bulletIndex} className="relative">
                    <Input
                      value={bullet}
                      onChange={e => {
                        const newBullets = [...proj.bullets];
                        newBullets[bulletIndex] = e.target.value;
                        updateProject(proj.id, 'bullets', newBullets);
                      }}
                      placeholder={`Bullet point ${bulletIndex + 1}`}
                      className="pr-24"
                    />
                    <EnhanceButton
                      text={bullet}
                      id={`proj-${proj.id}-${bulletIndex}`}
                      onUpdate={(enhanced) => {
                        const newBullets = [...proj.bullets];
                        newBullets[bulletIndex] = enhanced;
                        updateProject(proj.id, 'bullets', newBullets);
                      }}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
          <Button onClick={addProject} variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </div>
      );
    }
    if (sectionKey === 'leadership') {
      return (
        <div className="bg-card border border-border rounded-xl p-4 space-y-4">
          {data.leadershipRoles.map((role, index) => (
            <motion.div key={role.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-secondary/30 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground">Role {index + 1}</h4>
                <Button variant="ghost" size="sm" onClick={() => removeLeadership(role.id)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>Title</Label><Input value={role.title} onChange={e => updateLeadership(role.id, 'title', e.target.value)} placeholder="President" /></div>
                <div><Label>Organization</Label><Input value={role.organization} onChange={e => updateLeadership(role.id, 'organization', e.target.value)} placeholder="Computer Science Club" /></div>
                <div><Label>Start Date</Label><Input type="month" value={role.startDate} onChange={e => updateLeadership(role.id, 'startDate', e.target.value)} /></div>
                <div><Label>End Date</Label><Input type="month" value={role.endDate} onChange={e => updateLeadership(role.id, 'endDate', e.target.value)} placeholder="Present" /></div>
                <div className="md:col-span-2"><Label>Description</Label><Textarea value={role.description} onChange={e => updateLeadership(role.id, 'description', e.target.value)} placeholder="Describe your responsibilities and achievements..." rows={3} /></div>
              </div>
            </motion.div>
          ))}
          <Button onClick={addLeadership} variant="outline" className="w-full"><Plus className="w-4 h-4 mr-2" />Add Leadership Role</Button>
        </div>
      );
    }

    if (sectionKey.startsWith('custom:')) {
      const sectionId = sectionKey.split('custom:')[1];
      const section = data.customSections.find(s => s.id === sectionId);
      if (!section) return null;

      return (
        <div className="bg-card border border-border rounded-xl p-4 space-y-4">
          <div className="mb-4">
            <Label>Section Title</Label>
            <Input
              value={section.title}
              onChange={(e) => updateCustomSection(sectionId, 'title', e.target.value)}
              placeholder="e.g. Certifications, Volunteering"
              className="font-semibold text-lg"
            />
          </div>
          {section.items.map((item, idx) => (
            <div key={idx} className="p-4 bg-secondary/30 rounded-lg space-y-4 relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeCustomItem(sectionId, idx)}
                className="absolute top-2 right-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Item Title</Label>
                  <Input
                    value={item.title}
                    onChange={(e) => updateCustomItem(sectionId, idx, 'title', e.target.value)}
                    placeholder="e.g. AWS Certified Solutions Architect"
                  />
                </div>
                <div>
                  <Label>Date</Label>
                  <Input
                    value={item.date}
                    onChange={(e) => updateCustomItem(sectionId, idx, 'date', e.target.value)}
                    placeholder="e.g. Jan 2023"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Description</Label>
                  <Input
                    value={item.description}
                    onChange={(e) => updateCustomItem(sectionId, idx, 'description', e.target.value)}
                    placeholder="Brief description..."
                  />
                </div>
              </div>
            </div>
          ))}
          <Button onClick={() => addCustomItem(sectionId)} variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" /> Add Item
          </Button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Dynamic Sections Loop */}
      {data.sectionOrder.map((sectionKey, index) => {
        let title = '';
        const isCustom = sectionKey.startsWith('custom:');
        if (sectionKey === 'userInfo') title = 'Personal Information';
        else if (sectionKey === 'summary') title = 'Professional Summary';
        else if (sectionKey === 'skills') title = 'Skills';
        else if (sectionKey === 'experience') title = 'Work Experience';
        else if (sectionKey === 'projects') title = 'Projects';
        else if (sectionKey === 'leadership') title = 'Leadership Roles';
        else if (isCustom) {
          const sec = data.customSections.find(s => s.id === sectionKey.split('custom:')[1]);
          title = sec ? sec.title : 'Custom Section';
        }

        if (!title) return null;

        return (
          <div key={sectionKey} className="section-container bg-card border border-border rounded-xl overflow-hidden">
            <SectionHeader
              title={title}
              section={sectionKey}
              index={index}
              isCustom={isCustom}
              onDelete={isCustom ? () => removeCustomSection(sectionKey.split('custom:')[1]) : undefined}
            />
            <AnimatePresence>
              {expandedSections[sectionKey] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  {renderSectionContent(sectionKey)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {/* Add Custom Section Button */}
      <Button onClick={addCustomSection} variant="secondary" className="w-full border-dashed border-2">
        <Plus className="w-4 h-4 mr-2" />
        Add Custom Section
      </Button>
    </div>
  );
};
