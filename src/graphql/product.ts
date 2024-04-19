export const getProducts = (): string => {
  return`query($limit: Int, $offset: Int){
    products(limit: $limit, offset: $offset){
      total
      offset
      results{
        id
        key
        masterData{
          current{
            name(locale:"en")
            nameAllLocales{
              locale
              value
            }
            description(locale: "en")
          }
        }
        
      }
      
    }
  }`;
};
