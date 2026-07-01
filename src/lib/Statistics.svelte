<script>
  export let meals = {}

  $: totalDays = 30
  $: selectedDays = Object.keys(meals).length
  $: totalCost = Object.values(meals).reduce((sum, m) => sum + m.cost, 0)
  $: avgCost = selectedDays > 0 ? Math.round(totalCost / selectedDays) : 0
  $: monthlyIfAllRamen = totalDays * 900

  $: categoryCosts = {
    '外食': 0,
    'コンビニ弁当': 0,
    '自炊': 0
  }

  $: {
    Object.values(meals).forEach(meal => {
      categoryCosts[meal.category] += meal.cost
    })
  }

  $: savings = monthlyIfAllRamen - totalCost

  $: maxCost = Math.max(
    categoryCosts['外食'] || 0,
    categoryCosts['コンビニ弁当'] || 0,
    categoryCosts['自炊'] || 0
  )

  const colors = {
    '外食': '#ff6b6b',
    'コンビニ弁当': '#ffd43b',
    '自炊': '#51cf66'
  }
</script>

<div class="statistics">
  <h2>📊 1ヶ月の食事シミュレーション結果</h2>

  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-label">入力済み日数</div>
      <div class="stat-value">{selectedDays} / 30 日</div>
      <div class="stat-progress">
        <div class="progress-bar" style="width: {(selectedDays / 30) * 100}%"></div>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-label">合計金額</div>
      <div class="stat-value total-cost">¥{totalCost.toLocaleString()}</div>
      {#if selectedDays > 0}
        <div class="stat-sub">1日平均: ¥{avgCost.toLocaleString()}</div>
      {/if}
    </div>

    <div class="stat-card savings-card">
      <div class="stat-label">節約額（ラーメン毎日vs実際）</div>
      <div class="stat-value savings-value">¥{savings.toLocaleString()}</div>
      <div class="stat-sub">
        毎日ラーメン: ¥{monthlyIfAllRamen.toLocaleString()} → 実際: ¥{totalCost.toLocaleString()}
      </div>
    </div>
  </div>

  {#if selectedDays > 0}
    <div class="breakdown">
      <h3>食事カテゴリ別 支出と頻度</h3>
      <div class="breakdown-items">
        {#each Object.entries(colors) as [category, color]}
          {@const cost = categoryCosts[category]}
          {@const count = Object.values(meals).filter(m => m.category === category).length}
          <div class="breakdown-item">
            <div class="item-info">
              <div class="item-name">{category}</div>
              <div class="item-stats">
                <span class="count">{count}日</span>
                <span class="cost">¥{cost.toLocaleString()}</span>
              </div>
            </div>
            <div class="item-bar">
              <div
                class="bar-fill"
                style="background-color: {color}; width: {maxCost > 0 ? (cost / maxCost) * 100 : 0}%"
              ></div>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <div class="pie-chart">
      <h3>食事パターン分析</h3>
      <div class="analysis-summary">
        {#each Object.entries(colors) as [cat, color]}
          {@const count = Object.values(meals).filter(m => m.category === cat).length}
          {@const percent = selectedDays > 0 ? Math.round((count / selectedDays) * 100) : 0}
          {#if count > 0}
            <div class="analysis-row">
              <div class="analysis-label">
                <span class="dot" style="background-color: {color}"></span>
                <strong>{cat}</strong>
              </div>
              <div class="analysis-data">
                <span class="count">{count}日</span>
                <span class="percent">{percent}%</span>
              </div>
            </div>
          {/if}
        {/each}
      </div>
    </div>
  {:else}
    <div class="empty-state">
      <p>カレンダーから食事を選んでシミュレーションを開始しましょう!</p>
    </div>
  {/if}
</div>

<style>
  .statistics {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
  }

  h2 {
    text-align: center;
    margin-bottom: 30px;
    font-size: 24px;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 40px;
  }

  .stat-card {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .stat-card.savings-card {
    background: linear-gradient(135deg, #51cf66 0%, #40c057 100%);
    color: white;
  }

  .stat-label {
    font-size: 12px;
    color: #999;
    text-transform: uppercase;
    margin-bottom: 8px;
    letter-spacing: 0.5px;
  }

  .stat-card.savings-card .stat-label {
    color: rgba(255, 255, 255, 0.8);
  }

  .stat-value {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 8px;
  }

  .stat-value.total-cost {
    color: #667eea;
  }

  .stat-card.savings-card .stat-value {
    color: white;
  }

  .stat-sub {
    font-size: 12px;
    color: #999;
  }

  .stat-card.savings-card .stat-sub {
    color: rgba(255, 255, 255, 0.9);
    font-size: 11px;
  }

  .stat-progress {
    background: #e0e0e0;
    height: 4px;
    border-radius: 2px;
    overflow: hidden;
  }

  .progress-bar {
    background: #667eea;
    height: 100%;
    transition: width 0.3s;
  }

  .breakdown {
    background: white;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 30px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .breakdown h3 {
    margin-bottom: 16px;
    font-size: 16px;
  }

  .breakdown-items {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .breakdown-item {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .item-info {
    min-width: 100px;
  }

  .item-name {
    font-weight: bold;
    margin-bottom: 4px;
  }

  .item-stats {
    font-size: 12px;
    color: #999;
    display: flex;
    gap: 8px;
  }

  .item-bar {
    flex: 1;
    height: 20px;
    background: #f0f0f0;
    border-radius: 4px;
    overflow: hidden;
  }

  .bar-fill {
    height: 100%;
    transition: width 0.3s;
  }

  .pie-chart {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .pie-chart h3 {
    margin-bottom: 16px;
    font-size: 16px;
  }

  .analysis-summary {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .analysis-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: #f9f9f9;
    border-radius: 6px;
  }

  .analysis-label {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }

  .analysis-data {
    display: flex;
    gap: 16px;
    align-items: center;
  }

  .count,
  .percent {
    font-weight: 600;
    font-size: 14px;
  }

  .percent {
    color: #667eea;
  }

  .empty-state {
    text-align: center;
    color: #999;
    padding: 40px 20px;
  }
</style>
