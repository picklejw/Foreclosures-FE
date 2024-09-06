import { updateForeclosure, addNewUpdateManagedOwned } from './apolloClient';
import { ForeclosureModel, RentalModel } from './models'
import { type AnyValue } from './types'

interface UpdateItemParams<Model> {
  keyPath: string[];
  value: AnyValue;
  valueType?: string;
  callback?: (arg: Model) => void;
  skipQuery?: boolean;
}

const mergeData = <ModelT extends object>(
  nKeyPath: string[], 
  nData: AnyValue, 
  cData: ModelT
) => {
  // when encounter array, we need to "find()" with data in nData to update correct item in array

  for (let i = 0; i < nKeyPath.length - 1; i++) {
    // if (Array.isArray())
    const key = nKeyPath[i];

    /* @ts-expect-error todo  */
    if (!cData[key]) {
      /* @ts-expect-error todo  */
      cData[key] = {};
    }
    /* @ts-expect-error todo  */
    if (cData.hasOwnProperty(key) && typeof cData[key] === 'object' && cData != null &&  typeof key === 'string') {
      /* @ts-expect-error todo  */
      cData = cData[key];
    } else {
      if (Array.isArray(key)) {
        /* @ts-expect-error todo  */
        cData = cData.find((item ) => {
          const toMatch = key[0]
          const keyName = Object.keys(toMatch)[0] // should only be one
          console.log(nData)
          console.log(cData)
          console.log(key)
          debugger
          if (toMatch[keyName] == item[keyName]) {
            return true
          }
          return false
        })
        debugger
      }
    }
  }

  if (nData === null) {
    /* @ts-expect-error todo  */
    delete cData[keyPath[keyPath.length - 1]]
  } else {
    /* @ts-expect-error todo  */
    if (Array.isArray(cData[nKeyPath[nKeyPath.length - 1]]) && Array.isArray(nData)) {
      /* @ts-expect-error todo  */
      cData[nKeyPath[nKeyPath.length - 1]].push(nData)
    } else {
      /* @ts-expect-error todo  */
      cData[nKeyPath[nKeyPath.length - 1]] = nData
    }
  }
}

export default class Property<ModelT> extends Object {
  data: ModelT;
  updateCB?: (arg: ModelT) => void;

  constructor(rentalData: ModelT) {
    super();
    this.data = { ...rentalData };
    this.updateItem = this.updateItem.bind(this);
    this.setUpdateCallback = this.setUpdateCallback.bind(this);
    this.setPersonalizationData = this.setPersonalizationData.bind(this);
  }

  updateItem({ keyPath, value, valueType, callback, skipQuery }: UpdateItemParams<ModelT>) {
    // let toUpdate = this.data
    /* @ts-expect-error todo  */
    mergeData(keyPath, value, this.data)

    // for (let i = 0; i < keyPath.length - 1; i++) {
    //   const key = keyPath[i];
    //   /* @ts-expect-error todo  */
    //   if (!toUpdate[key]) {
    //     /* @ts-expect-error todo  */
    //     toUpdate[key] = {};
    //   }
    //   /* @ts-expect-error todo  */
    //   toUpdate = toUpdate[key];
    // }

    // if (value === null) {
    //   /* @ts-expect-error todo  */
    //   delete toUpdate[keyPath[keyPath.length - 1]]
    // } else {
    //   debugger
    //   /* @ts-expect-error todo  */
    //   toUpdate[keyPath[keyPath.length - 1]] = value
    // }

    debugger
    if (typeof this.data === 'object' && this.data && 'caseNumber' in this.data) {
      const caseNum = `${this.data.caseNumber}`;
      updateForeclosure(caseNum, keyPath, value, valueType || typeof value, skipQuery); // blind update
    } else {
      if (typeof this.data === 'object' && this.data && 'address' in this.data) {
        const address = `${this.data.address}`;
        addNewUpdateManagedOwned(address, keyPath, value, valueType || typeof value, skipQuery); // blind update
      }
    }
    this?.updateCB?.(this.data); // we need to pass foreclosure back?
    callback?.(this.data);
  }

  setUpdateCallback(cb: typeof this.updateCB | null) {
    if (!cb) {
      this.updateCB = () => {}
    } else {
      this.updateCB = cb;

    }
  }

  setPersonalizationData(personalizedData: ModelT) {
    this.data = { ...this.data, ...personalizedData };
    this?.updateCB?.(this.data);
  }
}

export const mapDataToProperty = (pDatas: ForeclosureModel[] | RentalModel[]) => pDatas.map((pData) => new Property(pData));

export function isForeclosure(obj: ForeclosureModel | RentalModel): obj is ForeclosureModel {
  return obj && typeof (obj as ForeclosureModel).caseNumber === 'string';
}