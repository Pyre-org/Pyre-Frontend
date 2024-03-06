import { useParams } from "react-router-dom";

function OAuthPage() {
  const { authority } = useParams<{ authority: string }>();
  console.log(authority);
  return <div>OAuthPage</div>;
}

export default OAuthPage;
