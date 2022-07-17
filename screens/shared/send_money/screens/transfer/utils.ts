import * as z from 'zod';

export const base_schema = z.object({
  amount: z.string(),
  password: z.string(),
  narration: z.string(),
});
