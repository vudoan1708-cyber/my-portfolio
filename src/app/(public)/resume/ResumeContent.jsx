'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Printer,
  Mail,
  Globe,
  MapPin,
  Phone,
} from 'lucide-react';

function GithubMark({ className, ...rest }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...rest}
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function LinkedinMark({ className, ...rest }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...rest}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.063 2.063 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const SITE_ORIGIN =
  process.env.NODE_ENV === 'production' ? 'https://vudoan.vercel.app' : '';

function absUrl(path) {
  if (!path) return path;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_ORIGIN}${path.startsWith('/') ? '' : '/'}${path}`;
}

function formatRange(start, end, current) {
  const tail = current ? 'Present' : end || 'Present';
  return start ? `${start} — ${tail}` : tail;
}

function SectionLabel({ children }) {
  return (
    <p className="resume-section-label text-xs uppercase tracking-[0.3em] text-rose-300/70 mb-2 resume-accent">
      {children}
    </p>
  );
}

function ChipList({ items }) {
  if (!items || items.length === 0) return null;
  return (
    <p className="text-[13px] text-white/80 leading-snug">{items.join(', ')}</p>
  );
}

function RelatedProjects({ projects, label = 'Related work' }) {
  if (!projects || projects.length === 0) return null;
  return (
    <div className="resume-related flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[13px]">
      <span className="text-[10px] uppercase tracking-[0.2em] text-white/45">
        {label}
      </span>
      {projects.map((p, i) => (
        <span key={`${p.link}-${i}`} className="inline-flex items-center gap-3">
          <Link
            href={absUrl(p.link)}
            className="text-rose-300 hover:text-rose-200 resume-accent underline-offset-4 hover:underline transition-colors"
          >
            {p.title}
          </Link>
          {i < projects.length - 1 && (
            <span aria-hidden="true" className="text-white/20">
              ·
            </span>
          )}
        </span>
      ))}
    </div>
  );
}

function ContactItem({ icon: Icon, mark: Mark, href, external, children }) {
  const node = Mark ? (
    <Mark
      className="w-3.5 h-3.5 text-rose-300/70 resume-accent shrink-0"
      aria-hidden="true"
    />
  ) : (
    <Icon
      className="w-3.5 h-3.5 text-rose-300/70 resume-accent shrink-0"
      aria-hidden="true"
    />
  );

  return (
    <li className="flex items-center gap-2 break-words">
      {node}
      {href ? (
        <a
          href={href}
          {...(external
            ? { target: '_blank', rel: 'noopener noreferrer' }
            : {})}
          className="hover:text-rose-200 transition-colors break-all"
        >
          {children}
        </a>
      ) : (
        <span>{children}</span>
      )}
    </li>
  );
}

function ContactList({ profile }) {
  return (
    <section className="resume-contact-strip -mx-5 px-5 sm:-mx-7 sm:px-7 py-3 bg-rose-500/10 border-y border-rose-400/20">
      <SectionLabel>Contact</SectionLabel>
      <ul className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-2 text-[13px] text-white/80 leading-snug">
        {profile.location ? (
          <ContactItem icon={MapPin}>{profile.location}</ContactItem>
        ) : null}
        {profile.email ? (
          <ContactItem icon={Mail} href={`mailto:${profile.email}`}>
            {profile.email}
          </ContactItem>
        ) : null}
        {profile.phone ? (
          <ContactItem
            icon={Phone}
            href={`tel:${profile.phone.replace(/\s/g, '')}`}
          >
            {profile.phone}
          </ContactItem>
        ) : null}
        {profile.portfolio?.url ? (
          <ContactItem icon={Globe} href={profile.portfolio.url} external>
            {profile.portfolio.label || profile.portfolio.url}
          </ContactItem>
        ) : null}
        {profile.github?.url ? (
          <ContactItem mark={GithubMark} href={profile.github.url} external>
            {profile.github.label || profile.github.url}
          </ContactItem>
        ) : null}
        {profile.linkedin?.url ? (
          <ContactItem mark={LinkedinMark} href={profile.linkedin.url} external>
            {profile.linkedin.label || profile.linkedin.url}
          </ContactItem>
        ) : null}
      </ul>
    </section>
  );
}

function SummaryBlock({ summary }) {
  if (!summary) return null;
  return (
    <section>
      <SectionLabel>Summary</SectionLabel>
      <p className="text-[13px] text-white/80 leading-snug">{summary}</p>
    </section>
  );
}

function SkillsBlock({ skills }) {
  if (!skills || skills.length === 0) return null;
  return (
    <section>
      <SectionLabel>Skills</SectionLabel>
      <div className="space-y-2.5">
        {skills.map(({ group, items }) => (
          <div key={group}>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/45 mb-1">
              {group}
            </p>
            <ChipList items={items} />
          </div>
        ))}
      </div>
    </section>
  );
}

function LanguagesBlock({ languages }) {
  if (!languages || languages.length === 0) return null;
  return (
    <section>
      <SectionLabel>Languages</SectionLabel>
      <ChipList items={languages} />
    </section>
  );
}

function ExperienceEntry({ exp }) {
  return (
    <article className="resume-entry">
      <h3 className="text-[15px] font-semibold text-white tracking-tight flex flex-wrap items-baseline gap-x-2">
        <span>{exp.role}</span>
        <span className="text-white/40 font-normal">·</span>
        {exp.companyURL ? (
          <a
            href={exp.companyURL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-rose-300 hover:text-rose-200 resume-accent transition-colors"
          >
            {exp.company}
          </a>
        ) : (
          <span className="text-rose-300 resume-accent">{exp.company}</span>
        )}
      </h3>
      <p className="resume-meta text-xs text-white/50 mt-0.5">
        {[
          formatRange(exp.startDate, exp.endDate, exp.current),
          exp.location,
          exp.employmentType,
        ]
          .filter(Boolean)
          .join(' · ')}
      </p>
      {exp.summary && (
        <p className="text-[13px] text-white/70 mt-1.5 leading-snug">
          {exp.summary}
        </p>
      )}
      {exp.bullets && exp.bullets.length > 0 && (
        <ul className="mt-1.5 list-disc list-outside pl-5 space-y-1 text-[13px] text-white/85">
          {exp.bullets.map((b, i) => (
            <li key={i} className="leading-snug">
              {b}
            </li>
          ))}
        </ul>
      )}
      <RelatedProjects
        projects={exp.relatedProjects}
        label={exp.relatedProjectsLabel}
      />
    </article>
  );
}

function EducationEntry({ edu }) {
  return (
    <article className="resume-entry">
      <h3 className="text-[15px] font-semibold text-white tracking-tight">
        {edu.degree}
        <span className="text-white/40 font-normal"> · </span>
        <span className="text-rose-300 resume-accent">{edu.institution}</span>
      </h3>
      <p className="resume-meta text-xs text-white/50 mt-0.5">
        {formatRange(edu.startDate, edu.endDate)}
      </p>
      {edu.notes && (
        <p className="text-[13px] text-white/70 mt-1 leading-snug">
          {edu.notes}
        </p>
      )}
    </article>
  );
}

export default function ResumeContent({ data, hideHeader = false }) {
  const profile = data?.profile ?? {};
  const experiences = data?.experiences ?? [];
  const education = data?.education ?? [];
  const skills = data?.skills ?? [];
  const languages = data?.languages ?? [];

  const handlePrint = () => {
    // Give the saved PDF a descriptive, ATS-friendly filename instead of "Resume".
    const previousTitle = document.title;
    document.title = [profile.name, profile.role, 'Resume']
      .filter(Boolean)
      .join(' - ');
    const restore = () => {
      document.title = previousTitle;
      window.removeEventListener('afterprint', restore);
    };
    window.addEventListener('afterprint', restore);
    window.print();
  };

  return (
    <div className="resume-print-root max-w-3xl mx-auto px-4 sm:px-8 py-20">
      {hideHeader ? null : (
        <div className="print-hide flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-rose-300/70">CV</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-1">
              Resume
            </h1>
          </div>
          <div className="flex flex-col items-end gap-1">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-400 text-white font-medium transition"
            >
              <Printer className="w-4 h-4" aria-hidden="true" />
              Print / Save as PDF
            </button>
            <p className="text-[11px] text-white/40">
              Tip — uncheck “Headers and footers” in the print dialog for a clean PDF.
            </p>
          </div>
        </div>
      )}

      <motion.article
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="resume-card relative overflow-hidden rounded-2xl ring-1 ring-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.03] p-5 sm:p-7"
      >
        <header className="mb-3 pb-3 border-b border-white/10 flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            {profile.name}
          </h2>
          <p className="text-sm text-white/70">
            {profile.role}
            {profile.company?.name ? (
              <>
                <span className="text-white/40"> · </span>
                {profile.company.url ? (
                  <a
                    href={profile.company.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-rose-300 hover:text-rose-200 resume-accent transition-colors"
                  >
                    {profile.company.name}
                  </a>
                ) : (
                  <span className="text-rose-300 resume-accent">
                    {profile.company.name}
                  </span>
                )}
              </>
            ) : null}
          </p>
        </header>

        {/* DOM order = visual/print order = ATS reading order: contact,
            summary, skills, then experience and education. */}
        <div className="resume-grid flex flex-col gap-6">
          <aside className="resume-aside space-y-5 min-w-0">
            <ContactList profile={profile} />
            <SummaryBlock summary={profile.summary} />
            <SkillsBlock skills={skills} />
            <LanguagesBlock languages={languages} />
          </aside>

          <main className="resume-main space-y-3 min-w-0">
            <section>
              <SectionLabel>Professional Experience</SectionLabel>
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <ExperienceEntry key={exp.key} exp={exp} />
                ))}
              </div>
            </section>

            <section>
              <SectionLabel>Education</SectionLabel>
              <div className="space-y-3">
                {education.map((edu, idx) => (
                  <EducationEntry key={idx} edu={edu} />
                ))}
              </div>
            </section>
          </main>
        </div>
      </motion.article>
    </div>
  );
}
