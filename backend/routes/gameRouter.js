const express = require("express");
const router = express.Router();
const gameController = require("../controllers/gameController");

// 게임 상태 저장 (예: POST /api/game/save)
router.post("/save", gameController.saveGame);

// 게임 상태 불러오기 (예: GET /api/game/load)
router.get("/load", gameController.loadGame);

// 게임 초기화 (예: POST /api/game/reset)
router.post("/reset", gameController.resetGame);

// 게임 히스토리
router.post("/replay", gameController.replayGame);

// 이동가능한 좌표 표시
router.post("/movable", gameController.getMovablePositions);

module.exports = router;
