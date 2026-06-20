"use client";

import { useServerInsertedHTML } from 'next/navigation';

export default function ThemeScript() {
  useServerInsertedHTML(() => {
    return (
      <script
        id="theme-initializer"
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var savedTheme = localStorage.getItem('liq_theme');
                var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                var darkActive = savedTheme ? savedTheme === 'dark' : prefersDark;
                if (darkActive) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            })();
          `,
        }}
      />
    );
  });
  return null;
}
