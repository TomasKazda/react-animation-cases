import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { Stage, Layer } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import type { Vector2d } from 'konva/lib/types';
import Konva from 'konva';
import URLImage from './URLImage';
import basketImg from '../assets/basket.svg';

const WIDTH = 512;
const HEIGHT = 720;
const PLAYER_WIDTH = 80;
const PLAYER_HEIGHT = 51;
const PROJECTILE_WIDTH = 20;
const PROJECTILE_HEIGHT = 20;
const PROJECTILE_SPEED = 3;

type Projectile = { x: number; y: number; node: Konva.Circle };

const isColliding = (aX: number, aY: number, aW: number, aH: number, bX: number, bY: number, bW: number, bH: number) => {
    return aX < bX + bW && aX + aW > bX && aY < bY + bH && aH + aY > bY;
}

type MiniGameKonvaProps = {
    callbackGameOver?: () => void;
    callbackScore?: (score: number) => void;
};

const MiniGameKonva: React.FC<MiniGameKonvaProps> = ({callbackGameOver, callbackScore}) => {
    const [dimensions, setDimensions] = useState({ width: WIDTH, height: HEIGHT });
    const scale = Math.min(dimensions.width / WIDTH, dimensions.height / HEIGHT, 1);

    // non-render affecting refs
    const playerX = useRef(WIDTH / 2 - PLAYER_WIDTH / 2);
    const projectiles = useRef<Array<Projectile>>([]);
    const animationId = useRef<number | null>(null);
    const lastSpawnTime = useRef<number>(0);
    const score = useRef<number>(0);
    const layerRef = useRef<Konva.Layer | null>(null);
    const playerImageRef = useRef<Konva.Image | null>(null);
    const stageRef = useRef<Konva.Stage | null>(null);

    useEffect(() => {
        const updateDimensions = () => {
            const maxWidth = Math.min(window.innerWidth, WIDTH);
            const maxHeight = Math.min(window.innerHeight, HEIGHT);
            setDimensions({ width: maxWidth, height: maxHeight });
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const spawnProjectile = () => {
        if (!layerRef.current) return;
        const x = Math.random() * (WIDTH - PROJECTILE_WIDTH);
        const y = -PROJECTILE_HEIGHT;
        const circle = new Konva.Circle({
            x,
            y,
            radius: PROJECTILE_HEIGHT / 2,
            fill: 'green',
            listening: false
        });
        layerRef.current.add(circle);
        projectiles.current.push({ x, y, node: circle });
    };

    const updatePlayerXFromPos = (xPos: number) => {
        let x = xPos - PLAYER_WIDTH / 2;
        x = Math.max(0, Math.min(WIDTH - PLAYER_WIDTH, x));
        playerX.current = x;
        if (playerImageRef.current) playerImageRef.current.x(playerX.current);
    };

    const handleStagePointerMove = (e: KonvaEventObject<PointerEvent | MouseEvent | TouchEvent>) => {
        const stage = e.target.getStage();
        const pos = stage?.getPointerPosition();
        if (!pos) return;
        updatePlayerXFromPos(pos.x);
    };

    const handlePlayerDragMove = (e: KonvaEventObject<DragEvent>) => {
        const xPos = e.target.x() + PLAYER_WIDTH / 2;
        updatePlayerXFromPos(xPos);
    };

    useLayoutEffect(() => {
        const gameLoop = (time: number) => {
            if (!lastSpawnTime.current) lastSpawnTime.current = time;

            if (time - lastSpawnTime.current > 1000) {
                spawnProjectile();
                lastSpawnTime.current = time;
            }

            for (const p of projectiles.current) {
                p.y += PROJECTILE_SPEED;
                p.node.y(p.y);
            }

            const playerY = HEIGHT - PLAYER_HEIGHT - 10;
            let gameOver = false;
            for (let i = 0; i < projectiles.current.length; i++) {
                const p = projectiles.current[i];
                if (isColliding(playerX.current, playerY, PLAYER_WIDTH, PLAYER_HEIGHT, p.x, p.y, PROJECTILE_WIDTH, PROJECTILE_HEIGHT)) {
                    score.current += 1;
                    if (callbackScore) callbackScore(score.current);
                    p.node.destroy();
                    projectiles.current.splice(i, 1);
                    i--;
                } else if (p.y > HEIGHT) {
                    gameOver = true;
                    if (callbackGameOver) callbackGameOver();
                    if (animationId.current) cancelAnimationFrame(animationId.current);
                    animationId.current = null;
                    break;
                }
            }
            
            // Remove off-screen projectiles 
            for (let i = projectiles.current.length - 1; i >= 0; i--) {
                if (projectiles.current[i].y > HEIGHT + PROJECTILE_HEIGHT) {
                    projectiles.current[i].node.destroy();
                    projectiles.current.splice(i, 1);
                }
            }

            //redraw layer
            if (layerRef.current) layerRef.current.batchDraw();
            
            if (!gameOver)
                animationId.current = requestAnimationFrame(gameLoop);
        }

        animationId.current = requestAnimationFrame(gameLoop);
        return () => {
            if (animationId.current) cancelAnimationFrame(animationId.current);
        };
    }, [callbackGameOver, callbackScore]);

    return (
        <Stage
            ref={stageRef}
            width={dimensions.width}
            height={dimensions.height}
            scaleX={scale}
            scaleY={scale}
            onPointerMove={handleStagePointerMove}
            onTouchMove={handleStagePointerMove}
            onMouseMove={handleStagePointerMove}
        >
            <Layer ref={layerRef}>
                <URLImage
                    ref={playerImageRef}
                    src={basketImg}
                    x={playerX.current}
                    y={HEIGHT - PLAYER_HEIGHT - 10}
                    width={PLAYER_WIDTH}
                    height={PLAYER_HEIGHT}
                    draggable
                    onDragMove={handlePlayerDragMove}
                    dragBoundFunc={(pos: Vector2d) => {
                        const clampedX = Math.max(0, Math.min(WIDTH - PLAYER_WIDTH, pos.x));
                        return { x: clampedX, y: HEIGHT - PLAYER_HEIGHT - 10 };
                    }}
                />
            </Layer>
        </Stage>
    );
}

export default MiniGameKonva;
