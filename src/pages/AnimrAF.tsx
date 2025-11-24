import React, { useState } from 'react';
import KonvaMiniGame from '../components/KonvaMiniGame';

const AnimrAFKonva: React.FC = () => {
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    const handleGameOver = () => {
        setGameOver(true);
    }
    const handleScore = (newScore: number) => {
        setScore(newScore);
    }
    return (
        <div>
            <div style={{ border: '1px solid black', userSelect: 'none' }}>
                <KonvaMiniGame callbackGameOver={handleGameOver} callbackScore={handleScore} />
            </div>
            <div>Skóre: {score}</div>
            {gameOver && <div style={{ color: 'red' }}>Game Over!</div>}
        </div>
    );
}

export default AnimrAFKonva;
