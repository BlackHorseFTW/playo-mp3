// src/server/db/schema.ts
import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const songs = pgTable("songs", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  artist: varchar("artist", { length: 255 }),
  album: varchar("album", { length: 255 }),
  genre: varchar("genre", { length: 100 }),
  duration: text("duration"),
  cloudinaryUrl: text("cloudinary_url").notNull(),
  cloudinaryPublicId: text("cloudinary_public_id").notNull(),
  coverArtUrl: text("cover_art_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Song = typeof songs.$inferSelect;
export type NewSong = typeof songs.$inferInsert;

export const playlists = pgTable("playlists", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  coverArtUrl: text("cover_art_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const playlistSongs = pgTable("playlist_songs", {
  id: serial("id").primaryKey(),
  playlistId: serial("playlist_id").references(() => playlists.id, { onDelete: "cascade" }),
  songId: serial("song_id").references(() => songs.id, { onDelete: "cascade" }),
  position: serial("position"),
  createdAt: timestamp("created_at").defaultNow(),
});