"use client";

import React, { useEffect, useState } from "react";
import { FaFacebookF, FaYoutube, FaInstagram, FaXTwitter, FaLinkedinIn } from "react-icons/fa6";
import type { PublicSiteData } from "@/types/public";

export default function Footer({ site }: { site: PublicSiteData }) {
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const social = site.social_media ?? {};

  useEffect(() => {
    const onScroll = () => setShowScrollBtn(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const quickLinks = [
    ["বিজ্ঞাপন", "/advertise"],
    ["গোপনীয়তার নীতি", "/privacy-policy"],
    ["যোগাযোগ", "/contact"],
    ["আমাদের সম্পর্কে", "/about"],
  ] as const;

  const socialLinks = [
    [social.facebook || "https://www.facebook.com/24ghontatv", "Facebook", <FaFacebookF key="facebook" />],
    [social.twitter || "https://x.com/24ghontatv", "X", <FaXTwitter key="x" />],
    [social.instagram || "https://www.instagram.com/24ghontatv/", "Instagram", <FaInstagram key="instagram" />],
    [social.youtube || "https://www.youtube.com/@24ghontatv", "YouTube", <FaYoutube key="youtube" />],
    ["https://www.linkedin.com/", "LinkedIn", <FaLinkedinIn key="linkedin" />],
  ] as const;

  return (
    <footer className="site-footer">
      {showScrollBtn && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="উপরে যান"
          title="উপরে যান"
          className="site-footer__scroll-top"
        >
          ▲
        </button>
      )}

      <div className="site-footer__container">
        <div className="site-footer__grid">
          <section className="site-footer__section site-footer__editors" aria-label="সম্পাদকীয় তথ্য">
            <a href="/" className="site-footer__logo-link" aria-label="24Ghontatv.com">
              <img
                src="https://api.24ghontatv.com/images/logos/main_logo.jpg"
                alt="24Ghontatv.com"
                className="site-footer__logo"
              />
            </a>

            <dl className="site-footer__roles">
              <div className="site-footer__role">
                <dt>সম্পাদক ও প্রকাশক</dt>
                <dd>আরিফ সোহেল</dd>
              </div>
              <div className="site-footer__role">
                <dt>নির্বাহী সম্পাদক</dt>
                <dd>এস এম আবুল হোসেন</dd>
              </div>
              <div className="site-footer__role">
                <dt>উপ-সম্পাদক</dt>
                <dd>সালাউদ্দিন স্বপন</dd>
              </div>
            </dl>
          </section>

          <section className="site-footer__section site-footer__newsroom" aria-labelledby="site-footer-newsroom-heading">
            <h2 id="site-footer-newsroom-heading">বার্তা বিভাগ ও বাণিজ্যিক যোগাযোগ</h2>

            <dl className="site-footer__roles site-footer__contact-roles">
              <div className="site-footer__role">
                <dt>নির্বাহী প্রধান [আইটি]</dt>
                <dd>এম. ডি. আইয়ানুর রহমান</dd>
                <dd className="site-footer__role-detail">
                  Senior Developer ·{" "}
                  <a
                    href="https://www.upwork.com/freelancers/~01cf0fb3dd5bb153ff?mp_source=share"
                    target="_blank"
                    rel="noopener"
                  >
                    Upwork প্রোফাইল
                  </a>
                </dd>
              </div>
              <div className="site-footer__role">
                <dt>আবাসিক সম্পাদক [যুক্তরাষ্ট্র]</dt>
                <dd>দর্পণ কবীর</dd>
              </div>
            </dl>

            <address className="site-footer__address">
              ২৪ঘণ্টা টিভি, মানিকগঞ্জ হাউজিং (তৃতীয় তলা), ২১৬, শহীদ সৈয়দ নজরুল ইসলাম সরণি, পুরানা পল্টন, ঢাকা-১০০০
            </address>
          </section>

          <section className="site-footer__section site-footer__links-social" aria-label="লিংক ও সামাজিক যোগাযোগ">
            <nav aria-label="ফুটার লিংক" className="site-footer__nav">
              {quickLinks.map(([label, href]) => (
                <a key={label} href={href} className="site-footer__nav-link">
                  {label}
                </a>
              ))}
            </nav>

            <div className="site-footer__socials">
              {socialLinks.map(([href, label, icon]) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener"
                  aria-label={label}
                  title={label}
                  className="site-footer__social-link"
                >
                  {icon}
                </a>
              ))}
            </div>
          </section>
        </div>

        <div className="site-footer__copyright">
          © 2026 | All rights reserved by 24Ghontatv.com
        </div>
      </div>

      <style jsx>{`
        .site-footer {
          position: relative;
          width: 100%;
          margin-top: 2.5rem;
          border-top: 4px solid #c40000;
          background: #eceded;
          color: #1f2326;
          font-family: inherit;
        }

        .site-footer * {
          box-sizing: border-box;
        }

        .site-footer__container {
          width: 100%;
          max-width: 1248px;
          margin: 0 auto;
          padding: 32px 24px 0;
        }

        .site-footer__grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.25fr) minmax(0, 0.8fr);
          gap: 48px;
        }

        .site-footer__section {
          min-width: 0;
          padding-bottom: 28px;
        }

        .site-footer__editors,
        .site-footer__newsroom {
          border-right: 1px solid #cfd2d4;
          padding-right: 32px;
        }

        .site-footer__logo-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 64px;
          margin-bottom: 20px;
        }

        .site-footer__logo {
          display: block;
          width: auto;
          max-width: 100%;
          height: 64px;
          object-fit: contain;
        }

        .site-footer__roles {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin: 0;
        }

        .site-footer__role {
          margin: 0;
        }

        .site-footer__role dt {
          margin: 0 0 2px;
          color: #c40000;
          font-size: 14px;
          font-weight: 400;
          line-height: 1.5;
        }

        .site-footer__role dd {
          margin: 0;
          color: #1f2326;
          font-size: 17px;
          font-weight: 700;
          line-height: 1.5;
          overflow-wrap: anywhere;
        }

        .site-footer__role .site-footer__role-detail {
          margin-top: 3px;
          color: #5a6066;
          font-size: 13px;
          font-weight: 400;
          line-height: 1.7;
        }

        .site-footer__role-detail a {
          color: inherit;
          text-decoration: none;
        }

        .site-footer__role-detail a:hover {
          color: #c40000;
        }

        .site-footer__newsroom h2 {
          margin: 0 0 18px;
          color: #c40000;
          font-size: 18px;
          font-weight: 700;
          line-height: 1.5;
        }

        .site-footer__contact-roles {
          gap: 16px;
        }

        .site-footer__address {
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid #cfd2d4;
          color: #5a6066;
          font-size: 15px;
          font-style: normal;
          line-height: 1.9;
          overflow-wrap: anywhere;
        }

        .site-footer__nav {
          display: flex;
          flex-direction: column;
          margin: 0 0 24px;
        }

        .site-footer__nav-link {
          display: block;
          padding: 8px 0;
          border-bottom: 1px solid #cfd2d4;
          color: #1f2326;
          font-size: 16px;
          line-height: 1.5;
          text-decoration: none;
          transition: color 160ms ease;
        }

        .site-footer__nav-link:hover {
          color: #c40000;
        }

        .site-footer__socials {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px;
        }

        .site-footer__social-link {
          display: inline-flex;
          width: 44px;
          height: 44px;
          flex: 0 0 44px;
          align-items: center;
          justify-content: center;
          border: 1.5px solid #1f2326;
          border-radius: 6px;
          color: #1f2326;
          font-size: 20px;
          text-decoration: none;
          transition: background-color 160ms ease, border-color 160ms ease, color 160ms ease;
        }

        .site-footer__social-link:hover {
          border-color: #c40000;
          background: #c40000;
          color: #ffffff;
        }

        .site-footer__social-link:focus-visible,
        .site-footer__nav-link:focus-visible,
        .site-footer__role-detail a:focus-visible,
        .site-footer__logo-link:focus-visible,
        .site-footer__scroll-top:focus-visible {
          outline: 2px solid #c40000;
          outline-offset: 3px;
        }

        .site-footer__copyright {
          border-top: 1px solid #cfd2d4;
          padding: 16px 0 18px;
          color: #5a6066;
          font-family: Arial, sans-serif;
          font-size: 12px;
          line-height: 1.6;
          text-align: center;
        }

        .site-footer__scroll-top {
          position: absolute;
          top: -28px;
          right: 24px;
          z-index: 20;
          display: flex;
          width: 44px;
          height: 44px;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 50%;
          background: #c40000;
          color: #ffffff;
          cursor: pointer;
          box-shadow: 0 4px 12px rgb(0 0 0 / 14%);
          transition: background-color 160ms ease;
        }

        .site-footer__scroll-top:hover {
          background: #a80000;
        }

        @media (max-width: 899px) {
          .site-footer__grid {
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
            gap: 32px;
          }

          .site-footer__editors {
            border-right: 1px solid #cfd2d4;
            padding-right: 24px;
          }

          .site-footer__newsroom {
            border-right: 0;
            padding-right: 0;
          }

          .site-footer__links-social {
            grid-column: 1 / -1;
            border-top: 1px solid #cfd2d4;
            padding-top: 24px;
          }

          .site-footer__nav {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            column-gap: 32px;
          }
        }

        @media (max-width: 599px) {
          .site-footer__container {
            padding: 24px 24px 0;
          }

          .site-footer__grid {
            grid-template-columns: minmax(0, 1fr);
            gap: 0;
          }

          .site-footer__section,
          .site-footer__editors,
          .site-footer__newsroom,
          .site-footer__links-social {
            border-right: 0;
            padding: 0 0 24px;
          }

          .site-footer__section + .site-footer__section {
            border-top: 1px solid #cfd2d4;
            padding-top: 24px;
          }

          .site-footer__links-social {
            grid-column: auto;
          }

          .site-footer__nav {
            grid-template-columns: minmax(0, 1fr);
            margin-bottom: 20px;
          }

          .site-footer__socials {
            gap: 10px;
          }

          .site-footer__copyright {
            padding-bottom: 16px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .site-footer__nav-link,
          .site-footer__social-link,
          .site-footer__scroll-top {
            transition: none;
          }
        }
      `}</style>
    </footer>
  );
}
