import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { setUserAction } from '../actions';

function MainSelection() {
  const navigate = useNavigate();
  // so we need to have a mani menu for user, 1) Foreclosure lisings 2) Property Managment
  useEffect(() => {
    // This is while rental-mgmt is under construction to bypass this selection, just remove useEffectgit a
    navigate("/foreclosure-listings")
  }, [])
  return (
    <div>
      <Link to="./foreclosure-listings">Foreclosure Listings</Link>
      <br />
      <Link to="./rental-mgmt">Rental Managment</Link>
    </div>
  );
}

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  setUser: (user) => dispatch(setUserAction(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainSelection);
