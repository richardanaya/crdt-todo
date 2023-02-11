import React from 'react'
import ReactDOM from 'react-dom/client'
import CrdtWorkspace from './CrdtWorkspace'
import './index.css'
import { App, IAppWorkspace } from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <CrdtWorkspace<IAppWorkspace> createDefaultWorkspace={()=>{
      return {blocks:["bah"]}
    }} component={App}/>
  </React.StrictMode>,
)
