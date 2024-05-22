export const getProducts = (): string => {
  return `query ($limit: Int, $offset: Int, $Locale: Locale, $LocaleProjection: [Locale!]) {
    products(limit: $limit, offset: $offset, localeProjection: $LocaleProjection) {
      total
      offset
      results {
        id
        key
        version
        masterData {
          current {
            name(locale: $Locale)
            nameAllLocales {
              locale
              value
            }
            categories {
              name(locale: $Locale)
              slug(locale: $Locale)
            }
            metaTitle(locale: $Locale)
            metaDescription(locale: $Locale)
            metaTitleAllLocales {
              locale
              value
            }
            metaDescriptionAllLocales {
              locale
              value
            }
          }
        }
      }
    }
  }
  `;
};
