import { isValidElement } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ShellReviewPage from '@/app/(review)/shell-review/page';

// The review page (registry R165; P2 plan, A3) is for previews, e2e and lhci only: a production build
// must answer 404 (P3 plan, A fix 4). e2e runs on a non-production build, so only a unit test can see
// the production branch. The page is called as a function: its own check runs before anything renders.

const state = vi.hoisted(() => ({ vercelEnv: undefined as string | undefined }));

vi.mock('@/lib/env', () => ({ env: () => ({ vercelEnv: state.vercelEnv }) }));
vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND');
  },
}));

afterEach(() => {
  state.vercelEnv = undefined;
});

describe('the review page', () => {
  it('calls notFound() on a production deployment', () => {
    state.vercelEnv = 'production';
    expect(() => ShellReviewPage()).toThrow('NEXT_NOT_FOUND');
  });

  it('renders on previews, in CI and on the owner’s machine', () => {
    for (const vercelEnv of ['preview', 'development', undefined]) {
      state.vercelEnv = vercelEnv;
      expect(isValidElement(ShellReviewPage()), String(vercelEnv)).toBe(true);
    }
  });
});
