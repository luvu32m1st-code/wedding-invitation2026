window.addEventListener('load', function() {
    const loaderBg = document.getElementById('loader-bg');
    if (loaderBg) {
        // パスワード認証を既にクリアしている場合、または認証後に動く処理
        // 最低4秒（4000ミリ秒）待ってからフェードアウトを開始する
        setTimeout(() => {
            loaderBg.style.transition = 'opacity 2s ease'; // 2秒かけてゆっくり消す
            loaderBg.style.opacity = '0';
            setTimeout(() => {
                loaderBg.style.display = 'none';
            }, 1500); // トラジッション時間と合わせる
        }, 4000); // 3秒間表示し続ける
    }
});

document.addEventListener("DOMContentLoaded", function() {

    // --- パスワード認証の処理 ---
    const modal = document.getElementById('password-modal');
    const form = document.getElementById('password-form');
    const passwordInput = document.getElementById('access-password');
    const errorMessage = document.getElementById('password-error');
    const loaderBg = document.getElementById('loader-bg');

    // ※ここに設定したいパスワード（合言葉）を指定してください
    const correctPassword = "20260823"; 

    // ローディング画面を4秒表示したあとに消す共通関数
    function hideLoaderWithDelay() {
        if (loaderBg) {
            setTimeout(() => {
                loaderBg.style.transition = 'opacity 1.5s ease';
                loaderBg.style.opacity = '0';
                setTimeout(() => {
                    loaderBg.style.display = 'none';
                }, 1500);
            }, 4000); // 4秒ホールド
        }
    }

    // すでに認証済みの場合は最初からパスワードモーダルを隠す
    if (sessionStorage.getItem('wedding_authenticated') === 'true') {
        if (modal) modal.classList.add('is-hidden');
        // 認証済みならページ読み込み完了後に3秒ローディングを表示
        window.addEventListener('load', function() {
            hideLoaderWithDelay();
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
                // パスワード入力完了後もここから4秒間ローディングを表示・演出する
                hideLoaderWithDelay();
            } else {
                // 認証失敗
                if (errorMessage) {
                    errorMessage.style.display = 'block';
                }
                passwordInput.value = '';
            }
        });
    }

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

    // 2. 中央のタイトル＆ロゴ（ふんわり表示）
    setTimeout(() => {
        const keyvisualElements = document.querySelectorAll('.keyvisual-fadeIn');
        keyvisualElements.forEach(el => {
            el.classList.add('is-active');
        });
    }, 800);

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