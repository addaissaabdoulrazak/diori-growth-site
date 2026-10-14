import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const approval = z.enum(["draft", "approved"]);

const services = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/services" }),
  schema: z.object({
    title: z.string(),
    shortTitle: z.string(),
    summary: z.string(),
    order: z.number().int(),
    approvalStatus: approval,
    category: z.enum(["training", "experts", "events", "green-it", "commercial", "digital"]),
    featured: z.boolean().default(false),
    audience: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
  }),
});

const trainings = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/trainings" }),
  schema: z.object({
    title: z.string(),
    objective: z.string(),
    audience: z.array(z.string()),
    prerequisites: z.string().optional(),
    duration: z.string().optional(),
    format: z.array(z.string()),
    assessment: z.string().optional(),
    trainer: z.string().optional(),
    reference: z.string().optional(),
    approvalStatus: approval,
  }),
});

const experts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/experts" }),
  schema: ({ image }) => z.object({
    name: z.string(),
    role: z.string(),
    biography: z.string(),
    expertise: z.array(z.string()),
    masterclass: z.object({
      poster: image(),
      title: z.string(),
      alt: z.string(),
      trainingId: z.string(),
    }).optional(),
    approvalStatus: approval,
  }),
});

export const collections = { services, trainings, experts };
