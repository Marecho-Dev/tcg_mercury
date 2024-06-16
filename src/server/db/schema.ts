import { sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
  doublePrecision,
  integer,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `tcg_mercury_${name}`);

export const images = createTable(
  "image",
  {
    id: serial("id").primaryKey(),
    cardId: integer("cardId"),
    name: varchar("name", { length: 256 }),
    url: varchar("url", { length: 256 }).notNull(),
    userId: varchar("userId", { length: 256 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }),
  },
  (picture) => ({
    cardIdIndex: index("cardId_idx").on(picture.cardId),
  }),
);

export const cards = createTable(
  "card",
  {
    id: serial("id").primaryKey(),
    picture1Url: varchar("picture1Url", { length: 256 }),
    picture2Url: varchar("picture2Url", { length: 256 }),
    name: varchar("name", { length: 256 }),
    rarity: varchar("rarity", { length: 256 }),
    condition: varchar("condition", { length: 256 }),
    set: varchar("set", { length: 256 }),
    edition: varchar("edition", { length: 256 }),
    ebayPrice: doublePrecision("ebayPrice"),
    tcgPlayerPrice: doublePrecision("tcgPlayerPrice"),
    userId: varchar("userId", { length: 256 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }),
  },
  (card) => ({
    nameIndex: index("name_idx").on(card.name),
  }),
);
