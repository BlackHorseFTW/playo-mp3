ALTER TABLE "songs" ALTER COLUMN "duration" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "songs" ADD COLUMN "cloudinary_url" text NOT NULL;--> statement-breakpoint
ALTER TABLE "songs" ADD COLUMN "cloudinary_public_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "songs" DROP COLUMN "release_year";--> statement-breakpoint
ALTER TABLE "songs" DROP COLUMN "storage_url";--> statement-breakpoint
ALTER TABLE "songs" DROP COLUMN "storage_path";--> statement-breakpoint
ALTER TABLE "songs" DROP COLUMN "source_api";--> statement-breakpoint
ALTER TABLE "songs" DROP COLUMN "source_id";