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

    // 2. ページ読み込み時にファーストビューの要素を完全に隠す
    const keyvisualElements = document.querySelectorAll('.keyvisual-fadeIn');
    keyvisualElements.forEach(el => {
        el.style.opacity = '0';
        el.style.visibility = 'hidden';
    });

    // 3. ファーストビューのロゴと文字を時間差でアニメーションさせる関数
    function startFirstViewAnimation() {
        const logoEl = document.querySelector('.cover_ttl img.keyvisual-fadeIn');
        const textEl = document.querySelector('.cover_ttl span.keyvisual-fadeIn');

        // 1. まずロゴをフェードイン
        if (logoEl) {
            logoEl.style.transition = 'opacity 1.2s ease, visibility 1.2s ease';
            logoEl.style.opacity = '1';
            logoEl.style.visibility = 'visible';
        }

        // 2. 少し遅れて（例: 600ms後）テキストをフェードイン
        setTimeout(() => {
            if (textEl) {
                textEl.style.transition = 'opacity 1.2s ease, visibility 1.2s ease';
                textEl.style.opacity = '1';
                textEl.style.visibility = 'visible';
            }
        }, 600);

        // 3. アニメーションが一通り始まった後にスライドショーを開始
        setTimeout(() => {
            initSlider();
        }, 1500);
    }

    // 4. ローディング演出とアニメーションの連動
    function playLoaderWithDelay() {
        if (loaderBg) {
            loaderBg.style.display = 'block';
            loaderBg.style.opacity = '1';

            // ローディングを表示しておく時間（例: 1.2秒）
            setTimeout(() => {
                loaderBg.style.transition = 'opacity 1s ease';
                loaderBg.style.opacity = '0';
                
                setTimeout(() => {
                    loaderBg.style.display = 'none';
                    // ローディングが消えたらファーストビューのアニメーション開始
                    startFirstViewAnimation();
                }, 1000);

            }, 1200);
        } else {
            startFirstViewAnimation();
        }
    }

    // 【修正後】初期状態のモーダルと認証状態の判定
    if (sessionStorage.getItem('wedding_authenticated') === 'true') {
        if (modal) modal.classList.add('is_hidden');
        
        // すでに認証済みの場合は、ページ読み込み時にローディングとアニメーションを実行する
        window.addEventListener('load', function() {
            playLoaderWithDelay();
        });
    } else {
        // 未認証の場合はモーダルを表示し、ファーストビューの文字を隠しておく
        if (modal) modal.classList.remove('is_hidden');
        const keyvisualElements = document.querySelectorAll('.keyvisual-fadeIn');
        keyvisualElements.forEach(el => {
            el.style.opacity = '0';
            el.style.visibility = 'hidden';
        });
    }

    // 【修正後】パスワード送信時の処理
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (passwordInput.value === correctPassword) {
                sessionStorage.setItem('wedding_authenticated', 'true');
                if (modal) {
                    modal.classList.add('is_hidden');
                }
                // パスワードが正解した時もローディングとアニメーションを実行する
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
        const pcSlides = document.querySelectorAll('.main_img_pc .slide');
        const spSlides = document.querySelectorAll('.main_img_sp .img');
        
        let currentSlide = 0;
        const slidesLength = Math.max(pcSlides.length, spSlides.length);

        if (slidesLength > 0) {
            // 初期状態として1枚目に activeクラスが付いている前提でインターバルを開始
            setInterval(() => {
                if (pcSlides[currentSlide]) pcSlides[currentSlide].classList.remove('active');
                if (spSlides[currentSlide]) spSlides[currentSlide].classList.remove('active');

                currentSlide = (currentSlide + 1) % slidesLength;

                if (pcSlides[currentSlide]) pcSlides[currentSlide].classList.add('active');
                if (spSlides[currentSlide]) spSlides[currentSlide].classList.add('active');
            }, 4000);
        }
    }

    // --- 以下、既存のハンバーガー・カウントダウン等の処理 ---
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

    // 各セクションのフェードイン監視
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

    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

});