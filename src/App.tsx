export interface IAppWorkspace {
    blocks: string[]
}

export function App(p:{workspace?:IAppWorkspace, workspaceUpdated:(workspace:IAppWorkspace, changeDescription:string)=>void}) {
  
  return (
    <div>
      <h1>Blocks</h1>
      <p>Blocks: {p.workspace?.blocks.length}</p>
      <button onClick={()=>{
        if(p.workspace){
          p.workspace.blocks.push("bah")
          p.workspaceUpdated(p.workspace, "add block")
        }
      }}>new</button>
    </div>
  )
}