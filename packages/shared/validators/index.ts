import { z } from 'zod';

const DateLikeSchema = z.union([z.string(), z.date()]);

export const AccountSchema = z.object({
  name: z.string().min(1),
  nameAmh: z.string().optional(),
  type: z.string(),
  balance: z.number().optional(),
  color: z.string().optional(),
  number: z.string().optional(),
});

export const AccountResponseSchema = AccountSchema.extend({
  id: z.string(),
  userId: z.string(),
  nameAmh: z.string().nullable().optional(),
  balance: z.number(),
  color: z.string().nullable().optional(),
  number: z.string().nullable().optional(),
  createdAt: DateLikeSchema,
  updatedAt: DateLikeSchema,
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

export const TransactionResponseSchema = TransactionSchema.extend({
  id: z.string(),
  userId: z.string(),
  titleAmh: z.string().nullable().optional(),
  accountId: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  date: DateLikeSchema,
});

export const GoalSchema = z.object({
  name: z.string().min(1),
  emoji: z.string().optional(),
  target: z.number().min(0),
  saved: z.number().optional(),
  deadline: z.string().or(z.date()).optional(),
});

// Used across Mobile and Web to enforce consistent validation
