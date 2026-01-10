import type { ResumeData } from '@/types/resume';

interface ResumePreviewProps {
  data: ResumeData;
  isCompact?: boolean;
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'Present';
  // Attempt to parse "YYYY-MM"
  const [year, month] = dateStr.split('-');
  if (year && month) {
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }
  return dateStr;
};

export const ResumePreview = ({ data, isCompact = false }: ResumePreviewProps) => {
  const template = data.templateSelected;

  const spacing = isCompact ? 'mb-2' : 'mb-6';
  const headerSpacing = isCompact ? 'mb-1' : 'mb-3';
  const itemSpacing = isCompact ? 'mb-2' : 'mb-4';
  const textSpacing = isCompact ? 'space-y-0.5' : 'space-y-1';

  const renderSection = (sectionName: string) => {
    // ... (rest of renderSection function remains exact same, I will assume it's preserved or I should copy it fully if I can't partially edit. Since I need to wrap the whole component to add hooks, I must replace the implementation.
    // To save tokens, I will output the FULL content again to be safe given the complexity of the file and previous context usage).

    // Actually, I can use the 'StartLine' and 'EndLine' to just replace the TOP and BOTTOM, but the 'renderSection' is in the middle.
    // I will replace the whole component definition.
    switch (sectionName) {
      case 'userInfo':
        return null; // Handled in header
      case 'summary':
        return data.summary && (
          <div key="summary" className={spacing}>
            <h2 className={`
                    font-semibold ${headerSpacing}
                    ${template === 'modern' ? 'text-blue-600 uppercase text-sm tracking-wider' : ''}
                    ${template === 'classic' ? 'text-gray-800 border-b border-gray-300 pb-1' : ''}
                    ${template === 'minimal' ? 'text-gray-700 uppercase text-xs tracking-widest' : ''}
                  `}>
              Summary
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">{data.summary}</p>
          </div>
        );
      case 'skills':
        return data.skills.length > 0 && (
          <section key="skills" className={spacing}>
            <h2 className={`text-xl font-bold border-b-2 ${template === 'modern' ? 'border-blue-600 text-blue-600' : 'border-gray-800 text-gray-800'
              } ${headerSpacing}`}>
              Skills
            </h2>
            <div className="space-y-1">
              {data.skills.map((skillGroup, index) => (
                <div key={index} className="text-sm">
                  <span className="font-semibold">{skillGroup.category}: </span>
                  <span>{skillGroup.items}</span>
                </div>
              ))}
            </div>
          </section>
        );
      case 'experience':
        return data.experience.length > 0 && (
          <div key="experience" className={spacing}>
            <h2 className={`
                    font-semibold ${headerSpacing}
                    ${template === 'modern' ? 'text-blue-600 uppercase text-sm tracking-wider' : ''}
                    ${template === 'classic' ? 'text-gray-800 border-b border-gray-300 pb-1' : ''}
                    ${template === 'minimal' ? 'text-gray-700 uppercase text-xs tracking-widest' : ''}
                  `}>
              Experience
            </h2>
            <div className={isCompact ? 'space-y-2' : 'space-y-4'}>
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium text-gray-900">{exp.jobTitle || 'Job Title'}</h3>
                    <span className="text-sm text-gray-500">
                      {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                    </span>
                  </div>
                  <p className={`text-sm ${isCompact ? 'mb-1' : 'mb-2'} ${template === 'modern' ? 'text-blue-600' : 'text-gray-600'}`}>
                    {exp.company || 'Company'}{exp.location && ` • ${exp.location}`}
                  </p>
                  <ul className={`list-disc ml-4 ${textSpacing}`}>
                    {exp.bullets.filter(b => b.trim()).map((bullet, i) => (
                      <li key={i} className={`text-sm text-gray-700 pl-1 ${template === 'modern' ? 'marker:text-blue-600' : 'marker:text-gray-400'}`}>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );
      case 'projects':
        return data.projects.length > 0 && (
          <div key="projects" className={spacing}>
            <h2 className={`
                    font-semibold ${headerSpacing}
                    ${template === 'modern' ? 'text-blue-600 uppercase text-sm tracking-wider' : ''}
                    ${template === 'classic' ? 'text-gray-800 border-b border-gray-300 pb-1' : ''}
                    ${template === 'minimal' ? 'text-gray-700 uppercase text-xs tracking-widest' : ''}
                  `}>
              Projects
            </h2>
            <div className={isCompact ? 'space-y-2' : 'space-y-4'}>
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
                  {proj.url && (
                    <a
                      href={proj.url.startsWith('http') ? proj.url : `https://${proj.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline mb-1 block font-medium"
                    >
                      {proj.url.replace(/^https?:\/\/(www\.)?/, '')}
                    </a>
                  )}
                  {proj.description && (
                    <p className={`text-sm ${isCompact ? 'mb-1' : 'mb-2'} ${template === 'modern' ? 'text-blue-600' : 'text-gray-600'}`}>
                      {proj.description}
                    </p>
                  )}
                  <ul className={`list-disc ml-4 ${textSpacing}`}>
                    {proj.bullets.filter(b => b.trim()).map((bullet, i) => (
                      <li key={i} className={`text-sm text-gray-700 pl-1 ${template === 'modern' ? 'marker:text-blue-600' : 'marker:text-gray-400'}`}>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );
      case 'leadership':
        return data.leadershipRoles.length > 0 && (
          <div key="leadership" className={spacing}>
            <h2 className={`
                    font-semibold ${headerSpacing}
                    ${template === 'modern' ? 'text-blue-600 uppercase text-sm tracking-wider' : ''}
                    ${template === 'classic' ? 'text-gray-800 border-b border-gray-300 pb-1' : ''}
                    ${template === 'minimal' ? 'text-gray-700 uppercase text-xs tracking-widest' : ''}
                  `}>
              Leadership
            </h2>
            <div className={isCompact ? 'space-y-2' : 'space-y-3'}>
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
        );
      case 'custom':
        return data.customSections && data.customSections.map(section => (
          <div key={section.id} className={spacing}>
            <h2 className={`
                        font-semibold ${headerSpacing}
                        ${template === 'modern' ? 'text-blue-600 uppercase text-sm tracking-wider' : ''}
                        ${template === 'classic' ? 'text-gray-800 border-b border-gray-300 pb-1' : ''}
                        ${template === 'minimal' ? 'text-gray-700 uppercase text-xs tracking-widest' : ''}
                    `}>
              {section.title}
            </h2>
            <div className={isCompact ? 'space-y-2' : 'space-y-3'}>
              {section.items.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    <span className="text-sm text-gray-500">{item.date}</span>
                  </div>
                  <p className="text-sm text-gray-700">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        ));
      default:
        return null;
    }
  };

  return (
    <div className={`a4-page text-gray-900 ${isCompact ? 'text-[0.9rem]' : ''}`}>
      {/* Header */}
      <div className={`${spacing} ${template === 'modern' ? 'border-l-4 border-blue-600 pl-4' : ''}`}>
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

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-600">
          {data.userInfo.email && (
            <a href={`mailto:${data.userInfo.email}`} className="hover:text-blue-600 transition-colors">
              {data.userInfo.email}
            </a>
          )}
          {data.userInfo.phone && (
            <>
              <span className="text-gray-400">•</span>
              <a href={`tel:${data.userInfo.phone}`} className="hover:text-blue-600 transition-colors">
                {data.userInfo.phone}
              </a>
            </>
          )}
          {data.userInfo.linkedIn && (
            <>
              <span className="text-gray-400">•</span>
              <a href={data.userInfo.linkedIn.startsWith('http') ? data.userInfo.linkedIn : `https://${data.userInfo.linkedIn}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                {data.userInfo.linkedIn.replace(/^https?:\/\/(www\.)?/, '')}
              </a>
            </>
          )}
          {data.userInfo.github && (
            <>
              <span className="text-gray-400">•</span>
              <a href={data.userInfo.github.startsWith('http') ? data.userInfo.github : `https://${data.userInfo.github}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                {data.userInfo.github.replace(/^https?:\/\/(www\.)?/, '')}
              </a>
            </>
          )}
        </div>
      </div>

      {/* Dynamic Sections */}
      {data.sectionOrder ? data.sectionOrder.map(section => renderSection(section)) : (
        // Fallback order if not defined
        ['summary', 'skills', 'experience', 'projects', 'leadership', 'custom'].map(section => renderSection(section))
      )}
    </div>
  );
};
