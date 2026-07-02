import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn utility', () => {
  it('correctly blends standard tailwind classes together', () => {
    const result = cn('px-2 py-4', 'bg-red-500');
    expect(result).toContain('px-2');
    expect(result).toContain('py-4');
    expect(result).toContain('bg-red-500');
  });

  it('correctly resolves background and padding style overrides/collisions', () => {
    const result = cn('p-4 p-8', 'bg-red-500 bg-blue-600');
    expect(result).not.toContain('p-4');
    expect(result).toContain('p-8');
    expect(result).not.toContain('bg-red-500');
    expect(result).toContain('bg-blue-600');
  });

  it('filters empty or conditional values gracefully', () => {
    const isError = false;
    const result = cn('text-sm', isError && 'text-red-500', null, undefined);
    expect(result).toBe('text-sm');
  });
});
