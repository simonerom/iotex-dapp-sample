import React from "react";
import { Header } from "../../components/Header";
import { Layout } from "antd";
import "./index.scss";
import { ClientOnly } from "../../components/ClientOnly/clientOnly";

interface IComponentProps {
  children: Array<JSX.Element> | JSX.Element;
}

export const MainLayout = (props: IComponentProps) => {
  return (
    <ClientOnly>
      <div className="layout__main">
        <Header />
        <div className="layout__main__content bg-secondary pt-10 sm:pt-10 md:pt-12 lg:pt-16">{props.children}</div>
      </div>
    </ClientOnly>
  );
};
