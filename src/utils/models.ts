
export interface User {
  username: string;
  password: string;
  foreclosures: ForeclosureModel[];
  rentals: RentalModel[];
}

export interface ForeclosureModel {
  address: string;
  caseNumber: string;
  isAdvertised: boolean;
  isCanceled: boolean;
  isFav: boolean;
  debt: number;
  maxBid: number;
  detailedNotes: ForeclosureDetailedNotesModel
  zillowValue: number;
}

export interface ForeclosureDetailedNotesModel {
  otherNotes: string;
  otherDebts: ForeclosureDebts[];
  todoOwner: boolean;
  todoTaxes: boolean;
  todoTitle: boolean;
}

export interface ForeclosureDebts {
  amount: number;
  title: string;
}

export interface RentalModel {
  address: string;
  projects: {
    [key: string]: {
      [key: string]: boolean;
    };
  };
  rentersName: string;
  rentAmount: string;
}

export interface ForeclosureListing {
  isCanceled: boolean;
  casenumber: string;
  caseTitle: string;
  comments: string;
  createdAt: string;
  saleDate: string;
}