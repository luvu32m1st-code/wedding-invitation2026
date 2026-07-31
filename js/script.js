document.addEventListener("DOMContentLoaded", function() {

    // --- パスワード認証とローディングの連動制御 ---
    const modal = document.getElementById('password-modal');
    const form = document.getElementById('password-form');
    const passwordInput = document.getElementById('access-password');
    const errorMessage = document.getElementById('password-error');
    const loaderBg = document.getElementById('loader-bg');

    const correctPassword = "20260823"; // 設定したいパスワード

    // 【修正点①】ファーストビューのフェードインアニメーションを開始する関数
    function startFirstViewAnimation() {
        const keyvisualElements = document.querySelectorAll('.keyvisual-fadeIn');
        keyvisualElements.forEach(el => {
            el.classList.add('is-active');
        });
    }

    // 【修正点②】ローディングを一定時間表示し、消え切ったあとにアニメーションを発火させる共通関数
    function playLoaderWithDelay() {
        if (loaderBg) {
            setTimeout(() => {
                loaderBg.style.transition = 'opacity 2s ease'; // 2秒かけてゆっくり消す
                loaderBg.style.opacity = '0';
                setTimeout(() => {
                    loaderBg.style.display = 'none';
                    // ローディングが完全に消えた瞬間にファーストビューのアニメーションを開始
                    startFirstViewAnimation();
                }, 2000); // フェードアウト時間（2秒）と合わせる
            }, 4000); // 4秒間しっかり表示
        } else {
            // ローディング要素がない場合はすぐにアニメーション開始
            startFirstViewAnimation();
        }
    }

    // 【修正点③】すでに認証済みの場合は最初からパスワードモーダルを隠してローディングへ
    if (sessionStorage.getItem('wedding_authenticated') === 'true') {
        if (modal) modal.classList.add('is-hidden');
        window.addEventListener('load', function() {
            playLoaderWithDelay();
        });
    }

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (passwordInput.value === correctPassword) {
                // 認証成功：セッション保持 ＆ モーダルを隠す
                sessionStorage.setItem('wedding_authenticated', 'true');
                if (modal) {
                    modal.classList.add('is-hidden');
                }
                // パスワード入力完了後もここからローディングを表示・演出し、終了後にアニメーション
                playLoaderWithDelay();
            } else {
                // 認証失敗
                if (errorMessage) {
                    errorMessage.style.display = 'block';
                }
                passwordInput.value = '';
            }
        });
    }

    // 【修正点④】一番上にあった単体の window.load は重複するため削除し、未認証時の通常ロード用に統合
    window.addEventListener('load', function() {
        if (sessionStorage.getItem('wedding_authenticated') !== 'true') {
            playLoaderWithDelay();
        }
    });

    // 1. ファーストビューの画像スライドショー
    const slides = document.querySelectorAll('.main_img_slider .slide');
    let currentSlide = 0;

    if (slides.length > 0) {
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 4000);
    }

    // （※以前ここにあった「2. 中央のタイトル＆ロゴのsetTimeout」は、ローディング連動の `startFirstViewAnimation` に移行したため削除しました）

    // 3. ナビゲーションのスクロール追従制御
    const nav = document.getElementById('sticky-nav');
    const firstView = document.querySelector('.first-view');

    if (nav && firstView) {
        window.addEventListener('scroll', function() {
            const firstViewHeight = firstView.offsetHeight;
            if (window.scrollY > firstViewHeight - 100) {
                nav.classList.add('fixed');
            } else {
                nav.classList.remove('fixed');
            }
        });
    }

    // 4. ハンバーガーメニューの開閉制御（スマホ用）
    const menuToggle = document.getElementById('menu-toggle');
    const navList = document.getElementById('nav-list');

    if (menuToggle && navList) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('is-active');
            navList.classList.toggle('is-open');
        });

        const navLinks = navList.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('is-active');
                navList.classList.remove('is-open');
            });
        });
    }

    // 5. 挙式日（2026年8月23日 日本時間）までの自動カウントダウン
    function updateCountdown() {
        const targetDate = new Date('2026-08-23T00:00:00+09:00').getTime();
        const now = new Date().getTime();
        const diff = targetDate - now;

        const daysEl = document.getElementById('countdown_days');
        const hoursEl = document.getElementById('countdown_hours');
        const minutesEl = document.getElementById('countdown_minutes');
        const secondsEl = document.getElementById('countdown_seconds');

        if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            if (daysEl) daysEl.textContent = days;
            if (hoursEl) hoursEl.textContent = hours;
            if (minutesEl) minutesEl.textContent = minutes;
            if (secondsEl) secondsEl.textContent = seconds;
        } else {
            if (daysEl) daysEl.textContent = '0';
            if (hoursEl) hoursEl.textContent = '0';
            if (minutesEl) minutesEl.textContent = '0';
            if (secondsEl) secondsEl.textContent = '0';
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // 6. 各セクションのフェードイン監視
    const targets = document.querySelectorAll('.imgEffect_fadeIn, .imgEffect_bottom_top');
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-active');
                entry.target.style.visibility = 'visible';
            }
        });
    }, options);

    targets.forEach(target => {
        target.style.visibility = 'hidden';
        observer.observe(target);
    });

    // トップへ戻るボタンのスムーズスクロール
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

});