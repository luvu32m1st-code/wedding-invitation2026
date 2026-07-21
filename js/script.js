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