import style from './App.module.css'
import { useState } from "react"
import Closure from "./pages/Closure"
import ClosureEffect from "./pages/ClosureEffect"
import AnimFbF from "./pages/AnimFbF";
import AnimCSSEvent from "./pages/AnimCSSEvent";
import AnimrAFKonva from './pages/AnimrAF';
import AnimrAFCanvas from './pages/AnimrAFCanvas';

type PageType = "Closure" | "ClosureEffect" | "AnimFbF" | "AnimCSS" | "AnimrAFKonva" | "AnimrAFCanvas";

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
          <option value={"AnimFbF"}>rAF Frame-by-frame animation</option>
          <option value={"AnimrAFKonva"}>rAF Konva</option>
          <option value={"AnimrAFCanvas"}>rAF Canvas</option>
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
          page === "AnimrAFKonva" ?
            <AnimrAFKonva />
          :
          page === "AnimrAFCanvas" ?
            <AnimrAFCanvas />
          :
            <div>empty</div>
        }
      </div>
    </>
  )
}

export default App
