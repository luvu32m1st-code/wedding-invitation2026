document.addEventListener("DOMContentLoaded", function() {

    // --- 要素の取得 ---
    const modal = document.getElementById('password-modal');
    const form = document.getElementById('password-form');
    const passwordInput = document.getElementById('access-password');
    const errorMessage = document.getElementById('password-error');
    const loaderBg = document.getElementById('loader-bg');
    const passCheck = document.getElementById('passcheck');

    const correctPassword = "20260823"; // 設定したいパスワード

    // 1. パスワードのマスク表示・非表示切り替え
    if (passCheck && passwordInput) {
        passCheck.addEventListener('change', function() {
            passwordInput.type = this.checked ? 'text' : 'password';
        });
    }

    // 2. ページ読み込み時にファーストビューのロゴと文字を完全に隠す
    const keyvisualElements = document.querySelectorAll('.keyvisual-fadeIn');
    keyvisualElements.forEach(el => {
        el.style.opacity = '0';
        el.style.visibility = 'hidden';
    });

    // 3. ファーストビューのフェードインアニメーション開始関数
    function startFirstViewAnimation() {
        const svgEl = document.querySelector('.cover_svg.keyvisual-fadeIn');
        const textEl = document.querySelector('#main h1 span.keyvisual-fadeIn');

        if (svgEl) {
            svgEl.style.transition = 'opacity 1.5s ease, visibility 1.5s ease';
            svgEl.style.opacity = '1';
            svgEl.style.visibility = 'visible';
        }

        setTimeout(() => {
            if (textEl) {
                textEl.style.transition = 'opacity 1.5s ease, visibility 1.5s ease';
                textEl.style.opacity = '1';
                textEl.style.visibility = 'visible';
            }
        }, 800);
    }

    // 4. ローディング演出とアニメーション・スライドショーの連動
    function playLoaderWithDelay() {
        if (loaderBg) {
            loaderBg.style.display = 'block';
            loaderBg.style.opacity = '1';

            setTimeout(() => {
                loaderBg.style.transition = 'opacity 1s ease';
                loaderBg.style.opacity = '0';
                
                setTimeout(() => {
                    loaderBg.style.display = 'none';
                    startFirstViewAnimation();
                    initSlider();
                }, 1000);

            }, 1000);
        } else {
            startFirstViewAnimation();
            initSlider();
        }
    }

    // 初期状態のモーダル表示判定
    if (sessionStorage.getItem('wedding_authenticated') === 'true') {
        if (modal) modal.classList.add('is_hidden');
    } else {
        if (modal) modal.classList.remove('is_hidden');
    }

    // ページ読み込み完了時の処理
    window.addEventListener('load', function() {
        if (sessionStorage.getItem('wedding_authenticated') === 'true') {
            playLoaderWithDelay();
        }
    });

    // パスワード送信時の処理
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (passwordInput.value === correctPassword) {
                sessionStorage.setItem('wedding_authenticated', 'true');
                if (modal) {
                    modal.classList.add('is_hidden');
                }
                playLoaderWithDelay();
            } else {
                if (errorMessage) {
                    errorMessage.style.display = 'block';
                }
                passwordInput.value = '';
            }
        });
    }

    // 5. 画像スライドショー制御
    function initSlider() {
        // ※ HTML側のクラスに合わせて調整 (.slide または .main_img_pc .slide 等)
        const slides = document.querySelectorAll('.main_img_pc .slide, .main_img_sp .img');
        let currentSlide = 0;

        if (slides.length > 0) {
            setTimeout(() => {
                setInterval(() => {
                    slides[currentSlide].classList.remove('active');
                    currentSlide = (currentSlide + 1) % slides.length;
                    slides[currentSlide].classList.add('active');
                }, 4000);
            }, 1000);
        }
    }

    // 6. ハンバーガーメニューの開閉制御（スマホ用）
    const navToggle = document.getElementById('nav-toggle');
    const mobileHead = document.getElementById('mobile-head');

    if (navToggle && mobileHead) {
        navToggle.addEventListener('click', function() {
            mobileHead.classList.toggle('open');
        });

        const navLinks = document.querySelectorAll('#global-nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileHead.classList.remove('open');
            });
        });
    }

    // 7. 挙式日までの自動カウントダウン
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
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // 8. 各セクションのフェードイン監視
    const targets = document.querySelectorAll('.imgEffect_fadeIn, .imgEffect_bottom_top');
    const options = { root: null, rootMargin: '0px', threshold: 0.1 };

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
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

});