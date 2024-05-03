export const getProductDetails = (): string => {
  return `
  query ($id: String) {
    product(id: $id) {
      masterData {
        current {
          masterVariant {
            id
          }
          name(locale: "en")
          categories {
            name(locale: "en")
            slug(locale: "en")
          }
        }
      }
      skus
    }
  }
    `;
};
