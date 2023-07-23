window.addEventListener('load', function () {// 画像の遅延読み込み
    var $button = document.querySelector('.toggle-menu-button');// ボタン要素
    var $menu = document.querySelector('.header-site-menu');// メニュー要素
    $button.addEventListener('click', function () {// ボタンをクリックしたとき
        if ($menu.classList.contains('is-show')) {// メニューが表示されているとき
            $menu.classList.remove('is-show');// 表示を解除する
        }
        else {
            $menu.classList.add('is-show');// 表示する
        }
    });
});
$(function () {
    $(window).scroll (function () {// スクロールしたとき
        $("nav.floating").stop().animate(// ナビゲーションを
            {"top": $(window).scrollTop() + 100},// スクロールに合わせて移動
        0.000001);// なめらかに移動する
    });
});