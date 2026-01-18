import { useState, useLayoutEffect, useRef, useMemo, useEffect } from 'react';
import type { ResumeData } from '@/types/resume';

interface ResumePreviewProps {
  data: ResumeData;
  isCompact?: boolean;
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'Present';
  const [year, month] = dateStr.split('-');
  if (year && month) {
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }
  return dateStr;
};

const renderDateRange = (startDate?: string, endDate?: string) => {
  if (!startDate) return null;
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  return `${start} - ${end}`;
};

// Dimensions in pixels (approximate for 96DPI)
// A4 Height = 297mm approx 1122px
// Padding Top/Bottom = 10mm each = 20mm approx 75px
// Safe content height = 1122 - 75 = 1047px.
// We use a slightly safer margin.
const MAX_PAGE_HEIGHT = 1040;

export const ResumePreview = ({ data, isCompact = false }: ResumePreviewProps) => {
  // Always use standard spacing since Harvard is the only template
  const spacing = 'mb-2';
  const headerSpacing = 'mb-1';
  const textSpacing = 'space-y-0';

  const [paginatedContent, setPaginatedContent] = useState<React.ReactNode[][]>([]);
  const measureContainerRef = useRef<HTMLDivElement>(null);

  // 1. Generate Atomic Blocks
  // We turn the resume into a flat list of renderable "blocks" with IDs
  const blocks = useMemo(() => {
    const b: { id: string; content: React.ReactNode }[] = [];
    const sectionOrder = data.sectionOrder || ['summary', 'skills', 'education', 'experience', 'projects', 'leadership', 'custom'];

    // --- Header Block ---
    b.push({
      id: 'header',
      content: (
        <div className={`${spacing} text-center`}>
          <h1 className="font-bold text-black text-xl uppercase">
            {data.userInfo.name || 'Your Name'}
          </h1>
          {data.userInfo.title && (
            <p className="text-black text-sm">
              {data.userInfo.title}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0 mt-1 text-sm text-black justify-center">
            {data.userInfo.email && (
              <a href={`mailto:${data.userInfo.email}`} className="text-black">
                {data.userInfo.email}
              </a>
            )}
            {data.userInfo.phone && (
              <>
                <span className="text-black">•</span>
                <a href={`tel:${data.userInfo.phone}`} className="text-black">
                  {data.userInfo.phone}
                </a>
              </>
            )}
            {data.userInfo.linkedIn && (
              <>
                <span className="text-black">•</span>
                <a href={data.userInfo.linkedIn.startsWith('http') ? data.userInfo.linkedIn : `https://${data.userInfo.linkedIn}`} target="_blank" rel="noopener noreferrer" className="text-black">
                  {data.userInfo.linkedIn.replace(/^https?:\/\/(www\.)?/, '')}
                </a>
              </>
            )}
            {data.userInfo.github && (
              <>
                <span className="text-black">•</span>
                <a href={data.userInfo.github.startsWith('http') ? data.userInfo.github : `https://${data.userInfo.github}`} target="_blank" rel="noopener noreferrer" className="text-black">
                  {data.userInfo.github.replace(/^https?:\/\/(www\.)?/, '')}
                </a>
              </>
            )}
          </div>
        </div>
      )
    });

    // --- Dynamic Sections ---
    sectionOrder.forEach(sectionName => {
      switch (sectionName) {
        case 'userInfo':
          break; // Already in header
        case 'summary':
          if (data.summary) {
            b.push({
              id: 'summary',
              content: (
                <div className={spacing}>
                  <div className={`font-semibold ${headerSpacing} text-black font-bold uppercase border-b border-black text-sm pb-1`}>
                    Summary
                  </div>
                  <p className="text-sm leading-snug text-black">{data.summary}</p>
                </div>
              )
            });
          }
          break;
        case 'skills':
          if (data.skills.length > 0) {
            b.push({
              id: 'skills',
              content: (
                <section className={spacing}>
                  <div className={`font-semibold ${headerSpacing} text-black font-bold uppercase border-b border-black text-sm pb-1`}>
                    Skills
                  </div>
                  <div className="space-y-0">
                    {data.skills.map((skillGroup, index) => (
                      <div key={index} className="text-sm text-black leading-snug">
                        <span className="font-semibold">{skillGroup.category}: </span>
                        <span>{skillGroup.items}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )
            });
          }
          break;
        case 'education':
          if (data.education.length > 0) {
            // Header for Education
            b.push({
              id: 'education-header',
              content: (
                <div className={`font-semibold ${headerSpacing} text-black font-bold uppercase border-b border-black text-sm pb-1 mb-1 mt-2`}>
                  Education
                </div>
              )
            });
            // Items
            data.education.forEach(edu => {
              b.push({
                id: `edu-${edu.id}`,
                content: (
                  <div className="mb-1">
                    <div className="flex justify-between items-start mb-0.5">
                      <div className="flex-1">
                        <div className="font-bold text-black text-sm">
                          {edu.school} <span className="font-normal italic text-black">– {edu.location}</span>
                        </div>
                        <p className="text-sm text-black italic">{edu.degree}</p>
                      </div>
                      <span className="text-sm whitespace-nowrap ml-4 text-black">
                        {renderDateRange(edu.startDate, edu.endDate)}
                      </span>
                    </div>
                    {edu.bullets && edu.bullets.length > 0 && (
                      <ul className={`list-disc ml-4 ${textSpacing}`}>
                        {edu.bullets.filter(bb => bb.trim()).map((bullet, i) => (
                          <li key={i} className="text-sm pl-1 leading-snug text-black marker:text-black">
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )
              });
            });
          }
          break;
        case 'experience':
          if (data.experience.length > 0) {
            b.push({
              id: 'experience-header',
              content: (
                <div className={`font-semibold ${headerSpacing} text-black font-bold uppercase border-b border-black text-sm pb-1 mb-1 mt-2`}>
                  Experience
                </div>
              )
            });
            data.experience.forEach(exp => {
              b.push({
                id: `exp-${exp.id}`,
                content: (
                  <div className="mb-1">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex-1">
                        <div className="font-bold text-black text-sm">
                          {exp.jobTitle || 'Job Title'} <span className="font-normal italic text-black">– {exp.company || 'Company'}</span>
                        </div>
                      </div>
                      <span className="text-sm whitespace-nowrap ml-4 text-black">
                        {renderDateRange(exp.startDate, exp.endDate)}
                      </span>
                    </div>
                    <ul className={`list-disc ml-4 ${textSpacing}`}>
                      {exp.bullets.filter(bb => bb.trim()).map((bullet, i) => (
                        <li key={i} className="text-sm pl-1 leading-snug text-black marker:text-black">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              });
            });
          }
          break;
        case 'projects':
          if (data.projects.length > 0) {
            b.push({
              id: 'projects-header',
              content: (
                <div className={`font-semibold ${headerSpacing} text-black font-bold uppercase border-b border-black text-sm pb-1 mb-1 mt-2`}>
                  Projects
                </div>
              )
            });
            data.projects.forEach(proj => {
              b.push({
                id: `proj-${proj.id}`,
                content: (
                  <div className="mb-1">
                    <div className="flex justify-between items-start mb-0.5">
                      <div className="font-bold text-black text-sm">
                        {proj.name || 'Project Name'}
                        {proj.url && (
                          <a href={proj.url.startsWith('http') ? proj.url : `https://${proj.url}`} target="_blank" rel="noopener noreferrer" className="ml-2 text-black underline font-normal">Link</a>
                        )}
                      </div>
                      <span className="text-sm whitespace-nowrap ml-4 text-black">
                        {renderDateRange(proj.startDate, proj.endDate)}
                      </span>
                    </div>
                    {proj.description && (
                      <p className="text-sm text-black italic">
                        {proj.description}
                      </p>
                    )}
                    <ul className={`list-disc ml-4 ${textSpacing}`}>
                      {proj.bullets.filter(bb => bb.trim()).map((bullet, i) => (
                        <li key={i} className="text-sm pl-1 leading-snug text-black marker:text-black">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              });
            });
          }
          break;
        case 'leadership':
          if (data.leadershipRoles.length > 0) {
            b.push({
              id: 'leadership-header',
              content: (
                <div className={`font-semibold ${headerSpacing} text-black font-bold uppercase border-b border-black text-sm pb-1 mb-1 mt-2`}>
                  Leadership
                </div>
              )
            });
            data.leadershipRoles.forEach(role => {
              b.push({
                id: `lead-${role.id}`,
                content: (
                  <div className="mb-1">
                    <div className="flex justify-between items-start mb-0.5">
                      <div className="flex-1">
                        <div className="font-bold text-black text-sm">
                          {role.title || 'Role Title'} <span className="font-normal italic text-black">– {role.organization || 'Organization'}</span>
                        </div>
                      </div>
                      <span className="text-sm whitespace-nowrap ml-4 text-black">
                        {renderDateRange(role.startDate, role.endDate)}
                      </span>
                    </div>
                    {role.description && (
                      <p className="text-sm leading-snug text-black">{role.description}</p>
                    )}
                    {role.bullets && role.bullets.length > 0 && (
                      <ul className={`list-disc ml-4 ${textSpacing} ${role.description ? 'mt-1' : ''}`}>
                        {role.bullets.filter(bb => bb.trim()).map((bullet, i) => (
                          <li key={i} className="text-sm pl-1 leading-snug text-black marker:text-black">
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )
              });
            });
          }
          break;
        case 'custom':
          if (data.customSections) {
            data.customSections.forEach(section => {
              if (section.items && section.items.length > 0) {
                b.push({
                  id: `custom-header-${section.id}`,
                  content: (
                    <div className={`font-semibold ${headerSpacing} text-black font-bold uppercase border-b border-black text-sm pb-1 mb-1 mt-2`}>
                      {section.title}
                    </div>
                  )
                });
                section.items.forEach((item, idx) => {
                  b.push({
                    id: `custom-item-${section.id}-${idx}`,
                    content: (
                      <div className="mb-1">
                        <div className="flex justify-between items-start mb-0.5">
                          <div className="font-medium text-black text-sm font-bold">{item.title}</div>
                          <span className="text-sm text-black">{item.date}</span>
                        </div>
                        <p className="text-sm leading-snug text-black">{item.description}</p>
                      </div>
                    )
                  });
                });
              }
            });
          }
          break;
      }
    });

    return b;
  }, [data]);

  // 2. Measure and Paginate
  useLayoutEffect(() => {
    if (!measureContainerRef.current) return;

    const container = measureContainerRef.current;
    const measuredBlocks = Array.from(container.children).map((child, index) => ({
      index,
      height: child.getBoundingClientRect().height
    }));

    const newPages: React.ReactNode[][] = [];
    let currentPage: React.ReactNode[] = [];
    let currentHeight = 0;

    measuredBlocks.forEach((blockItem) => {
      const blockContent = blocks[blockItem.index].content;

      // If adding this block exceeds max height, start new page
      // (unless it's the very first item, then force it)
      if (currentHeight + blockItem.height > MAX_PAGE_HEIGHT && currentPage.length > 0) {
        newPages.push(currentPage);
        currentPage = [blockContent];
        currentHeight = blockItem.height;
      } else {
        currentPage.push(blockContent);
        currentHeight += blockItem.height;
      }
    });

    if (currentPage.length > 0) {
      newPages.push(currentPage);
    }

    setPaginatedContent(newPages);
  }, [blocks]);

  return (
    <div className={`text-gray-900 ${isCompact ? 'text-[0.9rem]' : ''} font-serif leading-snug w-full`}>

      {/* Hidden container for measurement - Must match A4 styling exactly for accurate height */}
      <div
        ref={measureContainerRef}
        className="fixed top-0 left-0 invisible pointer-events-none w-[210mm] px-[10mm] z-[-9999]"
        style={{
          // We strip margins here, we only care about content flow
          // But we must apply the same font sizing contexts
        }}
        aria-hidden="true"
      >
        {blocks.map((block) => (
          <div key={block.id}>{block.content}</div>
        ))}
      </div>

      {/* Visible Pages */}
      {paginatedContent.length === 0 ? (
        // Initial render fallback (while measuring) - Render everything in one page to prevent flicker or empty
        <div className="a4-page">
          {blocks.map((block) => (
            <div key={block.id}>{block.content}</div>
          ))}
        </div>
      ) : (
        paginatedContent.map((pageContent, i) => (
          <div key={i} className="a4-page mb-8 relative last:mb-0">
            {pageContent.map((content, idx) => (
              <div key={idx}>{content}</div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};
