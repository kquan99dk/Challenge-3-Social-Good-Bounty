import React from 'react';
import PropTypes from 'prop-types';

export default function Messages({ messages }) {
  return (
    <div>
      <h2>Messages</h2>
      {messages.map((message, i) =>
        // TODO: format as cards, add timestamp
        <p key={i} className={message.premium ? 'is-premium' : ''}>
          <strong>{message.sender}</strong>
        </p>
      )}
    </div>
  );
}

Messages.propTypes = {
  messages: PropTypes.array
};
