import React, { useRef, useState, useLayoutEffect } from 'react';
import { Stage, Layer, Circle, Image } from 'react-konva';
import useImage from 'use-image';
import basketImg from '../assets/basket.svg';

const WIDTH = 400;
const HEIGHT = 600;
const PLAYER_WIDTH = 80;
const PLAYER_HEIGHT = 51;
const PROJECTILE_WIDTH = 20;
const PROJECTILE_HEIGHT = 20;
const PROJECTILE_SPEED = 3;

type Projectile = { x: number; y: number };

const URLImage: React.FC<{ src: string } & Omit<React.ComponentProps<typeof Image>, 'image'>> = ({ src, ...rest }) => {
    const [img] = useImage(src, 'anonymous');
    return <Image image={img} {...rest} />;
};

const isColliding = (
    aX: number, aY: number, aW: number, aH: number,
    bX: number, bY: number, bW: number, bH: number
) => {
    return (
        aX < bX + bW &&
        aX + aW > bX &&
        aY < bY + bH &&
        aH + aY > bY
    );
}

const miniGameKonva: React.FC = () => {
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [refresh, setRefresh] = useState(0);

    //non-render affecting refs
    const playerX = useRef(WIDTH / 2 - PLAYER_WIDTH / 2);
    const projectiles = useRef<Array<Projectile>>([]);
    const animationId = useRef<number | null>(null);
    const lastSpawnTime = useRef<number>(0);
    //const backetCanvas = useRef<typeof Image>(null);

    const spawnProjectile = () => {
        projectiles.current.push({ x: Math.random() * (WIDTH - PROJECTILE_WIDTH), y: -PROJECTILE_HEIGHT });
    }

    useLayoutEffect(() => {
        const gameLoop = (time: number) => {
            if (gameOver) return;
            if (!lastSpawnTime.current) lastSpawnTime.current = time;

            if (time - lastSpawnTime.current > 1000) {
                spawnProjectile();
                lastSpawnTime.current = time;
            }

            projectiles.current = projectiles.current
                .map(p => ({ x: p.x, y: p.y + PROJECTILE_SPEED }))
                .filter(p => p.y < HEIGHT + PROJECTILE_HEIGHT);


            const playerY = HEIGHT - PLAYER_HEIGHT - 10;
            let collided = false;
            for (let i = 0; i < projectiles.current.length; i++) {
                const p = projectiles.current[i];
                if (isColliding(playerX.current, playerY, PLAYER_WIDTH, PLAYER_HEIGHT, p.x, p.y, PROJECTILE_WIDTH, PROJECTILE_HEIGHT)) {
                    collided = true;
                    setScore(score => score + 1);
                    projectiles.current.splice(i, 1);
                    i--;
                } else if (p.y > HEIGHT) {
                    setGameOver(true);
                }
            }

            if (collided && !gameOver) {     
                
            }
            
            if (!gameOver)
                setRefresh(r => r ^ 1); // trigger re-render
                
            animationId.current = requestAnimationFrame(gameLoop);
        }

        animationId.current = requestAnimationFrame(gameLoop);
        return () => {
            if (animationId.current) cancelAnimationFrame(animationId.current);
        };
    }, [gameOver]);


    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        let x = e.clientX - rect.left - PLAYER_WIDTH / 2;
        x = Math.max(0, Math.min(WIDTH - PLAYER_WIDTH, x));
        playerX.current = x;
    }

    return (
        <div
            style={{ width: WIDTH, height: HEIGHT, border: '1px solid black', userSelect: 'none' }}
            onMouseMove={handleMouseMove}
        >
            <Stage width={WIDTH} height={HEIGHT}>
                <Layer>
                    {projectiles.current.map((p, i) => (
                        <Circle key={i} x={p.x} y={p.y} radius={PROJECTILE_HEIGHT / 2} fill="green" />
                    ))}
                    <URLImage /*ref={backetCanvas}*/ src={basketImg} x={playerX.current} y={HEIGHT - PLAYER_HEIGHT - 10} width={PLAYER_WIDTH} height={PLAYER_HEIGHT} />
                </Layer>
            </Stage>
            <div>Skóre: {score}</div>
            {gameOver && <div style={{ color: 'red' }}>Game Over!</div>}
        </div>
    );
}

export default miniGameKonva;
