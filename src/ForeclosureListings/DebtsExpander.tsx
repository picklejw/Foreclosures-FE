import React, { useState, type FC } from 'react';
import { ForeclosureDetailedNotesModel, ForeclosureModel, ForeclosureDebts } from '../utils/models'
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CurrencyInput, { formatValue } from 'react-currency-input-field';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

interface CompProps {
  updateDebts: (debts: ForeclosureDebts[], cb: (details: ForeclosureModel) => void) => void;
  debts: ForeclosureDetailedNotesModel;
  foreclosureData: ForeclosureModel;
  updateChecklist: (optionSelector: string[], value: boolean, cb: () => void) => void;
}

const DebtsExpander: FC<CompProps> = ({
  updateDebts, debts, foreclosureData, updateChecklist,
}) => {
  const [show, setShow] = useState<boolean>();
  const [inputVal, setInputVal] = useState({ title: '', amount: 0 });
  const [chkLstVal, setChkLstVal] = useState({
    didTitle: !!foreclosureData?.detailedNotes?.todoTitle,
    didOwner: !!foreclosureData?.detailedNotes?.todoOwner,
    didTaxes: !!foreclosureData?.detailedNotes?.todoTaxes,
  });
  const [parsedDebts, setDebts] = useState(debts?.otherDebts || []);
  const saleData = {
    ...foreclosureData,
    Debt: foreclosureData.debt ||  0,
    'Zillow Value': foreclosureData['zillowValue'] || 0,
  };

  const renderDebtsTotal = (overrideNumber: number = 0) => {
    let total = overrideNumber;
    if (!overrideNumber && parsedDebts.length) {
      parsedDebts.forEach((dbt) => {
        total += dbt?.amount  || 0;
      });
    }
    return formatValue({
      value: `${total}`,
      groupSeparator: ',',
      decimalSeparator: '.',
      prefix: '$',
    });
  };

  return (
    <div style={{ border: '1px solid black', padding: 5 }}>
      <button onClick={() => setShow(!show)}>invert expand</button>
      {renderDebtsTotal()}
      {
        show && (
          <>
            <hr />
            <div>
              {parsedDebts.map((debt, i) => (
                <div key={i}>
                  <div style={{ display: 'inline-block' }}>{debt?.title}</div>
                  {' : '}
                  {(() => {
                    if (debt?.amount) {
                      return formatValue({
                        value: `${debt?.amount}`,
                        groupSeparator: ',',
                        decimalSeparator: '.',
                        prefix: '$',
                      });
                    }
                  })()}
                  {'  '}
                  <FontAwesomeIcon
                    onClick={() => {
                      delete parsedDebts[i];
                      parsedDebts.splice(i, 1); 
                      updateDebts([...parsedDebts], ({detailedNotes: { otherDebts }}) => {
                        setDebts(otherDebts);
                      });
                    }}
                    icon={faTrash}
                  />
                </div>
              ))}
              <div>
                <b>
                  Total:
                  {' '}
                  {'  '}
                  {renderDebtsTotal()}
                  <br />
                  Est Profit:
                  {' '}
                  {(() => {
                    let total = 0;
                    parsedDebts.forEach((dbt) => {
                      total += (dbt?.amount || 0);
                    });
                    return renderDebtsTotal(saleData['zillowValue'] - saleData.Debt - total);
                  })()}
                </b>

              </div>
            </div>
            <p>add new</p>
            <input
              onChange={(ev) => { setInputVal({ ...inputVal, title: ev.currentTarget.value }); }}
              value={inputVal.title}
            />
            <CurrencyInput
              intlConfig={{ locale: 'en-US', currency: 'USD' }}
              defaultValue={inputVal.amount}
              onChange={(e) => {
                const val = parseFloat(e.target.value.replace(/[^0-9\.-]+/g, ''));
                if (inputVal.amount !== val) {
                  setInputVal({ ...inputVal, amount: val });
                }
              }}
            />
            <button onClick={() => {
              parsedDebts.push(inputVal);
              setInputVal({
                title: '',
                amount: 0,
              });
              updateDebts([...parsedDebts], ({detailedNotes: { otherDebts }}) => {
                setDebts(otherDebts);
              });
            }}
            >
              Add New Debt

            </button>
            <div>
              Checklist:
              <FormGroup>
                <FormControlLabel
                  value={chkLstVal.didTitle}
                  onChange={(_, checked) => {
                    updateChecklist(['detailedNotes', 'todoTitle'], checked, () => {
                      setChkLstVal({ ...chkLstVal, didTitle: checked });
                    });
                  }}
                  control={<Checkbox checked={chkLstVal.didTitle} />}
                  label="Land/Title Search"
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  value={chkLstVal.didOwner}
                  onChange={(_, checked) => {
                    updateChecklist(['detailedNotes', 'todoOwner'], checked, () => {
                      setChkLstVal({ ...chkLstVal, didOwner: checked });
                    });
                  }}
                  control={<Checkbox checked={chkLstVal.didOwner} />}
                  label="Ownership Encumberances Search"
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  value={chkLstVal.didTaxes}
                  onChange={(_, checked) => {
                    updateChecklist(['detailedNotes', 'todoTaxes'], checked, () => {
                      setChkLstVal({ ...chkLstVal, didTaxes: checked });
                    });
                  }}
                  control={<Checkbox checked={chkLstVal.didTaxes} />}
                  label="County Taxes"
                />
              </FormGroup>
            </div>
          </>
        )
      }
    </div>
  );
}

export default DebtsExpander