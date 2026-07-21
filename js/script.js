document.addEventListener("DOMContentLoaded", function() {
    // 監視する要素を指定（フェードインさせたい要素に付与したクラス）
    const targets = document.querySelectorAll('.imgEffect_fadeIn');

    // 監視の設定
    const options = {
        root: null, // ビューポートを基準にする
        rootMargin: '0px',
        threshold: 0.2 // 要素が20%見えたら発火
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 画面内に入ったら 'is-active' クラスを付与
                entry.target.classList.add('is-active');
                // 一度表示したら監視を終了するなら以下を有効化
                // observer.unobserve(entry.target);
            }
        });
    }, options);

    // 全てのターゲットを監視対象にする
    targets.forEach(target => {
        observer.observe(target);
    });
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
        }, 4000); // 4秒ごとに切り替え
    }

    // 2. main-ttl.svg をふんわり表示
    setTimeout(() => {
        const keyvisualLogo = document.querySelector('.keyvisual-fadeIn');
        if (keyvisualLogo) {
            keyvisualLogo.classList.add('is-active');
        }
    }, 500); // 0.5秒後にフェードイン開始

    // 3. ナビゲーションのスクロール追従制御
    const nav = document.getElementById('sticky-nav');
    const firstView = document.querySelector('.first-view');

    if (nav && firstView) {
        window.addEventListener('scroll', function() {
            const firstViewHeight = firstView.offsetHeight;
            if (window.scrollY > firstViewHeight / 2) {
                // ファーストビューの中腹を過ぎたら固定へ切り替え
                nav.classList.add('fixed');
            } else {
                nav.classList.remove('fixed');
            }
        });
    }

    // 4. その他の要素のフェードイン監視（Intersection Observer）
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
        // 初期状態で非表示にしていたものを監視対象にする
        target.style.visibility = 'hidden';
        observer.observe(target);
    });
});



document.addEventListener("DOMContentLoaded", function() {
    // --- 既存の処理（スライドショーやフェードイン、スクロール追従など）はそのまま ---

    // --- ハンバーガーメニューの開閉制御 ---
    const menuToggle = document.getElementById('menu-toggle');
    const navList = document.getElementById('nav-list');

    if (menuToggle && navList) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('is-active');
            navList.classList.toggle('is-open');
        });

        // メニュー内のリンクをクリックしたときに、自動でメニューを閉じる
        const navLinks = navList.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('is-active');
                navList.classList.remove('is-open');
            });
        });
    }
});