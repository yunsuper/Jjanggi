const pool = require("../db/db");

// 임시 메모리 저장용 데이터
let gameData = {
    board_state: null,
    turn: "player1",
};

// 게임 저장
exports.saveGame = (req, res) => {
    const { board_state, turn } = req.body;
    gameData = { board_state, turn };
    res.status(200).json({ message: "게임 상태 저장 완료", data: gameData });
};

// TEXT 필드이지만 JSON 문자열로 저장
// await pool.query(sql, [JSON.stringify(board_state), turn]);

// 게임 불러오기
exports.loadGame = (req, res) => {
    res.status(200).json({
        message: "게임 상태 불러오기 성공",
        data: gameData,
    });
};

// TEXT로 저장된 JSON 문자열을 객체로 변환
    // const gameData = {
    //   ...rows[0],
    //   board_state: JSON.parse(rows[0].board_state || "{}"),
    // };

// 게임 초기화 (새로하기)
exports.resetGame = (req, res) => {
    gameData = { board_state: null, turn: "player1" };
    res.status(200).json({ message: "게임 상태 초기화 완료", data: gameData });
};

// 히스토리 보기 (리플레이)
exports.replayGame = async (req, res) => { }

// 이동가능한 좌표 표시
exports.getMovablePositions = (req, res) => { }