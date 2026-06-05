import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["TRAVELER", "HOST"]).default("TRAVELER")
});

export const listingSchema = z.object({
  title: z.string().min(4),
  description: z.string().min(20),
  address: z.string().min(4),
  city: z.string().min(2),
  country: z.string().min(2),
  pricePerNight: z.coerce.number().positive(),
  type: z.enum(["BEACH_HOUSE", "CABIN", "VILLA", "APARTMENT", "ROOM", "CHALET"]),
  guests: z.coerce.number().int().positive(),
  bedrooms: z.coerce.number().int().nonnegative(),
  beds: z.coerce.number().int().positive(),
  bathrooms: z.coerce.number().int().positive()
});

export const bookingSchema = z.object({
  listingId: z.string(),
  userId: z.string(),
  checkIn: z.coerce.date(),
  checkOut: z.coerce.date(),
  guests: z.coerce.number().int().positive(),
  method: z.enum(["CASH", "STRIPE"]).default("CASH")
});

export const messageSchema = z.object({
  conversationId: z.string().optional(),
  senderId: z.string(),
  travelerId: z.string(),
  hostId: z.string(),
  listingId: z.string().optional(),
  body: z.string().min(1)
});
