<script>
  import Calendar from './lib/Calendar.svelte'
  import Statistics from './lib/Statistics.svelte'

  let meals = {}

  function reset() {
    meals = {}
  }

  function exportCSV() {
    try {
      const selectedDays = Object.keys(meals).length
      if (selectedDays === 0) {
        alert('まずカレンダーから食事を選んでください')
        return
      }

      const lines = ['日付,カテゴリ,食事,金額']
      for (let day = 0; day < 30; day++) {
        if (meals[day]) {
          const { category, item, cost } = meals[day]
          lines.push(`7月${day + 1}日,${category},${item},${cost}`)
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
