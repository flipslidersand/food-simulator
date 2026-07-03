<script>
  import Calendar from './lib/Calendar.svelte'
  import Statistics from './lib/Statistics.svelte'
  import QuickSim from './lib/QuickSim.svelte'
  import LivingCost from './lib/LivingCost.svelte'

  let meals = {}
  let quickSimCost = 0

  $: selectedDays = Object.keys(meals).length
  $: totalCost = Object.values(meals).reduce(
    (sum, m) => sum + m.cost + (m.drink?.cost ?? 0),
    0
  )
  $: savings = 30 * 1000 - totalCost

  function reset() {
    meals = {}
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
            `7月${day + 1}日,${category},${item},${cost},${drink?.name ?? ''},${drink?.cost ?? 0}`
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

  <QuickSim onApply={applySimulation} onCostChange={(c) => (quickSimCost = c)} />

  <div class="controls">
    <button class="btn btn-primary" on:click={exportCSV}>
      📥 CSV にエクスポート
    </button>
    <button class="btn btn-secondary" on:click={reset}>
      🔄 リセット
    </button>
  </div>

  <Calendar bind:meals />

  <Statistics {meals} />

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
