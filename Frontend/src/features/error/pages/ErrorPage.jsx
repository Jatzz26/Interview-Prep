import React from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  const isNotFound = error?.status === 404 || error?.statusText === 'Not Found';
  const status = isNotFound ? 404 : error?.status || 'Error';
  const message = isNotFound
    ? "Oops! The page you're looking for doesn't exist."
    : error?.statusText || error?.message || 'Something went wrong.';

  return (
    <main
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        gap: '1.5rem',
        padding: '1rem'
      }}
    >
      <h1 style={{ fontSize: '4rem', fontWeight: 700, color: '#e1034d' }}>
        {status}
      </h1>
      <p style={{ fontSize: '1.25rem', opacity: 0.9 }}>{message}</p>
      <button
        className="button primary-button"
        onClick={() => navigate('/login')}
        style={{ marginTop: '0.5rem' }}
      >
        Go to Login
      </button>
    </main>
  );
};

export default ErrorPage;

