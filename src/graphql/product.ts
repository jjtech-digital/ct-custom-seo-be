export const getProducts = (): string => {
  return `query($limit: Int, $offset: Int){
    products(limit: $limit, offset: $offset){
      total
      offset
      results{
        id
        key
        version
        masterData{
          current{
            name(locale:"en")
            nameAllLocales{
              locale
              value
            }
            description(locale: "en")
            categories {
              name(locale: "en")
              slug(locale: "en")
            }
            metaTitle
            metaDescription
          }
        }
        
      }
      
    }
  }`;
};
