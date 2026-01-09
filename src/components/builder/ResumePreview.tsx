import type { ResumeData } from '@/types/resume';

interface ResumePreviewProps {
  data: ResumeData;
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'Present';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export const ResumePreview = ({ data }: ResumePreviewProps) => {
  const template = data.templateSelected;

  return (
    <div className="bg-white text-gray-900 p-8 shadow-lg min-h-[11in] w-full max-w-[8.5in] mx-auto">
      {/* Header */}
      <div className={`mb-6 ${template === 'modern' ? 'border-l-4 border-blue-600 pl-4' : ''}`}>
        <h1 className={`
          font-bold text-gray-900
          ${template === 'modern' ? 'text-3xl' : ''}
          ${template === 'classic' ? 'text-2xl font-serif' : ''}
          ${template === 'minimal' ? 'text-2xl tracking-wide' : ''}
        `}>
          {data.userInfo.name || 'Your Name'}
        </h1>
        
        {data.userInfo.title && (
          <p className={`
            mt-1
            ${template === 'modern' ? 'text-blue-600 font-medium text-lg' : ''}
            ${template === 'classic' ? 'text-gray-600 italic' : ''}
            ${template === 'minimal' ? 'text-gray-500 uppercase text-sm tracking-widest' : ''}
          `}>
            {data.userInfo.title}
          </p>
        )}
        
        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
          {data.userInfo.email && <span>{data.userInfo.email}</span>}
          {data.userInfo.phone && <span>• {data.userInfo.phone}</span>}
          {data.userInfo.linkedIn && <span>• {data.userInfo.linkedIn}</span>}
          {data.userInfo.github && <span>• {data.userInfo.github}</span>}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="mb-6">
          <h2 className={`
            font-semibold mb-2
            ${template === 'modern' ? 'text-blue-600 uppercase text-sm tracking-wider' : ''}
            ${template === 'classic' ? 'text-gray-800 border-b border-gray-300 pb-1' : ''}
            ${template === 'minimal' ? 'text-gray-700 uppercase text-xs tracking-widest' : ''}
          `}>
            Summary
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">{data.summary}</p>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mb-6">
          <h2 className={`
            font-semibold mb-2
            ${template === 'modern' ? 'text-blue-600 uppercase text-sm tracking-wider' : ''}
            ${template === 'classic' ? 'text-gray-800 border-b border-gray-300 pb-1' : ''}
            ${template === 'minimal' ? 'text-gray-700 uppercase text-xs tracking-widest' : ''}
          `}>
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill) => (
              <span
                key={skill}
                className={`
                  text-sm px-2.5 py-0.5 rounded-full
                  ${template === 'modern' ? 'bg-blue-50 text-blue-700' : ''}
                  ${template === 'classic' ? 'bg-gray-100 text-gray-700' : ''}
                  ${template === 'minimal' ? 'border border-gray-300 text-gray-600' : ''}
                `}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className={`
            font-semibold mb-3
            ${template === 'modern' ? 'text-blue-600 uppercase text-sm tracking-wider' : ''}
            ${template === 'classic' ? 'text-gray-800 border-b border-gray-300 pb-1' : ''}
            ${template === 'minimal' ? 'text-gray-700 uppercase text-xs tracking-widest' : ''}
          `}>
            Experience
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-gray-900">{exp.jobTitle || 'Job Title'}</h3>
                  <span className="text-sm text-gray-500">
                    {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                  </span>
                </div>
                <p className={`text-sm mb-2 ${template === 'modern' ? 'text-blue-600' : 'text-gray-600'}`}>
                  {exp.company || 'Company'}{exp.location && ` • ${exp.location}`}
                </p>
                <ul className="space-y-1">
                  {exp.bullets.filter(b => b.trim()).map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className={`mt-2 w-1 h-1 rounded-full flex-shrink-0 ${
                        template === 'modern' ? 'bg-blue-600' : 'bg-gray-400'
                      }`} />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div className="mb-6">
          <h2 className={`
            font-semibold mb-3
            ${template === 'modern' ? 'text-blue-600 uppercase text-sm tracking-wider' : ''}
            ${template === 'classic' ? 'text-gray-800 border-b border-gray-300 pb-1' : ''}
            ${template === 'minimal' ? 'text-gray-700 uppercase text-xs tracking-widest' : ''}
          `}>
            Projects
          </h2>
          <div className="space-y-4">
            {data.projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-gray-900">{proj.name || 'Project Name'}</h3>
                  {(proj.startDate || proj.endDate) && (
                    <span className="text-sm text-gray-500">
                      {formatDate(proj.startDate)} - {formatDate(proj.endDate)}
                    </span>
                  )}
                </div>
                {proj.description && (
                  <p className={`text-sm mb-2 ${template === 'modern' ? 'text-blue-600' : 'text-gray-600'}`}>
                    {proj.description}
                  </p>
                )}
                <ul className="space-y-1">
                  {proj.bullets.filter(b => b.trim()).map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className={`mt-2 w-1 h-1 rounded-full flex-shrink-0 ${
                        template === 'modern' ? 'bg-blue-600' : 'bg-gray-400'
                      }`} />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leadership Roles */}
      {data.leadershipRoles.length > 0 && (
        <div className="mb-6">
          <h2 className={`
            font-semibold mb-3
            ${template === 'modern' ? 'text-blue-600 uppercase text-sm tracking-wider' : ''}
            ${template === 'classic' ? 'text-gray-800 border-b border-gray-300 pb-1' : ''}
            ${template === 'minimal' ? 'text-gray-700 uppercase text-xs tracking-widest' : ''}
          `}>
            Leadership
          </h2>
          <div className="space-y-3">
            {data.leadershipRoles.map((role) => (
              <div key={role.id}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-gray-900">{role.title || 'Role Title'}</h3>
                  <span className="text-sm text-gray-500">
                    {formatDate(role.startDate)} - {formatDate(role.endDate)}
                  </span>
                </div>
                <p className={`text-sm ${template === 'modern' ? 'text-blue-600' : 'text-gray-600'}`}>
                  {role.organization || 'Organization'}
                </p>
                {role.description && (
                  <p className="text-sm text-gray-700 mt-1">{role.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};