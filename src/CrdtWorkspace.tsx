import { useCallback, useEffect, useState } from "react";
import * as Automerge from "@automerge/automerge";
import "./Workspace.css";
import styled from "styled-components";

interface ICrdtWorkspaceProps<T> {
  createDefaultWorkspace: () => T;
  component: React.FC<{ workspace?: T , workspaceUpdated:(workspace:T,changeDescription:string)=>void}>;
}

const Button = styled.button`
  background-color: grey; /* Grey */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
`;

const ButtonBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: fixed;
  top: 0;
  right: 0;
`;

export default function CrdtWorkspace<T>(props: ICrdtWorkspaceProps<T>) {
  const [workspaceDoc, setWorkspace] = useState<Automerge.Doc<{workspace:T}> | undefined>(undefined);
  const newCallback = useCallback(() => {
    let doc1 = Automerge.init<{ workspace: T }>();
    doc1 = Automerge.change(doc1, "new workspace", (doc: any) => {
      doc.workspace = props.createDefaultWorkspace();
    });
    const binary = Automerge.save(doc1);
    const base64 = btoa(String.fromCharCode(...binary));
    localStorage.setItem("workspace", base64);
    setWorkspace(doc1);
  }, []);

  const saveCallback = useCallback(() => {
    // download the workspace as a text file
    const binary = Automerge.save(workspaceDoc!);
    const base64 = btoa(String.fromCharCode(...binary));
    const element = document.createElement("a");
    const file = new Blob([base64], { type: "text/plain" });
    element.style.display = "none";
    element.href = URL.createObjectURL(file);
    element.download = "workspace.txt";
    document.body.appendChild(element); // Required for this to work in FireFox 
    element.click();
    // delete the element
    document.body.removeChild(element);
  }, [workspaceDoc]);

  const workspaceUpdated = useCallback((workspace:T, changeDescription:string) => {
    if(workspaceDoc){
      const newDoc = Automerge.change(workspaceDoc, changeDescription, (doc: any) => {
        doc.workspace = JSON.parse(JSON.stringify(workspace));
      });
      const binary = Automerge.save(newDoc);
      const base64 = btoa(String.fromCharCode(...binary));
      localStorage.setItem("workspace", base64);
      setWorkspace(newDoc);
    }
  }, [workspaceDoc]);

  useEffect(() => {
    const savedDoc = localStorage.getItem("workspace");
    if (savedDoc) {
      const binary = Uint8Array.from(atob(savedDoc), (c) => c.charCodeAt(0));
      const doc = Automerge.load<{ workspace: T }>(binary);
      setWorkspace(doc);
    } else {
      let doc1 = Automerge.init<{ workspace: T }>();
      doc1 = Automerge.change(doc1, "new workspace", (doc: any) => {
        doc.workspace = props.createDefaultWorkspace();
      });
      const binary = Automerge.save(doc1);
      const base64 = btoa(String.fromCharCode(...binary));
      localStorage.setItem("workspace", base64);
      setWorkspace(doc1);
    }
  }, []);
  return (
    <div className="App">
      <ButtonBar>
        <Button onClick={newCallback}>New</Button>
        <Button onClick={saveCallback}>Save</Button>
        <Button>Load</Button>
        <Button>Merge</Button>
      </ButtonBar>
      <props.component workspace={workspaceDoc?.workspace} workspaceUpdated={workspaceUpdated} />
    </div>
  );
}
