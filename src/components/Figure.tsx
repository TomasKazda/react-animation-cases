import style from "./Figure.module.css"

type FigureProps = {
    field: number,
    callbackEnd: () => void;
}

const Figure: React.FC<FigureProps> = ({ field, callbackEnd }) => {
    const handlePosition = (field: number) => {
        // abraka dabra new position
        if (field > 0)
            return { x: 200, y: 100 };
        else
            return { x: -100, y: -50 };
    }
    const position = handlePosition(field);

    const handleTransitionEnd = (event: React.TransitionEvent) => {
        if (event.propertyName === 'transform') {
            callbackEnd();
        }
    }

    return (
        <div
            className={style.figure}
            style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
            onTransitionEnd={handleTransitionEnd}
        >🔴</div>
    );
}

export default Figure;