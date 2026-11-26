/* =====================================================================
 * 教室聯絡簿外掛抽獎模組（共 8 款互動遊戲）
 * ===================================================================== */

(function() {
  if (!document.getElementById('lotto-all-plugins-style')) {
    const st = document.createElement('style');
    st.id = 'lotto-all-plugins-style';
    st.textContent = `
      /* 2. 戳戳樂 */
      .poke-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-width:310px;margin:8px auto 14px;padding:12px;background:#F2A497;border:3px solid #3E3A39;border-radius:20px;box-shadow:4px 4px 0 #3E3A39}
      .poke-cell{aspect-ratio:1/1;border:3px solid #3E3A39;border-radius:14px;background:radial-gradient(circle,#FFFDF5 60%,#F6D27A 100%);box-shadow:2px 2px 0 #3E3A39;font-size:28px;font-weight:700;display:grid;place-items:center;transition:transform .12s}
      .poke-cell:hover:not(:disabled){transform:scale(1.06)}
      .poke-cell.poked{background:#3E3A39;color:#F6D27A;border-style:dashed;border-color:#D9453D;font-size:26px;animation:pop .38s cubic-bezier(.3,1.6,.5,1)}
      .poke-cell.dim{opacity:.45}

      /* 3. 恐龍蛋 */
      @keyframes eggWobble{0%,100%{transform:rotate(0deg) scale(1.05)}25%{transform:rotate(-10deg) scale(1.08)}50%{transform:rotate(10deg) scale(1.08)}75%{transform:rotate(-6deg) scale(1.06)}}
      .egg-stage{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;max-width:380px;margin:10px auto 14px;padding:14px 10px;background:#E9F4E0;border:3px solid #3E3A39;border-radius:20px;box-shadow:4px 4px 0 #3E3A39}
      .egg-btn{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:12px 6px;border:3px solid #3E3A39;border-radius:18px;background:#FFFEFA;box-shadow:3px 3px 0 #3E3A39;transition:transform .15s}
      .egg-btn:hover:not(:disabled){transform:translateY(-5px)}
      .egg-shell{width:58px;height:70px;border:3px solid #3E3A39;border-radius:50% 50% 45% 45% / 60% 60% 40% 40%;display:grid;place-items:center;font-size:26px;font-weight:700}
      .egg-btn[data-egg="0"] .egg-shell{background:#F6D27A}
      .egg-btn[data-egg="1"] .egg-shell{background:#A8D3E6}
      .egg-btn[data-egg="2"] .egg-shell{background:#F2A497}
      .egg-btn.hatching .egg-shell{animation:eggWobble .55s ease-in-out}
      .egg-btn.hatched{background:#FFFDF5;border-color:#D9453D;transform:scale(1.06)}
      .egg-btn.hatched .egg-shell{background:#FFF3C4;border-style:dashed;border-color:#D9453D;color:#D9453D;font-size:24px;animation:pop .4s}
      .egg-btn.dim{opacity:.48}
      .egg-lbl{font-size:16px;font-weight:700}

      /* 4. 扭蛋機 */
      @keyframes gachaShake{0%,100%{transform:rotate(0deg)}20%{transform:rotate(-8deg)}40%{transform:rotate(8deg)}60%{transform:rotate(-6deg)}80%{transform:rotate(6deg)}}
      @keyframes capsuleDrop{0%{transform:translateY(-28px) scale(.4);opacity:0}60%{transform:translateY(5px) scale(1.15);opacity:1}100%{transform:translateY(0) scale(1);opacity:1}}
      .gacha-machine{width:220px;margin:6px auto 12px;display:flex;flex-direction:column;align-items:center}
      .gacha-globe{width:154px;height:132px;border:3px solid #3E3A39;border-radius:70px 70px 28px 28px;background:radial-gradient(circle at 30% 25%,#FFF,#EBF6FC);box-shadow:4px 4px 0 #3E3A39;position:relative;overflow:hidden}
      .gacha-globe.shake{animation:gachaShake .65s ease-in-out}
      .gacha-mini{position:absolute;width:34px;height:34px;border-radius:50%;border:2.5px solid #3E3A39}
      .gacha-base{width:170px;height:78px;margin-top:-6px;background:#F2A497;border:3px solid #3E3A39;border-radius:16px;box-shadow:4px 4px 0 #3E3A39;display:flex;align-items:center;justify-content:space-around;padding:0 12px}
      .gacha-knob{width:46px;height:46px;border-radius:50%;background:#F6D27A;border:3px solid #3E3A39;box-shadow:2px 2px 0 #3E3A39;font-weight:700;font-size:14px;display:grid;place-items:center;transition:transform .4s}
      .gacha-knob.turned{transform:rotate(180deg)}
      .gacha-exit{width:56px;height:52px;background:#3E3A39;border-radius:12px;display:grid;place-items:center}
      .gacha-cap{width:46px;height:46px;border-radius:50%;border:2.5px solid #3E3A39;background:linear-gradient(135deg,#F6D27A 50%,#A8D3E6 50%);font-weight:700;font-size:18px;color:#D9453D;display:grid;place-items:center;animation:capsuleDrop .45s ease-out}

      /* 5. 爬格子 */
      .ladder-box{max-width:340px;margin:8px auto 12px;padding:12px;background:#FFF7E6;border:3px solid #3E3A39;border-radius:18px;box-shadow:4px 4px 0 #3E3A39}
      .ladder-top{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:6px}
      .ladder-start{padding:6px;border:2.5px solid #3E3A39;border-radius:12px;background:#A8D3E6;font-weight:700;font-size:17px}
      .ladder-start.on{background:#F6D27A;border-color:#D9453D;transform:scale(1.06)}
      .ladder-svg{width:100%;height:110px;display:block}
      .ladder-bot{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:6px}
      .ladder-end{padding:6px;border:2.5px solid #3E3A39;border-radius:12px;background:#FFFEFA;font-weight:700;font-size:19px}
      .ladder-end.win{background:#FFF3C4;border-color:#D9453D;color:#D9453D;animation:pop .35s}

      /* 6. 下樓梯 */
      .stairs-stage{position:relative;height:185px;max-width:340px;margin:8px auto 12px;padding:12px;background:#EBF6FC;border:3px solid #3E3A39;border-radius:18px;box-shadow:4px 4px 0 #3E3A39;overflow:hidden}
      .stair-step{position:absolute;width:82px;height:18px;background:#B9DAA5;border:2.5px solid #3E3A39;border-radius:8px;box-shadow:2px 2px 0 #3E3A39}
      .stair-walker{position:absolute;font-size:30px;transition:all .28s cubic-bezier(.3,1.5,.5,1);z-index:2}
      .stair-chest{position:absolute;right:20px;bottom:14px;padding:4px 10px;background:#F6D27A;border:2.5px solid #3E3A39;border-radius:12px;font-weight:700;font-size:18px}

      /* 7. 丟瓶子 */
      .bottle-stage{max-width:360px;margin:8px auto 12px;padding:14px 10px;background:#FDEBE6;border:3px solid #3E3A39;border-radius:18px;box-shadow:4px 4px 0 #3E3A39}
      .bottle-row{display:flex;justify-content:center;gap:14px;margin-bottom:14px;min-height:74px;align-items:flex-end}
      .milk-bottle{width:46px;height:66px;border:3px solid #3E3A39;border-radius:14px 14px 8px 8px;background:#FFFEFA;box-shadow:2px 2px 0 #3E3A39;display:grid;place-items:center;font-weight:700;font-size:16px;transition:transform .45s ease-out,opacity .45s}
      .milk-bottle.fall-l{transform:translate(-18px,10px) rotate(-75deg);opacity:.45;background:#F6D27A}
      .milk-bottle.fall-r{transform:translate(18px,10px) rotate(75deg);opacity:.45;background:#F6D27A}

      /* 8. 保齡球 */
      .bowl-lane{position:relative;height:180px;max-width:340px;margin:8px auto 12px;padding:12px;background:#FFF3D1;border:3px solid #3E3A39;border-radius:18px;box-shadow:4px 4px 0 #3E3A39;overflow:hidden;display:flex;flex-direction:column;justify-content:space-between;align-items:center}
      .bowl-pins{display:flex;gap:10px;margin-top:6px}
      .bpin{width:28px;height:48px;background:#FFF;border:2.5px solid #3E3A39;border-radius:12px 12px 8px 8px;position:relative;transition:transform .4s ease-out}
      .bpin::after{content:'';position:absolute;top:12px;left:0;right:0;height:5px;background:#D9453D}
      .bpin.knock{transform:translateY(-10px) rotate(82deg);opacity:.4}
      .bowl-ball{width:46px;height:46px;border-radius:50%;background:#14456A;border:3px solid #3E3A39;color:#FFF;display:grid;place-items:center;font-size:20px;transition:transform .55s ease-in}
      .bowl-ball.roll{transform:translateY(-105px) scale(.75)}

      /* 9. 擲骰子 */
      @keyframes diceRoll{0%{transform:rotate(0deg) scale(1)}25%{transform:rotate(90deg) scale(1.18)}50%{transform:rotate(180deg) scale(.92)}75%{transform:rotate(270deg) scale(1.18)}100%{transform:rotate(360deg) scale(1)}}
      .dice-stage{height:150px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;margin:8px auto 12px}
      .dice-cube{width:92px;height:92px;background:#FFFEFA;border:4px solid #3E3A39;border-radius:20px;box-shadow:5px 5px 0 #3E3A39;display:grid;place-items:center;font-size:44px;font-weight:700;color:#D9453D}
      .dice-cube.rolling{animation:diceRoll .65s linear infinite}
    `;
    document.head.appendChild(st);
  }
})();

/* 2. 懷舊童玩戳戳樂 */
window.LOTTO_PLUGINS.push({
  title: '🧧 懷舊童玩戳戳樂',
  hint: '選一個喜歡的格子用力戳下去吧！',
  render: function(container, claimPointsFn) {
    const covers = ['⭐', '🍀', '🎈', '🎁', '🌈', '🍎', '🚀', '🐱', '👑'];
    let busy = false;
    container.innerHTML = `
      <div class="poke-grid">
        ${covers.map((ic, idx) => `<button type="button" class="poke-cell" data-poke="${idx}">${ic}</button>`).join('')}
      </div>
    `;
    container.querySelector('.poke-grid').addEventListener('click', async (ev) => {
      const btn = ev.target.closest('[data-poke]');
      if (!btn || busy) return;
      busy = true;
      const allCells = [...container.querySelectorAll('.poke-cell')];
      allCells.forEach(c => c.disabled = true);
      btn.classList.add('poked');
      btn.textContent = '💥';
      document.getElementById('lottoMsg').textContent = '啵！戳破紙張，看看裡面藏了幾分…';
      try {
        const [res] = await Promise.all([claimPointsFn(), new Promise(r => setTimeout(r, 500))]);
        if (res && (res.ok || res.already)) {
          btn.textContent = '+' + res.points + '分';
          allCells.forEach(c => { if (c !== btn) c.classList.add('dim'); });
        }
      } catch (e) {
        document.getElementById('lottoMsg').textContent = e.message || '發生錯誤';
        allCells.forEach(c => { c.disabled = false; c.classList.remove('poked'); });
        busy = false;
      }
    });
  }
});

/* 3. 幸運恐龍蛋孵化 */
window.LOTTO_PLUGINS.push({
  title: '🥚 幸運恐龍蛋孵化',
  hint: '選一顆恐龍蛋輕輕敲開，看看會孵出幾分寶貝！',
  render: function(container, claimPointsFn) {
    const eggs = [{ name: '黃金蛋', spot: '✨' }, { name: '晴空蛋', spot: '☁️' }, { name: '珊瑚蛋', spot: '🌸' }];
    let busy = false;
    container.innerHTML = `
      <div class="egg-stage">
        ${eggs.map((eg, i) => `<button type="button" class="egg-btn" data-egg="${i}"><div class="egg-shell">${eg.spot}</div><span class="egg-lbl">${eg.name}</span></button>`).join('')}
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
        const [res] = await Promise.all([claimPointsFn(), new Promise(r => setTimeout(r, 600))]);
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
        document.getElementById('lottoMsg').textContent = e.message || '發生錯誤';
        allBtns.forEach(b => b.disabled = false);
        busy = false;
      }
    });
  }
});

/* 4. 幸運扭蛋機 */
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

/* 5. 幸運爬格子 */
window.LOTTO_PLUGINS.push({
  title: '🪜 幸運爬格子',
  hint: '選擇一條起點路線，順著橫線爬向終點寶箱！',
  render: function(container, claimPointsFn) {
    let busy = false;
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
            if (i === endIdx) { el.classList.add('win'); el.textContent = `+${res.points} 分`; }
            else { el.textContent = `+${others[oi++]} 分`; }
          });
        }
      } catch (e) {
        document.getElementById('lottoMsg').textContent = e.message || '發生錯誤';
        busy = false;
      }
    });
  }
});

/* 6. 勇士下樓梯 */
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
      const steps = [{ top: '50px', left: '118px' }, { top: '96px', left: '190px' }, { top: '136px', left: '235px' }];
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

/* 7. 夜市丟瓶子 */
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

/* 8. 全倒保齡球 */
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
          for (let i = 0; i < knock; i++) container.querySelector('#bp' + i).classList.add('knock');
        }
      } catch (e) {
        document.getElementById('lottoMsg').textContent = e.message || '發生錯誤';
        this.disabled = false;
        busy = false;
      }
    };
  }
});

/* 9. 幸運擲骰子 */
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
      const iv = setInterval(() => { cube.textContent = faces[idx++ % faces.length]; }, 90);
      try {
        const [res] = await Promise.all([claimPointsFn(), new Promise(r => setTimeout(r, 700))]);
        clearInterval(iv);
        cube.classList.remove('rolling');
        if (res && (res.ok || res.already)) cube.textContent = `+${res.points}`;
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
/* =====================================================================
 * 外掛擴充包（第三批 6 款新遊戲）：
 * 1. 草原趣味賽馬  2. 極速賽車大賽  3. 充氣爆氣球
 * 4. 籃子接星星    5. 生日吹蠟燭    6. 夜空流星許願
 * ===================================================================== */

(function() {
  if (!document.getElementById('lotto-batch3-style')) {
    const st = document.createElement('style');
    st.id = 'lotto-batch3-style';
    st.textContent = `
      /* 1. 賽馬 */
      .horse-track{max-width:360px;margin:8px auto 12px;padding:10px 12px;background:#E9F4E0;border:3px solid #3E3A39;border-radius:18px;box-shadow:4px 4px 0 #3E3A39}
      .horse-lane{position:relative;height:44px;border-bottom:2px dashed rgba(62,58,57,.35);display:flex;align-items:center}
      .horse-lane:last-child{border-bottom:0}
      .horse-finish{position:absolute;right:26px;top:2px;bottom:2px;width:6px;background:repeating-linear-gradient(0deg,#3E3A39 0 6px,#FFF 6px 12px)}
      .horse-runner{position:absolute;left:6px;font-size:28px;transition:left 1.1s cubic-bezier(.25,.8,.35,1);transform:scaleX(-1)}
      .horse-btns{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:10px}

      /* 2. 賽車 */
      .car-track{position:relative;height:130px;max-width:360px;margin:8px auto 12px;padding:12px;background:#EAECEF;border:3px solid #3E3A39;border-radius:18px;box-shadow:4px 4px 0 #3E3A39;overflow:hidden;display:flex;flex-direction:column;justify-content:center}
      .car-road{position:relative;height:58px;background:#555;border-top:3px solid #3E3A39;border-bottom:3px solid #3E3A39;display:flex;align-items:center}
      .car-stripe{position:absolute;left:0;right:0;height:4px;background:repeating-linear-gradient(90deg,#FFF 0 18px,transparent 18px 34px)}
      .car-goal{position:absolute;right:18px;top:0;bottom:0;width:14px;background:repeating-conic-gradient(#3E3A39 0% 25%,#FFF 0% 50%) 50% / 10px 10px;border-left:2px solid #3E3A39}
      .race-car{position:absolute;left:12px;font-size:34px;transition:left .85s cubic-bezier(.4,0,.2,1);transform:scaleX(-1);z-index:2}
      .car-flag{position:absolute;top:10px;left:50%;transform:translateX(-50%);padding:3px 12px;background:#F6D27A;border:2.5px solid #3E3A39;border-radius:999px;font-weight:700;font-size:20px;color:#D9453D;animation:pop .35s}

      /* 3. 充氣爆氣球 */
      .balloon-stage{height:185px;max-width:340px;margin:8px auto 12px;background:#EBF6FC;border:3px solid #3E3A39;border-radius:18px;box-shadow:4px 4px 0 #3E3A39;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding-bottom:14px;position:relative;overflow:hidden}
      .big-balloon{width:54px;height:64px;background:#F2A497;border:3px solid #3E3A39;border-radius:50% 50% 48% 48% / 55% 55% 45% 45%;display:grid;place-items:center;font-weight:700;font-size:20px;box-shadow:inset -6px -6px 0 rgba(62,58,57,.12);transition:transform .2s cubic-bezier(.3,1.6,.5,1);margin-bottom:18px}
      .big-balloon.boom{background:#FFF3C4;border-style:dashed;border-color:#D9453D;color:#D9453D;font-size:26px;transform:scale(1.5)!important;animation:pop .35s}

      /* 4. 接星星 */
      @keyframes swayBasket{0%,100%{left:22px}50%{left:240px}}
      @keyframes starFall{0%{top:-30px}100%{top:115px}}
      .catch-stage{position:relative;height:185px;max-width:350px;margin:8px auto 12px;background:#14456A;border:3px solid #3E3A39;border-radius:18px;box-shadow:4px 4px 0 #3E3A39;overflow:hidden}
      .fall-star{position:absolute;top:14px;left:50%;transform:translateX(-50%);font-size:36px;transition:top .5s ease-in}
      .catch-basket{position:absolute;bottom:14px;left:22px;width:76px;height:42px;background:#F6D27A;border:3px solid #3E3A39;border-radius:8px 8px 22px 22px;display:grid;place-items:center;font-weight:700;font-size:17px;animation:swayBasket 2.2s ease-in-out infinite}
      .catch-basket.paused{animation-play-state:paused;left:50%!important;transform:translateX(-50%);background:#FFF3C4;color:#D9453D;font-size:22px;width:96px}

      /* 5. 吹蠟燭 */
      @keyframes flameFlicker{0%,100%{transform:scale(1) rotate(-4deg)}50%{transform:scale(1.15) rotate(5deg)}}
      .cake-stage{height:185px;max-width:340px;margin:8px auto 12px;background:#FFF7E6;border:3px solid #3E3A39;border-radius:18px;box-shadow:4px 4px 0 #3E3A39;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding-bottom:16px;position:relative}
      .candles-row{display:flex;gap:22px;margin-bottom:-2px;z-index:2}
      .candle-item{display:flex;flex-direction:column;align-items:center}
      .flame{font-size:22px;animation:flameFlicker .5s ease-in-out infinite;transition:opacity .3s,transform .3s}
      .flame.out{opacity:0;transform:translateX(18px) scale(.3)}
      .candle-stick{width:12px;height:34px;background:#A8D3E6;border:2.5px solid #3E3A39;border-radius:4px}
      .cake-body{width:190px;height:66px;background:#F2A497;border:3px solid #3E3A39;border-radius:16px 16px 10px 10px;box-shadow:3px 3px 0 #3E3A39;display:grid;place-items:center;font-size:24px;font-weight:700;color:#FFFEFA}

      /* 6. 流星許願 */
      @keyframes meteorFly{0%{top:12px;right:16px;opacity:1;transform:scale(.7)}70%{top:105px;right:210px;opacity:1;transform:scale(1.25)}100%{top:125px;right:245px;opacity:0;transform:scale(.8)}}
      .wish-sky{position:relative;height:180px;max-width:350px;margin:8px auto 12px;background:linear-gradient(180deg,#14456A,#2B6CB0);border:3px solid #3E3A39;border-radius:18px;box-shadow:4px 4px 0 #3E3A39;overflow:hidden;display:flex;align-items:center;justify-content:center}
      .shooting-star{position:absolute;top:16px;right:24px;font-size:34px;pointer-events:none}
      .shooting-star.fly{animation:meteorFly .85s ease-out forwards}
      .wish-result{padding:10px 22px;background:#FFF3C4;border:3px solid #3E3A39;border-radius:999px;font-size:28px;font-weight:700;color:#D9453D;box-shadow:3px 3px 0 #3E3A39;animation:pop .4s}
    `;
    document.head.appendChild(st);
  }
})();

/* 1. 草原趣味賽馬 */
window.LOTTO_PLUGINS.push({
  title: '🐎 草原趣味賽馬',
  hint: '選一匹你最看好的小馬應援，看看牠能跑出幾分！',
  render: function(container, claimPointsFn) {
    let busy = false;
    container.innerHTML = `
      <div class="horse-track">
        <div class="horse-lane"><span class="horse-runner" id="hr0">🐎</span><div class="horse-finish"></div></div>
        <div class="horse-lane"><span class="horse-runner" id="hr1">🦄</span><div class="horse-finish"></div></div>
        <div class="horse-lane"><span class="horse-runner" id="hr2">🦓</span><div class="horse-finish"></div></div>
      </div>
      <div class="horse-btns">
        <button type="button" class="btn sm" data-horse="0">1號 駿馬</button>
        <button type="button" class="btn sm sky" data-horse="1">2號 獨角獸</button>
        <button type="button" class="btn sm coral" data-horse="2">3號 斑馬</button>
      </div>
    `;
    container.querySelector('.horse-btns').addEventListener('click', async (ev) => {
      const btn = ev.target.closest('[data-horse]');
      if (!btn || busy) return;
      busy = true;
      const pick = +btn.dataset.horse;
      container.querySelectorAll('[data-horse]').forEach(b => b.disabled = true);
      document.getElementById('lottoMsg').textContent = '砰！起跑槍響，全速衝向終點線…';

      [0, 1, 2].forEach(i => {
        const el = container.querySelector('#hr' + i);
        el.style.left = (i === pick ? '275px' : (195 + Math.floor(Math.random() * 55)) + 'px');
      });

      try {
        const [res] = await Promise.all([claimPointsFn(), new Promise(r => setTimeout(r, 1100))]);
        if (res && (res.ok || res.already)) {
          btn.textContent = `🏆 +${res.points}分`;
        }
      } catch (e) {
        document.getElementById('lottoMsg').textContent = e.message || '發生錯誤';
        busy = false;
      }
    });
  }
});

/* 2. 極速賽車大賽 */
window.LOTTO_PLUGINS.push({
  title: '🏎️ 極速賽車大賽',
  hint: '點擊「踩油門衝刺！」，衝過終點線領取獎勵！',
  render: function(container, claimPointsFn) {
    let busy = false;
    container.innerHTML = `
      <div class="car-track">
        <div id="carFlag" class="car-flag" style="display:none"></div>
        <div class="car-road">
          <div class="car-stripe"></div>
          <div class="race-car" id="raceCar">🏎️</div>
          <div class="car-goal"></div>
        </div>
      </div>
      <button type="button" class="btn green sm" id="gasBtn">踩油門衝刺！ 🏁</button>
    `;
    container.querySelector('#gasBtn').onclick = async function() {
      if (busy) return;
      busy = true;
      this.disabled = true;
      container.querySelector('#raceCar').style.left = '265px';
      document.getElementById('lottoMsg').textContent = '轟隆隆——極速衝過終點線！';
      try {
        const [res] = await Promise.all([claimPointsFn(), new Promise(r => setTimeout(r, 850))]);
        if (res && (res.ok || res.already)) {
          const flag = container.querySelector('#carFlag');
          flag.textContent = `🏁 衝線獲得 +${res.points} 分！`;
          flag.style.display = 'block';
        }
      } catch (e) {
        document.getElementById('lottoMsg').textContent = e.message || '發生錯誤';
        this.disabled = false;
        busy = false;
      }
    };
  }
});

/* 3. 充氣讓氣球爆炸 */
window.LOTTO_PLUGINS.push({
  title: '🎈 充氣爆氣球挑戰',
  hint: '連按 4 下「用力打氣」，把氣球吹爆揭曉分數！',
  render: function(container, claimPointsFn) {
    let pumps = 0;
    let busy = false;
    container.innerHTML = `
      <div class="balloon-stage">
        <div class="big-balloon" id="bigBalloon">0 / 4</div>
      </div>
      <button type="button" class="btn sm" id="pumpBtn">用力打氣！ 💨</button>
    `;
    const balloon = container.querySelector('#bigBalloon');
    const pumpBtn = container.querySelector('#pumpBtn');

    pumpBtn.onclick = async function() {
      if (busy) return;
      pumps++;
      if (pumps < 4) {
        const scale = 1 + pumps * 0.28;
        balloon.style.transform = `scale(${scale})`;
        balloon.textContent = `${pumps} / 4`;
        document.getElementById('lottoMsg').textContent = pumps === 3 ? '好鼓好鼓！再打最後一下就要爆啦！' : '氣球變大囉，繼續打氣！';
        return;
      }

      busy = true;
      pumpBtn.disabled = true;
      balloon.classList.add('boom');
      balloon.textContent = '💥 砰！';
      document.getElementById('lottoMsg').textContent = '砰一聲炸開啦，看看裡面藏了幾分…';

      try {
        const [res] = await Promise.all([claimPointsFn(), new Promise(r => setTimeout(r, 450))]);
        if (res && (res.ok || res.already)) {
          balloon.textContent = `+${res.points} 分`;
        }
      } catch (e) {
        document.getElementById('lottoMsg').textContent = e.message || '發生錯誤';
        pumpBtn.disabled = false;
        busy = false;
      }
    };
  }
});

/* 4. 接星星 */
window.LOTTO_PLUGINS.push({
  title: '🧺 幸運籃子接星星',
  hint: '看準時機點擊「接住星星！」，把大星星接進籃子裡！',
  render: function(container, claimPointsFn) {
    let busy = false;
    container.innerHTML = `
      <div class="catch-stage">
        <div class="fall-star" id="fallStar">⭐</div>
        <div class="catch-basket" id="catchBasket">接星星</div>
      </div>
      <button type="button" class="btn green sm" id="catchBtn">接住星星！ ⭐</button>
    `;
    container.querySelector('#catchBtn').onclick = async function() {
      if (busy) return;
      busy = true;
      this.disabled = true;
      const star = container.querySelector('#fallStar');
      const basket = container.querySelector('#catchBasket');
      basket.classList.add('paused');
      star.style.top = '112px';
      document.getElementById('lottoMsg').textContent = '咻——大星星掉進籃子裡啦！';

      try {
        const [res] = await Promise.all([claimPointsFn(), new Promise(r => setTimeout(r, 550))]);
        if (res && (res.ok || res.already)) {
          star.style.display = 'none';
          basket.textContent = `⭐+${res.points}分`;
        }
      } catch (e) {
        document.getElementById('lottoMsg').textContent = e.message || '發生錯誤';
        this.disabled = false;
        busy = false;
      }
    };
  }
});

/* 5. 吹蠟燭 */
window.LOTTO_PLUGINS.push({
  title: '🎂 許願吹蠟燭',
  hint: '點擊「用力吹一口氣」，把蛋糕上的蠟燭全部吹熄！',
  render: function(container, claimPointsFn) {
    let busy = false;
    container.innerHTML = `
      <div class="cake-stage">
        <div class="candles-row">
          <div class="candle-item"><span class="flame">🔥</span><div class="candle-stick"></div></div>
          <div class="candle-item"><span class="flame">🔥</span><div class="candle-stick" style="background:#F6D27A"></div></div>
          <div class="candle-item"><span class="flame">🔥</span><div class="candle-stick" style="background:#B9DAA5"></div></div>
        </div>
        <div class="cake-body" id="cakeBody">🎂 許願蛋糕</div>
      </div>
      <button type="button" class="btn sky sm" id="blowBtn">呼～用力吹熄蠟燭！ 🌬️</button>
    `;
    container.querySelector('#blowBtn').onclick = async function() {
      if (busy) return;
      busy = true;
      this.disabled = true;
      container.querySelectorAll('.flame').forEach(f => f.classList.add('out'));
      document.getElementById('lottoMsg').textContent = '呼——蠟燭全熄啦，願望成真！';

      try {
        const [res] = await Promise.all([claimPointsFn(), new Promise(r => setTimeout(r, 500))]);
        if (res && (res.ok || res.already)) {
          const cake = container.querySelector('#cakeBody');
          cake.style.background = '#F6D27A';
          cake.style.color = '#D9453D';
          cake.textContent = `🎉 獲得 +${res.points} 分`;
        }
      } catch (e) {
        document.getElementById('lottoMsg').textContent = e.message || '發生錯誤';
        this.disabled = false;
        busy = false;
      }
    };
  }
});

/* 6. 流星許願 */
window.LOTTO_PLUGINS.push({
  title: '🌠 夜空流星許願',
  hint: '點擊「對流星許願」，看看夜空會賜給你幾分祝福！',
  render: function(container, claimPointsFn) {
    let busy = false;
    container.innerHTML = `
      <div class="wish-sky" id="wishSky">
        <span style="position:absolute;top:24px;left:36px;color:#FFF;opacity:.7">✦</span>
        <span style="position:absolute;bottom:28px;right:48px;color:#FFF;opacity:.7">✦</span>
        <span style="position:absolute;top:65px;left:85px;color:#F6D27A;opacity:.8">★</span>
        <div class="shooting-star" id="meteorEl">🌠</div>
      </div>
      <button type="button" class="btn sm" id="wishBtn">🙏 對流星許願！</button>
    `;
    container.querySelector('#wishBtn').onclick = async function() {
      if (busy) return;
      busy = true;
      this.disabled = true;
      container.querySelector('#meteorEl').classList.add('fly');
      document.getElementById('lottoMsg').textContent = '流星劃過夜空，誠心許願中…';

      try {
        const [res] = await Promise.all([claimPointsFn(), new Promise(r => setTimeout(r, 850))]);
        if (res && (res.ok || res.already)) {
          const sky = container.querySelector('#wishSky');
          sky.insertAdjacentHTML('beforeend', `<div class="wish-result">✨ 願望實現 +${res.points} 分</div>`);
        }
      } catch (e) {
        document.getElementById('lottoMsg').textContent = e.message || '發生錯誤';
        this.disabled = false;
        busy = false;
      }
    };
  }
});
/**
 * =====================================================================
 * 教室聯絡簿 - 外部擴充抽獎小遊戲 (lotto-plugins.js)
 * 風格：手繪插畫粗框線風，自動銜接 Firebase 抽獎計分系統
 * =====================================================================
 */
(function () {
  window.LOTTO_PLUGINS = window.LOTTO_PLUGINS || [];

  // 1. 注入專屬手繪風 CSS 樣式（自動避免重複載入）
  if (!document.getElementById('lotto-plugins-style')) {
    const st = document.createElement('style');
    st.id = 'lotto-plugins-style';
    st.textContent = `
      @keyframes lpBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
      @keyframes lpShake { 0%,100%{transform:rotate(0)} 25%{transform:rotate(-8deg)} 75%{transform:rotate(8deg)} }
      @keyframes lpClawMove { 0%,100%{left:16%} 50%{left:72%} }

      /* 遊戲 1：開寶箱 */
      .lp-chests { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; max-width:390px; margin:12px auto 14px; }
      .lp-chest-btn {
        border:3px solid #3E3A39; border-radius:18px; background:#FFF7E6;
        box-shadow:4px 4px 0 #3E3A39; padding:12px 6px;
        display:flex; flex-direction:column; align-items:center; gap:6px;
        transition:transform .14s, background .2s;
      }
      .lp-chest-btn:hover:not(:disabled) { transform:translateY(-5px); background:#FFF1C9; }
      .lp-chest-btn.opened { background:#FFFDF5; border-color:#D9453D; transform:scale(1.06); }
      .lp-chest-btn.dim { opacity:.5; background:#EFECE6; }
      .lp-chest-ic { font-size:42px; line-height:1.1; }
      .lp-chest-lbl { font-size:17px; font-weight:700; color:#3E3A39; }
      .lp-chest-pts { font-size:30px; font-weight:700; color:#D9453D; animation:pop .35s ease-out; }

      /* 遊戲 2：打地鼠 */
      .lp-mole-stage {
        max-width:370px; margin:10px auto 14px; padding:14px 12px;
        background:#E9F4E0; border:3px solid #3E3A39; border-radius:20px;
        box-shadow:4px 4px 0 #3E3A39;
        display:grid; grid-template-columns:repeat(2,1fr); gap:14px;
      }
      .lp-hole-btn {
        position:relative; height:84px; border:3px solid #3E3A39; border-radius:18px;
        background:#B9DAA5; box-shadow:3px 3px 0 #3E3A39; overflow:hidden;
        display:flex; flex-direction:column; align-items:center; justify-content:flex-end; padding-bottom:6px;
      }
      .lp-hole-pit {
        width:78%; height:22px; background:#5A4636; border:2.5px solid #3E3A39; border-radius:50%;
      }
      .lp-mole-critter {
        position:absolute; bottom:14px; font-size:38px; line-height:1;
        transition:transform .18s cubic-bezier(.3,1.5,.5,1);
        transform:translateY(46px);
      }
      .lp-hole-btn.up .lp-mole-critter { transform:translateY(0); }
      .lp-hole-btn.bonked { background:#FFF3C4; border-color:#D9453D; }
      .lp-hole-btn.bonked .lp-mole-critter { transform:translateY(-2px) scale(1.15); }
      .lp-hole-btn.dim { opacity:.5; }
      .lp-mole-pts {
        position:absolute; top:6px; right:8px; background:#F6D27A; border:2px solid #3E3A39;
        border-radius:10px; padding:1px 7px; font-size:18px; font-weight:700; color:#D9453D;
      }

      /* 遊戲 3：夾娃娃機 */
      .lp-claw-box {
        position:relative; height:195px; max-width:350px; margin:10px auto 12px;
        background:linear-gradient(180deg,#EBF6FC 0%,#FFFDF8 72%,#F2A497 72%,#F2A497 100%);
        border:3px solid #3E3A39; border-radius:20px; box-shadow:4px 4px 0 #3E3A39;
        overflow:hidden;
      }
      .lp-claw-rail {
        position:absolute; top:14px; left:10px; right:10px; height:8px;
        background:#F6D27A; border:2.5px solid #3E3A39; border-radius:999px;
      }
      .lp-claw-rig {
        position:absolute; top:18px; left:16%; width:44px;
        display:flex; flex-direction:column; align-items:center;
        animation:lpClawMove 2.2s ease-in-out infinite;
      }
      .lp-claw-rig.paused { animation-play-state:paused; }
      .lp-claw-cable {
        width:6px; height:24px; background:#3E3A39;
        transition:height .5s ease-in-out;
      }
      .lp-claw-head { font-size:30px; line-height:1; margin-top:-4px; }
      .lp-claw-prize {
        margin-top:-4px; width:44px; height:44px; border-radius:50%;
        border:3px solid #3E3A39; background:#F6D27A; box-shadow:2px 2px 0 #3E3A39;
        display:grid; place-items:center; font-size:18px; font-weight:700; color:#D9453D;
        animation:pop .35s ease-out;
      }
      .lp-toys-floor {
        position:absolute; bottom:46px; left:14px; right:14px;
        display:flex; justify-content:space-around; font-size:30px; pointer-events:none;
      }
    `;
    document.head.appendChild(st);
  }

  // ===================================================================
  // 遊戲 A：🗝️ 神秘海盜開寶箱
  // ===================================================================
  window.LOTTO_PLUGINS.push({
    title: '🗝️ 神秘海盜開寶箱',
    hint: '選一個藏寶箱打開，看看裡面裝了幾顆星星分數！',
    render: function (container, triggerDraw) {
      const names = ['黃金寶箱', '海洋寶箱', '森林寶箱'];
      container.innerHTML =
        '<div class="lp-chests">' +
        [0, 1, 2].map(i =>
          '<button type="button" class="lp-chest-btn" data-chest="' + i + '">' +
            '<span class="lp-chest-ic">🧰</span>' +
            '<span class="lp-chest-lbl">' + names[i] + '</span>' +
          '</button>'
        ).join('') +
        '</div>';

      let busy = false;
      container.firstElementChild.addEventListener('click', async function (ev) {
        const btn = ev.target.closest('[data-chest]');
        if (!btn || busy) return;
        busy = true;

        const picked = +btn.dataset.chest;
        const allBtns = [...container.querySelectorAll('.lp-chest-btn')];
        allBtns.forEach(b => b.disabled = true);
        btn.classList.add('opened');
        btn.querySelector('.lp-chest-ic').style.animation = 'lpShake .45s ease-in-out';

        try {
          const [res] = await Promise.all([
            triggerDraw(),
            new Promise(r => setTimeout(r, 550))
          ]);
          if (res && (res.ok || res.already)) {
            const others = [1, 2, 3].filter(n => n !== res.points);
            let oi = 0;
            allBtns.forEach((b, idx) => {
              if (idx === picked) {
                b.innerHTML = '<span class="lp-chest-ic">✨</span><span class="lp-chest-pts">+' + res.points + ' 分</span>';
              } else {
                b.classList.add('dim');
                b.innerHTML = '<span class="lp-chest-ic">📦</span><span class="lp-chest-lbl">+' + others[oi++] + ' 分</span>';
              }
            });
          }
        } catch (e) {
          allBtns.forEach(b => b.disabled = false);
          busy = false;
        }
      });
    }
  });

  // ===================================================================
  // 遊戲 B：🔨 草原打地鼠
  // ===================================================================
  window.LOTTO_PLUGINS.push({
    title: '🔨 草原打地鼠',
    hint: '地鼠探頭出來啦！快點任一隻小地鼠敲出幸運分數！',
    render: function (container, triggerDraw) {
      const critters = ['🐹', '🐰', '🐻', '🦊'];
      container.innerHTML =
        '<div class="lp-mole-stage">' +
        [0, 1, 2, 3].map(i =>
          '<button type="button" class="lp-hole-btn" data-hole="' + i + '">' +
            '<span class="lp-mole-critter">' + critters[i] + '</span>' +
            '<span class="lp-hole-pit"></span>' +
          '</button>'
        ).join('') +
        '</div>';

      const holes = [...container.querySelectorAll('.lp-hole-btn')];
      let activeIdx = 0;
      holes[0].classList.add('up');

      // 讓地鼠輪流探頭增加趣味感（但點任何一洞都能隨時擊中）
      const iv = setInterval(() => {
        if (!holes[0].isConnected) { clearInterval(iv); return; }
        holes.forEach(h => h.classList.remove('up'));
        activeIdx = (activeIdx + 1) % 4;
        holes[activeIdx].classList.add('up');
        holes[(activeIdx + 2) % 4].classList.add('up');
      }, 650);

      let busy = false;
      container.firstElementChild.addEventListener('click', async function (ev) {
        const btn = ev.target.closest('[data-hole]');
        if (!btn || busy) return;
        busy = true;
        clearInterval(iv);

        const picked = +btn.dataset.hole;
        holes.forEach(h => { h.disabled = true; h.classList.add('up'); });
        btn.classList.add('bonked');
        btn.querySelector('.lp-mole-critter').textContent = '💫';

        try {
          const [res] = await Promise.all([
            triggerDraw(),
            new Promise(r => setTimeout(r, 450))
          ]);
          if (res && (res.ok || res.already)) {
            const others = [1, 2, 3, 2].filter(n => n !== res.points);
            let oi = 0;
            holes.forEach((h, idx) => {
              if (idx === picked) {
                h.insertAdjacentHTML('beforeend', '<span class="lp-mole-pts">🔨 +' + res.points + '分</span>');
              } else {
                h.classList.add('dim');
                h.insertAdjacentHTML('beforeend', '<span class="lp-mole-pts" style="background:#FFF">+' + others[oi++] + '分</span>');
              }
            });
          }
        } catch (e) {
          holes.forEach(h => h.disabled = false);
          busy = false;
        }
      });
    }
  });

  // ===================================================================
  // 遊戲 C：🕹️ 歡樂夾娃娃機
  // ===================================================================
  window.LOTTO_PLUGINS.push({
    title: '🕹️ 歡樂夾娃娃機',
    hint: '看準移動的爪子，按下「下爪夾取」夾起幸運扭蛋！',
    render: function (container, triggerDraw) {
      container.innerHTML =
        '<div class="lp-claw-box">' +
          '<div class="lp-claw-rail"></div>' +
          '<div class="lp-claw-rig" id="lpClawRig">' +
            '<div class="lp-claw-cable" id="lpClawCable"></div>' +
            '<div class="lp-claw-head" id="lpClawHead">🪝</div>' +
          '</div>' +
          '<div class="lp-toys-floor"><span>🧸</span><span>🥚</span><span>🎁</span><span>🌟</span></div>' +
        '</div>' +
        '<button type="button" class="btn green sm" id="lpGrabBtn">🕹️ 下爪夾取！</button>';

      let busy = false;
      const grabBtn = container.querySelector('#lpGrabBtn');
      const rig = container.querySelector('#lpClawRig');
      const cable = container.querySelector('#lpClawCable');

      grabBtn.addEventListener('click', async function () {
        if (busy) return;
        busy = true;
        grabBtn.disabled = true;
        rig.classList.add('paused');

        // 1. 爪子下降
        cable.style.height = '86px';

        try {
          const [res] = await Promise.all([
            triggerDraw(),
            new Promise(r => setTimeout(r, 550))
          ]);

          // 2. 夾起扭蛋上升並揭曉分數
          cable.style.height = '24px';
          await new Promise(r => setTimeout(r, 480));

          if (res && (res.ok || res.already)) {
            rig.insertAdjacentHTML('beforeend', '<div class="lp-claw-prize">+' + res.points + '</div>');
          }
        } catch (e) {
          cable.style.height = '24px';
          rig.classList.remove('paused');
          grabBtn.disabled = false;
          busy = false;
        }
      });
    }
  });
})();
