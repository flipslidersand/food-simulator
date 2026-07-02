<script>
  import menus from '../data/menus.json'

  export let onApply = () => {}

  const avgCosts = menus.categories.map((c) => ({
    name: c.name,
    color: c.color,
    avg: Math.round(c.items.reduce((s, i) => s + i.cost, 0) / c.items.length),
  }))

  let days = { 外食: 5, コンビニ弁当: 10, 自炊: 15 }

  $: totalDays = Object.values(days).reduce((a, b) => a + Number(b || 0), 0)
  $: totalCost = avgCosts.reduce(
    (s, c) => s + Number(days[c.name] || 0) * c.avg,
    0
  )
  $: allEatOut = 30 * avgCosts.find((c) => c.name === '外食').avg
  $: savings = allEatOut - totalCost
  $: overLimit = totalDays > 30

  function apply() {
    const meals = {}
    let day = 0
    for (const c of avgCosts) {
      for (let i = 0; i < Number(days[c.name] || 0) && day < 30; i++, day++) {
        meals[day] = {
          category: c.name,
          item: `${c.name}（平均）`,
          cost: c.avg,
        }
      }
    }
    onApply(meals)
  }
</script>

<div class="quick-sim">
  <h2>⚡ かんたんシミュレーション</h2>
  <p class="description">
    1ヶ月のうち何日ずつにするかをスライダーで選ぶだけで、食費の目安がすぐわかります。
  </p>

  <div class="sliders">
    {#each avgCosts as c}
      <div class="slider-row">
        <div class="slider-label">
          <span class="dot" style="background-color: {c.color}"></span>
          <strong>{c.name}</strong>
          <span class="avg">1食 約¥{c.avg}</span>
        </div>
        <input type="range" min="0" max="30" bind:value={days[c.name]} />
        <span class="days-value">{days[c.name]}日</span>
      </div>
    {/each}
  </div>

  <div class="sim-result" class:warning={overLimit}>
    {#if overLimit}
      <p class="over-note">⚠️ 合計 {totalDays} 日になっています（30日以内にしてください）</p>
    {:else}
      <div class="result-grid">
        <div class="result-item">
          <div class="result-label">合計日数</div>
          <div class="result-value">{totalDays} / 30日</div>
        </div>
        <div class="result-item">
          <div class="result-label">1ヶ月の食費（1日1食換算）</div>
          <div class="result-value cost">¥{totalCost.toLocaleString()}</div>
        </div>
        <div class="result-item">
          <div class="result-label">全部外食と比べて</div>
          <div class="result-value savings">
            ¥{savings.toLocaleString()} おトク
          </div>
        </div>
      </div>
      <button class="apply-btn" on:click={apply}>
        📅 この内訳をカレンダーに反映
      </button>
    {/if}
  </div>
</div>

<style>
  .quick-sim {
    background: white;
    border-radius: 8px;
    padding: 24px;
    margin: 0 20px 30px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  h2 {
    font-size: 20px;
    margin-bottom: 8px;
  }

  .description {
    font-size: 13px;
    color: #999;
    margin-bottom: 20px;
  }

  .sliders {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-bottom: 20px;
  }

  .slider-row {
    display: grid;
    grid-template-columns: 220px 1fr 60px;
    align-items: center;
    gap: 12px;
  }

  .slider-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
  }

  .avg {
    font-size: 12px;
    color: #999;
  }

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  input[type='range'] {
    width: 100%;
    accent-color: #667eea;
  }

  .days-value {
    font-weight: bold;
    text-align: right;
    color: #667eea;
  }

  .sim-result {
    background: #f0f3ff;
    border-radius: 8px;
    padding: 16px;
  }

  .sim-result.warning {
    background: #fff3cd;
  }

  .over-note {
    color: #856404;
    font-weight: 600;
    text-align: center;
  }

  .result-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
    margin-bottom: 16px;
  }

  .result-item {
    text-align: center;
  }

  .result-label {
    font-size: 11px;
    color: #999;
    margin-bottom: 4px;
  }

  .result-value {
    font-size: 20px;
    font-weight: bold;
  }

  .result-value.cost {
    color: #667eea;
  }

  .result-value.savings {
    color: #40c057;
  }

  .apply-btn {
    display: block;
    width: 100%;
    padding: 12px;
    border: none;
    border-radius: 6px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .apply-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  @media (max-width: 640px) {
    .slider-row {
      grid-template-columns: 1fr 60px;
    }

    .slider-label {
      grid-column: 1 / -1;
    }
  }
</style>
