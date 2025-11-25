import React, { useRef, useState, useLayoutEffect } from 'react';
import basketImgSrc from '../assets/basket.svg';

const WIDTH = 400;
const HEIGHT = 600;
const PLAYER_WIDTH = 80;
const PLAYER_HEIGHT = 51;
const PROJECTILE_WIDTH = 20;
const PROJECTILE_HEIGHT = 20;
const PROJECTILE_SPEED = 3;

type Projectile = { x: number; y: number };

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

const MiniGameCanvas: React.FC = () => {
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const basketImgRef = useRef<HTMLImageElement | null>(null);

    const playerX = useRef(WIDTH / 2 - PLAYER_WIDTH / 2);
    const projectiles = useRef<Projectile[]>([]);
    const animationId = useRef<number | null>(null);
    const lastSpawnTime = useRef(0);

    const spawnProjectile = () => {
        projectiles.current.push({
            x: Math.random() * (WIDTH - PROJECTILE_WIDTH),
            y: -PROJECTILE_HEIGHT,
        });
    }

    useLayoutEffect(() => {
        const img = new Image();
        img.src = basketImgSrc;
        img.onload = () => {
            basketImgRef.current = img;
        };
    }, []);

    useLayoutEffect(() => {
        const rawCtx = canvasRef.current?.getContext('2d');
        if (!rawCtx) return;
        const ctx = rawCtx;

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
                    setScore(s => s + 1);
                    projectiles.current.splice(i, 1);
                    i--;
                } else if (p.y > HEIGHT) {
                    setGameOver(true);
                }
            }

            if (collided && !gameOver) {    
            
            }
            
            // rendering
            ctx.clearRect(0, 0, WIDTH, HEIGHT);

            if (basketImgRef.current) {
                ctx.drawImage(
                    basketImgRef.current,
                    playerX.current,
                    playerY,
                    PLAYER_WIDTH,
                    PLAYER_HEIGHT
                );
            } 
            
            ctx.fillStyle = 'green';
            projectiles.current.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x + PROJECTILE_WIDTH / 2, p.y + PROJECTILE_HEIGHT / 2, PROJECTILE_WIDTH / 2, 0, Math.PI * 2);
                ctx.fill();
            });

            animationId.current = requestAnimationFrame(gameLoop);
        }

        animationId.current = requestAnimationFrame(gameLoop);

        return () => {
            if (animationId.current !== null) {
                cancelAnimationFrame(animationId.current);
            }
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
            onMouseMove={handleMouseMove}
            style={{ width: WIDTH, height: HEIGHT, border: '1px solid black', cursor: 'none', userSelect: 'none' }}
        >
            <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} style={{ display: 'block' }} />
            <div>Score: {score}</div>
            {gameOver && <div style={{ color: 'red' }}>Game Over!</div>}
        </div>
    );
};

export default MiniGameCanvas;
