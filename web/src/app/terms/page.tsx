import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions | Freenoo',
  description: 'Terms and Conditions for Freenoo — Free Online PDF Tools',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <header style={{ background: 'rgba(28,28,28,0.92)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/"><img src="/logo.png" alt="Freenoo" style={{ height: '40px', width: 'auto' }} /></Link>
          <Link href="/" className="text-sm" style={{ color: 'var(--text-muted)' }}>← Back to Home</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>Terms and Conditions</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Last updated: March 19, 2026</p>
        </div>

        <div style={{ lineHeight: '1.8' }}>
          <p className="mb-6 text-sm" style={{ color: 'var(--text-muted)' }}>
            Please read these terms and conditions carefully before using Our Service.
          </p>

          <S title="Interpretation and Definitions">
            <SS title="Interpretation">
              <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>The words whose initial letters are capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>
            </SS>
            <SS title="Definitions">
              <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>For the purposes of these Terms and Conditions:</p>
              <BL items={[
                '<strong style="color:#fff">Affiliate</strong> means an entity that controls, is controlled by, or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.',
                '<strong style="color:#fff">Country</strong> refers to: Uttarakhand, India',
                '<strong style="color:#fff">Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in these Terms and Conditions) refers to freenoo.',
                '<strong style="color:#fff">Device</strong> means any device that can access the Service such as a computer, a cell phone or a digital tablet.',
                '<strong style="color:#fff">Service</strong> refers to the Website.',
                '<strong style="color:#fff">Terms and Conditions</strong> (also referred to as "Terms") means these Terms and Conditions which govern Your access to and use of the Service.',
                '<strong style="color:#fff">Third-Party Social Media Service</strong> means any services or content provided by a third party that is displayed, included, or linked to through the Service.',
                '<strong style="color:#fff">Website</strong> refers to freenoo, accessible from https://www.freenoo.com/',
                '<strong style="color:#fff">You</strong> means the individual accessing or using the Service.',
              ]} />
            </SS>
          </S>

          <S title="Acknowledgment">
            <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>These are the Terms and Conditions governing the use of this Service and the agreement between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.</p>
            <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.</p>
            <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>By accessing or using the Service You agree to be bound by these Terms and Conditions. If You disagree with any part of these Terms and Conditions then You may not access the Service.</p>
            <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>You represent that you are over the age of 18. The Company does not permit those under 18 to use the Service.</p>
          </S>

          <S title="Links to Other Websites">
            <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>Our Service may contain links to third-party websites or services that are not owned or controlled by the Company. The Company has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party websites or services.</p>
            <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>We strongly advise You to read the terms and conditions and privacy policies of any third-party websites or services that You visit.</p>
          </S>

          <S title="Links from a Third-Party Social Media Service">
            <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>The Service may display, include, make available, or link to content or services provided by a Third-Party Social Media Service. A Third-Party Social Media Service is not owned or controlled by the Company, and the Company does not endorse or assume responsibility for any Third-Party Social Media Service.</p>
          </S>

          <S title="Termination">
            <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>We may terminate or suspend Your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if You breach these Terms and Conditions. Upon termination, Your right to use the Service will cease immediately.</p>
          </S>

          <S title="Limitation of Liability">
            <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>Notwithstanding any damages that You might incur, the entire liability of the Company and any of its suppliers under any provision of these Terms and Your exclusive remedy for all of the foregoing shall be limited to the amount actually paid by You through the Service or 100 USD if You haven't purchased anything through the Service.</p>
            <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>To the maximum extent permitted by applicable law, in no event shall the Company or its suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever (including, but not limited to, damages for loss of profits, loss of data or other information, for business interruption, for personal injury, loss of privacy arising out of or in any way related to the use of or inability to use the Service).</p>
          </S>

          <S title='"AS IS" and "AS AVAILABLE" Disclaimer'>
            <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>The Service is provided to You "AS IS" and "AS AVAILABLE" and with all faults and defects without warranty of any kind. To the maximum extent permitted under applicable law, the Company expressly disclaims all warranties, whether express, implied, statutory or otherwise, with respect to the Service.</p>
          </S>

          <S title="Governing Law">
            <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>The laws of the Country, excluding its conflicts of law rules, shall govern these Terms and Your use of the Service. Your use of the Application may also be subject to other local, state, national, or international laws.</p>
          </S>

          <S title="Disputes Resolution">
            <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>If You have any concern or dispute about the Service, You agree to first try to resolve the dispute informally by contacting the Company.</p>
          </S>

          <S title="For European Union (EU) Users">
            <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>If You are a European Union consumer, you will benefit from any mandatory provisions of the law of the country in which You are resident.</p>
          </S>

          <S title="United States Legal Compliance">
            <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>You represent and warrant that (i) You are not located in a country that is subject to the United States government embargo, or that has been designated by the United States government as a "terrorist supporting" country, and (ii) You are not listed on any United States government list of prohibited or restricted parties.</p>
          </S>

          <S title="Severability and Waiver">
            <SS title="Severability">
              <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law and the remaining provisions will continue in full force and effect.</p>
            </SS>
            <SS title="Waiver">
              <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>Except as provided herein, the failure to exercise a right or to require performance of an obligation under these Terms shall not affect a party's ability to exercise such right or require such performance at any time thereafter nor shall the waiver of a breach constitute a waiver of any subsequent breach.</p>
            </SS>
          </S>

          <S title="Translation Interpretation">
            <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>These Terms and Conditions may have been translated if We have made them available to You on our Service. You agree that the original English text shall prevail in the case of a dispute.</p>
          </S>

          <S title="Changes to These Terms and Conditions">
            <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. If a revision is material We will make reasonable efforts to provide at least 30 days' notice prior to any new terms taking effect.</p>
            <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>By continuing to access or use Our Service after those revisions become effective, You agree to be bound by the revised terms. If You do not agree to the new terms, in whole or in part, please stop using the Service.</p>
          </S>

          <S title="Contact Us">
            <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>If you have any questions about these Terms and Conditions, You can contact us:</p>
            <BL items={['By email: <a href="mailto:freenoo@zohomail.in" style="color:#eb1000">freenoo@zohomail.in</a>']} />
          </S>
        </div>
      </main>

      <footer style={{ borderTop: '1px solid var(--border)', marginTop: '48px' }}>
        <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/"><img src="/logo.png" alt="Freenoo" style={{ height: '32px', width: 'auto' }} /></Link>
          <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
            <Link href="/privacy" style={{ color: 'var(--text-muted)' }}>Privacy Policy</Link>
            <Link href="/terms" style={{ color: 'var(--accent)' }}>Terms & Conditions</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function S({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text)', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>{title}</h2>
      {children}
    </div>
  );
}

function SS({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4 mb-2">
      <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--text)' }}>{title}</h3>
      {children}
    </div>
  );
}

function BL({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 mb-4 space-y-2 pl-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
          <span style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }}>•</span>
          <span dangerouslySetInnerHTML={{ __html: item }} />
        </li>
      ))}
    </ul>
  );
}
