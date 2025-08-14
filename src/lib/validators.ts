import { z } from "zod";

export const createAppointmentSchema = z.object({
  clientId: z.string(),
  petId: z.string(),
  groomerId: z.string(),
  start: z.string(),
  end: z.string(),
  serviceId: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;

