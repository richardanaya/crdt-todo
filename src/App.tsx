import { useState } from "react";
import styled from "styled-components";

export interface IAppWorkspace {
  blocks: string[];
}

const TextInput = styled.input`
  height: 30px;
  font-size: 20px;
  border: none;
  border-bottom: 1px solid black;
  outline: none;
  border-radius: 3px;
  margin-right: 10px;
`;

const TodoItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 10px 0;
  cursor: pointer;

  &:hover {
    background-color: #fa2a55;
  }
`;

export function App(p: {
  workspace?: IAppWorkspace;
  workspaceUpdated: (
    workspace: IAppWorkspace,
    changeDescription: string
  ) => void;
}) {
  // input text state
  const [text, setText] = useState<string>("");

  return (
    <div>
      <h1>TODO</h1>
      {p.workspace &&
        p.workspace.blocks.map((b, i) => {
          return (
            <TodoItem
              key={i}
              onClick={() => {
                if (!p.workspace) return;
                p.workspace.blocks.splice(i, 1);
                p.workspaceUpdated(p.workspace, "remove block");
              }}
            >
              {b}
            </TodoItem>
          );
        })}
      <br />
      <br />
      <TextInput
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (p.workspace) {
              p.workspace.blocks.push(text);
              setText("");
              p.workspaceUpdated(p.workspace, "add block");
            }
          }
        }}
      />
      <button
        onClick={() => {
          if (p.workspace) {
            p.workspace.blocks.push(text);
            setText("");
            p.workspaceUpdated(p.workspace, "add block");
          }
        }}
      >
        new
      </button>
    </div>
  );
}
