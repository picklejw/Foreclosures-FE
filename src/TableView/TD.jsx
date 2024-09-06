import React, { useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import Checkbox from '@mui/material/Checkbox';

function TD(props) {
  const {
    className,
    children,
    defaultValue,
    style,
    type,
    onBlurUpdate,
    elementType,
    inputStyle,
    readOnly,
    onClick,
  } = props;
  const [value, setValue] = useState(defaultValue)

  const doBlurUpdate = (val) => {
    if (!readOnly) {
      onBlurUpdate(val);
      setValue(val)
    }
  };

  const renderReadOnly = () => <span>{value}</span>;

  const renderInput = () => {
    const inputProps = {
      defaultValue: value,
      onBlur: (e) => {
        const val = e.target.value;
        if (value !== val) {
          doBlurUpdate(val);
        }
      },
      style: inputStyle,
    };
    if (type === 'number') {
      inputProps.onBlur = (e) => {
        const val = parseFloat(e.target.value.replace(/[^0-9\.-]+/g, ''));
        if (value !== val) {
          doBlurUpdate(val);
        }
      };
      return (
        <CurrencyInput
          intlConfig={{ locale: 'en-US', currency: 'USD' }}
          {...inputProps}
        />
      );
    }

    return <input {...inputProps} />;
  };

  const renderSpan = () => <span>{renderReadOnly()}</span>;

  const renderDateType = () => {
    if (!value) {
      return <span>__???__</span>;
    }
    const splitVals = value.split('-');
    const date = `${splitVals[2]}-${splitVals[0]}-${splitVals[1]}`;
    const dateStr = new Date(date).toLocaleDateString('en-US', {
      timeZone: 'UTC',
    });
    return <span>{dateStr}</span>;
  };

  const renderCheck = () => (
    <Checkbox
      checked={value}
      onChange={(e) => {
        const val = Boolean(e.target.checked);
        doBlurUpdate(val);
      }}
    />
  );

  const renderTextarea = () => {
    const resize = (target) => {
      if (target && target.style) {
        setTimeout(() => {
          target.style.height = 0;
          target.style.height = `${target.scrollHeight}px`;
        });
      }
    };
    return (
      <textarea
        style={{ ...inputStyle, overflow: 'hidden', resize: 'none' }}
        ref={(e) => {
          const doShow = setTimeout(() => {
            if (e?.textLength || !defaultValue?.length) {
              resize(e);
              clearInterval(doShow);
            }
          }, 1);
          setTimeout(() => {
            clearInterval(doShow);
          }, 100);
        }}
        onBlur={(e) => {
          const val = e.target.value;
          doBlurUpdate(val);
        }}
        onKeyUp={(e) => e && resize(e.target)}
        defaultValue={defaultValue}
      />
    );
  };

  return (
    <td className={className} style={style} onClick={onClick}>
      {(() => {
        switch (elementType) {
          case 'date':
            return renderDateType();
          case 'input':
            return renderInput();
          case 'check':
            return renderCheck();
          case 'textarea':
            return renderTextarea();
          case 'string':
            return renderSpan();
          default:
            return children;
        }
      })()}
    </td>
  );
}

export default TD;
