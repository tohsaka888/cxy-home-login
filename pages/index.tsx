import { connectDB } from "@utils/server/connectDB";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { createSwaggerSpec } from "next-swagger-doc";
import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

function ApiDoc({ spec }: InferGetStaticPropsType<typeof getStaticProps>) {
  return <SwaggerUI spec={spec} />;
}

export const getStaticProps: GetStaticProps = async () => {
  connectDB()
  const spec: Record<string, any> = createSwaggerSpec({
    apiFolder: "pages/api",
    schemaFolders: ["models"],
    title: '登录模块',
    definition: {
      openapi: "3.0.0",
      info: {
        title: "程序员之家登录模块接口文档实例",
        version: "1.0",
      },
    },
  });

  return {
    props: {
      spec,
    },
  };
};

export default ApiDoc;
