import styled from 'styled-components';

export const Table = styled.table`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-collapse: collapse;

  th, td {
    padding: 4px;
    margin: 0;
  }
  
  tr {
    width: 100%;
  }
  
  
  .expand-td {
    width: 20px;
  }
  
  .fav-td {
    width: 20px;
  }
  
  .casenum-td {
    width: 160px;
    text-align: center;
  }
  
  .address-td {
  }
  
  .lastupdate-td {
    width: 100px;
  }
  
  .equity-td {
    width: 100px;
  }
  
  
  @media (max-width: 767px) {
    .hidden-mobile {
      display: none;

      @media print { 
        {
          display: block
        } 
       }
    }
  }

  thead {
    border-spacing: 0;
    height: 45px;
    border: 1px solid black;
    position: fixed;
    top: 60px;
    display: table;
    width: 100%;

    tr {
      background: #ffffcc;
      :last-child {
        background: #ffff99;
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
  tbody {
    top: 60px;
    position: absolute;
    bottom: 0;
    width: 100%;
    overflow: scroll;

    .sale-row {
      border-bottom: 1px solid #000;
      display: block;
    }

    td {
      padding: 5px;
      margin: auto;
    }

  }
`;
