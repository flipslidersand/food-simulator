<script>
  import rentData from '../data/rent.json'

  export let foodCost = 0

  let selectedRegion = rentData.regions[5] // 全国平均
  let customRent = null
  let mealsPerDay = 3
  let utilities = 13000
  let internet = 8000
  let misc = 10000

  $: rent = customRent ?? selectedRegion.rent
  $: monthlyFood = foodCost * mealsPerDay
  $: total =
    rent + monthlyFood + Number(utilities || 0) + Number(internet || 0) + Number(misc || 0)

  $: items = [
    { name: '家賃', value: rent, color: '#845ef7' },
    { name: '食費', value: monthlyFood, color: '#51cf66' },
    { name: '光熱費（電気・ガス・水道）', value: Number(utilities || 0), color: '#ffd43b' },
    { name: '通信費（スマホ＋ネット）', value: Number(internet || 0), color: '#74c0fc' },
    { name: '日用品・その他', value: Number(misc || 0), color: '#ff922b' },
  ]
</script>

<div class="living-cost">
  <h2>🏠 月々の生活費まるごとシミュレーション</h2>
  <p class="description">
    家賃・光熱費なども合わせて、一人暮らしの1ヶ月の支出をざっくり掴めます。
  </p>

  <div class="inputs">
    <div class="input-row">
      <label for="region">住む場所（1K・ワンルーム相場）</label>
      <select id="region" bind:value={selectedRegion} on:change={() => (customRent = null)}>
        {#each rentData.regions as region}
          <option value={region}>{region.name} — ¥{region.rent.toLocaleString()}</option>
        {/each}
      </select>
    </div>

    <div class="input-row">
      <label for="custom-rent">家賃を直接入力（円）</label>
      <input
        id="custom-rent"
        type="number"
        min="0"
        step="1000"
        placeholder="例: 55000"
        bind:value={customRent}
      />
    </div>

    <div class="input-row">
      <label for="meals-per-day">食費の換算（カレンダーは1日1食分）</label>
      <div class="meal-multiplier" id="meals-per-day">
        {#each [1, 2, 3] as n}
          <button
            class="mult-btn"
            class:active={mealsPerDay === n}
            on:click={() => (mealsPerDay = n)}
          >
            1日{n}食
          </button>
        {/each}
      </div>
    </div>

    <div class="input-row">
      <label for="utilities">光熱費（全国平均 約13,000円）</label>
      <input id="utilities" type="number" min="0" step="500" bind:value={utilities} />
    </div>

    <div class="input-row">
      <label for="internet">通信費（平均 約8,000円）</label>
      <input id="internet" type="number" min="0" step="500" bind:value={internet} />
    </div>

    <div class="input-row">
      <label for="misc">日用品・その他</label>
      <input id="misc" type="number" min="0" step="500" bind:value={misc} />
    </div>
  </div>

  <div class="breakdown">
    {#each items as item}
      <div class="breakdown-row">
        <div class="breakdown-label">
          <span class="dot" style="background-color: {item.color}"></span>
          {item.name}
        </div>
        <div class="breakdown-bar">
          <div
            class="bar-fill"
            style="background-color: {item.color}; width: {total > 0
              ? (item.value / total) * 100
              : 0}%"
          ></div>
        </div>
        <div class="breakdown-value">¥{item.value.toLocaleString()}</div>
      </div>
    {/each}
  </div>

  <div class="total-box">
    <div class="total-label">1ヶ月の支出目安</div>
    <div class="total-value">¥{total.toLocaleString()}</div>
    {#if monthlyFood === 0}
      <p class="hint">
        ※ 食費が ¥0 です。カレンダーかかんたんシミュレーションで食事を選ぶと反映されます。
      </p>
    {/if}
  </div>
</div>

<style>
  .living-cost {
    background: white;
    border-radius: 8px;
    padding: 24px;
    margin: 30px auto;
    max-width: 800px;
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

  .inputs {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 14px;
    margin-bottom: 24px;
  }

  .input-row {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  label {
    font-size: 12px;
    font-weight: 600;
    color: #666;
  }

  select,
  input[type='number'] {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    background: white;
  }

  .meal-multiplier {
    display: flex;
    gap: 8px;
  }

  .mult-btn {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    background: white;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .mult-btn.active {
    background: #667eea;
    color: white;
    border-color: #667eea;
    font-weight: 600;
  }

  .breakdown {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
  }

  .breakdown-row {
    display: grid;
    grid-template-columns: 230px 1fr 100px;
    align-items: center;
    gap: 12px;
    font-size: 13px;
  }

  .breakdown-label {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .breakdown-bar {
    height: 16px;
    background: #f0f0f0;
    border-radius: 4px;
    overflow: hidden;
  }

  .bar-fill {
    height: 100%;
    transition: width 0.3s;
  }

  .breakdown-value {
    text-align: right;
    font-weight: 600;
  }

  .total-box {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
  }

  .total-label {
    font-size: 13px;
    opacity: 0.9;
    margin-bottom: 6px;
  }

  .total-value {
    font-size: 32px;
    font-weight: bold;
  }

  .hint {
    font-size: 12px;
    opacity: 0.9;
    margin-top: 8px;
  }

  @media (max-width: 640px) {
    .breakdown-row {
      grid-template-columns: 1fr 80px;
    }

    .breakdown-bar {
      display: none;
    }
  }
</style>
