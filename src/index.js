import React from "react";
import ReactDOM from 'react-dom/client';
import "./index.css";
import { createStore } from "redux";
import { Provider } from "react-redux";
// import App from './App';
import Router from "./Router";

import reportWebVitals from "./reportWebVitals";
import reducer from "./reducer/reducer";

const store = createStore(reducer);

const root = ReactDOM.createRoot(document.getElementById("root"), {
  concurrentFeatures: true
});
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router />
    </Provider>
  </React.StrictMode>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
function convertMsToSeconds(milliseconds) {
  if (typeof milliseconds !== 'number' || milliseconds < 0) {
    throw new Error('Input must be a non-negative number.');
  }

  const seconds = milliseconds / 1000;
  return seconds.toFixed(2);
}
const reporting = (metric) => {
  const { name, value } = metric;

  let category = '';
  let acceptableRange = '';

  switch (name) {
    case 'LCP':
      if (value <= 2500) {
        category = 'Good';
      } else if (value <= 4000) {
        category = 'Needs Improvement';
      } else {
        category = 'Poor';
      }
      acceptableRange = '≤ 2.5 seconds (Good), > 2.5s and ≤ 4.0s (Needs Improvement), > 4.0s (Poor)';
      break;

    case 'FCP':
      if (value <= 1800) {
        category = 'Good';
      } else if (value <= 3000) {
        category = 'Needs Improvement';
      } else {
        category = 'Poor';
      }
      acceptableRange = '≤ 1.8 seconds (Good), > 1.8s and ≤ 3.0s (Needs Improvement), > 3.0s (Poor)';
      break;

    case 'CLS':
      if (value <= 0.1) {
        category = 'Good';
      } else if (value <= 0.25) {
        category = 'Needs Improvement';
      } else {
        category = 'Poor';
      }
      acceptableRange = '≤ 0.1 (Good), > 0.1 and ≤ 0.25 (Needs Improvement), > 0.25 (Poor)';
      break;

    case 'FID':
      if (value <= 100) {
        category = 'Good';
      } else if (value <= 300) {
        category = 'Needs Improvement';
      } else {
        category = 'Poor';
      }
      acceptableRange = '≤ 100 milliseconds (Good), > 100ms and ≤ 300ms (Needs Improvement), > 300ms (Poor)';
      break;

    case 'TTFB':
      if (value <= 200) {
        category = 'Good';
      } else if (value <= 500) {
        category = 'Needs Improvement';
      } else {
        category = 'Poor';
      }
      acceptableRange = '≤ 200 milliseconds (Good), > 200ms and ≤ 500ms (Needs Improvement), > 500ms (Poor)';
      break;

    default:
      category = 'Unknown Metric';
      acceptableRange = 'N/A';
  }

  console.log(`${name}: ${category} (${convertMsToSeconds(value)}s) - ${acceptableRange}`);
}
reportWebVitals(reporting);
