import { MdOutlinePrivacyTip, MdCookie, MdGavel, MdSecurity } from 'react-icons/md';

const Privacy = () => {
  return (
    <a
      href="https://www.iubenda.com/privacy-policy/97069484/full-legal"
      className="text-gray-400 hover:text-gray-300 transition-colors duration-200 ease-in-out inline-flex items-center gap-2"
      title="Privacy Policy"
      target="_blank"
      rel="noopener noreferrer"
    >
      <MdOutlinePrivacyTip className="w-4 h-4" />
      Privacy Policy
    </a>
  );
};

const Cookies = () => {
  return (
    <a
      href="https://www.iubenda.com/privacy-policy/97069484/cookie-policy"
      className="text-gray-400 hover:text-gray-300 transition-colors duration-200 ease-in-out inline-flex items-center gap-2"
      title="Cookie Policy"
      target="_blank"
      rel="noopener noreferrer"
    >
      <MdCookie className="w-4 h-4" />
      Cookie Policy
    </a>
  );
};

const Terms = () => {
  return (
    <a
      href="https://www.iubenda.com/terms-and-conditions/97069484"
      className="text-gray-400 hover:text-gray-300 transition-colors duration-200 ease-in-out inline-flex items-center gap-2"
      title="Terms and Conditions"
      target="_blank"
      rel="noopener noreferrer"
    >
      <MdGavel className="w-4 h-4" />
      Terms & Conditions
    </a>
  );
};

const Security = () => {
  return (
    <a
      href="/security"
      className="text-gray-400 hover:text-gray-300 transition-colors duration-200 ease-in-out inline-flex items-center gap-2"
      title="Security - Responsible Disclosure"
    >
      <MdSecurity className="w-4 h-4" />
      Security
    </a>
  );
};

// const PrivacyChoices = () => {
//   useEffect(() => {
//     const script = document.createElement('script');
//     script.src =
//       '//embeds.iubenda.com/widgets/1a87d6c7-a30f-472c-97ad-dee6e51b6968.js';
//     script.async = true;
//     script.type = 'text/javascript';
//     document.body.appendChild(script);

//     return () => {
//       if (document.body.contains(script)) {
//         document.body.removeChild(script);
//       }
//     };
//   }, []);

//   return (
//     <a
//       href="#"
//       className="text-gray-400 hover:text-gray-300 transition-colors duration-200 ease-in-out inline-flex items-center gap-2 iubenda-cs-preferences-link"
//       title="Your Privacy Choices"
//     >
//       <MdOutlinePrivacyTip className="w-4 h-4" />
//       Your Privacy Choices
//     </a>
//   );
// };

export { Privacy, Cookies, Terms, Security };
