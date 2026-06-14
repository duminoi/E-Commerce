import { ScrollReveal } from '../ui/ScrollReveal';

export function Footer() {
  return (
    <footer className="bg-on-surface w-full">
      {/* Main footer content */}
      <div className="max-w-max_width mx-auto px-gutter pt-[64px] pb-[48px]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-xl">
          {/* Brand column */}
          <ScrollReveal delay={0}>
            <div className="col-span-1">
              <div className="text-[22px] font-bold tracking-tighter text-surface-bright mb-md font-heading">
                LUXE
              </div>
              <p className="text-[14px] leading-[22px] text-outline-variant font-normal mb-lg max-w-[200px]">
                Elevating everyday essentials through premium design and uncompromising quality.
              </p>
              <div className="flex items-center gap-sm">
                {['instagram', 'facebook', 'twitter'].map((platform) => (
                  <a
                    key={platform}
                    href="#"
                    aria-label={platform}
                    className="w-9 h-9 rounded-full flex items-center justify-center border border-outline-variant/30 text-outline-variant hover:text-surface-bright hover:border-outline-variant hover:scale-110 transition-all duration-200"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {platform === 'instagram'
                        ? 'photo_camera'
                        : platform === 'facebook'
                          ? 'thumb_up'
                          : 'share'}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Links columns */}
          <div className="col-span-1 md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-xl">
            {/* Company */}
            <ScrollReveal delay={0.1}>
              <div>
                <h5 className="font-label-md text-label-md text-outline uppercase tracking-[0.12em] mb-md">
                  Company
                </h5>
                <ul className="space-y-[12px]">
                  {['About Us', 'Careers', 'Press', 'Contact'].map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-[14px] text-outline-variant hover:text-surface-bright hover:translate-x-1 inline-block transition-all duration-200 font-body"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>

            {/* Support */}
            <ScrollReveal delay={0.2}>
              <div>
                <h5 className="font-label-md text-label-md text-outline uppercase tracking-[0.12em] mb-md">
                  Support
                </h5>
                <ul className="space-y-[12px]">
                  {['Help Center', 'Shipping Policy', 'Returns', 'Track Order'].map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-[14px] text-outline-variant hover:text-surface-bright hover:translate-x-1 inline-block transition-all duration-200 font-body"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>

            {/* Legal */}
            <ScrollReveal delay={0.3}>
              <div>
                <h5 className="font-label-md text-label-md text-outline uppercase tracking-[0.12em] mb-md">
                  Legal
                </h5>
                <ul className="space-y-[12px]">
                  {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-[14px] text-outline-variant hover:text-surface-bright hover:translate-x-1 inline-block transition-all duration-200 font-body"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-on-surface-variant/20">
        <div className="max-w-max_width mx-auto px-gutter py-[24px] flex flex-col sm:flex-row items-center justify-between gap-sm">
          <p className="text-[13px] text-outline-variant font-body">
            &copy; {new Date().getFullYear()} LUXE Premium Commerce. All rights reserved.
          </p>

          {/* Payment icons */}
          <div className="flex items-center gap-sm">
            {['Visa', 'MC', 'PayPal', 'AMEX'].map((method) => (
              <span
                key={method}
                className="px-2 py-1 bg-on-surface-variant/20 rounded text-[11px] font-semibold text-outline-variant hover:bg-on-surface-variant/30 transition-colors duration-200"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
