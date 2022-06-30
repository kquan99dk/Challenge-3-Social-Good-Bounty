import 'regenerator-runtime/runtime';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Big from 'big.js';

const SUGGESTED_DONATION = '0';
const BOATLOAD_OF_GAS = Big(3).times(10 ** 13).toFixed();

const App = ({ contract, currentUser, nearConfig, wallet }) => {
  const [messages, setMessages] = useState([]);
  const [number, setNumber] = React.useState(1)

  useEffect(() => {
    contract.getMessages().then(setMessages);
  }, []);
  // console.log('messages', messages);
  const handleChange = (event) => {
    const { value } = event.target
    setNumber(number < 1 || value === '' ? 1 : Number(value))
  }
  const onSubmit = (e) => {
    e.preventDefault();

    const { btnDonate, message, donation } = e.target.elements;

    btnDonate.disabled = true;

    contract.addMessage(
      { text: message.value },
      BOATLOAD_OF_GAS,
      Big(donation.value || '0').times(10 ** 24).toFixed()
    ).then(() => {
      contract.getMessages().then(messages => {
        setMessages(messages);
        message.value = '';
        donation.value = SUGGESTED_DONATION;
        btnDonate.disabled = false;
        message.focus();
      });
    });
  };

  const signIn = () => {
    wallet.requestSignIn(
      { contractId: nearConfig.contractName, methodNames: [contract.addMessage.name] }, //contract requesting access
      'Funraising', //optional name
      null, //optional URL to redirect to if the sign in was successful
      null //optional URL to redirect to if the sign in was NOT successful
    );
  };

  const signOut = () => {
    wallet.signOut();
    // eslint-disable-next-line no-undef
    window.location.replace(window.location.origin + window.location.pathname);
  };

  return (
    <div style={{
      // backgroundColor: 'rgba(4, 26, 16)',
      backgroundImage: 'url("https://thumbs.gfycat.com/BaggyPersonalJerboa-max-1mb.gif?fbclid=IwAR2VtobU2_XGgkokUlpPLlpFAGW25YpuuzPb8n7A1jHiIdrC3o-MJyUa7T0")',
      // backgroundRepeat: 'no-repeat',
      backgroundSize: 'auto',
      height: 'auto'
    }}>
      <div style={{ height: '65px' }} className="d-flex justify-content-between align-items-center px-3"
      >
        <h3 className="text-warning">Book Fundraise</h3>
        {currentUser
          ? <button className="btn text-white border" onClick={signOut}>Log out</button>
          : <button className="btn text-white border" onClick={signIn}>Log in</button>
        }
      </div>

      {currentUser
        ?
        <div className="pb-5">
          <div style={{ marginTop: '50px', padding: '0 8%' }} className="d-flex justify-content-center text-white">
            <div className="w-100 d-flex flex-column align-items-center">
              <p style={{ color: '#26bc57', fontSize: '14px' }}>READING CULTURE IGNITION</p>
              <h3 className="text-center">Welcome <b>{currentUser.accountId}</b> !!!</h3>
              <p style={{ fontSize: '88px' }} className="text-warning mb-2">READING FUNDRAISE</p>
              <p className="w-75">Fill in the amount you want to donate in the form below carefully. Once submitted, be patient and sign the confirmation with your Near Wallet. Do not refresh the page.
              </p>
            </div>
          </div>

          <div style={{ marginTop: '50px', padding: '0 8%' }} className="d-flex justify-content-center text-white">
            <div className="d-flex border border-warning rounded w-75" style={{ height: '300px', backgroundColor: 'rgba(117, 81, 51, 0.637)' }}>
              <form onSubmit={onSubmit} className="w-50 d-flex flex-column align-items-center">
                <input
                  type="hidden"
                  autoComplete="off"
                  autoFocus
                  id="message"
                // required
                />
                <h3 className="mt-5">Donate</h3>
                <input
                  className="form-control w-50 mb-3"
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
                <button id="btnDonate" className="btn btn-warning" type="submit">
                  Send
                </button>
              </form>
              <div className="w-50 d-flex flex-column align-items-center">
                <h4 className="text-warning"> Donation List</h4>
                <div className="w-100 d-flex flex-column align-items-center" style={{ overflowY: 'auto' }}>
                  {messages.reverse().map((message, i) =>
                    <p key={i} style={{ fontSize: '30px' }} className="text-break">
                      {message.sender}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: '50px', padding: '0 10%' }} className="text-white">
            <div className="d-flex">
              <div className="w-50 pe-3">
                <p>
                  Give everyone a book of their own: A donation helps us get book
                  tokens and books to everyone all over the world especially those
                  from poor and underdeveloped countries. They do not have the economic
                  conditions to buy books and are not aware of the importance of reading books.
                  <br />

                </p>
              </div>
              <div className="w-50 ps-3">
                <img className="w-100 rounded" src="https://image.cnbcfm.com/api/v1/image/106357368-1580149122021at-the-library_t20_3j87o3.jpg?v=1580149230" />
              </div>
            </div>
            <div className="d-flex mt-5">
              <div className="w-50 pe-3">
                <img className="w-100 rounded" src="https://cdn.techinasia.com/wp-content/uploads/2016/09/reading-book.jpg" />
              </div>
              <div className="w-50 ps-3">
                <p>
                  Ensure access to books for every child: Working with local communities,
                  libraries and charity partners we deliver exciting activities to encourage
                  everyone and get books to the children and young people who need them most.
                  Thank you for helping us to change lives through reading and access to books.
                </p>
              </div>
            </div>
          </div>
        </div>
        :
        <div className="pb-5">
          <div style={{ marginTop: '50px', padding: '0 8%' }} className="d-flex justify-content-between align-items-center pt-5">
            <div className="d-flex flex-column w-50">
              <p style={{ color: '#26bc57', fontSize: '14px' }}>READING IGNITION</p>
              <p style={{ fontSize: '60px', lineHeight: '70px' }} className="text-white my-2">READING CULTURE IGNITION</p>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '35px', fontWeight: '400' }}
                className="text-warning">
                RAISING MONEY, RAISING READER.</p>
            </div>
            <div className="w-50">
              <img className="w-100" src="https://vnmedia.monkeyuni.net/upload/web/storage_web/04-03-2022_13:38:02_shutterstock_134721788.jpg?fbclid=IwAR2og23H3CHwbDSbqochuTP2y_fFLsFmjJ8LnHlNfCVc7Yr3R0reFL1pIl0" />
            </div>
          </div>
          <div className="d-flex justify-content-between mt-5" style={{ padding: '0 8%' }}>
            <div className="w-50">
              <p style={{ color: '#26bc57', fontSize: '14px' }}>WHAT IS THE READING IGNITION?</p>
              <h3 className="text-white mb-3">MEET THE READING CULTURE FUNDRAISE</h3>
              <p className="text-white" style={{ fontSize: '16px' }}>
                Our vision is to see more people from all backgrounds, developing a
                life-long habit of reading for pleasure and benefitting from the improved
                life chances this brings them. By making a donation or raising funds for
                READING CULTURE FUNDRAISE, you can help us change lives through a love of
                books and shared reading.
                <br />
                The READING CULTURE FUNDRAISE Ignition is a campaign to
                launch the READING IGNITION. The campaign will begin on May
                1 2022 and will be live until July 15 2022. It will kickstart
                the READING IGNITION and boost the reading culture for people
                from all ages and from all walks of life.
              </p>
            </div>
            <div className="w-50 d-flex flex-column justify-content-around align-items-center pt-3">
              <div style={{ width: "310px" }} className="d-flex align-items-center">
                <div style={{ width: '60px', height: '60px', backgroundColor: '#07bc0c' }}
                  className="rounded-circle d-flex align-items-center justify-content-center fw-bold me-2">1
                </div>
                <p className="text-white">Login with Near Wallet</p>
              </div>
              <div style={{ width: "310px" }} className="d-flex align-items-center">
                <div style={{ width: '60px', height: '60px', backgroundColor: '#07bc0c' }}
                  className="rounded-circle d-flex align-items-center justify-content-center fw-bold me-2">2</div>
                <p className="text-white">Donate now (Min 1NEAR)</p>
              </div>
              <div style={{ width: "310px" }} className="d-flex align-items-center">
                <div style={{ width: '60px', height: '60px', backgroundColor: '#07bc0c' }}
                  className="rounded-circle d-flex align-items-center justify-content-center fw-bold me-2">3</div>
                <p className="text-white">Keep your fingers crossed!</p>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

App.propTypes = {
  contract: PropTypes.shape({
    addMessage: PropTypes.func.isRequired,
    getMessages: PropTypes.func.isRequired
  }).isRequired,
  currentUser: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired
  }),
  nearConfig: PropTypes.shape({
    contractName: PropTypes.string.isRequired
  }).isRequired,
  wallet: PropTypes.shape({
    requestSignIn: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired
  }).isRequired
};

export default App;