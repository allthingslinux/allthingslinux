import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Security - Responsible Disclosure',
  description: 'Security vulnerability disclosure and responsible reporting for All Things Linux.',
};

export default function SecurityPage() {
  return (
    <div className="container mx-auto px-4 py-4 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Security at All Things Linux</h1>

      <div className="prose prose-lg max-w-none dark:prose-invert [&_ul]:space-y-1 [&_ol]:space-y-1 [&_li]:my-1">
        <p>
          At All Things Linux, we are committed to maintaining the highest security standards
          to protect our community and infrastructure. We deeply value the security research
          community and actively encourage responsible disclosure of security vulnerabilities.
          Your contributions help us ensure the safety, privacy, and integrity of our platforms
          and services.
        </p>

        <p>
          We believe in transparency and collaboration when it comes to security. Our team is
          dedicated to investigating all reported issues promptly and working with researchers
          to address vulnerabilities in a timely and responsible manner.
        </p>

        <h2>Scope</h2>
        <p>
          This security policy applies to all All Things Linux services, including but not limited to:
        </p>
        <ul>
          <li>All our domains including their subdomains:
            <ul className="text-muted-foreground text-sm mt-1 ml-4 space-y-0.5">
              <li>allthingslinux.com</li>
              <li>allthingslinux.dev</li>
              <li>allthingslinux.org</li>
              <li>atl.chat</li>
              <li>atl.dev</li>
              <li>atl.moe</li>
              <li>atl.network</li>
              <li>atl.rip</li>
              <li>atl.services</li>
              <li>atl.sh</li>
              <li>atl.tools</li>
              <li>atl.wiki</li>
            </ul>
          </li>
          <li>Discord bot services and integrations</li>
          <li>API endpoints and backend services</li>
          <li>Community platforms and forums</li>
        </ul>

        We are interested in any vulnerability that could lead to unauthorized access, data breaches, or service disruptions.
        We welcome any reports of potential security issues outside of this scope but we may not be able to address them immediately.

        <h2>How to Report a Security Issue</h2>
        <p>
          If you have discovered a security vulnerability, please help us keep our community
          safe by reporting it responsibly. When reporting, please include:
        </p>
        <ol>
          <li>A clear description of the vulnerability and its potential impact</li>
          <li>Detailed steps to reproduce the issue</li>
          <li>Information about the environment where you discovered the issue</li>
          <li>Any proof-of-concept code or evidence (if applicable)</li>
          <li>Any recommendations or patches you may have for resolving the issue</li>
        </ol>

        <div className="bg-card border-2 border-primary/20 rounded-lg p-4 sm:p-5 md:p-6 shadow-lg">
          <h3 className="text-lg sm:text-xl md:text-2xl font-medium mb-0 text-primary/90 font-mono flex items-center -mt-2">
            <span className="text-green-500 mr-2">~/</span>Contact Information
          </h3>
          <p className="text-sm sm:text-base md:text-lg leading-relaxed mb-0 -mt-2">
            <br></br>
            <a href="mailto:security@allthingslinux.org" className="text-blue-500 hover:text-blue-400 hover:underline font-medium">
              security@allthingslinux.org
            </a>
          </p>
          <p className="text-sm text-muted-foreground mb-3 mt-1 ml-4">
            PGP Key:{" "}
            <a
              href="https://allthingslinux.org/security@allthingslinux.org-pubkey.asc"
              className="text-blue-500 hover:text-blue-400 hover:underline font-medium"
            >
              allthingslinux.org/security@allthingslinux.org-pubkey.asc
            </a>
          </p>
          <p className="text-sm sm:text-base md:text-lg leading-relaxed text-muted-foreground mb-0">
            Alternatively, you may open a ticket in our Discord server at{" "}
            <a href="https://discord.gg/linux" className="text-blue-500 hover:text-blue-400 hover:underline font-medium">
              discord.gg/linux
            </a>{" "}
            and request assistance from our systems team. Please do not disclose vulnerability details in the ticket unless
            requested by an administrator or a member of the systems team.
          </p>
        </div>

        <h2>Responsible Disclosure Guidelines</h2>
        <p>We ask that you:</p>
        <ul>
          <li>Do not make use of any vulnerabilities without explicit permission to do so</li>
          <li>Do not access, copy, or destroy data in any capacity</li>
          <li>Do not disrupt our services or degrade the performance of our services</li>
          <li>Keep vulnerability details confidential until we have addressed the issue</li>
          <li>Give us reasonable time to investigate and resolve the issue</li>
        </ul>

        <h2>Safe Harbor</h2>
        <p>
          Any activities conducted in a manner consistent with this policy will be considered authorized
          conduct and we will not initiate legal action against you. If legal action is initiated by a
          third party against you in connection with activities conducted under this policy, we will ensure
          it is known that your actions were conducted in compliance with this policy.
        </p>

        <div className="bg-card border-2 border-primary/20 rounded-lg p-4 sm:p-5 md:p-6 shadow-lg">
          <h3 className="text-lg sm:text-xl md:text-2xl font-medium mb-0 text-primary/90 font-mono flex items-center -mt-2">
            <span className="text-yellow-500 mr-2">~/</span>Recognition
          </h3>
          <p className="text-muted-foreground mb-0 mt-1">
            We appreciate security researchers who help keep our community safe. If you would like to be acknowledged for your responsible disclosure, please let us know in your report and we'll be happy to recognize your contribution publicly.
          </p>
        </div>

        <p className="text-sm text-muted-foreground mb-0">
          Thank you for helping us keep All Things Linux secure for everyone.
        </p>
      </div>
    </div>
  );
}
