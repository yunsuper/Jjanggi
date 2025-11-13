const pool = require("../db/db");

// 게임 저장
exports.saveGame = async (req, res) => {
    try {
        const { board_state, turn } = req.body;

        if (!board_state || !turn) {
            return res
                .status(400)
                .json({ message: "board_state 또는 turn 값이 없습니다." });
        }

        // game_state 저장
        await pool.query(
            `REPLACE INTO game_state (id, board_state, turn)
             VALUES (1, ?, ?)`,
            [JSON.stringify(board_state), turn]
        );

        // 히스토리 기록 저장
        await pool.query(
            `INSERT INTO game_history (turn, board_state, current_player)
             VALUES (?, ?, ?)`,
            [turn, JSON.stringify(board_state), turn]
        );

        return res.json({ message: "게임 상태 저장 완료" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "서버 오류 발생" });
    }
};

// 게임 불러오기
exports.loadGame = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT * FROM game_state WHERE id = 1`
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "저장된 게임이 없습니다." });
        }

        return res.json({
            board_state: JSON.parse(rows[0].board_state || "{}") , // 일부러 OR연산자 넣음. null
            turn: rows[0].turn,
            updated_at: rows[0].updated_at,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "서버 오류 발생" });
    }
};

// 게임 초기화 (새로하기)
exports.resetGame = async (req, res) => {
    try {
        const defaultState = {
            turn: "player1",
            pieces: {
                player1: [
                    {
                        id: "p1-cha-left",
                        type: "cha",
                        x: 0,
                        y: 9,
                        alive: true,
                        owner: "player1",
                    },
                    {
                        id: "p1-ma-left",
                        type: "ma",
                        x: 1,
                        y: 9,
                        alive: true,
                        owner: "player1",
                    },
                    {
                        id: "p1-sang-left",
                        type: "sang",
                        x: 2,
                        y: 9,
                        alive: true,
                        owner: "player1",
                    },
                    {
                        id: "p1-sa-left",
                        type: "sa",
                        x: 3,
                        y: 9,
                        alive: true,
                        owner: "player1",
                    },
                    {
                        id: "p1-king",
                        type: "king",
                        x: 4,
                        y: 9,
                        alive: true,
                        owner: "player1",
                    },
                    {
                        id: "p1-sa-right",
                        type: "sa",
                        x: 5,
                        y: 9,
                        alive: true,
                        owner: "player1",
                    },
                    {
                        id: "p1-sang-right",
                        type: "sang",
                        x: 6,
                        y: 9,
                        alive: true,
                        owner: "player1",
                    },
                    {
                        id: "p1-ma-right",
                        type: "ma",
                        x: 7,
                        y: 9,
                        alive: true,
                        owner: "player1",
                    },
                    {
                        id: "p1-cha-right",
                        type: "cha",
                        x: 8,
                        y: 9,
                        alive: true,
                        owner: "player1",
                    },

                    {
                        id: "p1-po-left",
                        type: "po",
                        x: 1,
                        y: 7,
                        alive: true,
                        owner: "player1",
                    },
                    {
                        id: "p1-po-right",
                        type: "po",
                        x: 7,
                        y: 7,
                        alive: true,
                        owner: "player1",
                    },

                    {
                        id: "p1-b0",
                        type: "byeong",
                        x: 0,
                        y: 6,
                        alive: true,
                        owner: "player1",
                    },
                    {
                        id: "p1-b1",
                        type: "byeong",
                        x: 2,
                        y: 6,
                        alive: true,
                        owner: "player1",
                    },
                    {
                        id: "p1-b2",
                        type: "byeong",
                        x: 4,
                        y: 6,
                        alive: true,
                        owner: "player1",
                    },
                    {
                        id: "p1-b3",
                        type: "byeong",
                        x: 6,
                        y: 6,
                        alive: true,
                        owner: "player1",
                    },
                    {
                        id: "p1-b4",
                        type: "byeong",
                        x: 8,
                        y: 6,
                        alive: true,
                        owner: "player1",
                    },
                ],
                player2: [
                    {
                        id: "p2-cha-left",
                        type: "cha",
                        x: 0,
                        y: 0,
                        alive: true,
                        owner: "player2",
                    },
                    {
                        id: "p2-ma-left",
                        type: "ma",
                        x: 1,
                        y: 0,
                        alive: true,
                        owner: "player2",
                    },
                    {
                        id: "p2-sang-left",
                        type: "sang",
                        x: 2,
                        y: 0,
                        alive: true,
                        owner: "player2",
                    },
                    {
                        id: "p2-sa-left",
                        type: "sa",
                        x: 3,
                        y: 0,
                        alive: true,
                        owner: "player2",
                    },
                    {
                        id: "p2-king",
                        type: "king",
                        x: 4,
                        y: 0,
                        alive: true,
                        owner: "player2",
                    },
                    {
                        id: "p2-sa-right",
                        type: "sa",
                        x: 5,
                        y: 0,
                        alive: true,
                        owner: "player2",
                    },
                    {
                        id: "p2-sang-right",
                        type: "sang",
                        x: 6,
                        y: 0,
                        alive: true,
                        owner: "player2",
                    },
                    {
                        id: "p2-ma-right",
                        type: "ma",
                        x: 7,
                        y: 0,
                        alive: true,
                        owner: "player2",
                    },
                    {
                        id: "p2-cha-right",
                        type: "cha",
                        x: 8,
                        y: 0,
                        alive: true,
                        owner: "player2",
                    },

                    {
                        id: "p2-po-left",
                        type: "po",
                        x: 1,
                        y: 2,
                        alive: true,
                        owner: "player2",
                    },
                    {
                        id: "p2-po-right",
                        type: "po",
                        x: 7,
                        y: 2,
                        alive: true,
                        owner: "player2",
                    },

                    {
                        id: "p2-j0",
                        type: "jol",
                        x: 0,
                        y: 3,
                        alive: true,
                        owner: "player2",
                    },
                    {
                        id: "p2-j1",
                        type: "jol",
                        x: 2,
                        y: 3,
                        alive: true,
                        owner: "player2",
                    },
                    {
                        id: "p2-j2",
                        type: "jol",
                        x: 4,
                        y: 3,
                        alive: true,
                        owner: "player2",
                    },
                    {
                        id: "p2-j3",
                        type: "jol",
                        x: 6,
                        y: 3,
                        alive: true,
                        owner: "player2",
                    },
                    {
                        id: "p2-j4",
                        type: "jol",
                        x: 8,
                        y: 3,
                        alive: true,
                        owner: "player2",
                    },
                ],
            },
        };

        await pool.query(
            `REPLACE INTO game_state (id, board_state, turn)
             VALUES (1, ?, 'player1')`,
            [JSON.stringify(defaultState)]
        );

        return res.json({
            message: "게임 리셋 완료",
            board_state: defaultState,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "서버 오류 발생" });
    }
};


// 히스토리 보기 (리플레이)
exports.replayGame = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT id, turn, board_state, current_player, created_at
            FROM game_history
            ORDER BY id ASC
        `);

        const replay = rows.map((r) => ({
            id: r.id,
            turn: r.turn,
            board_state: JSON.parse(r.board_state),
            current_player: r.current_player,
            created_at: r.created_at,
        }));

        return res.json(replay);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "서버 오류 발생" });
    }
};

// 이동가능한 좌표 표시
exports.getMovablePositions = (req, res) => {
    const { piece, position, board_state } = req.body;
    const { x, y } = position;

    const moves = [];

    const inBounds = (nx, ny) => nx >= 0 && nx < 9 && ny >= 0 && ny < 10;

    // 전체 말 목록(player1 + player2)
    const allPieces = [
        ...board_state.pieces.player1,
        ...board_state.pieces.player2,
    ];

    // 위치에 있는 말 찾기
    const findPieceAt = (tx, ty) =>
        allPieces.find((p) => p.x === tx && p.y === ty && p.alive !== false);

    // 적군인지 확인
    const isEnemy = (target) => target && target.owner !== piece.owner;

    switch (piece.type) {
        // ================================
        // 🐎 말 (ma)
        // ================================
        case "ma": {
            const legMoves = [
                { leg: [0, -1], move: [-1, -2] },
                { leg: [0, -1], move: [1, -2] },
                { leg: [0, 1], move: [-1, 2] },
                { leg: [0, 1], move: [1, 2] },
                { leg: [-1, 0], move: [-2, -1] },
                { leg: [-1, 0], move: [-2, 1] },
                { leg: [1, 0], move: [2, -1] },
                { leg: [1, 0], move: [2, 1] },
            ];

            legMoves.forEach(({ leg, move }) => {
                const legX = x + leg[0];
                const legY = y + leg[1];
                const nx = x + move[0];
                const ny = y + move[1];

                if (!inBounds(nx, ny)) return;

                // 말다리 막힘
                if (findPieceAt(legX, legY)) return;

                const target = findPieceAt(nx, ny);
                if (!target || isEnemy(target)) moves.push({ x: nx, y: ny });
            });
            break;
        }

        // ================================
        // 🐘 상 (sang)
        // ================================
        case "sang": {
            const legMoves = [
                { leg: [0, -1], move: [-2, -2] },
                { leg: [0, -1], move: [2, -2] },
                { leg: [0, 1], move: [-2, 2] },
                { leg: [0, 1], move: [2, 2] },
            ];

            legMoves.forEach(({ leg, move }) => {
                const legX = x + leg[0];
                const legY = y + leg[1];
                const nx = x + move[0];
                const ny = y + move[1];

                if (!inBounds(nx, ny)) return;

                if (findPieceAt(legX, legY)) return;

                const target = findPieceAt(nx, ny);
                if (!target || isEnemy(target)) moves.push({ x: nx, y: ny });
            });
            break;
        }

        // ================================
        // 🏇 차 (cha)
        // ================================
        case "cha": {
            const dirs = [
                [1, 0],
                [-1, 0],
                [0, 1],
                [0, -1],
            ];

            dirs.forEach(([dx, dy]) => {
                let nx = x + dx;
                let ny = y + dy;

                while (inBounds(nx, ny)) {
                    const target = findPieceAt(nx, ny);

                    if (!target) {
                        moves.push({ x: nx, y: ny });
                        nx += dx;
                        ny += dy;
                    } else {
                        if (isEnemy(target)) moves.push({ x: nx, y: ny });
                        break;
                    }
                }
            });
            break;
        }

        // ================================
        // 💣 포 (po)
        // ================================
        case "po": {
            const dirs = [
                [1, 0],
                [-1, 0],
                [0, 1],
                [0, -1],
            ];

            dirs.forEach(([dx, dy]) => {
                let nx = x + dx;
                let ny = y + dy;

                let jumped = false;

                while (inBounds(nx, ny)) {
                    const target = findPieceAt(nx, ny);

                    if (!jumped) {
                        // 뛰기 전
                        if (target) jumped = true;
                        nx += dx;
                        ny += dy;
                    } else {
                        // 뛰기 후
                        if (target) {
                            if (isEnemy(target)) moves.push({ x: nx, y: ny });
                            break;
                        }
                        nx += dx;
                        ny += dy;
                    }
                }
            });
            break;
        }

        // ================================
        // ⚔️ 병/졸 (byeong, jol)
        // ================================
        case "byeong":
        case "jol": {
            const isPlayer1 = piece.owner === "player1";
            const dy = isPlayer1 ? -1 : 1;

            // 앞으로 한 칸
            const forwardX = x;
            const forwardY = y + dy;

            if (inBounds(forwardX, forwardY)) {
                const t = findPieceAt(forwardX, forwardY);
                if (!t || isEnemy(t)) moves.push({ x: forwardX, y: forwardY });
            }

            // 강을 넘었는가?
            const crossedRiver =
                (isPlayer1 && y <= 4) || (!isPlayer1 && y >= 5);

            if (crossedRiver) {
                const sides = [
                    { x: x - 1, y },
                    { x: x + 1, y },
                ];

                sides.forEach(({ x: sx, y: sy }) => {
                    if (!inBounds(sx, sy)) return;
                    const t = findPieceAt(sx, sy);
                    if (!t || isEnemy(t)) moves.push({ x: sx, y: sy });
                });
            }
            break;
        }

        // ================================
        // 🧱 사 (sa)
        // ================================
        case "sa": {
            const palaceX = [3, 4, 5];
            const palaceY = piece.owner === "player1" ? [7, 8, 9] : [0, 1, 2];

            const diag = [
                [1, 1],
                [1, -1],
                [-1, 1],
                [-1, -1],
            ];

            diag.forEach(([dx, dy]) => {
                const nx = x + dx;
                const ny = y + dy;

                if (!palaceX.includes(nx) || !palaceY.includes(ny)) return;

                const t = findPieceAt(nx, ny);
                if (!t || isEnemy(t)) moves.push({ x: nx, y: ny });
            });
            break;
        }

        // ================================
        // 👑 왕 (king)
        // ================================
        case "king": {
            const palaceX = [3, 4, 5];
            const palaceY = piece.owner === "player1" ? [7, 8, 9] : [0, 1, 2];

            const dirs = [
                [1, 0],
                [-1, 0],
                [0, 1],
                [0, -1],
            ];

            dirs.forEach(([dx, dy]) => {
                const nx = x + dx;
                const ny = y + dy;

                if (!palaceX.includes(nx) || !palaceY.includes(ny)) return;

                const t = findPieceAt(nx, ny);
                if (!t || isEnemy(t)) moves.push({ x: nx, y: ny });
            });
            break;
        }

        default:
            break;
    }

    return res.status(200).json({ movablePositions: moves });
};
