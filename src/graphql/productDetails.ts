export const getProductDetails = (): string => {
  return `
    query ($id: String) {
      product(id: $id) {
        productType {
          key
          name
          description
        }
        masterData {
          current {
            name(locale: "en")
            nameAllLocales {
              locale
              value
            }
            slug(locale: "en")
            searchKeyword(locale: "en") {
              text
            }
            searchKeywords {
              locale
            }
            metaTitle(locale: "en")
          }
        }
      }
    }
    `;
};
