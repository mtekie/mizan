import { z } from 'zod';

export const AccountSchema = z.object({
  name: z.string().min(1),
  nameAmh: z.string().optional(),
  type: z.string(),
  balance: z.number().optional(),
  color: z.string().optional(),
  number: z.string().optional(),
});

export const TransactionSchema = z.object({
  title: z.string().min(1),
  titleAmh: z.string().optional(),
  amount: z.number(),
  source: z.string(),
  category: z.string().optional(),
  accountId: z.string().optional(),
  date: z.string().or(z.date()).optional(),
});

export const GoalSchema = z.object({
  name: z.string().min(1),
  emoji: z.string().optional(),
  target: z.number().min(0),
  saved: z.number().optional(),
  deadline: z.string().or(z.date()).optional(),
});

// Used across Mobile and Web to enforce consistent validation
