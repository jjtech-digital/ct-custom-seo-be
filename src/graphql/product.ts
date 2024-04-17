export const getProducts = (): string => {
  return`query{
    products{
      total
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
            
          }
        }
        
      }
      
    }
  }`;
};
