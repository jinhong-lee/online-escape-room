/* ============================================================
   🎮 게임 엔진 (이 파일은 수정하지 않고도 story-data.js만 고쳐서
   새 챕터/퍼즐을 추가할 수 있도록 설계되어 있습니다)
   ============================================================ */

(() => {
  const SAVE_KEY = 'escapeRoomSave_v1';
  const TYPE_SPEED_MS = 28; // 한 글자당 타이핑 속도
  // ⚠️ 개발 중 story-data.js의 scenes 배열 순서/개수를 바꾸면, 과거에 저장된
  // sceneIndex가 전혀 다른 장면을 가리키게 될 수 있습니다. 챕터 구조를 크게
  // 바꾼 뒤 테스트할 땐 브라우저에서 localStorage를 한 번 지우고 확인하세요.

  /* ---------- 배경 일러스트 (플레이스홀더 SVG) ----------
     실제 사진/그림으로 교체하고 싶으면 story-data.js의 해당 scene에
     image: 'assets/images/xxx.jpg' 를 추가하면 이 SVG 대신 그 이미지가 쓰입니다. */
  const BACKGROUNDS = {
    'cargo-hold': `
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="light1" cx="50%" cy="10%" r="70%">
            <stop offset="0%" stop-color="#3a3528" stop-opacity="0.9"/>
            <stop offset="100%" stop-color="#0a0a0f" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="400" height="300" fill="#0a0a0f"/>
        <rect width="400" height="300" fill="url(#light1)"/>
        <g fill="#15151c" stroke="#232330" stroke-width="2">
          <rect x="20" y="170" width="90" height="100"/>
          <rect x="120" y="140" width="80" height="130"/>
          <rect x="210" y="180" width="70" height="90"/>
          <rect x="290" y="150" width="100" height="120"/>
        </g>
        <rect x="170" y="0" width="60" height="80" fill="#c89b4e" opacity="0.06"/>
      </svg>`,

    'box-open': `
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="light2" cx="50%" cy="55%" r="55%">
            <stop offset="0%" stop-color="#4a3a22" stop-opacity="0.9"/>
            <stop offset="100%" stop-color="#0a0a0f" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="400" height="300" fill="#0a0a0f"/>
        <rect width="400" height="300" fill="url(#light2)"/>
        <g stroke="#3a2f1c" stroke-width="2" fill="#1c1812">
          <rect x="130" y="150" width="140" height="70"/>
          <polygon points="130,150 150,110 250,110 270,150" fill="#241e14"/>
        </g>
        <g fill="#e9e4d8" opacity="0.18">
          <path d="M150 150 q10 -20 25 0 q10 -15 25 5 q15 -20 30 0 v20 h-80 z"/>
        </g>
      </svg>`,

    'crack-wall': `
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="300" fill="#07090c"/>
        <g stroke="#1d2730" stroke-width="1">
          <line x1="0" y1="60" x2="400" y2="60"/>
          <line x1="0" y1="140" x2="400" y2="140"/>
          <line x1="0" y1="220" x2="400" y2="220"/>
          <line x1="100" y1="0" x2="100" y2="300"/>
          <line x1="300" y1="0" x2="300" y2="300"/>
        </g>
        <path d="M60 10 L130 90 L105 140 L180 190 L160 260 L210 300"
          fill="none" stroke="#bfe4f5" stroke-width="3" opacity="0.85"/>
        <path d="M60 10 L130 90 L105 140 L180 190 L160 260 L210 300"
          fill="none" stroke="#5fc8ea" stroke-width="7" opacity="0.25"/>
      </svg>`,

    'patched': `
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="300" fill="#07090c"/>
        <g stroke="#1d2730" stroke-width="1">
          <line x1="0" y1="60" x2="400" y2="60"/>
          <line x1="0" y1="140" x2="400" y2="140"/>
          <line x1="0" y1="220" x2="400" y2="220"/>
        </g>
        <g transform="rotate(18 180 150)">
          <rect x="110" y="120" width="140" height="60" rx="6" fill="#8d8167" opacity="0.9"/>
          <rect x="110" y="120" width="140" height="60" rx="6" fill="none" stroke="#5a5240" stroke-width="2"/>
        </g>
      </svg>`,

    default: `
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="300" fill="#0a0a0f"/>
        <circle cx="200" cy="150" r="60" fill="none" stroke="#2a2a35" stroke-width="2"/>
        <text x="200" y="156" text-anchor="middle" fill="#5a5862" font-size="13" font-family="monospace">image placeholder</text>
      </svg>`,
  };

  function getBackgroundHTML(key) {
    return BACKGROUNDS[key] || BACKGROUNDS.default;
  }

  /* ---------- DOM ---------- */
  const screens = {
    title: document.getElementById('screen-title'),
    game: document.getElementById('screen-game'),
    end: document.getElementById('screen-end'),
  };
  const btnStart = document.getElementById('btn-start');
  const btnContinue = document.getElementById('btn-continue');
  const btnRestartFromTitle = document.getElementById('btn-restart-from-title');
  const btnReplay = document.getElementById('btn-replay');
  const titleGameName = document.getElementById('title-game-name');

  const imageArea = document.getElementById('image-area');
  const bgLayer = document.getElementById('bg-layer');
  const bgImage = document.getElementById('bg-image');
  const bgPlaceholder = document.getElementById('bg-placeholder');
  const hotspotLayer = document.getElementById('hotspot-layer');

  const textArea = document.getElementById('text-area');
  const textContent = document.getElementById('text-content');
  const nextIndicator = document.getElementById('next-indicator');
  const bottomBar = document.getElementById('bottom-bar');
  const feedbackMsg = document.getElementById('feedback-msg');

  const inputControls = document.getElementById('puzzle-input-controls');
  const puzzleInput = document.getElementById('puzzle-input');
  const btnSubmitAnswer = document.getElementById('btn-submit-answer');

  const hotspotControls = document.getElementById('puzzle-hotspot-controls');
  const btnHint = document.getElementById('btn-hint');

  const confirmModal = document.getElementById('confirm-modal');
  const confirmModalText = document.getElementById('confirm-modal-text');
  const confirmModalOk = document.getElementById('confirm-modal-ok');
  const confirmModalCancel = document.getElementById('confirm-modal-cancel');

  /* ---------- 상태 ---------- */
  let sceneIndex = 0;
  let lineIndex = 0;
  let isTyping = false;
  let typingTimer = null;
  let wrongTries = 0;
  let awaitingAdvance = false; // 지금 탭하면 다음으로 넘어가는 상태인지

  titleGameName.textContent = GAME_TITLE;

  // 모바일 데이터처럼 느린 네트워크에서도 장면 전환이 버벅이지 않도록,
  // 시작하자마자 모든 장면의 이미지를 브라우저 캐시에 미리 받아둠 (결과 기다리지 않음)
  (function preloadAllImages() {
    const paths = new Set();
    scenes.forEach((scene) => {
      if (scene.image) paths.add(scene.image);
      if (Array.isArray(scene.lines)) {
        scene.lines.forEach((line) => {
          if (line && typeof line === 'object' && line.image) paths.add(line.image);
        });
      }
    });
    paths.forEach((path) => {
      const img = new Image();
      img.src = path;
    });
  })();

  /* ---------- 화면 전환 ---------- */
  function showScreen(name) {
    Object.values(screens).forEach((el) => el.classList.remove('active'));
    screens[name].classList.add('active');
  }

  /* ---------- 확인 모달 (초기화처럼 되돌릴 수 없는 행동 전 확인) ---------- */
  let pendingConfirmAction = null;

  function showConfirmModal(message, onConfirm) {
    confirmModalText.textContent = message;
    pendingConfirmAction = onConfirm;
    confirmModal.hidden = false;
  }

  function hideConfirmModal() {
    confirmModal.hidden = true;
    pendingConfirmAction = null;
  }

  confirmModalOk.addEventListener('click', () => {
    const action = pendingConfirmAction;
    hideConfirmModal();
    if (action) action();
  });
  confirmModalCancel.addEventListener('click', hideConfirmModal);
  confirmModal.addEventListener('click', (e) => {
    if (e.target === confirmModal) hideConfirmModal(); // 바깥 영역 탭 = 취소
  });

  /* ---------- 저장/이어하기 ---------- */
  function saveProgress() {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ sceneIndex, lineIndex }));
  }
  function loadProgress() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }
  function clearProgress() {
    localStorage.removeItem(SAVE_KEY);
  }

  function initTitleScreen() {
    const saved = loadProgress();
    const hasSave = saved && (saved.sceneIndex > 0 || saved.lineIndex > 0);
    // 저장된 진행 상황이 있으면 "이어서 하기"(주 행동)만 강조하고,
    // 없으면 "시작하기" 하나만 보여줍니다. (선택지를 1~2개로 최소화 — 동일 의미의
    // 중복 버튼을 늘어놓지 않음)
    btnStart.hidden = hasSave;
    btnContinue.hidden = !hasSave;
    btnRestartFromTitle.hidden = !hasSave;
  }

  function startGame(fromSave) {
    if (fromSave) {
      const saved = loadProgress();
      sceneIndex = saved ? saved.sceneIndex : 0;
      lineIndex = saved ? saved.lineIndex : 0;
    } else {
      sceneIndex = 0;
      lineIndex = 0;
      clearProgress();
    }
    showScreen('game');
    renderScene(sceneIndex);
  }

  /* ---------- 배경 전환 ----------
     scene.image 경로가 틀렸거나 파일이 없을 때 화면이 그냥 까맣게 뜨는 걸
     막기 위해, 실제 이미지를 미리 로드해보고 실패하면 플레이스홀더 SVG로
     자동 대체합니다. (친구가 이미지 파일을 추가할 때 오타/경로 실수가 날 수 있음)

     한 장면 안에서 줄마다 배경을 바꾸고 싶으면(line.bg/line.image) 그 줄의
     값이 scene.background/scene.image보다 우선 적용됩니다.

     ⚠️ #bg-image는 HTML에 미리 박아둔 고정 <img> 하나를 계속 재사용하고
     src만 바꿉니다. (이미지가 바뀔 때마다 <img>를 새로 만들어
     innerHTML로 갈아끼우는 방식은 절대 쓰지 마세요 — 아이폰 사파리/크롬
     (둘 다 WebKit 엔진)에서 opacity 트랜지션이 걸린 요소의 자식을
     innerHTML로 교체하면, 로딩도 성공하고 DOM에도 정상적으로 들어가는데
     화면만 까맣게 멈춰버리는 레이어 페인트 버그가 실제로 재현 확인됨.
     고정된 <img>의 src 속성만 바꾸는 방식은 전 세계에서 가장 많이 쓰이는
     표준적인 방법이라 이런 문제가 생기지 않음.) */
  function setBackground(scene, overrideKey, overrideImage) {
    const key = overrideKey || scene.background || 'default';
    const imagePath = overrideImage || scene.image;

    const applyPlaceholder = () => {
      bgImage.hidden = true;
      bgImage.removeAttribute('src');
      bgPlaceholder.innerHTML = getBackgroundHTML(key);
      bgPlaceholder.hidden = false;
      bgLayer.style.opacity = 1;
    };

    bgLayer.style.opacity = 0;
    setTimeout(() => {
      if (imagePath) {
        const tester = new Image();
        // 모바일처럼 네트워크가 느릴 때 이미지가 실제로 다 받아지기 전에
        // 화면이 먼저 밝아져서 "이미지가 안 뜬다"처럼 보이던 버그 수정 —
        // opacity 복구는 반드시 로딩이 끝난 뒤(성공/실패 둘 다)에만 실행
        tester.onload = () => {
          bgPlaceholder.hidden = true;
          bgPlaceholder.innerHTML = '';
          bgImage.src = imagePath;
          bgImage.hidden = false;
          bgLayer.style.opacity = 1;
        };
        tester.onerror = () => {
          console.warn(`[배경 이미지 로드 실패] "${imagePath}" 경로를 확인하세요. 임시로 플레이스홀더를 표시합니다.`);
          applyPlaceholder();
        };
        tester.src = imagePath;
      } else {
        applyPlaceholder();
      }
    }, 180);
  }

  /* ---------- 스토리 연출 효과 ----------
     line.effect: 'shake'(충격/흔들림) | 'flicker'(조명 깜박임)
     story-data.js에서 특정 줄에 딱 맞는 곳에만 붙여서 쓰는 용도 (남발 금지) */
  function triggerEffect(name) {
    const cls = `fx-${name}`;
    imageArea.classList.remove(cls);
    void imageArea.offsetWidth; // 리플로우 강제 → 같은 효과 연속 트리거도 재생되게
    imageArea.classList.add(cls);
  }

  /* ---------- 줄 정규화 ----------
     대사(type: 'dialogue')에는 speaker(인물명)를 지정할 수 있습니다.
     등장인물이 여러 명이어도 줄마다 speaker만 다르게 쓰면 됩니다.
     예: { text: "거기 누구 없어요?", type: 'dialogue', speaker: '???' } */
  function normalizeLine(line) {
    if (typeof line === 'string') return { text: line, type: 'narration', bg: null, image: null, speaker: null };
    return {
      text: line.text,
      type: line.type || 'narration',
      bg: line.bg || null,
      image: line.image || null, // 이 줄부터 실제 이미지로 전환하고 싶을 때 (예: 상자 여는 순간)
      speaker: line.speaker || null,
      effect: line.effect || null, // 'shake' | 'flicker' — 이 줄이 뜰 때 이미지 영역에 트리거
    };
  }

  /* ---------- 공통: 타이프라이터 ---------- */
  function typeText(targetEl, fullText, className, onDone, speakerLabel) {
    isTyping = true;
    nextIndicator.hidden = true;

    const wrapper = document.createElement('span');
    wrapper.className = `line ${className}`;

    if (speakerLabel) {
      const label = document.createElement('strong');
      label.className = 'speaker-label';
      label.textContent = `${speakerLabel} : `;
      wrapper.appendChild(label);
    }

    const typedSpan = document.createElement('span');
    typedSpan.className = 'typed-text';
    wrapper.appendChild(typedSpan);
    targetEl.appendChild(wrapper);

    let i = 0;
    clearInterval(typingTimer);
    typingTimer = setInterval(() => {
      i++;
      typedSpan.textContent = fullText.slice(0, i);
      if (i >= fullText.length) {
        clearInterval(typingTimer);
        isTyping = false;
        nextIndicator.hidden = false;
        if (onDone) onDone();
      }
    }, TYPE_SPEED_MS);

    return wrapper;
  }

  function completeTypingNow() {
    clearInterval(typingTimer);
    isTyping = false;
  }

  /* ============================================================
     스토리 장면
     ============================================================ */
  let currentStoryScene = null;

  function renderStoryScene(scene) {
    currentStoryScene = scene;
    awaitingAdvance = false;
    bottomBar.hidden = true;
    inputControls.hidden = true;
    hotspotControls.hidden = true;
    feedbackMsg.textContent = '';
    feedbackMsg.className = 'feedback-msg';
    hotspotLayer.innerHTML = '';
    setBackground(scene);
    showStoryLine(lineIndex);
  }

  function showStoryLine(idx) {
    const scene = currentStoryScene;
    const raw = scene.lines[idx];
    const line = normalizeLine(raw);

    if (line.bg || line.image) setBackground(scene, line.bg, line.image);
    if (line.effect) triggerEffect(line.effect);

    // 한 줄만 보이도록 이전 줄은 지우고 새 줄만 표시
    textContent.innerHTML = '';
    typeText(textContent, line.text, line.type, null, line.type === 'dialogue' ? line.speaker : null);
  }

  function handleStoryTap() {
    const scene = currentStoryScene;
    if (isTyping) {
      // 타이핑 중이면 즉시 완성 (화자 라벨은 그대로 두고 본문만 채움)
      const typedSpan = textContent.querySelector('.typed-text');
      const line = normalizeLine(scene.lines[lineIndex]);
      if (typedSpan) typedSpan.textContent = line.text;
      completeTypingNow();
      nextIndicator.hidden = false;
      return;
    }
    if (lineIndex < scene.lines.length - 1) {
      lineIndex++;
      saveProgress();
      showStoryLine(lineIndex);
    } else {
      // 이 장면의 마지막 줄 → 다음 장면으로
      goToNextScene();
    }
  }

  /* ============================================================
     퍼즐 장면 — 입력형
     ============================================================ */
  function renderInputPuzzle(scene) {
    bottomBar.hidden = false;
    hotspotControls.hidden = true;
    hotspotLayer.innerHTML = '';
    feedbackMsg.textContent = '';
    feedbackMsg.className = 'feedback-msg';
    wrongTries = 0;
    textContent.innerHTML = '';
    awaitingAdvance = false;
    setBackground(scene);

    typeText(textContent, scene.prompt, 'narration', () => {
      inputControls.hidden = false;
      puzzleInput.value = '';
      puzzleInput.focus();
    });
  }

  function checkInputAnswer() {
    const scene = scenes[sceneIndex];
    const val = puzzleInput.value.trim().toLowerCase();
    const answer = String(scene.answer).trim().toLowerCase();

    if (!val) {
      puzzleInput.classList.remove('wrong-shake');
      void puzzleInput.offsetWidth;
      puzzleInput.classList.add('wrong-shake');
      feedbackMsg.className = 'feedback-msg wrong';
      feedbackMsg.textContent = '정답을 입력해주세요.';
      puzzleInput.focus();
      return;
    }

    if (val === answer) {
      bottomBar.hidden = true;
      feedbackMsg.textContent = '';
      awaitingAdvance = true;
      textContent.innerHTML = '';
      typeText(textContent, scene.successText || '성공했다!', 'narration');
    } else {
      wrongTries++;
      puzzleInput.classList.remove('wrong-shake');
      void puzzleInput.offsetWidth;
      puzzleInput.classList.add('wrong-shake');
      feedbackMsg.className = 'feedback-msg wrong';
      feedbackMsg.textContent = scene.wrongFeedback || '정답이 아니다.';

      if (scene.hint && wrongTries >= (scene.hintAfterTries || 3)) {
        feedbackMsg.className = 'feedback-msg hint';
        feedbackMsg.textContent = `힌트: ${scene.hint}`;
      }

      // 오답이어도 모바일 키패드가 접히지 않도록 포커스를 다시 보장
      puzzleInput.focus();
    }
  }

  /* ============================================================
     퍼즐 장면 — 핫스팟(클릭)형
     ============================================================ */
  function renderHotspotPuzzle(scene) {
    bottomBar.hidden = false;
    inputControls.hidden = true;
    feedbackMsg.textContent = '';
    feedbackMsg.className = 'feedback-msg';
    textContent.innerHTML = '';
    awaitingAdvance = false;
    setBackground(scene);

    typeText(textContent, scene.prompt, 'narration', () => {
      hotspotControls.hidden = false;
      renderHotspots(scene);
    });
  }

  function renderHotspots(scene) {
    hotspotLayer.innerHTML = '';
    (scene.hotspots || []).forEach((spot) => {
      const el = document.createElement('div');
      el.className = 'hotspot';
      el.style.left = spot.x + '%';
      el.style.top = spot.y + '%';
      el.style.width = spot.w + '%';
      el.style.height = spot.h + '%';
      el.tabIndex = 0;
      el.setAttribute('role', 'button');
      el.setAttribute('aria-label', '여기를 탭해서 확인');

      const activate = () => {
        if (spot.correct) {
          bottomBar.hidden = true;
          feedbackMsg.className = 'feedback-msg success';
          feedbackMsg.textContent = '';
          awaitingAdvance = true;
          textContent.innerHTML = '';
          typeText(textContent, scene.successText || '찾아냈다!', 'narration');
          hotspotLayer.querySelectorAll('.hotspot').forEach((h) => (h.style.pointerEvents = 'none'));
        } else {
          el.classList.remove('wrong-shake');
          void el.offsetWidth;
          el.classList.add('wrong-shake');
          feedbackMsg.className = 'feedback-msg wrong';
          feedbackMsg.textContent = scene.wrongFeedback || '여긴 아니다.';
        }
      };

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        activate();
      });
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          activate();
        }
      });
      hotspotLayer.appendChild(el);
    });
  }

  function showHint() {
    const scene = scenes[sceneIndex];
    const correctSpot = hotspotLayer.querySelectorAll('.hotspot')[
      (scene.hotspots || []).findIndex((s) => s.correct)
    ];
    if (!correctSpot) return;
    correctSpot.classList.add('hint-pulse');
    setTimeout(() => correctSpot.classList.remove('hint-pulse'), 2500);
  }

  /* ============================================================
     장면 라우팅
     ============================================================ */
  function renderScene(idx) {
    if (idx >= scenes.length) {
      endChapter();
      return;
    }
    const scene = scenes[idx];
    if (scene.type === 'story') {
      renderStoryScene(scene);
    } else if (scene.type === 'puzzle' && scene.puzzleType === 'input') {
      renderInputPuzzle(scene);
    } else if (scene.type === 'puzzle' && scene.puzzleType === 'hotspot') {
      renderHotspotPuzzle(scene);
    }
  }

  function goToNextScene() {
    sceneIndex++;
    lineIndex = 0;
    saveProgress();
    renderScene(sceneIndex);
  }

  function endChapter() {
    clearProgress();
    showScreen('end');
  }

  /* ---------- 텍스트 영역 탭 핸들러 (상태에 따라 분기) ---------- */
  function handleTextAreaAdvance() {
    const scene = scenes[sceneIndex];

    if (awaitingAdvance) {
      // 퍼즐을 막 풀어서 성공 메시지가 떠 있는 상태 → 탭하면 다음 장면
      if (isTyping) {
        completeTypingNow();
        return;
      }
      goToNextScene();
      return;
    }

    if (!scene) return;
    if (scene.type === 'story') {
      handleStoryTap();
    }
    // 퍼즐 진행 중(아직 못 풂)일 때는 텍스트 영역 탭으로 아무 일도 일어나지 않음
  }

  textArea.addEventListener('click', handleTextAreaAdvance);
  // 키보드 사용자도 동일하게 진행할 수 있도록 Enter/Space 지원
  textArea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleTextAreaAdvance();
    }
  });

  /* ---------- 이벤트 바인딩 ---------- */
  btnStart.addEventListener('click', () => startGame(false));
  btnContinue.addEventListener('click', () => startGame(true));

  btnRestartFromTitle.addEventListener('click', () => {
    showConfirmModal('처음부터 다시 시작할까요?\n지금까지 진행 상황이 사라집니다.', () => {
      startGame(false);
    });
  });

  btnReplay.addEventListener('click', () => {
    clearProgress();
    showScreen('title');
    initTitleScreen();
  });

  // 버튼을 탭해도 입력창의 포커스가 빠지지 않도록 막음
  // (모바일에서 버튼 탭 시 기본 동작으로 input이 blur되며 키패드가 접히는 것 방지 —
  //  오답이어도 키패드가 그대로 떠 있어야 바로 다시 입력할 수 있음)
  btnSubmitAnswer.addEventListener('mousedown', (e) => e.preventDefault());
  btnSubmitAnswer.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
  btnSubmitAnswer.addEventListener('click', (e) => {
    e.stopPropagation();
    checkInputAnswer();
  });

  puzzleInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      checkInputAnswer();
      // 키보드 자체의 Done/Return 키를 누르면 의도적으로 키패드를 내림
      puzzleInput.blur();
    }
  });
  puzzleInput.addEventListener('click', (e) => e.stopPropagation());

  btnHint.addEventListener('click', (e) => {
    e.stopPropagation();
    showHint();
  });

  /* ============================================================
     🛠 제작자 전용 디버그 바 (테스트 단계 전용)
     내용 다 완성되고 배포할 때는 이 블록 + index.html의 #dev-toolbar +
     styles.css의 #dev-toolbar 관련 스타일을 통째로 삭제하면 됩니다.
     ============================================================ */
  const devPrevBtn = document.getElementById('dev-prev');
  const devNextBtn = document.getElementById('dev-next');
  const devJumpPuzzleBtn = document.getElementById('dev-jump-puzzle');
  const devRestartBtn = document.getElementById('dev-restart');
  const devRefreshBtn = document.getElementById('dev-refresh');

  const DEV_RESUME_KEY = 'escapeRoomDevResume_v1'; // 새로고침 버튼 전용, 1회성

  function devGoToScene(idx, lineIdx) {
    // 상한을 scenes.length로 묶지 않아야 "다음 내용"으로 마지막 장면 이후
    // 엔딩 화면까지 테스트할 수 있음 (renderScene이 범위 초과를 엔딩으로 처리)
    sceneIndex = Math.max(0, idx);
    lineIndex = lineIdx || 0;
    showScreen('game');
    renderScene(sceneIndex);
    saveProgress();
  }

  // 이전 내용: 같은 스토리 장면이면 한 줄 뒤로, 장면 맨 앞이면 이전 장면의 끝으로
  devPrevBtn.addEventListener('click', () => {
    const scene = scenes[sceneIndex];
    if (scene && scene.type === 'story' && lineIndex > 0) {
      devGoToScene(sceneIndex, lineIndex - 1);
      return;
    }
    if (sceneIndex === 0) return; // 맨 처음
    const prevIdx = sceneIndex - 1;
    const prevScene = scenes[prevIdx];
    const prevLine = prevScene && prevScene.type === 'story' ? prevScene.lines.length - 1 : 0;
    devGoToScene(prevIdx, prevLine);
  });

  // 다음 내용: 퍼즐을 안 풀었어도 강제로 다음 장면으로 건너뜀 (테스트 편의용)
  devNextBtn.addEventListener('click', () => {
    const scene = scenes[sceneIndex];
    if (scene && scene.type === 'story' && lineIndex < scene.lines.length - 1) {
      devGoToScene(sceneIndex, lineIndex + 1);
      return;
    }
    devGoToScene(sceneIndex + 1, 0);
  });

  // 문제로: 현재 위치 다음(없으면 처음부터 한 바퀴 돌려) 가장 가까운 퍼즐 장면으로 점프
  devJumpPuzzleBtn.addEventListener('click', () => {
    const n = scenes.length;
    for (let step = 1; step <= n; step++) {
      const idx = (sceneIndex + step) % n;
      if (scenes[idx].type === 'puzzle') {
        devGoToScene(idx, 0);
        return;
      }
    }
  });

  // 처음으로: 확인창 없이 바로 1번 장면부터 재시작 (테스트 중 반복 재생용)
  devRestartBtn.addEventListener('click', () => startGame(false));

  // 새로고침: 실제 페이지를 리로드(코드/스타일 변경 반영)하면서도
  // 지금 보고 있던 화면·장면·줄에 그대로 돌아오게 함
  function getActiveScreenName() {
    return Object.keys(screens).find((name) => screens[name].classList.contains('active')) || 'title';
  }

  devRefreshBtn.addEventListener('click', () => {
    localStorage.setItem(
      DEV_RESUME_KEY,
      JSON.stringify({ screen: getActiveScreenName(), sceneIndex, lineIndex })
    );
    location.reload();
  });

  /* ---------- 시작 ---------- */
  const devResumeRaw = localStorage.getItem(DEV_RESUME_KEY);
  if (devResumeRaw) {
    localStorage.removeItem(DEV_RESUME_KEY); // 1회성이므로 바로 소비
    try {
      const resume = JSON.parse(devResumeRaw);
      if (resume.screen === 'game') {
        sceneIndex = resume.sceneIndex || 0;
        lineIndex = resume.lineIndex || 0;
        showScreen('game');
        renderScene(sceneIndex);
      } else if (resume.screen === 'end') {
        showScreen('end');
      } else {
        initTitleScreen();
        showScreen('title');
      }
    } catch (e) {
      initTitleScreen();
      showScreen('title');
    }
  } else {
    initTitleScreen();
    showScreen('title');
  }
})();
