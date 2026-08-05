document.addEventListener("DOMContentLoaded", function() {

    // --- パスワード認証とローディングの連動制御 ---
    const modal = document.getElementById('password-modal');
    const form = document.getElementById('password-form');
    const passwordInput = document.getElementById('access-password');
    const errorMessage = document.getElementById('password-error');
    const loaderBg = document.getElementById('loader-bg');

    const correctPassword = "20260823"; // 設定したいパスワード

    // 1. ページ読み込み時にファーストビューのロゴと文字を完全に隠す
    const keyvisualElements = document.querySelectorAll('.keyvisual-fadeIn');
    keyvisualElements.forEach(el => {
        el.style.opacity = '0';
        el.style.visibility = 'hidden';
    });


    // 2. ファーストビューのフェードインアニメーションを開始する関数（時間差制御）
    function startFirstViewAnimation() {
        const svgEl = document.querySelector('.cover_svg.keyvisual-fadeIn');
        const textEl = document.querySelector('#main h1 span.keyvisual-fadeIn');

        // 1. ロゴ（SVG）を先にフェードイン
        if (svgEl) {
            svgEl.style.transition = 'opacity 1.5s ease, visibility 1.5s ease';
            svgEl.style.opacity = '1';
            svgEl.style.visibility = 'visible';
        }

        // 2. 文字部分を少し遅れて（0.8秒後）フェードイン
        setTimeout(() => {
            if (textEl) {
                textEl.style.transition = 'opacity 1.5s ease, visibility 1.5s ease';
                textEl.style.opacity = '1';
                textEl.style.visibility = 'visible';
            }
        }, 800); // ロゴから文字が出るまでの時間差（ミリ秒）
    }


    // 3. ローディングを一定時間表示し、消え切ったあとにアニメーションを発火させる関数
    function playLoaderWithDelay() {
        if (loaderBg) {
            setTimeout(() => {
                loaderBg.style.transition = 'opacity 1s ease';
                loaderBg.style.opacity = '0';
                
                setTimeout(() => {
                    loaderBg.style.display = 'none';
                    
                    // ★ローディングが完全に消えたタイミングで中央アニメーションを発火
                    startFirstViewAnimation();

                    // ★同時にスライドショーの待機タイマーもスタート
                    initSlider();

                }, 1000); // フェードアウトの時間（1秒）

            }, 1000); // ローディング表示時間（1秒）
        } else {
            startFirstViewAnimation();
            initSlider();
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

    // 4. ファーストビューの画像スライドショー（中央アニメーション終了後に連動開始）
    function initSlider() {
        const pcSlides = document.querySelectorAll('.main_img_pc_slider .slide');
        const spSlides = document.querySelectorAll('.main_img_sp_slider .slide');
        let currentSlide = 0;
        const maxSlides = Math.max(pcSlides.length, spSlides.length);

        if (maxSlides > 0) {
            // 中央のロゴ＆文字のフェードインがすべて完了したあとにスタート
            setTimeout(() => {
                setInterval(() => {
                    // 現在のスライドの active を外す
                    if (pcSlides[currentSlide]) {
                        pcSlides[currentSlide].classList.remove('active');
                    }
                    if (spSlides[currentSlide]) {
                        spSlides[currentSlide].classList.remove('active');
                    }

                    // 次のスライドインデックスを計算
                    currentSlide = (currentSlide + 1) % maxSlides;

                    // 次のスライドに active を付与
                    if (pcSlides[currentSlide]) {
                        pcSlides[currentSlide].classList.add('active');
                    }
                    if (spSlides[currentSlide]) {
                        spSlides[currentSlide].classList.add('active');
                    }
                }, 4000);
            }, 1000);
        }
    }
        
    // 5. ナビゲーションのスクロール追従制御
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
        } else {
            if (daysEl) daysEl.textContent = '0';
            if (hoursEl) hoursEl.textContent = '0';
            if (minutesEl) minutesEl.textContent = '0';
            if (secondsEl) secondsEl.textContent = '0';
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // 8. 各セクションのフェードイン監視（スクロールするたびに発火）
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

    // --- 9. ナビゲーションのスクロール連動アクティブ切り替え ---
    const navMappings = [
        { className: 'nav-top', target: document.querySelector('.first-view') },
        { className: 'nav-message', target: document.querySelector('#message') },
        { className: 'nav-profile', target: document.querySelector('#profile') },
        { className: 'nav-countdown', target: document.querySelector('#countdown') },
        { className: 'nav-events', target: document.querySelector('#events') },
        { className: 'nav-rsvp', target: document.querySelector('#rsvp') }
    ];

    function updateActiveNav() {
        let activeClassName = '';
        const scrollPosition = window.scrollY + window.innerHeight / 3;
        const firstViewEl = document.querySelector('.first-view');
        const firstViewHeight = firstViewEl ? firstViewEl.offsetHeight : 600;

        if (window.scrollY < firstViewHeight - 150) {
            activeClassName = '';
        } else {
            navMappings.forEach(item => {
                if (item.target) {
                    const rect = item.target.getBoundingClientRect();
                    const top = rect.top + window.scrollY;
                    if (scrollPosition >= top) {
                        activeClassName = item.className;
                    }
                }
            });
        }

        navMappings.forEach(item => {
            const elements = document.querySelectorAll('.' + item.className);
            elements.forEach(el => {
                if (item.className === activeClassName) {
                    el.classList.add('nav-active');
                } else {
                    el.classList.remove('nav-active');
                }
            });
        });
    }

    window.addEventListener('scroll', updateActiveNav);
    window.addEventListener('resize', updateActiveNav);
    updateActiveNav();

});