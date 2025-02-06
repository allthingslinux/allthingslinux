'use client';

import { useEffect } from 'react';
import { MdOutlinePrivacyTip, MdCookie, MdGavel } from 'react-icons/md';

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
      className="text-gray-400 hover:text-gray-300 transition-colors duration-200 ease-in-out inline-flex items-center gap-2 iubenda-nostyle no-brand iubenda-noiframe iubenda-embed iubenda-noiframe"
      title="Privacy Policy"
    >
      <MdOutlinePrivacyTip className="w-4 h-4" />
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
      className="text-gray-400 hover:text-gray-300 transition-colors duration-200 ease-in-out inline-flex items-center gap-2 iubenda-nostyle no-brand iubenda-noiframe iubenda-embed iubenda-noiframe"
      title="Cookie Policy"
    >
      <MdCookie className="w-4 h-4" />
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
      className="text-gray-400 hover:text-gray-300 transition-colors duration-200 ease-in-out inline-flex items-center gap-2 iubenda-nostyle no-brand iubenda-noiframe iubenda-embed iubenda-noiframe"
      title="Terms and Conditions"
    >
      <MdGavel className="w-4 h-4" />
      Terms & Conditions
    </a>
  );
};

const PrivacyChoices = () => {
  return (
    <a
      href="#"
      className="text-gray-400 hover:text-gray-300 transition-colors duration-200 ease-in-out inline-flex items-center gap-2"
      onClick={(e) => {
        e.preventDefault();
        if (window._iub?.cs?.api?.openPreferences) {
          window._iub.cs.api.openPreferences();
        }
      }}
    >
      <MdOutlinePrivacyTip className="w-4 h-4" />
      Your Privacy Choices
    </a>
  );
};

const NoticeAtCollection = () => {
  return (
    <a
      href="#"
      className="text-gray-400 hover:text-gray-300 transition-colors duration-200 ease-in-out inline-flex items-center gap-2"
    >
      <MdOutlinePrivacyTip className="w-4 h-4" />
      Notice at Collection
    </a>
  );
};

export { Privacy, Cookies, Terms, PrivacyChoices, NoticeAtCollection };
