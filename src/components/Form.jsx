import React from 'react';
import PropTypes from 'prop-types';
import Big from 'big.js';

export default function Form({ onSubmit, currentUser }) {

  const [number, setNumber] = React.useState(1)
  const handleChange = (event) =>{
    // console.log(event.target.value);
    const {value} = event.target
    setNumber(number < 1 || value === ''? 1 :  Number(value))
  }

  return (
    <form onSubmit={onSubmit} className="text-white">
      <fieldset id="fieldset">
        <p>Sign the guest book, { currentUser.accountId }!</p>
          <input
            type="hidden"
            autoComplete="off"
            autoFocus
            id="message"
            // required
          />
        <p>
          <label htmlFor="donation">Donation (optional):</label>
          <input
            autoComplete="off"
            value={number}
            onChange={handleChange}
            id="donation"
            max={Big(currentUser.balance).div(10 ** 24)}
            min={1}
            minLength={1}
            step={1}
            type="number"
          />
          <span title="NEAR Tokens">Ⓝ</span>
        </p>
        <button type="submit">
          Sign
        </button>
      </fieldset>
    </form>
  );
}

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired
  })
};
