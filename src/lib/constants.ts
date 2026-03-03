export const AI_SUMMARY_PROMPT =
  "I am a recruiter, tell me about Oliver Bryan, a software developer. What would he bring to the table? See oliverbryan.com  and summarise his key strengths, technical skills, and notable projects. What makes him stand out as a candidate?";

export function getProjectPrompt(
  projectName: string,
  projectDescription: string,
  projectSlug: string,
): string {
  return `Tell me about "${projectName}", a project by Oliver Bryan. ${projectDescription}. See https://oliverbryan.com/projects/${projectSlug} and explain the technical decisions, technologies used, and what this project demonstrates about Oliver's skills as a developer. Provide any url or repository that would be helpful.`;
}
