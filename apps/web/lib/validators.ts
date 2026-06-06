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
  userId: z.string().optional(),
  checkIn: z.coerce.date(),
  checkOut: z.coerce.date(),
  guests: z.coerce.number().int().positive(),
  method: z.enum(["CASH", "STRIPE"]).default("CASH")
});

export const messageSchema = z.object({
  conversationId: z.string().optional(),
  recipientId: z.string().optional(),
  senderId: z.string().optional(),
  travelerId: z.string().optional(),
  hostId: z.string().optional(),
  listingId: z.string().optional(),
  body: z.string().min(1)
});

export const listingDraftSchema = z.object({
  userId: z.string(),
  currentStep: z.coerce.number().int().min(1).max(8).default(1),
  status: z.enum(["DRAFT", "READY", "PUBLISHED"]).default("DRAFT"),
  payload: z.record(z.unknown()).default({}),
  preview: z.record(z.unknown()).optional(),
  missingFields: z.array(z.string()).default([])
});

export const pricingSuggestionSchema = z.object({
  city: z.string().min(2),
  season: z.enum(["low", "mid", "high"]).default("mid"),
  guests: z.coerce.number().int().positive(),
  category: z.string().min(2)
});

export const calendarBlockSchema = z.object({
  listingId: z.string(),
  date: z.coerce.date(),
  isBlocked: z.boolean().default(false),
  price: z.coerce.number().positive().optional()
});

export const favoriteCollectionSchema = z.object({
  userId: z.string(),
  name: z.string().min(2),
  isShared: z.boolean().default(false),
  notes: z.string().optional()
});

export const verificationSchema = z.object({
  userId: z.string().optional(),
  documents: z
    .array(
      z.object({
        type: z.enum(["ID_CARD", "PASSPORT", "SELFIE", "PHONE", "EMAIL"]),
        url: z.string().url()
      })
    )
    .default([])
});
