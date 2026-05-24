import { z } from "zod";

// Armor schema
export const ArmorSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[a-zA-Z0-9_-]+$/),
  description: z.string().max(120),
});

// Armor type
export type Armor = z.infer<typeof ArmorSchema>;
