"""Reusable puzzles: word search (with key) and a perfect maze (with solution path)."""
import random
from reportlab.lib.colors import HexColor, white
from . import INK, KEYRED

DIRS = {"across": (1, 0), "down": (0, 1), "diag": (1, 1)}


def wordsearch(words, cols, rows, seed=1, dirs=("across", "down")):
    """Returns (grid rows of letters, placements {word: [(col, row), ...]}). Retries until every word fits."""
    R = random.Random(seed)
    for _ in range(500):
        grid = [[None] * cols for _ in range(rows)]; place = {}
        for w in sorted(words, key=len, reverse=True):
            spots = []
            for d in dirs:
                dx, dy = DIRS[d]
                for r in range(rows):
                    for c in range(cols):
                        cells = [(c + dx * i, r + dy * i) for i in range(len(w))]
                        if all(0 <= x < cols and 0 <= y < rows and grid[y][x] in (None, w[i]) for i, (x, y) in enumerate(cells)):
                            spots.append(cells)
            if not spots:
                break
            cells = R.choice(spots); place[w] = cells
            for i, (x, y) in enumerate(cells): grid[y][x] = w[i]
        else:
            fill = "ABCDEFGHIJKLMNOPRSTUVWY"
            out = [[ch or R.choice(fill) for ch in row] for row in grid]
            if all(_count(out, w, dirs) == 1 for w in words):  # no accidental second copy of a word
                return out, place
        R = random.Random(R.random())
    raise ValueError("words do not fit")


def _count(grid, w, dirs):
    rows, cols, n = len(grid), len(grid[0]), 0
    for d in dirs:
        dx, dy = DIRS[d]
        for r in range(rows):
            for c in range(cols):
                cells = [(c + dx * i, r + dy * i) for i in range(len(w))]
                n += all(0 <= x < cols and 0 <= y < rows and grid[y][x] == w[i] for i, (x, y) in enumerate(cells))
    return n


def draw_wordsearch(b, grid, x, y, cell, place=None, fs=None):
    """Top-left (x, y). place: draw key loops around each word."""
    c = b.c; rows, cols = len(grid), len(grid[0])
    c.setStrokeColor(b.t.primary); c.setLineWidth(2); c.roundRect(x - 6, y - rows * cell - 6, cols * cell + 12, rows * cell + 12, 10)
    c.setFillColor(INK); c.setFont("BodyB", fs or cell * .55)
    for r, row in enumerate(grid):
        for k, ch in enumerate(row):
            c.drawCentredString(x + (k + .5) * cell, y - (r + .5) * cell - cell * .19, ch)
    if place:
        c.setStrokeColor(KEYRED); c.setLineWidth(2)
        for cells in place.values():
            (x0, y0), (x1, y1) = cells[0], cells[-1]
            ax, ay = x + (x0 + .5) * cell, y - (y0 + .5) * cell; bx, by = x + (x1 + .5) * cell, y - (y1 + .5) * cell
            r = cell * .42
            if ay == by: c.roundRect(ax - r, ay - r, bx - ax + 2 * r, 2 * r, r)
            elif ax == bx: c.roundRect(ax - r, by - r, 2 * r, ay - by + 2 * r, r)
            else:
                c.saveState(); c.setLineWidth(cell * .7); c.setStrokeColor(HexColor("#FCA5A5")); c.setLineCap(1)
                c.setStrokeAlpha(.55); c.line(ax, ay, bx, by); c.restoreState()


def maze(cols, rows, seed=1):
    """Perfect maze by depth-first search. Returns (open set of frozenset({a, b}) passages, solution cell list)
    from (0, 0) top-left to (cols-1, rows-1) bottom-right."""
    R = random.Random(seed); seen = {(0, 0)}; stack = [(0, 0)]; open_ = set()
    while stack:
        x, y = stack[-1]
        nb = [(x + dx, y + dy) for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)) if 0 <= x + dx < cols and 0 <= y + dy < rows and (x + dx, y + dy) not in seen]
        if nb:
            n = R.choice(nb); open_.add(frozenset(((x, y), n))); seen.add(n); stack.append(n)
        else:
            stack.pop()
    prev = {(0, 0): None}; q = [(0, 0)]
    for cur in q:
        x, y = cur
        for n in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if n not in prev and frozenset((cur, n)) in open_:
                prev[n] = cur; q.append(n)
    path, cur = [], (cols - 1, rows - 1)
    while cur: path.append(cur); cur = prev[cur]
    return open_, path[::-1]


def draw_maze(b, m, cols, rows, x, y, cell, solution=None):
    """Top-left (x, y). Entrance on the left of the top-left cell, exit on the right of the bottom-right cell."""
    c = b.c; open_, path = m
    if solution:
        c.saveState(); c.setStrokeColor(KEYRED); c.setLineWidth(cell * .28); c.setLineCap(1); c.setLineJoin(1)
        p = c.beginPath(); p.moveTo(x - cell * .5, y - cell * .5)
        for cx, cy in path: p.lineTo(x + (cx + .5) * cell, y - (cy + .5) * cell)
        p.lineTo(x + (cols + .5) * cell, y - (rows - .5) * cell); c.drawPath(p); c.restoreState()
    c.setStrokeColor(b.t.dark); c.setLineWidth(3); c.setLineCap(1)
    for cy in range(rows):
        for cx in range(cols):
            X, Y = x + cx * cell, y - cy * cell
            if cy == 0: c.line(X, Y, X + cell, Y)
            if cx == 0 and cy != 0: c.line(X, Y, X, Y - cell)
            if not (cx == cols - 1 and cy == rows - 1) and (cx == cols - 1 or frozenset(((cx, cy), (cx + 1, cy))) not in open_):
                c.line(X + cell, Y, X + cell, Y - cell)
            if cy == rows - 1 or frozenset(((cx, cy), (cx, cy + 1))) not in open_:
                c.line(X, Y - cell, X + cell, Y - cell)
