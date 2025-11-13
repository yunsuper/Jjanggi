
const express = require("express");
require("dotenv").config();
const app = express();
const path = require("path");

app.use(express.json());

// ✅ 프론트엔드 정적 파일 제공 설정
app.use(express.static(path.join(__dirname, "../frontend")));

// 기본 테스트 라우트
app.get("/", (req, res) => {
    res.send("✅ 장기 서버 실행 중!");
});

const gameRouter = require("./routes/gameRouter");
app.use("/api/game", gameRouter);


// 포트 설정 (.env에서 불러오기)
const PORT = process.env.PORT || 5678;

// 서버 실행
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
