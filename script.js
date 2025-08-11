document.addEventListener('DOMContentLoaded', () => {
    // 게임 상태
    const gameState = {
        hints: {}, // 획득한 힌트 저장 (예: {speaker: '2'})
        isGameWon: {
            speaker: false,
            clock: false,
            computer: false,
            book: false
        }
    };

    const finalPassword = "2025";

    // 모달 및 오브젝트 요소 가져오기
    const modalContainer = document.getElementById('modal-container');
    const modals = {
        speaker: document.getElementById('speaker-modal'),
        clock: document.getElementById('clock-modal'),
        computer: document.getElementById('computer-modal'),
        book: document.getElementById('book-modal'),
        door: document.getElementById('door-modal'),
    };

    // 힌트 표시 영역
    const hintList = document.getElementById('hint-list');

    // 모달 열기 함수
    function openModal(modalName) {
        modalContainer.classList.remove('hidden');
        for (const key in modals) {
            modals[key].classList.add('hidden');
        }
        modals[modalName].classList.remove('hidden');
    }

    // 모달 닫기 함수
    function closeModal() {
        modalContainer.classList.add('hidden');
    }

    // 모든 닫기 버튼에 이벤트 리스너 추가
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    // 힌트 획득 및 표시 함수
    function gainHint(gameName, hint) {
        if (!gameState.hints[gameName]) {
            gameState.hints[gameName] = hint;
            gameState.isGameWon[gameName] = true;
            
            const li = document.createElement('li');
            li.textContent = `힌트: ${hint}`;
            hintList.appendChild(li);
        }
    }


    // --- 오브젝트 클릭 이벤트 ---
    document.getElementById('speaker-obj').addEventListener('click', () => {
        if (gameState.isGameWon.speaker) {
            alert('이미 이 퍼즐은 해결했습니다.');
            return;
        }
        openModal('speaker');
    });

    document.getElementById('clock-obj').addEventListener('click', () => {
        if (gameState.isGameWon.clock) {
            alert('이미 이 퍼즐은 해결했습니다.');
            return;
        }
        openModal('clock');
    });

    document.getElementById('computer-obj').addEventListener('click', () => {
        if (gameState.isGameWon.computer) {
            alert('이미 이 퍼즐은 해결했습니다.');
            return;
        }
        openModal('computer');
    });

    document.getElementById('book-obj').addEventListener('click', () => {
        if (gameState.isGameWon.book) {
            alert('이미 이 퍼즐은 해결했습니다.');
            return;
        }
        openModal('book');
    });

    document.getElementById('door-obj').addEventListener('click', () => openModal('door'));


    // --- 게임별 로직 ---

    // 1. 스피커 게임
    const correctSequence = ['1', '3', '2', '4'];
    let playerSequence = [];
    const playerSequenceDisplay = document.getElementById('player-sequence');
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    function playTone(freq, duration) {
        const oscillator = audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
        oscillator.connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + duration);
    }

    document.getElementById('play-sound-btn').addEventListener('click', () => {
        correctSequence.forEach((sound, index) => {
            setTimeout(() => {
                // 삐-, 삑-, 지지직, 띵- 을 주파수로 표현
                if(sound === '1') playTone(440, 0.3); // 삐-
                if(sound === '2') playTone(587, 0.3); // 삑-
                if(sound === '3') playTone(220, 0.3); // 지지직(낮은음)
                if(sound === '4') playTone(880, 0.3); // 띵-
            }, index * 500);
        });
    });

    document.querySelectorAll('.sound-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const sound = btn.dataset.sound;
            playerSequence.push(sound);
            playerSequenceDisplay.textContent = playerSequence.join(' ');

            if (playerSequence.length === correctSequence.length) {
                if (JSON.stringify(playerSequence) === JSON.stringify(correctSequence)) {
                    alert("정확한 소리입니다! 첫 번째 비밀번호 힌트: 2");
                    gainHint('speaker', '2');
                    closeModal();
                } else {
                    alert("순서가 틀렸습니다. 다시 시도하세요.");
                }
                playerSequence = [];
                playerSequenceDisplay.textContent = "";
            }
        });
    });


    // 2. 시계 게임
    document.getElementById('clock-submit').addEventListener('click', () => {
        const answer = document.getElementById('clock-answer').value;
        if (answer === '0') {
            alert("정답입니다! 시간의 흐름 속에서 무(無)의 의미를 아는군요. 두 번째 비밀번호 힌트: 0");
            gainHint('clock', '0');
            closeModal();
        } else {
            alert('틀렸습니다. 다시 생각해보세요.');
        }
        document.getElementById('clock-answer').value = '';
    });

    // 3. 컴퓨터 게임
    document.getElementById('computer-submit').addEventListener('click', () => {
        const answer = document.getElementById('computer-answer').value.toUpperCase();
        if (answer === 'NETWORK') {
            alert("SYSTEM ACCESS GRANTED. 교실의 스피커 개수를 확인하십시오. 세 번째 비밀번호 힌트: 2");
            gainHint('computer', '2');
            closeModal();
        } else {
            alert('ACCESS DENIED. 잘못된 명령어입니다.');
        }
        document.getElementById('computer-answer').value = '';
    });

    // 4. 책 게임
    document.querySelectorAll('.book-item').forEach(book => {
        book.addEventListener('click', (e) => {
            if (e.target.classList.contains('correct-book')) {
                alert("마지막 단서를 찾았군요! 네 번째 비밀번호 힌트: 5");
                gainHint('book', '5');
                closeModal();
            } else {
                alert('이 책에는 별다른 내용이 없는 것 같다.');
            }
        });
    });

    // 5. 문 (키패드) 로직
    const passwordDisplay = document.getElementById('password-display');
    let currentPassword = '';

    document.querySelectorAll('.key').forEach(key => {
        key.addEventListener('click', () => {
            if (currentPassword.length < 4) {
                currentPassword += key.textContent;
                updatePasswordDisplay();
            }
        });
    });

    document.getElementById('clear-btn').addEventListener('click', () => {
        currentPassword = '';
        updatePasswordDisplay();
    });
    
    document.getElementById('enter-btn').addEventListener('click', () => {
        if(currentPassword === finalPassword) {
            closeModal();
            document.getElementById('success-modal').classList.remove('hidden');
        } else {
            alert('비밀번호가 틀렸습니다.');
            currentPassword = '';
            updatePasswordDisplay();
        }
    });

    function updatePasswordDisplay() {
        passwordDisplay.textContent = currentPassword.padEnd(4, '-');
    }
    
    // 다시 시작 버튼
    document.getElementById('restart-btn').addEventListener('click', () => {
        window.location.reload();
    });

});