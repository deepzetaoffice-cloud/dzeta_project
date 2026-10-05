// The FAQPage generator (P4 S5). Q&A mirrors the visible FAQ exactly (08 §3 rule 7, visible
// parity) — the assembler passes the same strings the page renders, from the content file.
// Pure: plain data in, plain object out.
import type { SchemaNode } from '@/lib/schema/types.ts';

export type FaqQuestion = {
  /** The visible question, byte for byte */
  name: string;
  /** The visible answer, byte for byte */
  answerText: string;
};

export type FaqPageInput = {
  /** {page URL}#faq */
  id: string;
  questions: readonly FaqQuestion[];
};

export function faqPageNode({ id, questions }: FaqPageInput): SchemaNode {
  return {
    '@type': 'FAQPage',
    '@id': id,
    mainEntity: questions.map((question) => ({
      '@type': 'Question',
      name: question.name,
      acceptedAnswer: { '@type': 'Answer', text: question.answerText },
    })),
  };
}
