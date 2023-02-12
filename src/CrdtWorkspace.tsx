import { useCallback, useEffect, useState } from "react";
import * as Automerge from "@automerge/automerge";
import "./Workspace.css";
import styled from "styled-components";
import { Popup } from "./Popup";

interface ICrdtWorkspaceProps<T> {
  createDefaultWorkspace: () => T;
  component: React.FC<{
    workspace?: T;
    workspaceUpdated: (workspace: T, changeDescription: string) => void;
  }>;
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
  top: 20px;
  left: 20px;
`;

const CircleButton = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: grey;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-right: 10px;
`;

const PopupButtonBar = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;

  button {
    margin-left: 10px;
  }
`;

export default function CrdtWorkspace<T>(props: ICrdtWorkspaceProps<T>) {
  const [workspaceDoc, setWorkspace] = useState<
    Automerge.Doc<{ workspace: T }> | undefined
  >(undefined);
  const [showLoadPopup, setShowLoadPopup] = useState(false);
  const [showMergePopup, setShowMergePopup] = useState(false);
  const [menuToggled, setMenuToggled] = useState(false);

  // create state for input file
  const [file, setFile] = useState<File | undefined>(undefined);

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

  const workspaceUpdated = useCallback(
    (workspace: T, changeDescription: string) => {
      if (workspaceDoc) {
        const newDoc = Automerge.change(
          workspaceDoc,
          changeDescription,
          (doc: any) => {
            doc.workspace = JSON.parse(JSON.stringify(workspace));
          }
        );
        const binary = Automerge.save(newDoc);
        const base64 = btoa(String.fromCharCode(...binary));
        localStorage.setItem("workspace", base64);
        setWorkspace(newDoc);
      }
    },
    [workspaceDoc]
  );

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
      <Popup
        title={"Load"}
        visible={showLoadPopup}
        onRequestClose={() => {
          setShowLoadPopup(false);
        }}
      >
        <p>Select a file you'd like to load</p>
        <input
          type="file"
          onChange={(e) => {
            if (e.target.files) {
              setFile(e.target.files[0]);
            }
          }}
        />
        <PopupButtonBar>
          <button
            onClick={() => {
              if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                  if (e.target?.result) {
                    const base64 = e.target.result.toString();
                    const binary = Uint8Array.from(atob(base64), (c) =>
                      c.charCodeAt(0)
                    );
                    const doc = Automerge.load<{ workspace: T }>(binary);
                    setWorkspace(doc);
                    setShowLoadPopup(false);
                    localStorage.setItem("workspace", base64);
                  }
                };
                reader.readAsText(file);
              }
            }}
          >
            Load
          </button>
          <button
            onClick={() => {
              setShowLoadPopup(false);
            }}
          >
            Cancel
          </button>
        </PopupButtonBar>
      </Popup>
      <Popup
        title={"Merge"}
        visible={showMergePopup}
        onRequestClose={() => {
          setShowMergePopup(false);
        }}
      >
        <p>Select a file you'd like to merge in with this file</p>
        <input
          type="file"
          onChange={(e) => {
            if (e.target.files) {
              setFile(e.target.files[0]);
            }
          }}
        />

        <PopupButtonBar>
          <button
            onClick={() => {
              if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                  if (e.target?.result) {
                    const base64 = e.target.result.toString();
                    const binary = Uint8Array.from(atob(base64), (c) =>
                      c.charCodeAt(0)
                    );
                    const doc = Automerge.load<{ workspace: T }>(binary);
                    const mergedDoc = Automerge.merge(workspaceDoc!, doc);
                    setWorkspace(mergedDoc);
                    setShowMergePopup(false);
                    const binary2 = Automerge.save(mergedDoc);
                    const base64New = btoa(String.fromCharCode(...binary2));
                    localStorage.setItem("workspace", base64New);
                  }
                };
                reader.readAsText(file);
              }
            }}
          >
            Merge
          </button>
          <button
            onClick={() => {
              setShowMergePopup(false);
            }}
          >
            Cancel
          </button>
        </PopupButtonBar>
      </Popup>
      <ButtonBar>
        <CircleButton
          onClick={() => {
            setMenuToggled(!menuToggled);
          }}
        />
        {menuToggled && (
          <>
            <Button onClick={newCallback}>New</Button>
            <Button onClick={saveCallback}>Save</Button>
            <Button
              onClick={() => {
                setShowLoadPopup(true);
              }}
            >
              Load
            </Button>
            <Button
              onClick={() => {
                setShowMergePopup(true);
              }}
            >
              Merge
            </Button>
          </>
        )}
      </ButtonBar>
      <props.component
        workspace={workspaceDoc?.workspace}
        workspaceUpdated={workspaceUpdated}
      />
    </div>
  );
}
