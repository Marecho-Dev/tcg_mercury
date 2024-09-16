import { sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
  doublePrecision,
  integer,
  boolean,
  text,
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
    firstEdition: boolean("edition").default(false),
    ebayPrice: doublePrecision("ebayPrice"),
    tcgPlayerPrice: doublePrecision("tcgPlayerPrice"),
    userId: varchar("userId", { length: 256 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }),
    productId: integer("productId"),
    matchStatus: varchar("matchStatus", { length: 20 }),
  },
  (card) => ({
    nameIndex: index("name_idx").on(card.name),
    productIdIndex: index("productId_idx").on(card.productId),
  }),
);

export const products = createTable(
  "product",
  {
    id: serial("id").primaryKey(),
    groupId: integer("groupId").notNull(),
    name: varchar("name", { length: 256 }).notNull(),
    abbreviation: varchar("abbreviation", { length: 10 }),
    isSupplemental: boolean("isSupplemental").notNull().default(false),
    publishedOn: timestamp("publishedOn", { withTimezone: true }),
    modifiedOn: timestamp("modifiedOn", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    categoryId: integer("categoryId").notNull(),
  },
  (product) => ({
    nameIndex: index("product_name_idx").on(product.name),
    groupIdIndex: index("product_groupId_idx").on(product.groupId),
    publishedOnIndex: index("product_publishedOn_idx").on(product.publishedOn),
  }),
);

export const tcgPlayerCards = createTable(
  "tcgplayer_card",
  {
    id: serial("id").primaryKey(),
    productId: integer("productId").notNull(),
    name: varchar("name", { length: 256 }).notNull(),
    cleanName: varchar("cleanName", { length: 256 }).notNull(),
    imageUrl: varchar("imageUrl", { length: 256 }),
    categoryId: integer("categoryId").notNull(),
    groupId: integer("groupId").notNull(),
    url: varchar("url", { length: 256 }),
    modifiedOn: timestamp("modifiedOn", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    imageCount: integer("imageCount"),
    extDescription: text("extDescription"),
    extUPC: varchar("extUPC", { length: 50 }),
    extNumber: varchar("extNumber", { length: 50 }),
    extRarity: varchar("extRarity", { length: 50 }),
    extAttribute: varchar("extAttribute", { length: 20 }),
    extMonsterType: varchar("extMonsterType", { length: 50 }),
    extCardType: varchar("extCardType", { length: 50 }),
    extAttack: varchar("extAttack", { length: 10 }),
    extDefense: varchar("extDefense", { length: 10 }),
    extLinkRating: varchar("extLinkRating", { length: 10 }),
    extLinkArrows: varchar("extLinkArrows", { length: 50 }),
    createdAt: timestamp("createdAt", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }),
  },
  (tcgPlayerCard) => ({
    nameIndex: index("tcgplayer_card_name_idx").on(tcgPlayerCard.name),
    productIdIndex: index("tcgplayer_card_productId_idx").on(
      tcgPlayerCard.productId,
    ),
    groupIdIndex: index("tcgplayer_card_groupId_idx").on(tcgPlayerCard.groupId),
  }),
);

export const tcgPlayerPrices = createTable(
  "tcgplayer_price",
  {
    id: serial("id").primaryKey(),
    productId: integer("productId").notNull(),
    lowPrice: doublePrecision("lowPrice"),
    midPrice: doublePrecision("midPrice"),
    highPrice: doublePrecision("highPrice"),
    marketPrice: doublePrecision("marketPrice"),
    directLowPrice: doublePrecision("directLowPrice"),
    subTypeName: varchar("subTypeName", { length: 50 }).notNull(),
    createdAt: timestamp("createdAt", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (tcgPlayerPrice) => ({
    productIdSubTypeNameIndex: index(
      "tcgplayer_price_productId_subTypeName_idx",
    ).on(tcgPlayerPrice.productId, tcgPlayerPrice.subTypeName),
    productIdIndex: index("tcgplayer_price_productId_idx").on(
      tcgPlayerPrice.productId,
    ),
  }),
);
