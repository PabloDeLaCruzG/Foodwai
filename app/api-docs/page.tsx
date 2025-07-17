import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";
import swaggerSpec from "../lib/swagger";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false }) as React.ComponentType<{ spec: object }>;

export default function ApiDocsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      <SwaggerUI spec={swaggerSpec} />
    </div>
  );
}
