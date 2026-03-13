'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Zap } from 'lucide-react';
import { PLANS } from '@/lib/constants';

const QUESTIONS = [
  {
    id: 'devices',
    question: 'How many devices are in your home?',
    options: [
      { label: '1-3 devices', value: 'few' },
      { label: '4-8 devices', value: 'moderate' },
      { label: '8+ devices', value: 'many' },
    ],
  },
  {
    id: 'usage',
    question: 'What do you primarily use the internet for?',
    options: [
      { label: 'Browsing & streaming', value: 'basic' },
      { label: 'Gaming & video calls', value: 'medium' },
      { label: 'Content creation & heavy uploads', value: 'heavy' },
    ],
  },
] as const;

type Answers = { devices?: string; usage?: string };

function getRecommendation(answers: Answers): string {
  const { devices, usage } = answers;
  if (devices === 'many' && usage === 'heavy') return 'gig-5';
  if (devices === 'many' || usage === 'heavy') return 'gig-2';
  if (devices === 'moderate' || usage === 'medium') return 'gig-1';
  return 'fast-500';
}

export function PlanRecommender() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [recommendedId, setRecommendedId] = useState<string | null>(null);

  const handleAnswer = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setRecommendedId(getRecommendation(newAnswers));
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setRecommendedId(null);
  };

  const recommendedPlan = recommendedId ? PLANS.find((p) => p.id === recommendedId) : null;

  if (recommendedPlan) {
    return (
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-fiber-success/10 px-4 py-1.5 mb-4">
          <Zap className="size-4 text-fiber-success" />
          <span className="text-sm font-semibold text-fiber-success">Our Recommendation</span>
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2">{recommendedPlan.name}</h3>
        <p className="text-3xl font-bold text-fiber-orange mb-2">
          ${recommendedPlan.price}<span className="text-base font-normal text-muted-foreground">/mo</span>
        </p>
        <p className="text-muted-foreground mb-6">{recommendedPlan.description}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={`/check-availability?plan=${recommendedPlan.id}`}
            className="inline-flex items-center justify-center h-12 px-8 rounded-lg bg-fiber-orange text-white font-semibold hover:bg-fiber-orange/90 transition-all glow-orange"
          >
            Get Started with {recommendedPlan.name}
          </Link>
          <button
            onClick={reset}
            className="inline-flex items-center justify-center h-12 px-8 rounded-lg border border-border text-foreground font-semibold hover:bg-accent transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = QUESTIONS[step];

  return (
    <div className="text-center">
      <p className="text-sm text-muted-foreground mb-2">
        Question {step + 1} of {QUESTIONS.length}
      </p>
      <h3 className="text-xl font-semibold text-foreground mb-6">{currentQuestion.question}</h3>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {currentQuestion.options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleAnswer(currentQuestion.id, option.value)}
            className="inline-flex items-center justify-center h-12 px-6 rounded-lg border border-border text-foreground font-medium hover:bg-accent hover:border-fiber-orange/50 transition-all"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
