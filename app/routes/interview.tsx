import type { MetaFunction } from "react-router";
import { useParams } from "react-router";
import { InterviewChat } from "../interview/InterviewChat";

export const meta: MetaFunction = () => [
  { title: "Interview | nüll." },
  { name: "robots", content: "noindex, nofollow" },
  { name: "theme-color", content: "#ffffff" },
];

export default function InterviewRoute() {
  const { slug } = useParams();
  return <InterviewChat key={slug} slug={slug ?? ""} />;
}
