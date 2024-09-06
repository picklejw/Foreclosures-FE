import React, { useEffect, useState, useMemo, type FC } from 'react';
import Property from '../utils/Property'
import { RentalModel, ForeclosureModel } from '../utils/models'
import TR from './TR'
import styled from 'styled-components';


export interface TableHeaders {
  label: string;
  width: {
    desktop: string;
    mobile: string;
  }
}

export interface ExpanderTRprops {
  listing: Property<ForeclosureModel | RentalModel>;
}

interface TableViewProps {
  properties: Property<RentalModel | ForeclosureModel>[];
  tableHeaders: TableHeaders[];
  expanderTR: {
    comp: React.ElementType,
    getter: (inst: Property<RentalModel | ForeclosureModel>) => Promise<ForeclosureModel | RentalModel>
  };
}

const rowHeight = 56
export type ResponsiveName = 'desktop' | 'mobile';
// type ColResponsiveStyles = {
//   [key in ResponsiveName]: CSSProperties;
// }[];
// export const columnWidth: ColResponsiveStyles = [
//   { // edit toggle
//     desktop: { width: 50 },
//     mobile: { width: 50 }
//   },
//   { // is faved (TODO)
//     desktop: { width: 50 },
//     mobile: { width: 50 }
//   },
//   { // isAdvertised
//     desktop: { width: 50 },
//     mobile: { width: 50 }
//   },
//   { // case number
//     desktop: { width: 200 },
//     mobile: { width: 200 }
//   },
//   { // address
//     desktop: { flex: 1 },
//     mobile: { flex: 1 }
//   },
//   { // equity
//     desktop: { width: 100 },
//     mobile: { width: 100 }
//   },
// ]

const Table = styled('div')`
  margin-top: 15px;
  width: 100%;
  border-collapse: collapse;
  overflow: hidden;
`;

const TableHeader = styled('div')`
  line-height: ${rowHeight}px;
  background-color: #007bff;
  color: #fff;
`;
const TableBody = styled('div')`
  line-height: ${rowHeight}px;
`;

export const TableRow = styled('div')`
  border-bottom: 1px solid #000;
  width: 100vw;
  padding-right: 200%;
  display:flex;
`


const TableView: FC<TableViewProps> = ({ properties, tableHeaders, expanderTR }) => {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768)
  const screenSizeName = isMobile ? 'mobile' : 'desktop'

  useEffect(() => {
    window.addEventListener('resize', () => { setIsMobile(window.innerWidth < 768) });
  }, [])
  const makeTableHeader = () => {
    return (
      <TableHeader>
        <TableRow>
          {tableHeaders.map((headerItem, i) => (
                      /* @ts-expect-error todo  */
            <th key={i} style={tableHeaders[i].style[screenSizeName]}>{headerItem.label}</th>
          ))}
        </TableRow>
      </TableHeader>
    )
  }

  const getTRs = () => useMemo(
    () => properties.map((sale, i) => <TR key={i} screenType={screenSizeName} listing={sale} tableHeaders={tableHeaders} expanderTR={expanderTR} />),
    [properties]
  )

  return (
    <Table>
      {makeTableHeader()}
      <TableBody>
        {getTRs()}
      </TableBody>
    </Table>
  );
};

export default TableView;