import { Navigate, useParams, useSearchParams } from "react-router";

export default function LegacyTurkishRedirect() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const rest = params["*"]?.replace(/^\/+/, "") ?? "";
  const targetPath = rest ? `/${rest}` : "/";
  const nextParams = new URLSearchParams(searchParams);
  nextParams.delete("lang");
  const query = nextParams.toString();

  return <Navigate to={`${targetPath}${query ? `?${query}` : ""}`} replace />;
}
