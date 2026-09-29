# AI Breakout: Neural Networks Learn to Play Breakout

A population of 300 paddles learns to play Breakout through neuroevolution. Each paddle is controlled by its own small neural network. The paddles that keep the ball in play longest and clear the most bricks pass their "brains" on to the next generation, with mutations, and over generations they learn to track the ball and aim it at what's left of the wall.

[![AI learns Breakout (watch on YouTube)](https://img.youtube.com/vi/muIK5nAHKwI/hqdefault.jpg)](https://youtu.be/muIK5nAHKwI)

**[Watch: AI learns Breakout](https://youtu.be/muIK5nAHKwI)**

## How it works

The learning algorithm is **NEAT** (NeuroEvolution of Augmenting Topologies). Instead of training one network with gradient descent, NEAT evolves a population of networks. It mutates both their connection weights and their structure, and groups similar networks into species so new strategies have time to develop.

**The game:** a wall of 56 bricks in 4 rows of 14. Each paddle gets 3 balls. Where the ball hits the paddle matters: the left or right third adds sideways spin, so a paddle can learn to aim.

**What each paddle sees (8 inputs):**

- how far the ball is to its left or right
- how high the ball is
- **six "wall density" readings.** Feeding all 56 bricks into a small network makes learning slow, so the wall is compressed first. Neighboring bricks are grouped into 2×2 blocks, then six overlapping windows sweep across the wall from left to right, each reporting what fraction of its bricks are still standing. The paddle gets a coarse map of where the targets are, in 6 numbers instead of 56.

**What it can do (2 outputs):** move left or move right. Each fires when its output is above 0.6.

**How it is scored:** 300 points per brick and 200 points per paddle hit, which rewards keeping the ball in play. Fitness is `1 + score² + time alive / 20`, so clearing bricks matters far more than just surviving.

## What I built on top of the NEAT template

The neural-network core started from Code Bullet's [NEAT Template (JavaScript)](https://github.com/Code-Bullet/NEAT-Template-JavaScript), which was originally set up for a Flappy Bird style game. I replaced the game and adapted the learning setup:

- **The game:** `player.js` (the paddle), `Puck.js`, `Wall.js`, `Row.js`, and `Brick.js`: ball physics, paddle spin zones, brick collisions, and lives.
- **Sensing:** the compressed wall-density vision described above.
- **Learning changes:** modifications to `Genome.js`, `Population.js`, `Node.js`, and `Species.js`, plus fitness shaping for this game.

`ConnectionGene.js` and `ConnectionHistory.js` are unchanged from the template.

## Running it

It is plain JavaScript using [p5.js](https://p5js.org/), with no build step. Because it loads an image, open it through a local web server rather than by double-clicking `index.html`:

```bash
cd Breakout
python -m http.server 8000
```

Then browse to <http://localhost:8000>. The VS Code **Live Server** extension also works.

**Controls:**

| Key | Action |
| --- | --- |
| `=` / `-` | Speed up / slow down the frame rate |
| `B` | Replay the best paddle so far |
| `G` | Step through the best paddle of each generation (Right arrow advances) |
| `N` | Hide the drawing to train faster |
| `P` | Play it yourself, then `A` / `D` to move |

## Credits

- NEAT template by [Code Bullet](https://github.com/Code-Bullet/NEAT-Template-JavaScript). The original repository does not include a license; its files are credited here and remain his work.
- NEAT algorithm: Kenneth O. Stanley and Risto Miikkulainen, *Evolving Neural Networks through Augmenting Topologies* (2002).
- [p5.js](https://p5js.org/) (LGPL 2.1).

Game code and learning changes by Matthew Rogers, 2020.
