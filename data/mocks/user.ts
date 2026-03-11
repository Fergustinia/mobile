export type User = {
  id: string;
  name: string;
  email: string;
  skills: string[]; 
};

export const users: User[] = [
  {
    id: "u1",
    name: "Иван Иванов",
    email: "ivanov@example.com",
    skills: ["React", "JavaScript", "TypeScript"],
  },
  {
    id: "u2",
    name: "Мария Петрова",
    email: "petrova@example.com",
    skills: ["Python", "Django", "REST API"],
  },
  {
    id: "u3",
    name: "Петр Смирнов",
    email: "smirnov@example.com",
    skills: ["UX/UI дизайн", "Sketch", "Figma"],
  },
];