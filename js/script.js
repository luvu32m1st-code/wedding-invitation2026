window.addEventListener('load', function() {
    const loaderBg = document.getElementById('loader-bg');
    if (loaderBg) {
        loaderBg.style.transition = 'opacity 0.8s ease';
        loaderBg.style.opacity = '0';
        setTimeout(() => {
            loaderBg.style.display = 'none';
        }, 800);
    }
});

document.addEventListener("DOMContentLoaded", function() {
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
});