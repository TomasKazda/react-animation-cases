import { useState } from "react";
import style from "./Closure.module.css"

function makeCounter(init: number = 0) {
  let no1 = init;  // closure effect
  
  return () => {
    no1 += 1;
    return no1;
  }
}
const counter1 = makeCounter(0);
const counter2 = makeCounter(100);

const Closure: React.FC = () => {
    const [value2, setValue2] = useState(counter2());
    let value1 = counter1();

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        value1 = counter1();
        setValue2(counter2());
    }

    return (
        <div className={style.closureEffect}>
            <h2>Closure - unsecure example</h2>
            <p>value 1: {value1} | value 2: {value2}</p>
            <div>
                <div onClick={handleClick} className={style.btn}>Click me</div>
            </div>
        </div>
    )
}

export default Closure
