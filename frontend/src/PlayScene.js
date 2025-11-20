import * as Phaser from 'phaser';
import { getPixelCoords, getPieceAssetKey, getPieceOwner } from './utils/coords.js';
import { v4 as uuidv4 } from 'https://cdn.skypack.dev/uuid';

class PlayScene extends Phaser.Scene {

    constructor() {
        super('PlayScene');
        
        // 이 씬에서 사용할 변수들
        this.room = {
            id: null,
            status: null,
            players: [],
        };

        this.selectedPieceId = null;
        this.movablePositions = [];
        this.movableMarkers = null;

        this.board_state = {
            turn: null,
            pieces: {
                player1: [],
                player2: []
            }
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

        let playerId = localStorage.getItem('myPlayerId');
        if(!playerId) {
            playerId = uuidv4();
            localStorage.setItem('myPlayerId', playerId);
        }

        const newGameButton = document.querySelector('#new-game');
        const nicknameModal = document.querySelector('#nickname-modal');
        const nicknameForm = document.querySelector('#nickname-form');
        const nicknameInput = document.querySelector('#nickname-input');

        const showNicknameModal = () => {
            nicknameModal.classList.add('show');
            nicknameInput.focus();
        };

        const hideNicknameModal = () => {
            nicknameModal.classList.remove('show');
        };

        nicknameForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const nickname = nicknameInput.value;
            if (nickname) {
                console.log(`입력된 닉네임: ${nickname}`);
                hideNicknameModal();
                
                joinRoom({
                    room_id: this.room.id,
                    player_id: playerId
                });
            }
        });

        const createRoom = async() => {
            try {
                const response = await fetch('/api/game/rooms/create', {method: 'POST'});
                
                if(!response.ok) {
                    throw new Error(`네트워크 응답이 올바르지 않습니다: ${response.status}`);
                }

                const { room_id } = await response.json();
                this.room.id = room_id;
                console.log(`룸이 생성되었습니다. ID: ${this.room.id}`);
                showNicknameModal();
            } catch (error) {
                console.error("Error fetching room id: ", error);
            }
        }

        const joinRoom = async({ room_id, player_id }) => {
            try {
                const response = await fetch('/api/game/rooms/join', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        room_id: room_id,
                        player_id: player_id
                    })
                });
                
                if(!response.ok) {
                    throw new Error(`네트워크 응답이 올바르지 않습니다: ${response.status}`);
                }

                //TODO: 백엔드에서는 role만 보내주는데 room도 보내는 게 좋은지 확인하기
                const { role, room } = await response.json();
                this.room = room;

                handleGameStart();
            } catch (error) {
                console.error("Error fetching role: ", error);
            }
        }

        //TODO: resetGame을 단순히 board_state를 비우는 기능으로 만드는 게 좋을 것 같은데 어떤지
        const resetGame = async () => {
            try {
                const response = await fetch('/api/game/reset', {method: 'POST'});
                if (!response.ok) {
                    throw new Error(`네트워크 응답이 올바르지 않습니다: ${response.status}`);
                }
                const data = await response.json();
                return data.board_state;
            } catch(error) {
                console.error("Error fetching game reset: ", error);
                return null;
            }
        };

        //TODO: room의 status를 변경하는 코드가 없는데 어디서 만드는 게 좋은지
        const setStatus = async (newStatus) => {
            if (!this.room || !this.room.id) {
                console.error("룸 정보가 없어 상태를 변경할 수 없습니다.");
                return;
            }

            try {
                const response = await fetch(`/api/game/${this.room.id}/status`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ status: newStatus })
                });

                if (!response.ok) {
                    throw new Error(`네트워크 응답이 올바르지 않습니다: ${response.status}`);
                }

                const updatedRoom = await response.json();
                this.room = updatedRoom;
                console.log(`룸 상태가 서버에 의해 '${this.room.status}'(으)로 업데이트되었습니다.`);

            } catch (error) {
                console.error("룸 상태 업데이트 중 오류 발생:", error);
            }
        };
        
        const handleGameStart = async () => {
            if (this.room.players.length === 2) {
                
                if (this.room.status === 'finished') {
                    console.log("게임을 재시작합니다.");
                } else {
                    console.log("두 명의 플레이어가 모두 입장했습니다. 게임을 시작합니다.");
                }

                try {
                    const newBoardState = await resetGame();
                    
                    renderBoard(newBoardState);

                    await setStatus('playing');

                } catch (error) {
                    console.error("게임 시작 처리 중 오류가 발생했습니다:", error);
                }

            } else {
                console.log("아직 플레이어가 모두 입장하지 않았습니다. 현재 인원:", this.room.players.length);
            }
        };

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

        const gridConfig = { gridTopLeftX, gridTopLeftY, tileWidth, tileHeight };

        //TODO: clickPiece 기능이 너무 많은 게 아닌지 확인하기
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
                this.displayMovablePositions();
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
                const pixelCoords = getPixelCoords(pos.x, pos.y, gridConfig);
                this.movableMarkers.fillCircle(pixelCoords.x, pixelCoords.y, radius);
            });
        };

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

        if (newGameButton) {
            newGameButton.addEventListener('click', () => {
                handleGameStart();
            });
        }

        // 게임 보드 그리기
        const renderBoard = (boardState) => {
            if (!boardState) {
                console.error("Error NO boardState data", error);
                return;
            }
            this.board_state = boardState;

            Object.values(this.pieceSpriteMap).forEach(sprite => sprite.destroy());
            this.pieceSpriteMap = {};

            const allPieces = [
                ...this.board_state.pieces.player1,
                ...this.board_state.pieces.player2
            ];

            allPieces.forEach(piece => {
                if (piece.alive) {
                    const assetKey = getPieceAssetKey(piece);
                    if (assetKey) {
                        const pixelCoords = getPixelCoords(piece.x, piece.y, gridConfig);
                        const sprite = this.add.sprite(pixelCoords.x, pixelCoords.y, assetKey);
                        this.pieceSpriteMap[piece.id] = sprite;
                        sprite.setInteractive();
                        sprite.id = piece.id;
                    }
                }
            });

            updateTurnDisplay();
        };

        const updateTurnDisplay = () => {
            const turnDisplay = document.querySelector('.turn-name');
            if (turnDisplay) {
                if (!this.board_state || !this.board_state.turn) {
                    turnDisplay.innerText = '대기 중...';
                    return;
                }

                switch (this.board_state.turn) {
                    case 'cho':
                        turnDisplay.innerText = '초(楚)';
                        turnDisplay.style.color = 'green';
                        break;
                    case 'han':
                        turnDisplay.innerText = '한(漢)';
                        turnDisplay.style.color = 'red';
                        break;
                    default:
                        turnDisplay.innerText = '대기 중...';
                        turnDisplay.style.color = 'black';
                }
            }
        };
        
        // --- App Start ---
        createRoom();

        // 장기말 클릭
        // 자신의 턴이 맞는지 확인
        // 클릭한 말을 클릭된 상태로 변경(크기 키우기)
        // 클릭한 말이 이동 가능한 위치 정보 요청
        //const movablePositions = clickPiece();

        // 이동 가능한 좌표 표시
        // 이동 가능한 위치 정보 받아와 이동 가능 표시를 화면에 표시
        //displayMovablePositions(movablePositions);

        // 장기말 이동
        // 클릭한 말이 있는 상태에서 이동 가능 표시를 클릭 시
        // 말의 위치를 이동해달라고 요청
        // 업데이트된 위치 정보 받으면 updateBoardState 호출
        const movePiece = (piece) => {
            //TODO: 함수 만들기
            //
            updateBoardState();
        };
        // 차례 바꾸기
        const changeTurn = () => {};

        // 화면 전체 업데이트
        const updateBoardState = () => {
            renderBoard(boardState);
            //TODO: 게임 종료 상태인지 확인하는 함수 만들지 다른 곳에서 구현할지 생각하기
            changeTurn();
        }

        const saveGame = () => {}; // 게임 저장

        const gameHistory = () => {}; // 게임 히스토리 보기

    }

    update() {
        // 프레임마다 실행됨, 사용되지 않을 예정
    }
}

export default PlayScene;
