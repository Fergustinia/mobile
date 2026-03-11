export type Resume = {
  id: string
  name: string
  isRecommended: boolean
}

export const resumes: Resume[] = [
  {
    id: "1",
    name: "Резюме без опыта (не соответствует)",
    isRecommended: false,
  },
  {
    id: "2",
    name: "Резюме Middle React Native",
    isRecommended: true,
  },
  {
    id: "3",
    name: "Резюме Frontend 2025",
    isRecommended: true,
  },
]

