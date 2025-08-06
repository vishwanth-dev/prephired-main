import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'prepAI - Your AI Interview Coach | Transform Your Interview Skills',
  description:
    "Hi I'm prepAI, your Interview Coach. Your dream job is one prep away. Practice with AI-powered mock interviews, get skill assessments, and receive personalized career guidance.",
  keywords:
    'AI interview coach, mock interviews, interview preparation, career guidance, skill assessment',
  openGraph: {
    title: 'prepAI - Your AI Interview Coach',
    description:
      'Transform your interview skills with AI-powered preparation. Your journey to career success starts here.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'prepAI - Your AI Interview Coach',
    description: 'Transform your interview skills with AI-powered preparation.',
  },
};

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
