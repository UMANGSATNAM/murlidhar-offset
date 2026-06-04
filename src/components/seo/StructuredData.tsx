const siteUrl = "https://murlidharoffset.com";

function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/#business`,
    name: "Murlidhar Offset",
    description:
      "Gujarat's premier offset printing press offering premium business cards, wedding cards, brochures, flyers, stickers, flex banners, and custom printing solutions.",
    url: siteUrl,
    telephone: "+91-98765-43210",
    email: "info@murlidharoffset.com",
    image: `${siteUrl}/products/hero-printing-press.png`,
    logo: `${siteUrl}/logo.svg`,
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, Credit Card, UPI, Razorpay, COD",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Plot No. 45, GIDC Industrial Estate",
      addressLocality: "Rajkot",
      addressRegion: "Gujarat",
      postalCode: "360002",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 22.3039,
      longitude: 70.8022,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:00",
        closes: "19:00",
      },
    ],
    sameAs: [
      "https://www.instagram.com/murlidharoffset",
      "https://www.facebook.com/murlidharoffset",
      "https://twitter.com/murlidharoffset",
      "https://www.linkedin.com/company/murlidharoffset",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "250",
      bestRating: "5",
      worstRating: "1",
    },
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    foundingDate: "2009",
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      minValue: 25,
      maxValue: 50,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "Murlidhar Offset",
    legalName: "Murlidhar Offset Printers Pvt. Ltd.",
    url: siteUrl,
    logo: `${siteUrl}/logo.svg`,
    description:
      "Leading offset printing press in Gujarat, India providing premium quality printing solutions since 2009.",
    foundingDate: "2009",
    founder: {
      "@type": "Person",
      name: "Murlidhar Patel",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Plot No. 45, GIDC Industrial Estate",
      addressLocality: "Rajkot",
      addressRegion: "Gujarat",
      postalCode: "360002",
      addressCountry: "IN",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+91-98765-43210",
        contactType: "customer service",
        email: "info@murlidharoffset.com",
        availableLanguage: ["English", "Hindi", "Gujarati"],
        areaServed: "IN",
      },
      {
        "@type": "ContactPoint",
        telephone: "+91-98765-43211",
        contactType: "sales",
        email: "sales@murlidharoffset.com",
        availableLanguage: ["English", "Hindi", "Gujarati"],
      },
    ],
    sameAs: [
      "https://www.instagram.com/murlidharoffset",
      "https://www.facebook.com/murlidharoffset",
      "https://twitter.com/murlidharoffset",
      "https://www.linkedin.com/company/murlidharoffset",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function ProductSchema() {
  const products = [
    { name: "Business Cards", slug: "business-cards", price: "299" },
    { name: "Wedding Cards", slug: "wedding-cards", price: "1499" },
    { name: "Brochures", slug: "brochures", price: "499" },
    { name: "Flyers", slug: "flyers", price: "399" },
    { name: "Stickers", slug: "stickers", price: "199" },
    { name: "Flex Banners", slug: "flex-banners", price: "599" },
    { name: "Letter Pads", slug: "letter-pads", price: "349" },
    { name: "Bill Books", slug: "bill-books", price: "399" },
    { name: "Posters", slug: "posters", price: "299" },
    { name: "Packaging", slug: "packaging", price: "999" },
    { name: "Xerox & Lamination", slug: "xerox-lamination", price: "49" },
    { name: "Custom Printing", slug: "custom-printing", price: "499" },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${siteUrl}/#products`,
    name: "Murlidhar Offset Printing Products",
    description: "Complete range of offset printing products and services",
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.name,
        description: `Premium quality ${product.name.toLowerCase()} from Murlidhar Offset. Professional offset printing with fast turnaround.`,
        url: `${siteUrl}/products/${product.slug}`,
        image: `${siteUrl}/products/${product.slug}.png`,
        brand: {
          "@type": "Brand",
          name: "Murlidhar Offset",
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "INR",
          price: product.price,
          availability: "https://schema.org/InStock",
          seller: {
            "@type": "Organization",
            name: "Murlidhar Offset",
          },
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.7",
          reviewCount: "50",
          bestRating: "5",
          worstRating: "1",
        },
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function BreadcrumbListSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${siteUrl}/#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: `${siteUrl}/products`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "About Us",
        item: `${siteUrl}/about`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Contact",
        item: `${siteUrl}/contact`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: "Murlidhar Offset",
    url: siteUrl,
    description:
      "Premium offset printing solutions in Gujarat, India. Business cards, wedding cards, brochures, flyers, and more.",
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/products?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    inLanguage: "en-IN",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function StructuredData() {
  return (
    <>
      <LocalBusinessSchema />
      <OrganizationSchema />
      <ProductSchema />
      <BreadcrumbListSchema />
      <WebSiteSchema />
    </>
  );
}
