/**
 * Facts about Bill's book "Sales Team of One", shared by the /book page and the
 * launch email so the two can't drift.
 *
 * Source: the Amazon product page, read 2026-11-27. Price and reviews are left
 * out on purpose — Amazon sets the price, and the book had no reviews yet.
 */
export const BOOK = {
  title: "Sales Team of One",
  subtitle: "How to Stay Irreplaceable When AI Comes for the Sales Team",
  tagline:
    "The story of a founder who has to become his company's entire revenue engine, and the method underneath it: expertise, fed by curiosity, that compounds into an audience, a pipeline and a moat.",
  asin: "B0HMFQ2C9G",
  /** Clean product URL. No Associates tag: add a disclosure if one is added. */
  amazonUrl: "https://www.amazon.com/dp/B0HMFQ2C9G",
  isbn13: "9798982139603",
  publisher: "Bill Rice Strategy Group",
  datePublished: "2026-10-20",
  datePublishedLabel: "October 2026",
  printLength: 130,
  coverPath: "/images/book/sales-team-of-one-cover.jpg",
  coverAlt: "Cover of Sales Team of One by Bill Rice",
} as const;
