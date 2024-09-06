const withProdPrefix = process.env.NODE_ENV === 'development' ? 'api' : 'api';
const fetchUtil = (url: string) => {
  try {
    return fetch(`${withProdPrefix}${url}`);
  } catch (error) {
    console.error(error)
    throw error
  }
};

export const fetchCasePageByCaseNumber = async (caseNumber: string) => {
  const formattedCaseNumb = caseNumber.slice(0, 17)
  const response = await fetchUtil(`/foreclosures/area/brevard/fetch-county-case?case_numb=${formattedCaseNumb}`);
  const data = await response?.json();

  if (response?.ok) {
    return data;
  }

  return new Error('An error occured');
};

export const fetchRecordsPageByCaseNumber = async (caseNumber: string) => {
  const formattedCaseNumb = caseNumber.slice(0, 17)
  const response = await fetchUtil(`/foreclosures/area/brevard/fetch-county-records?case_numb=${formattedCaseNumb}`);
  const data = await response?.json();

  if (response?.ok) {
    return data;
  }

  return new Error('An error occured');
};
