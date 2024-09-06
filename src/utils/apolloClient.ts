import {
  ApolloClient,
  InMemoryCache,
  gql,
} from "@apollo/client";
import { type User, type ForeclosureListing, type ForeclosureModel } from './models'
import { type AnyValue } from './types'

import cloneDeep from 'lodash/cloneDeep';

type StringArrayOrNthStringArray = string[];

export const client = new ApolloClient({
  uri: "/query",
  cache: new InMemoryCache(),
  assumeImmutableResults: true
});

const createQueryStringAndValues = (kPath: StringArrayOrNthStringArray, value: AnyValue) => {
  const nValIsObjectType = typeof value != 'string' && typeof value != 'boolean' && typeof value != 'number'
  const pathForResultByKeyPath = [...kPath];

  // Handle query generation if newVal is not string
  if (nValIsObjectType) {
    // we know we are working with an object or []object
    if (Array.isArray(value)) {
      const objKeys: { [key: string]: string } = {};
      value.forEach((val) => {
        const nValObjKeys:string[] = Object.keys(val)
        nValObjKeys.forEach((nValObjKey) => {
          if (!objKeys[nValObjKey]) {
            objKeys[nValObjKey] = ""
          }
        })
      })
      pathForResultByKeyPath.push(`${Object.keys(objKeys)}`)
    } else {
      console.error("UpdateForeclosure cannot be handled, is not a array of objects")
    }
  }

  const returnResGQL = pathForResultByKeyPath.reduceRight(
    (accumulator, currentValue) => {
      if (Array.isArray(currentValue)) {
        accumulator = currentValue.join(",")
      } else {
        if (accumulator === "") {
          accumulator = `${currentValue}`
        } else {
          accumulator = `${currentValue} { ${accumulator} }`
        }
      }
      return accumulator
    }, ""
  );

  let nVal = nValIsObjectType ? JSON.stringify(value).replace(/"/g, "'") : value
  if (Number.isNaN(nVal)) {
    nVal = 0
  }
  return { returnResGQL, nVal }
}

const extractFields = (query: string, fields: string[]) => { // this gets the object shape as string so we can handle debts and projects in queries
  const regex = new RegExp(`(${fields.join('|')})\\s*{([^{}]*{[^{}]*}[^{}]*|[^{}]*)}`, 's');
  const match = query.match(regex);
  
  if (!match) return '';

  const result = match[1] + ' {' + match[2].replace(/(\s*{[^{}]*})$/, ' }') + '}';
  
  return result;
}

export const doLogin = async (username: string, password: string): Promise<User>  => {
  const result = await client.query({
    query: gql`
      query {
        login(username: "${username}", password: "${password}") {
          username
          foreclosures {
            address
            caseNumber
            debt
            zillowValue
            isCanceled
            isAdvertised
          }
          rentals {
            address
          }
        }
        getForeclosureListings {
          caseNumber
          saleDate
        }
      }
    `,
  });

  return cloneDeep(result.data);
};

interface SignupResult {
  createUser:User,
  getForeclosureListings: ForeclosureListing[]
}

export const doSignup = async (username: string, password: string): Promise<SignupResult>  => {
  const result = await client.mutate({
    mutation: gql`
      mutation {
        createUser(username: "${username}", password: "${password}") {
          username,
          foreclosures {
            caseNumber
          },
          rentals {
            address
          }
        }
      }
    `,
  });
  const getForeclosureListings = cloneDeep(await getForeclosuresList())

  return {
    createUser: cloneDeep(result?.data?.createUser),
    getForeclosureListings
  }
};

export const getForeclosuresList = async (): Promise<ForeclosureListing[]>  => {
  const result = await client.query({
    query: gql`
      query {
        getForeclosureListings {
          caseNumber
          saleDate
        }
      }
    `,
  });
  return cloneDeep(result.data.getForeclosureListings);
};

export const updateForeclosure = async (
  caseNum: string,
  keyPath: StringArrayOrNthStringArray,
  newVal: AnyValue,
  valType: string,
  skipQuery?: boolean
): Promise<ForeclosureModel>  => {
  const makeDefaultQuery = `{
    address
    caseNumber
    isAdvertised
    isCanceled
    isFav
    debt
    maxBid
    detailedNotes {
      otherNotes
      otherDebts {
        amount
        title
      }
      todoOwner
      todoTaxes
      todoTitle
    }
    zillowValue
  }`

  console.log(extractFields(makeDefaultQuery, keyPath)) // missing closing bracket, did not get isFav
  debugger
  const { returnResGQL, nVal } = createQueryStringAndValues(keyPath, newVal)

  const result = await client.mutate({
    mutation: gql`
      mutation {
        updateForeclosure(caseNum: "${caseNum}", keyPath: ${JSON.stringify(keyPath)}, propVal: "${nVal}", propType: "${valType}") ${skipQuery ? makeDefaultQuery : `{
          ${returnResGQL}
        }`}
      }
    `,
  });
  return cloneDeep(result.data.updateForeclosure); // clone deep fix is for object freeze issue. Do not remove.
};

export const getUserForeclosureItems = async (caseNum: string, dataKeyPaths: StringArrayOrNthStringArray) => {
  /* @ts-expect-error todo */
  const handleKeyPath = (keyPath) => (
    keyPath.length === 1 ? (
      `${keyPath[0]},`
    ) : (
      keyPath.reduceRight(
        /* @ts-expect-error todo */
        (accumulator, currentValue) => {
          if (keyPath.length === 1) {
            accumulator = `${currentValue},`
          } else {
            accumulator = `${currentValue} { ${accumulator} },`
          }
          return accumulator
        }
      )
    )
  )

  const reqData =  (Array.isArray(dataKeyPaths) ? dataKeyPaths : []).reduce((accumulator, currentValue) => {
    return accumulator + handleKeyPath(currentValue)
  }, "")

  // updateForeclosure
  const result = await client.query({
    query: gql`
      query {
        getForeclosureByCaseNumber(caseNum: "${caseNum}") {
          ${reqData}
        }
      }
    `,
  });
  return cloneDeep(result.data.getForeclosureByCaseNumber);
};

export const getCaseRecords = async (caseNum: string) => {
  const result = await client.query({
    query: gql`
      query {
        getCaseRecordsByCaseNumber(caseNum: "${caseNum}")
      }
    `,
  });
  return cloneDeep(result.data.getCaseRecordsByCaseNumber);
};

export const getPublicRecordsByCaseNumber = async (caseNum: string) => {
  const result = await client.query({
    query: gql`
      query {
        getPublicRecordsByCaseNumber(caseNum: "${caseNum}")
      }
    `,
  });
  return cloneDeep(result.data.getForeclosureByCaseNumber);
};

export const fetchHistoricalRecords = async () => {
  // fetchHistorialRecords
  // const result = await client.query({
  //   query: gql`
  //     mutation {
  //       createUser(username: "${username}", password: "${password}") {
  //         username,
  //         foreclosures {
  //           address
  //         },
  //         rentals {
  //           address
  //         }
  //       }
  //     }
  //   `,
  // });
  // return result.data.login;
};

export const getAllManagedOwned = async () => {
  const result = await client.query({
    query: gql`
      query {
        getRentals {
          address,
          rentersName
        }
      }
    `,
  });
  return result.data.getRentals || [];
};

export const getManagedOwnedByAddress = async (address: string) => {
  const result = await client.query({
    query: gql`
      query {
        getRentalByAddress(address: "${address}") {
          rentAmount
          projects {
            name
            todos {
              name
              checked
            }
            notes
          }
        }
      }
    `,
  });
  return cloneDeep(result.data.getRentalByAddress) || [];
};

export const addNewUpdateManagedOwned = async (
  address: string,
  keyPath: StringArrayOrNthStringArray,
  newVal: AnyValue,
  valType: string,
  skipQuery?: boolean
) => {
  const { nVal } = createQueryStringAndValues(keyPath, newVal) // returnResGQL
  const makeDefaultQuery = `{
    address
    rentersName
    rentAmount
    projects {
      name
      todos {
        name
        checked
      }
      notes
    }
  }`


  const result = await client.mutate({
    mutation: gql`
      mutation {
        updateRental(address: "${address}", keyPath: ${JSON.stringify(keyPath)}, propVal: "${nVal}", propType: "${valType}") ${skipQuery ? makeDefaultQuery : `{
        ${extractFields(makeDefaultQuery, keyPath)}
      }`}
    }
    `,
  });
  return cloneDeep(result.data.updateRental)
};