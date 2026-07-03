<script>
  import Calendar from './lib/Calendar.svelte'
  import Statistics from './lib/Statistics.svelte'
  import QuickSim from './lib/QuickSim.svelte'
  import LivingCost from './lib/LivingCost.svelte'

  function loadMeals(y, m) {
    try { return JSON.parse(localStorage.getItem(`fs_meals_${y}-${m}`) ?? '{}') } catch { return {} }
  }

  let year = 2026
  let month = 7
  let meals = loadMeals(year, month)
  let quickSimCost = 0

  $: totalDays = new Date(year, month, 0).getDate()
  $: selectedDays = Object.keys(meals).length
  $: totalCost = Object.values(meals).reduce(
    (sum, m) => sum + m.cost + (m.drink?.cost ?? 0),
    0
  )
  $: savings = totalDays * 1000 - totalCost
  $: localStorage.setItem(`fs_meals_${year}-${month}`, JSON.stringify(meals))

  function switchMonth(y, m) {
    year = y
    month = m
    meals = loadMeals(y, m)
  }

  function prevMonth() {
    if (month === 1) switchMonth(year - 1, 12)
    else switchMonth(year, month - 1)
  }

  function nextMonth() {
    if (month === 12) switchMonth(year + 1, 1)
    else switchMonth(year, month + 1)
  }

  function reset() {
    meals = {}
    localStorage.removeItem(`fs_meals_${year}-${month}`)
  }

  function applySimulation(newMeals) {
    meals = newMeals
  }

  function exportCSV() {
    try {
      const selectedDays = Object.keys(meals).length
      if (selectedDays === 0) {
        alert('まずカレンダーから食事を選んでください')
        return
      }

      const lines = ['日付,カテゴリ,食事,金額,飲み物,飲み物代']
      for (let day = 0; day < 30; day++) {
        if (meals[day]) {
          const { category, item, cost, drink } = meals[day]
          lines.push(
            `${month}月${day + 1}日,${category},${item},${cost},${drink?.name ?? ''},${drink?.cost ?? 0}`
          )
        }
      }

      const csv = lines.join('\n')
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `food-simulator-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('CSV エクスポート失敗:', error)
      alert('ファイルのダウンロードに失敗しました')
    }
  }
</script>

<main>
  <header>
    <div class="header-content">
      <h1>🍱 一人暮らし向け 自炊シミュレーター</h1>
      <p>外食・弁当・自炊の1ヶ月の食費をシミュレート。自炊で本当に節約できるのか見えます。</p>
    </div>
  </header>

  <div class="summary-bar">
    <div class="summary-item">
      <span class="summary-label">入力</span>
      <span class="summary-value">{selectedDays} / 30日</span>
    </div>
    <div class="summary-item">
      <span class="summary-label">合計</span>
      <span class="summary-value cost">¥{totalCost.toLocaleString()}</span>
    </div>
    <div class="summary-item">
      <span class="summary-label">毎日ラーメン比</span>
      <span class="summary-value savings">¥{savings.toLocaleString()} おトク</span>
    </div>
  </div>

  <div class="month-nav">
    <button class="nav-btn" on:click={prevMonth}>‹</button>
    <div class="month-display">
      <select bind:value={year} on:change={() => switchMonth(year, month)}>
        {#each [2024, 2025, 2026, 2027] as y}
          <option value={y}>{y}年</option>
        {/each}
      </select>
      <select bind:value={month} on:change={() => switchMonth(year, month)}>
        {#each Array(12) as _, i}
          <option value={i + 1}>{i + 1}月</option>
        {/each}
      </select>
    </div>
    <button class="nav-btn" on:click={nextMonth}>›</button>
  </div>

  <QuickSim onApply={applySimulation} onCostChange={(c) => (quickSimCost = c)} />

  <div class="controls">
    <button class="btn btn-primary" on:click={exportCSV}>
      📥 CSV にエクスポート
    </button>
    <button class="btn btn-secondary" on:click={reset}>
      🔄 リセット
    </button>
  </div>

  <Calendar bind:meals {year} {month} {totalDays} />

  <Statistics {meals} {totalDays} />

  <LivingCost calendarCost={totalCost} {quickSimCost} />

  <footer>
    <p>
      © 2026 自炊シミュレーター -
      <a href="https://github.com/flipslidersand/food-simulator" target="_blank">
        GitHub
      </a>
    </p>
  </footer>
</main>

<style>
  main {
    max-width: 1200px;
    margin: 0 auto;
    padding-bottom: 40px;
  }

  header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 40px 20px;
    text-align: center;
    margin-bottom: 30px;
  }

  .header-content h1 {
    font-size: 32px;
    margin-bottom: 10px;
  }

  .header-content p {
    font-size: 16px;
    opacity: 0.95;
  }

  .summary-bar {
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    justify-content: center;
    gap: 32px;
    padding: 12px 20px;
    margin-bottom: 24px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(4px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  }

  .summary-item {
    display: flex;
    align-items: baseline;
    gap: 8px;
  }

  .summary-label {
    font-size: 12px;
    color: #999;
  }

  .summary-value {
    font-size: 18px;
    font-weight: bold;
  }

  .summary-value.cost {
    color: #667eea;
  }

  .summary-value.savings {
    color: #40c057;
  }

  .month-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin: 0 20px 20px;
  }

  .nav-btn {
    width: 36px;
    height: 36px;
    border: 2px solid #667eea;
    border-radius: 50%;
    background: white;
    color: #667eea;
    font-size: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    line-height: 1;
  }

  .nav-btn:hover {
    background: #667eea;
    color: white;
  }

  .month-display {
    display: flex;
    gap: 8px;
  }

  .month-display select {
    padding: 8px 12px;
    border: 2px solid #667eea;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 700;
    color: #667eea;
    background: white;
    cursor: pointer;
    appearance: none;
    text-align: center;
  }

  .controls {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-bottom: 30px;
    padding: 0 20px;
  }

  .btn {
    padding: 12px 20px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  .btn-secondary {
    background: white;
    color: #667eea;
    border: 2px solid #667eea;
  }

  .btn-secondary:hover {
    background: #f5f7fa;
    transform: translateY(-2px);
  }

  footer {
    text-align: center;
    padding: 20px;
    color: #999;
    font-size: 12px;
  }

  footer a {
    color: #667eea;
    text-decoration: none;
  }

  footer a:hover {
    text-decoration: underline;
  }

  @media (max-width: 640px) {
    .header-content h1 {
      font-size: 24px;
    }

    .header-content p {
      font-size: 14px;
    }

    .controls {
      flex-direction: column;
    }

    .btn {
      width: 100%;
    }
  }
</style>
