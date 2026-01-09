import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { ResumeData, Experience, Project, LeadershipRole } from '@/types/resume';

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

  const [skillInput, setSkillInput] = useState('');

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const updateUserInfo = (field: keyof ResumeData['userInfo'], value: string) => {
    onChange({
      ...data,
      userInfo: { ...data.userInfo, [field]: value },
    });
  };

  const addSkill = () => {
    if (skillInput.trim() && !data.skills.includes(skillInput.trim())) {
      onChange({
        ...data,
        skills: [...data.skills, skillInput.trim()],
      });
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    onChange({
      ...data,
      skills: data.skills.filter(s => s !== skill),
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

  const SectionHeader = ({ title, section }: { title: string; section: string }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
    >
      <h3 className="font-display font-semibold text-lg text-foreground">{title}</h3>
      {expandedSections[section] ? (
        <ChevronUp className="w-5 h-5 text-muted-foreground" />
      ) : (
        <ChevronDown className="w-5 h-5 text-muted-foreground" />
      )}
    </button>
  );

  const EnhanceButton = ({ text, onUpdate }: { text: string; onUpdate: (enhanced: string) => void }) => (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={enhanceDisabled || !text.trim()}
      onClick={() => onEnhance(text, onUpdate)}
      className="absolute right-2 top-1/2 -translate-y-1/2 text-xs gap-1"
    >
      <Sparkles className="w-3 h-3" />
      Enhance
    </Button>
  );

  return (
    <div className="space-y-4">
      {/* User Info Section */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <SectionHeader title="Personal Information" section="userInfo" />
        <AnimatePresence>
          {expandedSections.userInfo && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-4">
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Summary Section */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <SectionHeader title="Professional Summary" section="summary" />
        <AnimatePresence>
          {expandedSections.summary && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4">
                <Textarea
                  value={data.summary}
                  onChange={e => onChange({ ...data, summary: e.target.value })}
                  placeholder="Write a brief professional summary highlighting your key qualifications and career goals..."
                  rows={4}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Skills Section */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <SectionHeader title="Skills" section="skills" />
        <AnimatePresence>
          {expandedSections.skills && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    placeholder="Add a skill (e.g., React, Python, Leadership)"
                  />
                  <Button onClick={addSkill} variant="secondary">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map(skill => (
                    <motion.span
                      key={skill}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Experience Section */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <SectionHeader title="Work Experience" section="experience" />
        <AnimatePresence>
          {expandedSections.experience && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-4">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Company</Label>
                        <Input
                          value={exp.company}
                          onChange={e => updateExperience(exp.id, 'company', e.target.value)}
                          placeholder="Company Name"
                        />
                      </div>
                      <div>
                        <Label>Job Title</Label>
                        <Input
                          value={exp.jobTitle}
                          onChange={e => updateExperience(exp.id, 'jobTitle', e.target.value)}
                          placeholder="Software Engineer"
                        />
                      </div>
                      <div>
                        <Label>Location</Label>
                        <Input
                          value={exp.location}
                          onChange={e => updateExperience(exp.id, 'location', e.target.value)}
                          placeholder="San Francisco, CA"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>Start Date</Label>
                          <Input
                            type="month"
                            value={exp.startDate}
                            onChange={e => updateExperience(exp.id, 'startDate', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>End Date</Label>
                          <Input
                            type="month"
                            value={exp.endDate}
                            onChange={e => updateExperience(exp.id, 'endDate', e.target.value)}
                            placeholder="Present"
                          />
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Projects Section */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <SectionHeader title="Projects" section="projects" />
        <AnimatePresence>
          {expandedSections.projects && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-4">
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
                        <Input
                          value={proj.name}
                          onChange={e => updateProject(proj.id, 'name', e.target.value)}
                          placeholder="Project Name"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Technologies / Description</Label>
                        <Input
                          value={proj.description}
                          onChange={e => updateProject(proj.id, 'description', e.target.value)}
                          placeholder="React, Node.js, MongoDB"
                        />
                      </div>
                      <div>
                        <Label>Start Date</Label>
                        <Input
                          type="month"
                          value={proj.startDate}
                          onChange={e => updateProject(proj.id, 'startDate', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <Input
                          type="month"
                          value={proj.endDate}
                          onChange={e => updateProject(proj.id, 'endDate', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Bullet Points (AI Enhanceable)</Label>
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Leadership Section */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <SectionHeader title="Leadership Roles" section="leadership" />
        <AnimatePresence>
          {expandedSections.leadership && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-4">
                {data.leadershipRoles.map((role, index) => (
                  <motion.div
                    key={role.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-secondary/30 rounded-lg space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground">Role {index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLeadership(role.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={role.title}
                          onChange={e => updateLeadership(role.id, 'title', e.target.value)}
                          placeholder="President"
                        />
                      </div>
                      <div>
                        <Label>Organization</Label>
                        <Input
                          value={role.organization}
                          onChange={e => updateLeadership(role.id, 'organization', e.target.value)}
                          placeholder="Computer Science Club"
                        />
                      </div>
                      <div>
                        <Label>Start Date</Label>
                        <Input
                          type="month"
                          value={role.startDate}
                          onChange={e => updateLeadership(role.id, 'startDate', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <Input
                          type="month"
                          value={role.endDate}
                          onChange={e => updateLeadership(role.id, 'endDate', e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Description</Label>
                        <Textarea
                          value={role.description}
                          onChange={e => updateLeadership(role.id, 'description', e.target.value)}
                          placeholder="Describe your responsibilities and achievements..."
                          rows={3}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
                <Button onClick={addLeadership} variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Leadership Role
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* AI Enhancement Counter */}
      {!enhanceDisabled && (
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Free users get 1 AI enhancement.{' '}
            <span className="text-primary font-medium">Used: {enhanceCount}/1</span>
          </p>
        </div>
      )}
    </div>
  );
};