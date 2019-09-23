import { render } from "react-dom";
import React from "react";
import App from "./components/App";
// import "antd/dist/antd.min.css";

const Reload = () => {
  // eslint-disable-next-line react/jsx-filename-extension
  render(<App />, document.getElementById("root"));
};
Reload();

console.log("test webpack");

if (module.hot) {
  module.hot.accept("./components/App", () => {
    console.log("Accepting the updated printMe module!");
    Reload();
  });
}
