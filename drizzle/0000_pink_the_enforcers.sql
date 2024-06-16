CREATE TABLE IF NOT EXISTS "tcg_mercury_card" (
	"id" serial PRIMARY KEY NOT NULL,
	"picture1Url" varchar(256),
	"picture2Url" varchar(256),
	"name" varchar(256),
	"rarity" varchar(256),
	"condition" varchar(256),
	"set" varchar(256),
	"edition" varchar(256),
	"ebayPrice" double precision,
	"tcgPlayerPrice" double precision,
	"userId" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tcg_mercury_image" (
	"id" serial PRIMARY KEY NOT NULL,
	"cardId" integer,
	"url" varchar(256) NOT NULL,
	"userId" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "tcg_mercury_card" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cardId_idx" ON "tcg_mercury_image" ("cardId");