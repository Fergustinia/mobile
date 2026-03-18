export const checkSkillsMatch = (
  resumeSkills: string[],
  vacancySkills: string[]
) => {
  const normalizedResume = resumeSkills.map(s => s.toLowerCase());
  const normalizedVacancy = vacancySkills.map(s => s.toLowerCase());

  const matched = vacancySkills.filter(skill =>
    resumeSkills.includes(skill)
  );

  const matchPercent =
    normalizedVacancy.length === 0
      ? 100
      : Math.round((matched.length / normalizedVacancy.length) * 100);

  return {
    isMatch: matchPercent >= 50,
    matchPercent,
  };
};