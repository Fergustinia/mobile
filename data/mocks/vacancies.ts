export interface Vacancy {
    id: string;
    title: string;
    company: string;
    salary: string;
    location: string;
    format: string;
    description: string;
    requirements: string;
    conditions: string;
  }
  
  export const vacancies: Vacancy[] = [
    {
      id: "1",
      title: "Frontend разработчик (React)",
      company: "TechCorp",
      salary: "150 000 – 200 000 ₽",
      location: "Москва",
      format: "Гибрид",
  
      description:
        "Мы ищем Frontend разработчика для работы над современными веб-приложениями. Вы будете участвовать в разработке пользовательских интерфейсов, улучшении производительности приложения и внедрении новых функций. Работа в команде с backend-разработчиками, дизайнерами и аналитиками.",
  
      requirements:
        "• Опыт разработки на JavaScript/TypeScript от 1 года\n" +
        "• Опыт работы с React\n" +
        "• Знание HTML5, CSS3\n" +
        "• Опыт работы с REST API\n" +
        "• Понимание принципов адаптивной верстки\n" +
        "• Умение работать с Git",
  
      conditions:
        "• Официальное трудоустройство\n" +
        "• Гибкий график работы\n" +
        "• Возможность удаленной работы\n" +
        "• ДМС после испытательного срока\n" +
        "• Корпоративное обучение и развитие\n" +
        "• Работа в дружной команде",
    },
  ];