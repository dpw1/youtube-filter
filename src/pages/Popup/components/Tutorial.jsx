import React from 'react';
import './Tutorial.scss';
export default function Tutorial() {
  return (
    <div className="tutorial">
      <h2 className="title is-5 has-text-white tutorial-title">
        15 Seconds Tutorial:
      </h2>
      <iframe
        style={{ maxWidth: '100%', width: '100%' }}
        src="https://www.youtube.com/embed/R_13op9cZ08?autoplay=0&showinfo=0&controls=0"
        frameborder="0"
      ></iframe>
      <video src=""></video>
    </div>
  );
}
