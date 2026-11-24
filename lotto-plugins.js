window.LOTTO_PLUGINS.push({
  title: '🔨 幸運打地鼠',
  hint: '快敲一隻探頭的地鼠吧！',
  render: function(container, claimPointsFn) {
    container.innerHTML = `<button class="btn green" id="moleBtn">🐹 敲我！</button>`;
    container.querySelector('#moleBtn').onclick = async function() {
      this.disabled = true;
      const res = await claimPointsFn(); // 自動向 GAS 抽分數並更新看板
      this.textContent = '獲得 +' + res.points + ' 分！';
    };
  }
});
