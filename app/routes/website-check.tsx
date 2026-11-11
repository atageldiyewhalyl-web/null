import WebsiteCheckV2 from "../components/v2/WebsiteCheckV2";

// /website-check: free website check (lead magnet).
export function meta() {
  const title = "Kostenloser Website-Check: Wie viele Anfragen verliert deine Website? | nüll.";
  const description = "Gib deine Website ein und bekomm in etwa einer Minute eine Note von 0 bis 100 und die drei wichtigsten Baustellen per E-Mail. Kostenlos.";
  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { tagName: "link", rel: "canonical", href: "https://nuell-agentur.com/website-check" },
  ];
}

export default function WebsiteCheckRoute() {
  return <WebsiteCheckV2 />;
}
