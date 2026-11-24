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
window.LOTTO_PLUGINS.push({
  title: '🥚 幸運恐龍蛋孵化',
  hint: '選一顆恐龍蛋輕輕敲開，看看會孵出幾分寶貝！',
  render: function(container, claimPointsFn) {
    // 注入專屬樣式（只會注入一次，風格對齊主程式手繪粗框風）
    if (!document.getElementById('dino-egg-style')) {
      const st = document.createElement('style');
      st.id = 'dino-egg-style';
      st.textContent = `
        @keyframes eggWobble {
          0%, 100% { transform: rotate(0deg) scale(1.05); }
          25% { transform: rotate(-10deg) scale(1.08); }
          50% { transform: rotate(10deg) scale(1.08); }
          75% { transform: rotate(-6deg) scale(1.06); }
        }
        .egg-stage {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          max-width: 380px;
          margin: 10px auto 14px;
          padding: 14px 10px;
          background: #E9F4E0;
          border: 3px solid #3E3A39;
          border-radius: 20px;
          box-shadow: 4px 4px 0 #3E3A39;
        }
        .egg-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 12px 6px;
          border: 3px solid #3E3A39;
          border-radius: 18px;
          background: #FFFEFA;
          box-shadow: 3px 3px 0 #3E3A39;
          transition: transform .15s, background .2s;
        }
        .egg-btn:hover:not(:disabled) {
          transform: translateY(-5px);
        }
        .egg-shell {
          width: 58px;
          height: 70px;
          border: 3px solid #3E3A39;
          border-radius: 50% 50% 45% 45% / 60% 60% 40% 40%;
          display: grid;
          place-items: center;
          font-size: 26px;
          font-weight: 700;
          position: relative;
          box-shadow: inset -4px -4px 0 rgba(62,58,57,.12);
        }
        .egg-btn[data-egg="0"] .egg-shell { background: #F6D27A; }
        .egg-btn[data-egg="1"] .egg-shell { background: #A8D3E6; }
        .egg-btn[data-egg="2"] .egg-shell { background: #F2A497; }
        .egg-btn.hatching .egg-shell {
          animation: eggWobble .55s ease-in-out;
        }
        .egg-btn.hatched {
          background: #FFFDF5;
          border-color: #D9453D;
          transform: scale(1.06);
        }
        .egg-btn.hatched .egg-shell {
          background: #FFF3C4;
          border-style: dashed;
          border-color: #D9453D;
          color: #D9453D;
          font-size: 24px;
          animation: pop .4s cubic-bezier(.3, 1.6, .5, 1);
        }
        .egg-btn.dim {
          opacity: 0.48;
        }
        .egg-lbl {
          font-size: 16px;
          font-weight: 700;
        }
      `;
      document.head.appendChild(st);
    }

    const eggs = [
      { name: '黃金蛋', spot: '✨' },
      { name: '晴空蛋', spot: '☁️' },
      { name: '珊瑚蛋', spot: '🌸' }
    ];
    let busy = false;

    container.innerHTML = `
      <div class="egg-stage">
        ${eggs.map((eg, i) => `
          <button type="button" class="egg-btn" data-egg="${i}">
            <div class="egg-shell">${eg.spot}</div>
            <span class="egg-lbl">${eg.name}</span>
          </button>
        `).join('')}
      </div>
    `;

    container.querySelector('.egg-stage').addEventListener('click', async (ev) => {
      const btn = ev.target.closest('[data-egg]');
      if (!btn || busy) return;
      busy = true;

      const pickedIdx = +btn.dataset.egg;
      const allBtns = [...container.querySelectorAll('.egg-btn')];
      allBtns.forEach(b => b.disabled = true);

      btn.classList.add('hatching');
      document.getElementById('lottoMsg').textContent = '喀啦喀啦…恐龍蛋正在搖晃孵化中！';

      try {
        const [res] = await Promise.all([
          claimPointsFn(),
          new Promise(r => setTimeout(r, 600))
        ]);

        btn.classList.remove('hatching');
        if (res && (res.ok || res.already)) {
          const dinos = { 1: '🦕', 2: '🦖', 3: '🐉' };
          const others = [1, 2, 3].filter(n => n !== res.points);
          let oi = 0;

          allBtns.forEach((b, idx) => {
            const shell = b.querySelector('.egg-shell');
            const lbl = b.querySelector('.egg-lbl');
            if (idx === pickedIdx) {
              b.classList.add('hatched');
              shell.textContent = dinos[res.points] || '🦖';
              lbl.innerHTML = `<span style="color:#D9453D">+${res.points} 分</span>`;
            } else {
              const p = others[oi++];
              b.classList.add('dim');
              shell.textContent = dinos[p] || '🦕';
              lbl.textContent = `+${p} 分`;
            }
          });
        }
      } catch (e) {
        btn.classList.remove('hatching');
        document.getElementById('lottoMsg').textContent = e.message || '發生錯誤，請重試';
        allBtns.forEach(b => b.disabled = false);
        busy = false;
      }
    });
  }
});
/* =====================================================================
 * 外掛擴充包（6 款新遊戲）：
 * 1. 幸運扭蛋機  2. 幸運爬格子  3. 勇士下樓梯
 * 4. 夜市丟瓶子  5. 全倒保齡球  6. 幸運擲骰子
 * ===================================================================== */

(function() {
  if (!document.getElementById('lotto-extra-6-style')) {
    const st = document.createElement('style');
    st.id = 'lotto-extra-6-style';
    st.textContent = `
      /* 1. 幸運扭蛋機 */
      @keyframes gachaShake {
        0%,100%{transform:rotate(0deg)}
        20%{transform:rotate(-8deg)}
        40%{transform:rotate(8deg)}
        60%{transform:rotate(-6deg)}
        80%{transform:rotate(6deg)}
      }
      @keyframes capsuleDrop {
        0%{transform:translateY(-28px) scale(.4);opacity:0}
        60%{transform:translateY(5px) scale(1.15);opacity:1}
        100%{transform:translateY(0) scale(1);opacity:1}
      }
      .gacha-machine{width:220px;margin:6px auto 12px;display:flex;flex-direction:column;align-items:center}
      .gacha-globe{width:154px;height:132px;border:3px solid #3E3A39;border-radius:70px 70px 28px 28px;background:radial-gradient(circle at 30% 25%,#FFF,#EBF6FC);box-shadow:4px 4px 0 #3E3A39;position:relative;overflow:hidden}
      .gacha-globe.shake{animation:gachaShake .65s ease-in-out}
      .gacha-mini{position:absolute;width:34px;height:34px;border-radius:50%;border:2.5px solid #3E3A39}
      .gacha-base{width:170px;height:78px;margin-top:-6px;background:#F2A497;border:3px solid #3E3A39;border-radius:16px;box-shadow:4px 4px 0 #3E3A39;display:flex;align-items:center;justify-content:space-around;padding:0 12px}
      .gacha-knob{width:46px;height:46px;border-radius:50%;background:#F6D27A;border:3px solid #3E3A39;box-shadow:2px 2px 0 #3E3A39;font-weight:700;font-size:14px;display:grid;place-items:center;transition:transform .4s}
      .gacha-knob.turned{transform:rotate(180deg)}
      .gacha-exit{width:56px;height:52px;background:#3E3A39;border-radius:12px;display:grid;place-items:center}
      .gacha-cap{width:46px;height:46px;border-radius:50%;border:2.5px solid #3E3A39;background:linear-gradient(135deg,#F6D27A 50%,#A8D3E6 50%);font-weight:700;font-size:18px;color:#D9453D;display:grid;place-items:center;animation:capsuleDrop .45s ease-out}

      /* 2. 爬格子 */
      .ladder-box{max-width:340px;margin:8px auto 12px;padding:12px;background:#FFF7E6;border:3px solid #3E3A39;border-radius:18px;box-shadow:4px 4px 0 #3E3A39}
      .ladder-top{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:6px}
      .ladder-start{padding:6px;border:2.5px solid #3E3A39;border-radius:12px;background:#A8D3E6;font-weight:700;font-size:17px}
      .ladder-start.on{background:#F6D27A;border-color:#D9453D;transform:scale(1.06)}
      .ladder-svg{width:100%;height:110px;display:block}
      .ladder-bot{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:6px}
      .ladder-end{padding:6px;border:2.5px solid #3E3A39;border-radius:12px;background:#FFFEFA;font-weight:700;font-size:19px}
      .ladder-end.win{background:#FFF3C4;border-color:#D9453D;color:#D9453D;animation:pop .35s}

      /* 3. 下樓梯 */
      .stairs-stage{position:relative;height:185px;max-width:340px;margin:8px auto 12px;padding:12px;background:#EBF6FC;border:3px solid #3E3A39;border-radius:18px;box-shadow:4px 4px 0 #3E3A39;overflow:hidden}
      .stair-step{position:absolute;width:82px;height:18px;background:#B9DAA5;border:2.5px solid #3E3A39;border-radius:8px;box-shadow:2px 2px 0 #3E3A39}
      .stair-walker{position:absolute;font-size:30px;transition:all .28s cubic-bezier(.3,1.5,.5,1);z-index:2}
      .stair-chest{position:absolute;right:20px;bottom:14px;padding:4px 10px;background:#F6D27A;border:2.5px solid #3E3A39;border-radius:12px;font-weight:700;font-size:18px}

      /* 4. 丟瓶子 */
      .bottle-stage{max-width:360px;margin:8px auto 12px;padding:14px 10px;background:#FDEBE6;border:3px solid #3E3A39;border-radius:18px;box-shadow:4px 4px 0 #3E3A39}
      .bottle-row{display:flex;justify-content:center;gap:14px;margin-bottom:14px;min-height:74px;align-items:flex-end}
      .milk-bottle{width:46px;height:66px;border:3px solid #3E3A39;border-radius:14px 14px 8px 8px;background:#FFFEFA;box-shadow:2px 2px 0 #3E3A39;display:grid;place-items:center;font-weight:700;font-size:16px;transition:transform .45s ease-out,opacity .45s}
      .milk-bottle.fall-l{transform:translate(-18px,10px) rotate(-75deg);opacity:.45;background:#F6D27A}
      .milk-bottle.fall-r{transform:translate(18px,10px) rotate(75deg);opacity:.45;background:#F6D27A}

      /* 5. 保齡球 */
      .bowl-lane{position:relative;height:180px;max-width:340px;margin:8px auto 12px;padding:12px;background:#FFF3D1;border:3px solid #3E3A39;border-radius:18px;box-shadow:4px 4px 0 #3E3A39;overflow:hidden;display:flex;flex-direction:column;justify-content:space-between;align-items:center}
      .bowl-pins{display:flex;gap:10px;margin-top:6px}
      .bpin{width:28px;height:48px;background:#FFF;border:2.5px solid #3E3A39;border-radius:12px 12px 8px 8px;position:relative;transition:transform .4s ease-out}
      .bpin::after{content:'';position:absolute;top:12px;left:0;right:0;height:5px;background:#D9453D}
      .bpin.knock{transform:translateY(-10px) rotate(82deg);opacity:.4}
      .bowl-ball{width:46px;height:46px;border-radius:50%;background:#14456A;border:3px solid #3E3A39;color:#FFF;display:grid;place-items:center;font-size:20px;transition:transform .55s ease-in}
      .bowl-ball.roll{transform:translateY(-105px) scale(.75)}

      /* 6. 擲骰子 */
      @keyframes diceRoll {
        0%{transform:rotate(0deg) scale(1)}
        25%{transform:rotate(90deg) scale(1.18)}
        50%{transform:rotate(180deg) scale(.92)}
        75%{transform:rotate(270deg) scale(1.18)}
        100%{transform:rotate(360deg) scale(1)}
      }
      .dice-stage{height:150px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;margin:8px auto 12px}
      .dice-cube{width:92px;height:92px;background:#FFFEFA;border:4px solid #3E3A39;border-radius:20px;box-shadow:5px 5px 0 #3E3A39;display:grid;place-items:center;font-size:44px;font-weight:700;color:#D9453D}
      .dice-cube.rolling{animation:diceRoll .65s linear infinite}
    `;
    document.head.appendChild(st);
  }
})();

/* 1. 幸運扭蛋機 */
window.LOTTO_PLUGINS.push({
  title: '🔮 幸運扭蛋機',
  hint: '轉動黃色旋鈕，看看會掉出哪顆幸運扭蛋！',
  render: function(container, claimPointsFn) {
    let busy = false;
    container.innerHTML = `
      <div class="gacha-machine">
        <div class="gacha-globe" id="gGlobe">
          <div class="gacha-mini" style="bottom:8px;left:22px;background:#F6D27A"></div>
          <div class="gacha-mini" style="bottom:12px;left:58px;background:#A8D3E6"></div>
          <div class="gacha-mini" style="bottom:8px;right:24px;background:#B9DAA5"></div>
          <div class="gacha-mini" style="bottom:36px;left:40px;background:#F2A497"></div>
          <div class="gacha-mini" style="bottom:34px;right:40px;background:#FFF"></div>
        </div>
        <div class="gacha-base">
          <button type="button" class="gacha-knob" id="gKnob">轉動</button>
          <div class="gacha-exit" id="gExit"></div>
        </div>
      </div>
    `;
    container.querySelector('#gKnob').onclick = async function() {
      if (busy) return;
      busy = true;
      this.disabled = true;
      this.classList.add('turned');
      container.querySelector('#gGlobe').classList.add('shake');
      document.getElementById('lottoMsg').textContent = '喀啦喀啦…扭蛋正在滾下來！';
      try {
        const [res] = await Promise.all([claimPointsFn(), new Promise(r => setTimeout(r, 650))]);
        container.querySelector('#gGlobe').classList.remove('shake');
        if (res && (res.ok || res.already)) {
          container.querySelector('#gExit').innerHTML = `<div class="gacha-cap">+${res.points}</div>`;
        }
      } catch (e) {
        document.getElementById('lottoMsg').textContent = e.message || '發生錯誤';
        this.disabled = false;
        busy = false;
      }
    };
  }
});

/* 2. 幸運爬格子 */
window.LOTTO_PLUGINS.push({
  title: '🪜 幸運爬格子',
  hint: '選擇一條起點路線，順著橫線爬向終點寶箱！',
  render: function(container, claimPointsFn) {
    let busy = false;
    // 預設三種連通路徑：[起點0->終點, 起點1->終點, 起點2->終點]
    const routes = [
      { map: [1, 2, 0], paths: ['M45,5 V35 H155 V75 H155 V105', 'M155,5 V55 H265 V105', 'M265,5 V35 H155 V75 H45 V105'] },
      { map: [2, 0, 1], paths: ['M45,5 V45 H265 V105', 'M155,5 V30 H45 V105', 'M265,5 V70 H155 V105'] }
    ];
    const pickedRoute = routes[Math.floor(Math.random() * routes.length)];

    container.innerHTML = `
      <div class="ladder-box">
        <div class="ladder-top">
          <button type="button" class="ladder-start" data-ls="0">路線 A</button>
          <button type="button" class="ladder-start" data-ls="1">路線 B</button>
          <button type="button" class="ladder-start" data-ls="2">路線 C</button>
        </div>
        <svg class="ladder-svg" viewBox="0 0 310 110">
          <line x1="45" y1="5" x2="45" y2="105" stroke="#3E3A39" stroke-width="4" stroke-linecap="round"/>
          <line x1="155" y1="5" x2="155" y2="105" stroke="#3E3A39" stroke-width="4" stroke-linecap="round"/>
          <line x1="265" y1="5" x2="265" y2="105" stroke="#3E3A39" stroke-width="4" stroke-linecap="round"/>
          <line x1="45" y1="35" x2="155" y2="35" stroke="#3E3A39" stroke-width="4"/>
          <line x1="155" y1="55" x2="265" y2="55" stroke="#3E3A39" stroke-width="4"/>
          <line x1="45" y1="75" x2="155" y2="75" stroke="#3E3A39" stroke-width="4"/>
          <path id="lTrace" d="" fill="none" stroke="#D9453D" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div class="ladder-bot">
          <div class="ladder-end" id="le0">？</div>
          <div class="ladder-end" id="le1">？</div>
          <div class="ladder-end" id="le2">？</div>
        </div>
      </div>
    `;

    container.querySelector('.ladder-top').addEventListener('click', async (ev) => {
      const btn = ev.target.closest('[data-ls]');
      if (!btn || busy) return;
      busy = true;
      const startIdx = +btn.dataset.ls;
      container.querySelectorAll('.ladder-start').forEach(b => b.disabled = true);
      btn.classList.add('on');
      container.querySelector('#lTrace').setAttribute('d', pickedRoute.paths[startIdx]);
      document.getElementById('lottoMsg').textContent = '順著梯子往下爬囉…';

      try {
        const [res] = await Promise.all([claimPointsFn(), new Promise(r => setTimeout(r, 550))]);
        if (res && (res.ok || res.already)) {
          const endIdx = pickedRoute.map[startIdx];
          const others = [1, 2, 3].filter(n => n !== res.points);
          let oi = 0;
          [0, 1, 2].forEach(i => {
            const el = container.querySelector('#le' + i);
            if (i === endIdx) {
              el.classList.add('win');
              el.textContent = `+${res.points} 分`;
            } else {
              el.textContent = `+${others[oi++]} 分`;
            }
          });
        }
      } catch (e) {
        document.getElementById('lottoMsg').textContent = e.message || '發生錯誤';
        busy = false;
      }
    });
  }
});

/* 3. 勇士下樓梯 */
window.LOTTO_PLUGINS.push({
  title: '🏃 勇士下樓梯',
  hint: '點擊「開始下樓梯」，一路跳到底層打開寶箱！',
  render: function(container, claimPointsFn) {
    let busy = false;
    container.innerHTML = `
      <div class="stairs-stage">
        <div class="stair-step" style="top:38px;left:22px"></div>
        <div class="stair-step" style="top:84px;left:95px"></div>
        <div class="stair-step" style="top:130px;left:168px"></div>
        <div class="stair-walker" id="sWalker" style="top:4px;left:45px">🧒</div>
        <div class="stair-chest" id="sChest">🎁 寶箱</div>
      </div>
      <button type="button" class="btn green sm" id="stairGo">一路往下跳！ 🏃</button>
    `;

    container.querySelector('#stairGo').onclick = async function() {
      if (busy) return;
      busy = true;
      this.disabled = true;
      const walker = container.querySelector('#sWalker');
      document.getElementById('lottoMsg').textContent = '咚！咚！咚！勇敢往下跳樓梯…';

      const steps = [
        { top: '50px', left: '118px' },
        { top: '96px', left: '190px' },
        { top: '136px', left: '235px' }
      ];
      const apiPromise = claimPointsFn();
      for (const pos of steps) {
        await new Promise(r => setTimeout(r, 240));
        walker.style.top = pos.top;
        walker.style.left = pos.left;
      }

      try {
        const res = await apiPromise;
        if (res && (res.ok || res.already)) {
          const chest = container.querySelector('#sChest');
          chest.style.background = '#FFF3C4';
          chest.style.color = '#D9453D';
          chest.textContent = `🎉 +${res.points} 分`;
        }
      } catch (e) {
        document.getElementById('lottoMsg').textContent = e.message || '發生錯誤';
        this.disabled = false;
        busy = false;
      }
    };
  }
});

/* 4. 夜市丟瓶子 */
window.LOTTO_PLUGINS.push({
  title: '🍼 夜市丟沙包砸瓶子',
  hint: '瞄準牛奶瓶疊疊樂，用力丟出沙包！',
  render: function(container, claimPointsFn) {
    let busy = false;
    container.innerHTML = `
      <div class="bottle-stage">
        <div class="bottle-row">
          <div class="milk-bottle" id="mb0">🥛</div>
          <div class="milk-bottle" id="mb1">🥛</div>
          <div class="milk-bottle" id="mb2">🥛</div>
          <div class="milk-bottle" id="mb3">🥛</div>
        </div>
        <button type="button" class="btn green sm" id="throwBag">丟出沙包！ 🥎</button>
      </div>
    `;

    container.querySelector('#throwBag').onclick = async function() {
      if (busy) return;
      busy = true;
      this.disabled = true;
      document.getElementById('lottoMsg').textContent = '咻——沙包飛向牛奶瓶！';

      try {
        const [res] = await Promise.all([claimPointsFn(), new Promise(r => setTimeout(r, 450))]);
        if (res && (res.ok || res.already)) {
          // 依得分擊倒對應數量的瓶子（1分倒2瓶、2分倒3瓶、3分全倒4瓶）
          const knockCount = res.points + 1;
          for (let i = 0; i < knockCount; i++) {
            const b = container.querySelector('#mb' + i);
            b.classList.add(i % 2 === 0 ? 'fall-l' : 'fall-r');
            b.textContent = '💥';
          }
        }
      } catch (e) {
        document.getElementById('lottoMsg').textContent = e.message || '發生錯誤';
        this.disabled = false;
        busy = false;
      }
    };
  }
});

/* 5. 全倒保齡球 */
window.LOTTO_PLUGINS.push({
  title: '🎳 幸運保齡球',
  hint: '滾出保齡球，看看能撞倒幾支球瓶！',
  render: function(container, claimPointsFn) {
    let busy = false;
    container.innerHTML = `
      <div class="bowl-lane">
        <div class="bowl-pins">
          <div class="bpin" id="bp0"></div>
          <div class="bpin" id="bp1"></div>
          <div class="bpin" id="bp2"></div>
          <div class="bpin" id="bp3"></div>
          <div class="bpin" id="bp4"></div>
        </div>
        <div class="bowl-ball" id="bBall">🎳</div>
      </div>
      <button type="button" class="btn green sm" id="rollBowl">滾出保齡球！ 🎳</button>
    `;

    container.querySelector('#rollBowl').onclick = async function() {
      if (busy) return;
      busy = true;
      this.disabled = true;
      container.querySelector('#bBall').classList.add('roll');
      document.getElementById('lottoMsg').textContent = '咕嚕嚕嚕…保齡球衝向球瓶！';

      try {
        const [res] = await Promise.all([claimPointsFn(), new Promise(r => setTimeout(r, 550))]);
        if (res && (res.ok || res.already)) {
          const knock = res.points === 3 ? 5 : (res.points === 2 ? 4 : 3);
          for (let i = 0; i < knock; i++) {
            container.querySelector('#bp' + i).classList.add('knock');
          }
        }
      } catch (e) {
        document.getElementById('lottoMsg').textContent = e.message || '發生錯誤';
        this.disabled = false;
        busy = false;
      }
    };
  }
});

/* 6. 幸運擲骰子 */
window.LOTTO_PLUGINS.push({
  title: '🎲 幸運大骰子',
  hint: '點擊「擲出骰子」，看看骰出幾分幸運點數！',
  render: function(container, claimPointsFn) {
    let busy = false;
    container.innerHTML = `
      <div class="dice-stage">
        <div class="dice-cube" id="dCube">🎲</div>
      </div>
      <button type="button" class="btn green sm" id="rollDice">擲出大骰子！ 🎲</button>
    `;

    container.querySelector('#rollDice').onclick = async function() {
      if (busy) return;
      busy = true;
      this.disabled = true;
      const cube = container.querySelector('#dCube');
      cube.classList.add('rolling');
      document.getElementById('lottoMsg').textContent = '骰子在空中翻滾中…';

      const faces = ['+1', '+2', '+3', '⭐'];
      let idx = 0;
      const iv = setInterval(() => {
        cube.textContent = faces[idx++ % faces.length];
      }, 90);

      try {
        const [res] = await Promise.all([claimPointsFn(), new Promise(r => setTimeout(r, 700))]);
        clearInterval(iv);
        cube.classList.remove('rolling');
        if (res && (res.ok || res.already)) {
          cube.textContent = `+${res.points}`;
        }
      } catch (e) {
        clearInterval(iv);
        cube.classList.remove('rolling');
        document.getElementById('lottoMsg').textContent = e.message || '發生錯誤';
        this.disabled = false;
        busy = false;
      }
    };
  }
});
