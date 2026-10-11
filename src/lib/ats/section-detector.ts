export interface ParsedContactInfo {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
}

export interface DetectedSections {
  contact: ParsedContactInfo;
  summary: string;
  skills: string[];
  experience: string[];
  education: string[];
  projects: string[];
  certifications: string[];
}

const SECTION_HEADERS = {
  summary: /(?:professional\s+)?summary|objective|about\s+me|profile/i,
  experience: /(?:work\s+)?experience|employment|work\s+history|professional\s+experience/i,
  education: /education|academic\s+background|degrees/i,
  skills: /(?:technical\s+)?skills|competencies|technologies|tools/i,
  projects: /projects|portfolio|selected\s+work/i,
  certifications: /certifications|credentials|licenses/i,
};

export function detectResumeSections(rawText: string): DetectedSections {
  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const contact: ParsedContactInfo = {};

  // Email regex
  const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) contact.email = emailMatch[0];

  // Phone regex
  const phoneMatch = rawText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) contact.phone = phoneMatch[0];

  // Links
  const linkedinMatch = rawText.match(/linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  if (linkedinMatch) contact.linkedin = linkedinMatch[0];

  const githubMatch = rawText.match(/github\.com\/[a-zA-Z0-9_-]+/i);
  if (githubMatch) contact.github = githubMatch[0];

  // Guess name from first line if it looks like a person's name
  if (lines.length > 0 && lines[0].length < 40 && !lines[0].includes("@")) {
    contact.name = lines[0];
  }

  // Section splitting
  const sections: DetectedSections = {
    contact,
    summary: "",
    skills: [],
    experience: [],
    education: [],
    projects: [],
    certifications: [],
  };

  let currentSection: keyof Omit<DetectedSections, "contact"> | null = null;
  const buffer: Record<string, string[]> = {
    summary: [],
    skills: [],
    experience: [],
    education: [],
    projects: [],
    certifications: [],
  };

  for (const line of lines) {
    let matchedHeader = false;

    for (const [key, regex] of Object.entries(SECTION_HEADERS)) {
      if (regex.test(line) && line.length < 35) {
        currentSection = key as keyof Omit<DetectedSections, "contact">;
        matchedHeader = true;
        break;
      }
    }

    if (!matchedHeader && currentSection) {
      buffer[currentSection].push(line);
    }
  }

  sections.summary = buffer.summary.join(" ");
  sections.skills = buffer.skills
    .flatMap((l) => l.split(/[,•|·/]/))
    .map((s) => s.trim())
    .filter((s) => s.length > 1 && s.length < 35);
  sections.experience = buffer.experience;
  sections.education = buffer.education;
  sections.projects = buffer.projects;
  sections.certifications = buffer.certifications;

  return sections;
}
