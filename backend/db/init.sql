CREATE TABLE Jjanggi.game_state (
    id INT NOT NULL DEFAULT 1,    -- 항상 1번 슬롯(단일 저장)
    board_state TEXT NULL DEFAULT NULL,    -- 말 위치, 판 상태 (JSON 형식)
    turn ENUM('player1', 'player2') NOT NULL DEFAULT 'player1',    -- 현재 턴
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id));    -- 마지막 저장 시각

CREATE TABLE `Jjanggi`.`game_history` (
  `id` INT NULL AUTO_INCREMENT,
  `turn` ENUM('player1', 'player2') NOT NULL,
  `board_state` TEXT NULL,
  `current_player` ENUM('player1', 'player2') NULL,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (`id`));