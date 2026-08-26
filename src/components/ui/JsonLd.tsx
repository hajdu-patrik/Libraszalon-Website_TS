type JsonLdProps = {
  /** A schema.org graph, built by one of the functions in src/lib/jsonld.ts. */
  data: object;
};

/**
 * One schema.org graph, as a script tag.
 *
 * Eight of these were written out by hand, each repeating the type attribute
 * and its own dangerouslySetInnerHTML. Gathering them here means the escaping
 * below is applied to every graph on the site rather than to whichever one
 * somebody remembered.
 *
 * And it does need applying. JSON.stringify escapes for JSON, not for HTML, so
 * a "</script>" anywhere in the data would close this element early and put the
 * rest of the graph into the document as markup. Most of what goes in here is
 * our own copy, but the business graph carries review text pulled from the
 * Google Business Profile API, which is somebody else's writing arriving over
 * the network. Escaping the "<" as \u003c is the standard answer: it is the
 * same string to any JSON parser, and it cannot start a tag.
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
