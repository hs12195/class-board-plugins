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
window.LOTTO_PLUGINS.push({
  title: '🧧 懷舊童玩戳戳樂',
  hint: '選一個喜歡的格子用力戳下去吧！',
  render: function(container, claimPointsFn) {
    // 9 個可愛格子封面圖示
    const covers = ['⭐', '🍀', '🎈', '🎁', '🌈', '🍎', '🚀', '🐱', '👑'];
    let busy = false;

    // 注入專屬樣式（只會注入一次，風格對齊原本的粗框手繪風）
    if (!document.getElementById('poke-plugin-style')) {
      const st = document.createElement('style');
      st.id = 'poke-plugin-style';
      st.textContent = `
        .poke-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          max-width: 310px;
          margin: 8px auto 14px;
          padding: 12px;
          background: #F2A497;
          border: 3px solid #3E3A39;
          border-radius: 20px;
          box-shadow: 4px 4px 0 #3E3A39;
        }
        .poke-cell {
          aspect-ratio: 1 / 1;
          border: 3px solid #3E3A39;
          border-radius: 14px;
          background: radial-gradient(circle, #FFFDF5 60%, #F6D27A 100%);
          box-shadow: 2px 2px 0 #3E3A39;
          font-size: 28px;
          font-weight: 700;
          display: grid;
          place-items: center;
          transition: transform .12s;
        }
        .poke-cell:hover:not(:disabled) {
          transform: scale(1.06);
        }
        .poke-cell.poked {
          background: #3E3A39;
          color: #F6D27A;
          border-style: dashed;
          border-color: #D9453D;
          font-size: 26px;
          animation: pop .38s cubic-bezier(.3, 1.6, .5, 1);
        }
        .poke-cell.dim {
          opacity: 0.45;
        }
      `;
      document.head.appendChild(st);
    }

    // 渲染 3x3 戳戳樂盤面
    container.innerHTML = `
      <div class="poke-grid">
        ${covers.map((ic, idx) => `
          <button type="button" class="poke-cell" data-poke="${idx}">${ic}</button>
        `).join('')}
      </div>
    `;

    // 綁定點擊戳破事件
    container.querySelector('.poke-grid').addEventListener('click', async (ev) => {
      const btn = ev.target.closest('[data-poke]');
      if (!btn || busy) return;
      busy = true;

      const allCells = [...container.querySelectorAll('.poke-cell')];
      allCells.forEach(c => c.disabled = true);

      // 戳破音效視覺回饋
      btn.classList.add('poked');
      btn.textContent = '💥';
      document.getElementById('lottoMsg').textContent = '啵！戳破紙張，看看裡面藏了幾分…';

      try {
        // 呼叫主程式提供的領分函式（會自動打 GAS 的 drawLottery 並同步看板）
        const [res] = await Promise.all([
          claimPointsFn(),
          new Promise(r => setTimeout(r, 500))
        ]);

        if (res && (res.ok || res.already)) {
          btn.textContent = '+' + res.points + '分';
          allCells.forEach(c => {
            if (c !== btn) c.classList.add('dim');
          });
        }
      } catch (e) {
        document.getElementById('lottoMsg').textContent = e.message || '發生錯誤，請重試';
        allCells.forEach(c => {
          c.disabled = false;
          c.classList.remove('poked');
        });
        busy = false;
      }
    });
  }
});
