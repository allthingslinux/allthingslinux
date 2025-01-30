'use client';

import { useEffect } from 'react';

const Privacy = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.iubenda.com/iubenda.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <a
      href="https://www.iubenda.com/privacy-policy/97069484"
      className="iubenda-black no-brand iubenda-noiframe iubenda-embed iubenda-noiframe"
      title="Privacy Policy"
    >
      Privacy Policy
    </a>
  );
};

const Cookies = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.iubenda.com/iubenda.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <a
      href="https://www.iubenda.com/privacy-policy/97069484/cookie-policy"
      className="iubenda-black no-brand iubenda-noiframe iubenda-embed iubenda-noiframe"
      title="Cookie Policy"
    >
      Cookie Policy
    </a>
  );
};

const Terms = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.iubenda.com/iubenda.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <a
      href="https://www.iubenda.com/terms-and-conditions/97069484"
      className="iubenda-black no-brand iubenda-noiframe iubenda-embed iubenda-noiframe"
      title="Terms and Conditions"
    >
      Terms & Conditions
    </a>
  );
};

export { Privacy, Cookies, Terms };
