type JsonLdProps = {

  data: object;
};

export function JsonLd({ data }: Readonly<JsonLdProps>) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, String.raw`\u003c`),
      }}
    />
  );
}
