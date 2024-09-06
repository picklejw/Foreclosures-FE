import React from 'react';

export const Loader = () => (
  <div id="l-wrapper">
    <img className="loader" src="loader.png" style={{ width: 30, height: 30 }} />
  </div>
)

export const showLoader = (doShow: boolean) => {
  const el = document.getElementById('l-wrapper')
  if (el) {
    el.style.display = doShow ? 'block' : 'none';
  } else {
    throw new Error('Cannot find loader element...')
  }
}