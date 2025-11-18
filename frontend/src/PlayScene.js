import * as Phaser from 'phaser';

const newGameButton = document.querySelector('new-game');

class PlayScene extends Phaser.Scene {

    constructor() {
        super('PlayScene');
        this.selectedPieceId = null;
        this.movablePositions = [];
        this.movableMarkers = null;
        
        // 이 씬에서 사용할 변수들
        this.board_state = {
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
    }

    preload() {
        this.load.setPath('assets/');

        const imageFiles = [
            'board.png', 
            'chocha.png', 'chojol.png', 'choma.png', 'chopo.png', 'chosa.png', 'chosang.png', 'chowang.png',
            'hancha.png', 'hanjol.png', 'hanma.png', 'hanpo.png', 'hansa.png', 'hansang.png', 'hanwang.png'
        ];

        imageFiles.forEach(file => {
            const key = file.replace('.png', '');
            this.load.image(key, file);
        });
    }

    // 씬 생성 (소품/배우 배치)
    create() {
        const { width, height } = this.sys.game.config;
        this.pieceSpriteMap = {};

        let board = this.add.image(width / 2, height / 2, 'board');
        board.setInteractive();
        
        board.setScale(Math.min(width / board.width, height / board.height)*0.9);

        // 여백을 제외한 실제 장기판 격자의 크기와 시작 위치를 자동으로 계산
        const gridWidth = board.displayWidth;
        const gridHeight = board.displayHeight;
        const tileWidth = gridWidth / 8;
        const tileHeight = gridHeight / 9;
        const gridTopLeftX = (width - gridWidth) / 2;
        const gridTopLeftY = (height - gridHeight) / 2;

        // 헬퍼 함수
        // 격자 좌표를 실제 픽셀 좌표로 변환하는 함수
        const getPixelCoords = (gridX, gridY) => {
            return {
                x: gridTopLeftX + gridX * tileWidth,
                y: gridTopLeftY + gridY * tileHeight
            };
        }

        const getPieceAssetKey = (piece) => {
            const type = piece.type;
            const owner = piece.owner;
        
            if (owner === 'player1') {
                switch (type) {
                    case 'cha': return 'chocha';
                    case 'ma': return 'choma';
                    case 'sang': return 'chosang';
                    case 'sa': return 'chosa';
                    case 'king': return 'chowang';
                    case 'po': return 'chopo';
                    case 'byeong': return 'chojol';
                    default: return '';
                }
            } else {
                switch (type) {
                    case 'cha': return 'hancha';
                    case 'ma': return 'hanma';
                    case 'sang': return 'hansang';
                    case 'sa': return 'hansa';
                    case 'king': return 'hanwang';
                    case 'po': return 'hanpo';
                    case 'jol': return 'hanjol';
                    default: return '';
                }
            }
        }

        const getPieceOwner = (pieceId) => {
            if(/^p1/.test(pieceId)) return 'player1';
            else if(/^p2/.test(pieceId)) return 'player2';
            else return 'unknown';
        }

        // 핵심 게임 로직 함수
        const clickPiece = async(pointer, clickedSprite) => {
            try {
                const clickedPieceId = clickedSprite.id;
                console.log("클릭된 장기말 ID: ", clickedPieceId);

                if (this.selectedPieceId && this.pieceSpriteMap[this.selectedPieceId]) {
                    this.pieceSpriteMap[this.selectedPieceId].setScale(1);
                }

                if (this.selectedPieceId === clickedPieceId) {
                    this.selectedPieceId = null;
                    console.log("같은 장기말 재클릭으로 선택 해제");
                    return;
                }

                if (getPieceOwner(clickedPieceId) !== this.board_state.turn) {
                    console.log("상대방의 장기말이거나 현재 턴이 아닙니다.");
                    this.selectedPieceId = null;
                    return;
                }

                this.selectedPieceId = clickedPieceId;
                console.log("선택된 장기말 ID (this.selectedPieceId): ", this.selectedPieceId);

                const allPieces = [
                    ...this.board_state.pieces.player1,
                    ...this.board_state.pieces.player2
                ];
                const selectedPieceObject = allPieces.find(p => p.id === this.selectedPieceId);

                if (!selectedPieceObject) {
                    console.error("선택된 장기말의 정보를 찾을 수 없습니다.");
                    this.selectedPieceId = null;
                    return;
                }

                if (this.pieceSpriteMap[this.selectedPieceId]) {
                    this.pieceSpriteMap[this.selectedPieceId].setScale(1.1);
                }

                const response = await fetch('/api/game/movable', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        piece: selectedPieceObject,
                        position: {
                            x: selectedPieceObject.x,
                            y: selectedPieceObject.y,
                        },
                        board_state: this.board_state
                    })
                });
                
                if (!response.ok) {
                    throw new Error(`네트워크 응답이 올바르지 않습니다: ${response.status}`);
                }

                const data = await response.json();
                this.movablePositions = data.movablePositions;
                console.log('이동 가능한 위치 (this.movablePositions): ', this.movablePositions);
                this.displayMovablePositions(); // Draw markers on success
            } catch(error) {
                console.error("이동 가능한 위치를 가져오는 데 실패했습니다: ", error);
                this.movablePositions = [];
                this.displayMovablePositions();
            }
        };

        // 이동 가능한 좌표 표시
        const displayMovablePositions = () => {
            if (this.movableMarkers) {
                this.movableMarkers.destroy();
            }
            this.movableMarkers = this.add.graphics();
            this.movableMarkers.fillStyle(0x0000ff, 0.4);

            const radius = tileWidth / 4;

            this.movablePositions.forEach((pos) => {
                const pixelCoords = getPixelCoords(pos.x, pos.y);
                this.movableMarkers.fillCircle(pixelCoords.x, pixelCoords.y, radius);
            });
        };

        const onBoardClicked = () => {
            // 사용자가 장기판을 클릭
            // clickedPiece가 있고 클릭한 부분이 이동 가능한 좌표일 때
            // backend에 이동할 좌표를 보냄
            // 업데이트된 board_state를 받아서 화면에 리렌더링
        }

        // 이벤트 리스너
        board.on('pointerdown', (pointer) => {
            console.log('board 클릭');
            // TODO: 장기말 이동 로직 (onBoardClicked) 연결

            if (this.selectedPieceId) {
                if (this.pieceSpriteMap[this.selectedPieceId]) {
                    this.pieceSpriteMap[this.selectedPieceId].setScale(1);
                }
                this.selectedPieceId = null;
                this.movablePositions = [];
                console.log("빈 공간 클릭으로 선택 해제");
                this.displayMovablePositions();
            }
        });

        this.input.on('gameobjectdown', (pointer, gameObject) => {
            if (this.pieceSpriteMap[gameObject.id]) {
                clickPiece(pointer, gameObject);
            }
        });

        // 게임 초기화 및 시작
        const initializeBoard = async () => {
            try {
                const response = await fetch('/api/game/reset', {method: 'POST'});
                if (!response.ok) {
                    throw new Error(`네트워크 응답이 올바르지 않습니다: ${response.status}`);
                }

                const data = await response.json();
                console.log("Initialized board data: ", data);
                this.board_state = data.board_state;

                const allPieces = [
                    ...this.board_state.pieces.player1,
                    ...this.board_state.pieces.player2
                ];

                allPieces.forEach(piece => {
                    if (piece.alive) {
                        const assetKey = getPieceAssetKey(piece);
                        if (assetKey) {
                            const pixelCoords = getPixelCoords(piece.x, piece.y);
                            const sprite = this.add.sprite(pixelCoords.x, pixelCoords.y, assetKey);
                            this.pieceSpriteMap[piece.id] = sprite;
                            sprite.setInteractive();
                            sprite.id = piece.id;
                        }
                    }
                });
            } catch(error) {
                console.error("Error fetching initial board state: ", error);
            }
        };
        
        initializeBoard();

        // 장기말 이동
        const movePiece = (piece) => {
            // 장기말 클릭
            const movablePositions = clickPiece(piece);
            // 이동 가능한 좌표 표시
            displayMovablePositions(movablePositions);
            // 장기말 이동
            onBoardClicked();
        };

        const saveGame = () => {}; // 게임 저장

        const gameHistory = () => {}; // 게임 히스토리 보기

    }

    update() {

    }
    
    // (헬퍼 함수들)
    // setupInputEvents()
    // collectStar()
}

export default PlayScene;
