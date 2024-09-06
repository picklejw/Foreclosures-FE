type ArrayPath = string[]

interface ForeclosureDataPathMap {
  [key: string]: ArrayPath;
}

export const forelosureAPIMap: ForeclosureDataPathMap = {
  "Address": ["address"],
  "Sale Date" : ["saleDate"],
  "Other Notes": ["detailedNotes", "otherNotes"],
  "Other Debts": ["detailedNotes", "otherDebts"],
  "Debt": ["debt"],
  "Max Bid": ["maxBid"],
  "Zillow Value": ["zillowValue"],
  "Canceled?": ["isCanceled"],
  "Advertised?": ["isAdvertised"],
  "Favorite": ["isFav"]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getValueFromArrayPath = (obj: { [key: string]: any }, arrPath: ArrayPath): string | number => {
  let finalVal = obj
  arrPath.forEach((ap) => {
    finalVal = finalVal[ap] || ""
  })
  if (typeof finalVal === "string" || typeof finalVal === 'number' || typeof finalVal === 'boolean') {
    return finalVal || ""
  }
  return ""
}