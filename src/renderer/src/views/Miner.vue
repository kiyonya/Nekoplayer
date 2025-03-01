<template>
    <div class="minesweeper">
        <div class="controls">
            <label for="rows">行数:</label>
            <input id="rows" v-model.number="rows" type="number" min="1" />
            <label for="cols">列数:</label>
            <input id="cols" v-model.number="cols" type="number" min="1" />
            <label for="mines">雷数:</label>
            <input id="mines" v-model.number="mines" type="number" min="1" />
            <button @click="initializeGame">开始游戏</button>
        </div>
        <div class="board">
            <div v-for="(row, rowIndex) in board" :key="rowIndex" class="row">
                <div v-for="(cell, colIndex) in row" :key="colIndex" class="cell"
                    :class="{ revealed: cell.revealed, mine: cell.mine && cell.revealed }"
                    @click="revealCell(rowIndex, colIndex)" @contextmenu.prevent="flagCell(rowIndex, colIndex)">
                    <span v-if="cell.revealed">
                        {{ cell.mine ? '💣' : cell.adjacentMines || '' }}
                    </span>
                    <span v-else-if="cell.flagged">🚩</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
    name: 'Minesweeper',
    setup() {
        const rows = ref(10);
        const cols = ref(10);
        const mines = ref(10);
        const board = ref([]);

        const initializeGame = () => {
            board.value = createBoard(rows.value, cols.value, mines.value);
        };

        const createBoard = (rows, cols, mines) => {
            const board = Array.from({ length: rows }, () =>
                Array.from({ length: cols }, () => ({
                    mine: false,
                    revealed: false,
                    flagged: false,
                    adjacentMines: 0,
                }))
            );

            let minesPlaced = 0;
            while (minesPlaced < mines) {
                const row = Math.floor(Math.random() * rows);
                const col = Math.floor(Math.random() * cols);
                if (!board[row][col].mine) {
                    board[row][col].mine = true;
                    minesPlaced++;
                }
            }

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    if (!board[row][col].mine) {
                        board[row][col].adjacentMines = countAdjacentMines(board, row, col);
                    }
                }
            }

            return board;
        };

        const countAdjacentMines = (board, row, col) => {
            const directions = [
                [-1, -1], [-1, 0], [-1, 1],
                [0, -1], [0, 1],
                [1, -1], [1, 0], [1, 1]
            ];
            return directions.reduce((count, [dx, dy]) => {
                const newRow = row + dx;
                const newCol = col + dy;
                if (newRow >= 0 && newRow < board.length && newCol >= 0 && newCol < board[0].length && board[newRow][newCol].mine) {
                    count++;
                }
                return count;
            }, 0);
        };

        const reveaCell = (row, col) => {
            const cell = board.value[row][col];
            if (cell.revealed || cell.flagged) return;

            cell.revealed = true;

            if (cell.mine) {
                alert('游戏结束！你踩到雷了！');
                initializeGame();
                return;
            }

            if (cell.adjacentMines === 0) {
                revealAdjacentCells(row, col);
            }
        };

        const revealAdjacentCells = (row, col) => {
            const directions = [
                [-1, -1], [-1, 0], [-1, 1],
                [0, -1], [0, 1],
                [1, -1], [1, 0], [1, 1]
            ];
            directions.forEach(([dx, dy]) => {
                const newRow = row + dx;
                const newCol = col + dy;
                if (newRow >= 0 && newRow < board.value.length && newCol >= 0 && newCol < board.value[0].length) {
                    reveaCell(newRow, newCol);
                }
            });
        };

        const flagCell = (row, col) => {
            const cell = board.value[row][col];
            if (!cell.revealed) {
                cell.flagged = !cell.flagged;
            }
        };

        return {
            rows,
            cols,
            mines,
            board,
            initializeGame,
            reveaCell,
            flagCell,
        };
    },
};
</script>

<style scoped>
.minesweeper {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.controls {
    margin-bottom: 20px;
}

.board {
    display: flex;
    flex-direction: column;
}

.row {
    display: flex;
}

.cell {
    width: 30px;
    height: 30px;
    border: 1px solid #000;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

.cell.revealed {
    background-color: #ccc;
}

.cell.mine {
    background-color: #f00;
}
</style>