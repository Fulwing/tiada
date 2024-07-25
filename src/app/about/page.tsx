// pages/about.js
import React from 'react';
import Head from 'next/head';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-2">
      <Head>
        <title>About Us</title>
        <meta name="description" content="Learn more about our company and team." />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">About Us</h1>
        <p className="mt-3 text-2xl">
          Welcome to our website! We are a company dedicated to providing the best services to our customers.
        </p>
        <p className="mt-3 text-2xl">
          Our team is composed of experienced professionals who are passionate about what they do.
        </p>
      </main>
    </div>
  );
};

export default About;
