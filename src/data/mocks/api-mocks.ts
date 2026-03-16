export const apiMocks = {
  resumes: [
    {
      id: "1",
      name: "Резюме без опыта (не соответствует)",
      isRecommended: false,
      skills: ["HTML", "CSS"],
      experience: 0,
    },
    {
      id: "2",
      name: "Резюме Middle React Native",
      isRecommended: true,
      skills: ["React", "React Native", "TypeScript", "Redux"],
      experience: 3,
    },
    {
      id: "3",
      name: "Резюме Frontend 2025",
      isRecommended: true,
      skills: ["React", "Vue", "JavaScript", "Node.js"],
      experience: 2,
    },
  ],

  vacancy: {
    id: "vacancy_123",
    title: "React Native Developer",
    company: "TechCorp",
    salary: "от 150 000 ₽",
    location: "Москва • Гибрид",
    logo: "https://img.icons8.com/color/96/000000/briefcase.png",
    description: "Мы ищем опытного React Native разработчика для создания мобильных приложений.",
    requirements: [
      "Опыт коммерческой разработки от 2 лет",
      "Уверенное знание React / React Native",
      "Понимание принципов работы мобильных ОС",
      "Опыт работы с TypeScript",
    ],
    benefits: [
      "Конкурентная зарплата",
      "ДМС со стоматологией",
      "Гибкий график",
      "Обучение за счёт компании",
    ],
  },

  apiResponses: {
    fetchResumes: {
      delay: 500,
      success: true,
    },
    submitApplication: {
      delay: 800,
      success: true,
      message: "Отклик успешно отправлен",
    },
  },
} as const;