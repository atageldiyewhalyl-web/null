import ReferenzenV2 from "../components/v2/ReferenzenV2";

// /referenzen: the Fälle page, every client. Data: components/v2/caseList.ts.
export function meta() {
  return [
    { title: "Fälle: Betriebe, die jetzt gefunden werden | nüll." },
    { name: "description", content: "Referenzen von nüll.: Handwerksbetriebe, Praxen, Kanzleien und Läden aus der Region, mit echten Zahlen aus unseren Monatsberichten." },
  ];
}

export default function ReferenzenRoute() {
  return <ReferenzenV2 />;
}
