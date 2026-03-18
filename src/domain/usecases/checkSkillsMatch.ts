import type { Resume } from "../../data/mocks/resumesdata"

export type SkillsMatchResult = {
  isMatch: boolean
}

export const checkSkillsMatch = (resume: Resume): SkillsMatchResult => {
  // Simple domain rule: only recommended resumes are considered a match.
  // This can be extended later to use real skills and vacancy requirements.
  if (!resume.isRecommended) {
    return { isMatch: false }
  }

  return { isMatch: true }
}

