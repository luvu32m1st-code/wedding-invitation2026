// 1. ローディング画面の制御
$(function() {
    var h = $(window).height();
    var w = $(window).width();
    $('#loader-bg ,#loader').width(w).height(h).css('display','block');
});

$(window).on('load', function () {
    stopload();
});

function stopload(){
    $('#loader-bg').delay(800).fadeOut(800);
    $('#loader').delay(600).fadeOut(300);
}

document.addEventListener("DOMContentLoaded", function() {
    // 2. ファーストビューの画像スライドショー
    const slides = document.querySelectorAll('.main_img_slider .slide');
    let currentSlide = 0;

    if (slides.length > 0) {
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 4000);
    }

    // 3. 中央のタイトル＆ロゴ（ふんわり表示）
    setTimeout(() => {
        const keyvisualElements = document.querySelectorAll('.keyvisual-fadeIn');
        keyvisualElements.forEach(el => {
            el.classList.add('is-active');
        });
    }, 500);

    // 4. ナビゲーションのスクロール追従制御
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

    // 5. ハンバーガーメニューの開閉制御（スマホ用）
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

    // 6. 挙式日までの自動カウントダウン
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
});

// 7. スクロール時のフェードインアニメーション（ご提示いただいた分岐ロジック）
$(document).ready(function(){
    if (window.matchMedia( '(min-width: 481px)' ).matches) {
        $('.imgEffect_fadeIn').css('visibility','hidden');
        $('.imgEffect_bottom_top').css('visibility','hidden');
        $('.imgEffect_bottom_top-one-quarter').css('visibility','hidden');
        
        $(window).scroll(function(){
            var windowHeight = $(window).height(),
            topWindow = $(window).scrollTop();
            
            $('.imgEffect_fadeIn').each(function(){
                var objectPosition = $(this).offset().top,
                objectHeight = $(this).outerHeight(),
                objectIgnition = objectPosition + objectHeight / 2;
                if(topWindow > objectIgnition - windowHeight + 0){
                    $(this).addClass("is-active");
                    $(this).css('visibility', 'visible');
                }
            });
            $('.imgEffect_bottom_top').each(function(){
                var objectPosition = $(this).offset().top,
                objectHeight = $(this).outerHeight(),
                objectIgnition = objectPosition + objectHeight / 2;
                if(topWindow > objectIgnition - windowHeight + 0){
                    $(this).addClass("is-active");
                    $(this).css('visibility', 'visible');
                }
            });
            $('.imgEffect_bottom_top-one-quarter').each(function(){
                var objectPosition = $(this).offset().top,
                objectHeight = $(this).outerHeight(),
                objectIgnition = objectPosition + objectHeight / 4;
                if(topWindow > objectIgnition - windowHeight + 0){
                    $(this).addClass("is-active");
                    $(this).css('visibility', 'visible');
                }
            });
        });
    } else {
        $('.imgEffect_fadeIn').css('visibility','hidden');
        $('.imgEffect_bottom_top').css('visibility','hidden');
        $('.imgEffect_bottom_top-one-quarter').css('visibility','hidden');
        
        $(window).scroll(function(){
            var windowHeight = $(window).height(),
            topWindow = $(window).scrollTop();
            
            $('.imgEffect_fadeIn').each(function(){
                var objectPosition = $(this).offset().top,
                objectHeight = $(this).outerHeight(),
                objectIgnition = objectPosition + objectHeight / 3;
                if(topWindow > objectIgnition - windowHeight + 0){
                    $(this).addClass("is-active");
                    $(this).css('visibility', 'visible');
                }
            });
            $('.imgEffect_bottom_top').each(function(){
                var objectPosition = $(this).offset().top,
                objectHeight = $(this).outerHeight(),
                objectIgnition = objectPosition + objectHeight / 3;
                if(topWindow > objectIgnition - windowHeight + 0){
                    $(this).addClass("is-active");
                    $(this).css('visibility', 'visible');
                }
            });
            $('.imgEffect_bottom_top-one-quarter').each(function(){
                var objectPosition = $(this).offset().top,
                objectHeight = $(this).outerHeight(),
                objectIgnition = objectPosition + objectHeight / 4;
                if(topWindow > objectIgnition - windowHeight + 0){
                    $(this).addClass("is-active");
                    $(this).css('visibility', 'visible');
                }
            });
        });
    }
});