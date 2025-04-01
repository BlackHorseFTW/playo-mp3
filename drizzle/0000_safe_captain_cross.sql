CREATE TABLE "playlist_songs" (
	"id" serial PRIMARY KEY NOT NULL,
	"playlist_id" serial NOT NULL,
	"song_id" serial NOT NULL,
	"position" serial NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "playlists" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"cover_art_url" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "songs" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"artist" varchar(255),
	"album" varchar(255),
	"genre" varchar(100),
	"duration" integer,
	"release_year" integer,
	"storage_url" text NOT NULL,
	"storage_path" text NOT NULL,
	"cover_art_url" text,
	"source_api" varchar(100),
	"source_id" varchar(100),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "playlist_songs" ADD CONSTRAINT "playlist_songs_playlist_id_playlists_id_fk" FOREIGN KEY ("playlist_id") REFERENCES "public"."playlists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playlist_songs" ADD CONSTRAINT "playlist_songs_song_id_songs_id_fk" FOREIGN KEY ("song_id") REFERENCES "public"."songs"("id") ON DELETE cascade ON UPDATE no action;