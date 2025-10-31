import { useState, useEffect/*, useRef*/ } from 'react'
import style from "./ClosureEffect.module.css"

const ClosureEffect: React.FC = () => {
    const [text, setText] = useState("Tady je Pepa");
    const [count, setCount] = useState(0);
    //const refText = useRef("");
    //refText.current = text;
    
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        setCount((p) => p + 1);
        setText("Tedy je Karel")
    }

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                setCount(count)
                setText(text)
                //setText(refText.current);
            }

            if (e.key === " ") {
                setCount((p) => p + 1)
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []); //text, count

    return (
        <div className={style.closureEffect}>
            <h2>Closure effect</h2>
            <p>{count}× {text}</p>
            <div>
                <div onClick={handleClick} className={style.btn}>Click me</div>
            </div>
            <div>
                <div className={style.btn}>Press Enter key</div>
            </div>
            <div>
                <div className={style.btn}>Press Space key</div>
            </div>
        </div>
    )
}

export default ClosureEffect
