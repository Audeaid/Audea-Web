'use client';

const FooterText = () => {
  return (
    <p className="text-xs text-justify select-none">
      By clicking &quot;Continue with Apple / Google / Microsoft / Email&quot;
      above, you acknowledge that you have read and understood, and agree to
      Audea&apos;s{' '}
      <a
        href="https://audeaid.notion.site/Terms-of-Service-d0dcba2ccba54a9bb60b6c1dc0255c4f"
        className="text-primaryDark hover:text-errorDark"
        target="_blank"
      >
        Terms of Service
      </a>{' '}
      and{' '}
      <a
        href="https://audeaid.notion.site/Privacy-Policy-f865747ed0e142fa92680408d91fe136"
        className="text-primaryDark hover:text-errorDark"
        target="_blank"
      >
        Privacy Policy
      </a>
      .
    </p>
  );
};

export default FooterText;
