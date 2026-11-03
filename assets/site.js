/* 共通処理: Amazonリンクへのタグ付与 / 投げ銭ボタン / アプリ用のサイト帯 */
(function () {
  var C = window.SITE_CONFIG || {};
  var base = document.documentElement.getAttribute("data-base") || "./";

  function amazonUrl(q) {
    var u = "https://www.amazon.co.jp/s?k=" + encodeURIComponent(q);
    if (C.amazonTag) u += "&tag=" + encodeURIComponent(C.amazonTag);
    return u;
  }

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    // <a data-amazon="検索語"> にリンクを付ける
    document.querySelectorAll("a[data-amazon]").forEach(function (a) {
      a.href = amazonUrl(a.getAttribute("data-amazon"));
      a.rel = "sponsored noopener";
      a.target = "_blank";
    });

    // 投げ銭ボタン
    document.querySelectorAll("[data-tip]").forEach(function (el) {
      if (!C.tipUrl) { el.hidden = true; return; }
      el.hidden = false;
      var a = el.tagName === "A" ? el : el.querySelector("a");
      if (a) { a.href = C.tipUrl; a.target = "_blank"; a.rel = "noopener"; if (!a.textContent.trim()) a.textContent = C.tipLabel; }
    });

    // 問い合わせ先
    document.querySelectorAll("[data-contact]").forEach(function (el) {
      if (!C.contact) { el.textContent = "（準備中）"; return; }
      if (/^https?:/.test(C.contact)) { el.innerHTML = '<a href="' + C.contact + '" target="_blank" rel="noopener">お問い合わせフォーム</a>'; }
      else { el.textContent = C.contact; }
    });

    // アプリページ: 下部にサイト帯を足す
    if (document.documentElement.hasAttribute("data-app")) {
      var bar = document.createElement("aside");
      bar.className = "gl-bar";
      bar.setAttribute("aria-label", "サイト情報");
      bar.innerHTML =
        '<div class="gl-in">' +
          '<a class="gl-home" href="' + base + '">← ' + (C.siteName || "ホーム") + '</a>' +
          '<span class="gl-links">' +
            '<a href="' + base + 'gear.html">おすすめ機材</a>' +
            (C.tipUrl ? '<a href="' + C.tipUrl + '" target="_blank" rel="noopener">' + C.tipLabel + '</a>' : '') +
            '<a href="' + base + 'about.html">運営者情報・免責事項</a>' +
          '</span>' +
          '<p class="gl-note">このアプリは非公式のファン制作による練習ツールです。記載のアーティスト・レーベル・メーカーとは一切関係がなく、承認も受けていません。音はすべてブラウザ内で合成したオリジナルの例で、原曲の音源や採譜は含みません。各商標は各権利者に帰属します。</p>' +
        '</div>';
      document.body.appendChild(bar);
    }
  });
})();
