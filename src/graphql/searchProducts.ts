export const searchProducts = (): string => {
    return `
    query products($locale: Locale!, $limit: Int!, $offset: Int!, $text: String = "") {
        productProjectionSearch(locale: $locale, text: $text, limit: $limit, offset: $offset) {
          total
          results {
            productId: id
            name(locale: $locale)
            metaTitle(locale: $locale)
            metaDescription(locale: $locale)
          }
        }
      }
      `;
  };
  