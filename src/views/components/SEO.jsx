/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { Helmet } from "react-helmet-async";

const SeoHelmet = ({ title, description, keywords, url, image }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {/* <meta property="og:image" content={"../../assets/logo.png"} /> */}
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {/* <meta name="twitter:image" content={"../../assets/logo.png"} /> */}
    </Helmet>
  );
};

export default SeoHelmet;
