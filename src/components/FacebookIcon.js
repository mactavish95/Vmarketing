import React from 'react';

const FacebookIcon = ({ size = 32, style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={style}
  >
    <rect x="0" y="0" width="32" height="32" rx="6" fill="#1877F3" />
    <path
      d="M21.333 16.001h-3.111v8h-3.555v-8h-1.778v-3.111h1.778v-1.778c0-2.133 1.067-3.555 3.555-3.555h2.222v3.111h-1.333c-.711 0-.889.267-.889.889v1.333h2.222l-.444 3.111z"
      fill="#fff"
    />
  </svg>
);

export default FacebookIcon; 