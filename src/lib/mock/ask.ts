// Dates relative to "today"
const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();

export const mockQuestions = [
  {
    id: "q-1",
    title: "How to prepare for placement season starting in 3rd year?",
    body: "I'm currently in my 4th semester (CSE) and I feel like I haven't done enough DSA. Should I focus on Web Dev or strictly competitive programming to crack companies visiting USICT?",
    tags: ["Placements", "DSA", "WebDev"],
    anonymous: true,
    helpfulCount: 45,
    createdAt: daysAgo(2),
    author: null,
    answers: [
      {
        id: "a-1",
        body: "Start with standard DSA and practice Leetcode daily. Core subjects (OS, DBMS, CN) are also vital since companies like TCS and Amazon test them heavily in the first round.",
        createdAt: daysAgo(1),
        author: {
          fullName: "Aman Gupta",
          seniorScore: 420,
          branch: "IT",
          avatarUrl: null,
          role: "SENIOR"
        }
      },
      {
        id: "a-2",
        body: "Don't ignore dev entirely! Having 2 good MERN stack projects on your resume is what actually gets you shortlisted after you clear the OA (Online Assessment).",
        createdAt: daysAgo(0.5),
        author: {
          fullName: "Sneha Sharma",
          seniorScore: 310,
          branch: "CSE",
          avatarUrl: null,
          role: "SENIOR"
        }
      }
    ],
    _count: { answers: 2 }
  },
  {
    id: "q-2",
    title: "Which electives to choose in 5th Semester for AI/ML?",
    body: "Between Advanced DBMS, Computer Graphics, and Data Mining, which one is best if I want to pursue Machine Learning in the future? Do the professors for these subjects grade fairly?",
    tags: ["Academics", "Electives", "AI"],
    anonymous: false,
    helpfulCount: 23,
    createdAt: daysAgo(5),
    author: {
      fullName: "Rahul Verma",
      branch: "CSE",
      avatarUrl: null
    },
    answers: [
      {
        id: "a-3",
        body: "Data Mining is the obvious choice for ML. Prof. Rama Kishore usually takes it and his assignments are very practical. Graphics is completely math-heavy and unrelated to modern ML.",
        createdAt: daysAgo(4),
        author: {
          fullName: "Vikram Singh",
          seniorScore: 185,
          branch: "CSEAI",
          avatarUrl: null,
          role: "SENIOR"
        }
      }
    ],
    _count: { answers: 1 }
  },

  {
    id: "q-4",
    title: "Is it worth joining the USICT Robotics club if I'm from IT?",
    body: "I'm in IT but I've always loved IoT and microcontrollers. Will I be allowed to join the robotics club, or is it exclusively for ECE students?",
    tags: ["Clubs", "IoT", "ECE"],
    anonymous: false,
    helpfulCount: 12,
    createdAt: daysAgo(10),
    author: {
      fullName: "Priya Das",
      branch: "IT",
      avatarUrl: null
    },
    answers: [],
    _count: { answers: 0 }
  }
];
