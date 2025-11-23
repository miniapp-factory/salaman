"use client";

import { useState, useMemo } from "react";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

type Answer = {
  text: string;
  animal: string;
};

type Question = {
  question: string;
  options: Answer[];
};

const questions: Question[] = [
  {
    question: "What’s your favorite type of food?",
    options: [
      { text: "Fish", animal: "cat" },
      { text: "Meat", animal: "dog" },
      { text: "Berries", animal: "fox" },
      { text: "Seeds", animal: "hamster" },
      { text: "Grass", animal: "horse" },
    ],
  },
  {
    question: "How do you prefer to spend a weekend?",
    options: [
      { text: "Sleeping in a cozy spot", animal: "cat" },
      { text: "Playing fetch outside", animal: "dog" },
      { text: "Exploring the woods", animal: "fox" },
      { text: "Nibbling on treats", animal: "hamster" },
      { text: "Riding a long trail", animal: "horse" },
    ],
  },
  {
    question: "What’s your ideal vacation?",
    options: [
      { text: "A quiet beach", animal: "cat" },
      { text: "A dog park", animal: "dog" },
      { text: "A forest hike", animal: "fox" },
      { text: "A cozy cabin", animal: "hamster" },
      { text: "A countryside ride", animal: "horse" },
    ],
  },
  {
    question: "Which trait describes you best?",
    options: [
      { text: "Independent", animal: "cat" },
      { text: "Loyal", animal: "dog" },
      { text: "Curious", animal: "fox" },
      { text: "Playful", animal: "hamster" },
      { text: "Graceful", animal: "horse" },
    ],
  },
  {
    question: "What’s your favorite color?",
    options: [
      { text: "Black", animal: "cat" },
      { text: "Brown", animal: "dog" },
      { text: "Orange", animal: "fox" },
      { text: "Pink", animal: "hamster" },
      { text: "White", animal: "horse" },
    ],
  },
];

function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function Quiz() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  const shuffledQuestions = useMemo(
    () => questions.map((q) => ({ ...q, options: shuffleArray(q.options) })),
    []
  );

  const handleSelect = (animal: string) => {
    setAnswers((prev) => [...prev, animal]);
    if (current + 1 < shuffledQuestions.length) {
      setCurrent(current + 1);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrent(0);
    setAnswers([]);
    setShowResult(false);
  };

  const resultAnimal = answers.reduce((acc, curr) => {
    const count = acc[curr] ? acc[curr] + 1 : 1;
    return { ...acc, [curr]: count };
  }, {} as Record<string, number>);

  const winner = Object.entries(resultAnimal).reduce(
    (max, [animal, count]) => (count > max[1] ? [animal, count] : max),
    ["", 0]
  )[0];

  if (showResult) {
    return (
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-2xl font-semibold">You are a {winner}!</h2>
        <img
          src={`/${winner}.png`}
          alt={winner}
          width={512}
          height={512}
          className="rounded-md"
        />
        <Share text={`I am a ${winner}! ${url}`} />
        <button
          onClick={resetQuiz}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          Retake Quiz
        </button>
      </div>
    );
  }

  const { question, options } = shuffledQuestions[current];

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-xl font-medium">{question}</h2>
      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <button
            key={opt.text}
            onClick={() => handleSelect(opt.animal)}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md"
          >
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  );
}
