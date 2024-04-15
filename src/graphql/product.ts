export const getProducts = (): string => {
  return `
  query($limit: Int, $offset: Int, $sort: [String!]){
 products(limit: $limit, offset: $offset, sort: $sort){
  offset
  count
  total
  exists
  results{
    id
    key
    version
    masterData{
      current{
        masterVariant{
          id
          attributesRaw{
            name
            value
          }
          prices{
            id
            value {
              type
              currencyCode
              centAmount
              fractionDigits
            }
            key
            country
            channel{
              id
              version
              key
              roles
              name(locale: "en")
              description(locale: "en")
            }
            validFrom
            validUntil
            discounted{
              value{
                type
                currencyCode
                centAmount
                fractionDigits
              }
              discount{
                predicate
                validFrom
                validUntil
                isActive
                isValid
                sortOrder
                key
                name(locale: "en")
                description(locale: "en")
                value{
                  type
                }
                id
                version
              }
            }
            tiers{
              minimumQuantity
              value {
                type
                currencyCode
                centAmount
                fractionDigits
              }
            }
            custom{
              type{
                key
                name(locale: "en")
                description(locale: "en")
                resourceTypeIds
                fieldDefinitions{
                  name
                  required
                  inputHint
                  label
                  type{
                    name
                  }
                }
                id
                version
              }
              customFieldsRaw{
                name
                value
              }
            }
          }
        }
        name(locale: "en")
        description(locale: "en")
        nameAllLocales{
          locale
          value
        }
        slug(locale: "en")
        slugAllLocales{
          locale
          value
        }
        categoryOrderHints{
          orderHint
          categoryId
        }
        categories{
          id
          key
          version
          name(locale: "en")
          description(locale: "en")
          slug(locale: "en")
          ancestors{
            id
            key
            version
            name(locale: "en")
            description(locale: "en")
            slug(locale: "en")
            orderHint
            metaDescription(locale: "en")
            metaKeywords(locale: "en")
            metaTitle(locale: "en")
          }
          orderHint
          externalId
          metaTitle(locale: "en")
          metaKeywords(locale: "en")
          metaDescription(locale: "en")
          stagedProductCount
          childCount
          createdAt
          lastModifiedAt
          assets{
            id
            key
            sources{
              uri
              key
              dimensions{
                width
                height
              }
              contentType
            }
            name(locale: "en")
            description(locale: "en")
            tags
            custom{
              type{
                key
                name(locale: "en")
                description(locale: "en")
                resourceTypeIds
                fieldDefinitions{
                  name
                  required
                  inputHint
                  label
                  type{
                    name
                  }
                }
                id
                version
                createdAt
                lastModifiedAt
              }
              customFieldsRaw{
                name
                value
              }
            }
          }
        }
        searchKeyword(locale: "en"){
          suggestTokenizer{
            type
          }
          text
        }
        searchKeywords {
          locale
          searchKeywords{
            text
            suggestTokenizer{
              type
            }
          }
        }
      }
      hasStagedChanges
      published
    }
    skus
    createdAt
    lastModifiedAt
    priceMode
    taxCategory{
      name
      description
      rates{
        name
        amount
        includedInPrice
        country
        state
        id
        key
        subRates{
          name
          amount
        }
      }
      key
      id
      version
      createdAt
      lastModifiedAt
    }
    reviewRatingStatistics {
      averageRating
      highestRating
      lowestRating
      count
      ratingsDistribution
    }
  }
}
  }
    `;
};
