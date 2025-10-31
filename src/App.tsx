import style from './App.module.css'
import { useState } from "react"
import Closure from "./pages/Closure"
import ClosureEffect from "./pages/ClosureEffect"
import AnimFbF from "./pages/AnimFbF";
import AnimCSSEvent from "./pages/AnimCSSEvent";

type PageType = "Closure" | "ClosureEffect" | "AnimFbF" | "AnimCSS";

function App() {
  const [page, setPage] = useState<PageType>("Closure");
  return (
    <>
      <div className={style.selPage}>
        <select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          setPage(e.currentTarget.selectedOptions[0].value as PageType || "Closure");
        }}>
          <option value={"Closure"}>Closure (raw)</option>
          <option value={"ClosureEffect"}>useEffect - closure</option>
          <option value={"AnimFbF"}>Frame-by-frame animation</option>
          <option value={"AnimCSS"}>CSS animation</option>
        </select>
      </div>
      <div>
        {
          page === "Closure" ? 
            <Closure />
          :
          page === "ClosureEffect" ?
            <ClosureEffect />
          :
          page === "AnimFbF" ?
            <AnimFbF />
          :
          page === "AnimCSS" ?
            <AnimCSSEvent />
          :
            <div>empty</div>
        }
      </div>
    </>
  )
}

export default App
