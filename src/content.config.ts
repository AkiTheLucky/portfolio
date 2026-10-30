import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro:schema';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

const experience = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/experience' }),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    timeframe: z.string(),
    location: z.string(),
    summary: z.string(),
    order: z.number(),
    achievements: z.array(z.object({
      title: z.string(),
      detail: z.string(),
      metric: z.string().optional(),
    })),
  }),
});

const education = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/education' }),
  schema: z.object({
    institution: z.string(),
    credential: z.string(),
    credentialLink: z.object({
      text: z.string(),
      href: z.string().url(),
    }).optional(),
    timeframe: z.string(),
    order: z.number(),
    details: z.array(z.string()).default([]),
  }),
});

const fermi = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/fermi' }),
  schema: z.object({
    question: z.string(),
    answer: z.number().positive(),
    unit: z.string(),
    assumptions: z.array(z.string()),
  }),
});

export const collections = { blog, experience, education, fermi };
