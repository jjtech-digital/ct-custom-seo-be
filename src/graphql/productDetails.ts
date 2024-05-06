export const getProductDetails = (): string => {
  return `
  query ($id: String) {
    product(id: $id) {
      masterData {
        current {
          masterVariant {
            id
          }
          name(locale: "en-GB")
          categories {
            name(locale: "en-GB")
            slug(locale: "en-GB")
          }
        }
      }
      skus
    }
  }
    `;
};
