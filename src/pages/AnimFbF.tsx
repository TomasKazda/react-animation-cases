import { useLayoutEffect, useRef } from 'react'
import style from "./AnimFbF.module.css"
/*
    Window: requestAnimationFrame()
    Rozdíl oproti setTimeout: 
        - Synchronizace s refresh rate (typicky 60 FPS) = plynulejší
        - Automatická pauza v neaktivních tabech - šetří CPU a baterii​
        - Optimalizované pro vizuální updates
    useEffect je asnychronní po vykreslení
    useLayoutEffect je synchtonní před vykreslením

    requestAnimationFrame s useLayoutEffect má smysl pouze pro:
        - Komplexní physics-based animace (např. hod kostkou s gravitací)
        - Canvas/WebGL rendering (ne DOM elementy)
        - Interaktivní animace s real-time kontrolou (drag & drop s collision detection)
*/

const AnimFbF: React.FC = () => {
    const animationIdRef = useRef<number>(0);
    const element = useRef<HTMLDivElement | null>(null);
    let start = 0;

    useLayoutEffect(() => {
        const animate = (timestamp: number) => {
            if (start === 0) start = timestamp;

            if (element.current) {
                element.current.style.transform = `translateX(${(timestamp-start) / 10}px)`;
            }
            if ((timestamp-start)/10 < 300)
                animationIdRef.current = requestAnimationFrame(animate);
        };
        animationIdRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current);
            }
        };
    }, []);

    return (
        <div className={style.animFbF}>
            <h2>Frame-by-frame animation</h2>
            <div className={style.movingBlock} ref={element}>&nbsp;</div>
        </div>
    )
}

export default AnimFbF;
