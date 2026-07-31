document.addEventListener("DOMContentLoaded", function() {

    // --- パスワード認証とローディングの連動制御 ---
    const modal = document.getElementById('password-modal');
    const form = document.getElementById('password-form');
    const passwordInput = document.getElementById('access-password');
    const errorMessage = document.getElementById('password-error');
    const loaderBg = document.getElementById('loader-bg');

    const correctPassword = "20260823"; // 設定したいパスワード

    // ファーストビューのフェードインアニメーションを開始する関数
    function startFirstViewAnimation() {
        const keyvisualElements = document.querySelectorAll('.keyvisual-fadeIn');
        keyvisualElements.forEach(el => {
            el.classList.add('is-active');
        });
    }

    // ローディングを一定時間表示し、消えたあとにアニメーションを発火させる共通関数
    function playLoaderWithDelay() {
        if (loaderBg) {
            // ローディングを少し見せたらすぐにフェードアウト開始（例: 0.5秒後）
            setTimeout(() => {
                loaderBg.style.transition = 'opacity 1s ease'; // 1秒かけてスッと消す
                loaderBg.style.opacity = '0';
                
                // フェードアウトの完了（1秒後）を待たずに、消え始めた瞬間（または直後）にアニメーションを開始する
                setTimeout(() => {
                    loaderBg.style.display = 'none';
                }, 1000); // 消えるアニメーション時間と合わせる

                // ★ローディングが消え始めるのと同時にファーストビューのアニメーションを発火
                startFirstViewAnimation();

            }, 1000); // ローディングを表示しておく時間（1秒）
        } else {
            startFirstViewAnimation();
        }
    }

    // すでに認証済みの場合は最初からパスワードモーダルを隠す
    if (sessionStorage.getItem('wedding_authenticated') === 'true') {
        if (modal) {
            modal.classList.add('is-hidden');
        }
    }

    // ページ読み込み完了時の処理
    window.addEventListener('load', function() {
        if (sessionStorage.getItem('wedding_authenticated') === 'true') {
            // 認証済みならそのままローディング演出へ
            playLoaderWithDelay();
        } else {
            // 未認証の場合はローディングを表示しつつ、裏でパスワード入力を待つ
            // （※ローディングを消したくない場合はここで playLoaderWithDelay を呼ばず、認証成功時のみ回す）
            if (loaderBg) {
                loaderBg.style.opacity = '1';
                loaderBg.style.display = 'block';
            }
        }
    });

    // パスワード送信時の処理
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (passwordInput.value === correctPassword) {
                // 認証成功：セッション保持 ＆ モーダルを隠す
                sessionStorage.setItem('wedding_authenticated', 'true');
                if (modal) {
                    modal.classList.add('is-hidden');
                }
                // パスワード突破後にローディング演出を開始し、終了後にアニメーション
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

    // 5. 挙式日までの自動カウントダウン
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

    // 6. 各セクションのフェードイン監視（スクロールするたびに発火）
    const targets = document.querySelectorAll('.imgEffect_fadeIn, .imgEffect_bottom_top');
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 画面内に入ったら表示
                entry.target.classList.add('is-active');
                entry.target.style.visibility = 'visible';
            } else {
                // 画面外に出たらクラスを外し、再度スクロールした時に再アニメーションさせる場合
                entry.target.classList.remove('is-active');
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