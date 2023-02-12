import React from "react";
import ReactDOM from "react-dom/client";
import CrdtWorkspace from "./CrdtWorkspace";
import "./index.css";
import { App, IAppWorkspace } from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <CrdtWorkspace<IAppWorkspace>
    createDefaultWorkspace={() => {
      return { blocks: [] };
    }}
    component={App}
  />
);
