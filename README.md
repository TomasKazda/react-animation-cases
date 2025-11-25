# Closure a animace

[Live web](https://tomaskazda.github.io/react-animation-cases/)

## Přehled ukázek animačních technik

Tento projekt demonstruje různé přístupy k animacím v React aplikacích a základní problémy s closures v JavaScriptu.

---

## 1. Closure (raw)

### Co demonstruje
Základní JavaScript closure problém – funkce si "pamatuje" prostředí, ve kterém byla vytvořena.

### Use case
- **Pochopení closure mechanismu** v JavaScriptu
- Demonstrace problému se "stale closure" v React komponentách
- Ukázka, proč hodnota `value1` v komponentě není reaktivní

### Kdy se hodí použít
- **Výukové účely** – pochopení, jak JavaScript uchovává reference
- Counter pattern bez použití React state
- Situace, kdy **NECHCETE** spustit re-render komponenty

### Výhody
- Nízká režie – žádný React overhead
- Rychlé inkrementace bez re-renderu

### Nevýhody
- Komponenta se nepřekreslí automaticky
- Může vést k bugům, kdy UI neodpovídá skutečnému stavu

---

## 2. useEffect - Closure

### Co demonstruje
Problém s "stale closure" v `useEffect` s prázdným dependency array.

### Use case
- **Event listenery** s přístupem ke starým hodnotám state
- Problém, kdy event handler vidí pouze hodnoty z doby vytvoření efektu
- Řešení pomocí `useRef` nebo funkcionálního update `setState((prev) => prev + 1)`

### Kdy se hodí použít
- Při práci s **globálními event listenery** (keyboard, window resize)
- Když potřebujete **cleanup funkci** pro odpojení listenerů
- Pro **long-running subscriptions** (WebSocket, timers)

### Řešení problému
1. **Přidat dependencies** do dependency array (může způsobit zbytečné re-subscribes)
2. **Použít `useRef`** pro přístup k aktuálním hodnotám
3. **Funkcionální update** `setState((prev) => ...)` – doporučeno

### Výhody
- Umožňuje cleanup při unmount
- Kontrola nad tím, kdy se efekt přespouští

### Nevýhody
- Snadné zapomenout na dependencies → stale values
- Může vést k memory leaks, pokud chybí cleanup

---

## 3. rAF Frame-by-frame animation

### Co demonstruje
Použití `requestAnimationFrame` pro plynulou DOM animaci.

### Use case
- **Komplexní physics-based animace** (např. hod kostkou s gravitací)
- Animace s **real-time kontrolou** (drag & drop s collision detection)
- Kdy potřebujete **přesnou kontrolu nad každým snímkem**

### Kdy se hodí použít
- **Canvas/WebGL rendering** – pro hry, vizualizace
- Animace závislá na **čase nebo fyzikálních výpočtech**
- Když CSS animations/transitions nestačí (nelineární pohyby, interaktivita)

### Výhody
- **Synchronizace s refresh rate** (typicky 60 FPS) = plynulejší než `setTimeout`
- **Automatická pauza** v neaktivních tabech – šetří CPU a baterii
- Optimalizované pro vizuální updates
- Přesná kontrola nad každým frame

### Nevýhody
- Vyžaduje ruční správu animačního loopu
- Nutnost volat `cancelAnimationFrame` v cleanup
- Pro jednoduché animace overkill – raději CSS

### Poznámka
`useLayoutEffect` vs `useEffect`:
- `useLayoutEffect` – synchronní **před** vykreslením (vhodné pro měření DOM)
- `useEffect` – asynchronní **po** vykreslení

---

## 4. rAF Konva

### Co demonstruje
Použití `requestAnimationFrame` s **Konva.js** (React canvas wrapper) pro výkonnou 2D grafiku.

### Use case
- **2D hry** s mnoha objekty (sprites, kolize)
- **Interaktivní vizualizace** (grafy, diagramy s drag & drop)
- Aplikace potřebující **výkon Canvas bez psaní low-level kódu**

### Kdy se hodí použít
- Potřebujete **Canvas**, ale nechcete řešit low-level rendering
- Množství objektů (sprites), kde by DOM elementy byly pomalé
- Interaktivní prvky s **event handling** (click, drag, touch)
- Když potřebujete **layer management** a caching

### Optimalizace v této ukázce
- **`batchDraw()`** místo re-renderu celé komponenty
- Přímá manipulace s Konva uzly (Circle, Image) místo React state
- **Forward ref** pro přímý přístup k Konva objektům
- **Draggable** košík s omezením hranic (`dragBoundFunc`)
- **Responzivní Stage** – scale pro menší viewporty (mobily)

### Výhody
- React-like API pro Canvas
- GPU akcelerace
- Built-in event handling (drag, click, touch)
- Layer management a hit detection
- Export do obrázků

### Nevýhody
- Dodatečná závislost (Konva.js ~100 KB)
- Learning curve pro Konva API
- Pro velmi jednoduché animace overkill

---

## 5. rAF Canvas

### Co demonstruje
Čistý Canvas s `requestAnimationFrame` **bez abstrakcí** (raw Canvas API).

### Use case
- Potřebujete **maximální výkon** a kontrolu
- Custom rendering engine
- **Minimální bundle size** (žádné závislosti)

### Kdy se hodí použít
- **High-performance aplikace** (particles, 1000+ objektů)
- **Data visualization** s vlastními rendering optimalizacemi
- Když znáte Canvas API a nechcete overhead knihoven

### Výhody
- **Nejrychlejší možné rendering** (přímý přístup k Canvas API)
- **Žádné závislosti**
- Plná kontrola nad každým pixelem

### Nevýhody
- **Hodně boilerplate kódu**
- Nutné ruční psát event handling (hit detection)
- Složitější správa objektů než v Konva

### Srovnání Canvas vs Konva
| Aspekt | Raw Canvas | Konva |
|--------|------------|-------|
| Rychlost | ⚡⚡⚡ Nejrychlejší | ⚡⚡ Velmi rychlý |
| Složitost kódu | 🔧🔧🔧 Vysoká | 🔧 Nízká |
| Event handling | Manuální | Built-in |
| Bundle size | Minimální | ~100 KB |

---

## 6. CSS Animation

### Co demonstruje
GPU-akcelerované CSS animations/transitions s React event handlery (`onTransitionEnd`, `onAnimationEnd`).

### Use case
- **Jednoduché UI animace** (fade in/out, slide, scale)
- **Deklarativní animace** definované v CSS
- Detekce dokončení animace pro state machine (fáze UI)

### Kdy se hodí použít
- **První volba pro běžné UI animace**
- Animace buttons, modals, tooltips, page transitions
- Kdy nepotřebujete runtime kontrolu nad animací

### Výhody
- **GPU akcelerované** vykreslování bez CPU overhead
- **Automatická optimalizace** prohlížečem
- `onTransitionEnd` / `onAnimationEnd` – detekce dokončení
- **Minimální kód**, vysoký výkon
- **Deklarativní** – oddělení animace od logiky

### Nevýhody
- Omezená kontrola za běhu (nelze snadno měnit cílové hodnoty)
- Složitější orchestrovat více animací
- Pro komplexní interaktivní animace nevhodné

### Best practices
- Pro transform/opacity použít `will-change` nebo `transform: translateZ(0)` pro GPU layer
- Vyhýbat se animaci `width`, `height`, `top`, `left` (způsobuje reflow)
- Preferovat `transform` a `opacity`

---

## Doporučený přístup dle use case

| Typ animace | Doporučená technika | Alternativa |
|-------------|---------------------|-------------|
| UI transitions (buttons, modals) | **CSS animations** | React Spring |
| Jednoduché pohyby | **CSS animations** | Framer Motion |
| Canvas hry (2D) | **Konva + rAF** | raw Canvas |
| High-performance particles | **raw Canvas + rAF** | WebGL |
| Data visualization | **Canvas** nebo **SVG** | D3.js |
| Physics simulations | **rAF + physics engine** | Matter.js |
| Page transitions | **CSS** nebo **Framer Motion** | React Router transitions |

---

## Technologie

- React 19.1
- TypeScript
- Vite
- Konva (react-konva)
- CSS Modules