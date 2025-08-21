import { z } from "zod";

const contactFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  name: z.string().min(1, { message: "Name is required." }),
  message: z
    .string()
    .min(1, { message: "Message is required." })
    .max(500, { message: "Message cannot exceed 500 characters." }),
});

export default contactFormSchema;
