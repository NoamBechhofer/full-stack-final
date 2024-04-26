//4. Create a Footer.jsx component that renders a <footer> element
//to show a copyright message in a <p> with a dynamically updated year

import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer>
      <p>
        Copyleft <span className="copy-left">ⓒ</span> {currentYear} Noam
        Bechhofer
      </p>
    </footer>
  );
}
