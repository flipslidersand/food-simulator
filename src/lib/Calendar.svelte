<script>
  import menus from '../data/menus.json'

  export let meals = {}
  export let year = 2026
  export let month = 7
  export let totalDays = 30

  function handleMealSelect(day, categoryIdx, itemIdx) {
    const category = menus.categories[categoryIdx]
    const item = category.items[itemIdx]
    meals[day] = { category: category.name, item: item.name, cost: item.cost }
  }

  function clearMeal(day) {
    delete meals[day]
    meals = meals
  }

  function handleDrinkSelect(day, drinkIdx) {
    const drink = menus.drinks[drinkIdx]
    meals[day] = { ...meals[day], drink: { name: drink.name, cost: drink.cost } }
  }

  function clearDrink(day) {
    const { drink, ...rest } = meals[day]
    meals[day] = rest
  }
</script>

<div class="calendar">
  {#each Array(totalDays) as _, day}
    {#if day === 0}
      <div class="month-header">{year}年{month}月</div>
    {/if}
    <div class="day-cell" class:selected={meals[day]}>
      <div class="day-number">{day + 1}日</div>
      {#if meals[day]}
        <div class="selected-meal">
          <div class="meal-category">{meals[day].category}</div>
          <div class="meal-name">{meals[day].item}</div>
          <div class="meal-cost">
            ¥{(meals[day].cost + (meals[day].drink?.cost ?? 0)).toLocaleString()}
          </div>
          {#if meals[day].drink}
            <div class="drink-selected">
              🥤 {meals[day].drink.name} ¥{meals[day].drink.cost}
              <button class="drink-clear" on:click={() => clearDrink(day)}>×</button>
            </div>
          {:else}
            <div class="drink-select">
              <div class="drink-label">＋飲み物</div>
              {#each menus.drinks as drink, drinkIdx}
                <button
                  class="drink-btn"
                  on:click={() => handleDrinkSelect(day, drinkIdx)}
                  title="{drink.name} ¥{drink.cost}"
                >
                  {drink.name} ¥{drink.cost}
                </button>
              {/each}
            </div>
          {/if}
          <button class="clear-btn" on:click={() => clearMeal(day)}>
            ×
          </button>
        </div>
      {:else}
        <div class="menu-select">
          {#each menus.categories as category, catIdx}
            <div class="category-group">
              <div class="category-name">{category.name}</div>
              {#each category.items as item, itemIdx}
                <button
                  class="menu-btn"
                  style="background-color: {category.color}"
                  on:click={() => handleMealSelect(day, catIdx, itemIdx)}
                  title="{item.name} ¥{item.cost}"
                >
                  {item.name} ¥{item.cost}
                </button>
              {/each}
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/each}
</div>

<style>
  .calendar {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 12px;
    padding: 20px;
    background: #f5f5f5;
    border-radius: 8px;
  }

  .month-header {
    grid-column: 1 / -1;
    font-size: 24px;
    font-weight: bold;
    padding: 20px 0;
    text-align: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 8px;
    margin-bottom: 10px;
  }

  .day-cell {
    background: white;
    border: 2px solid #ddd;
    border-radius: 8px;
    padding: 12px;
    min-height: 180px;
    display: flex;
    flex-direction: column;
    transition: all 0.2s;
  }

  .day-cell:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .day-cell.selected {
    border-color: #667eea;
    background: #f0f3ff;
  }

  .day-number {
    font-weight: bold;
    font-size: 14px;
    color: #666;
    margin-bottom: 10px;
  }

  .selected-meal {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    position: relative;
  }

  .meal-category {
    font-size: 12px;
    color: #999;
    margin-bottom: 4px;
  }

  .meal-name {
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 8px;
  }

  .meal-cost {
    font-size: 18px;
    font-weight: bold;
    color: #667eea;
    margin-bottom: 12px;
  }

  .clear-btn {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #ff6b6b;
    color: white;
    border: none;
    font-size: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .clear-btn:hover {
    background: #ff5252;
    transform: scale(1.1);
  }

  .menu-select {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
    justify-content: center;
  }

  .category-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .category-name {
    font-size: 11px;
    font-weight: bold;
    color: #999;
    padding: 4px 0;
  }

  .menu-btn {
    padding: 6px 8px;
    border: none;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    color: white;
    font-weight: 500;
    transition: all 0.2s;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  }

  .menu-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .menu-btn:active {
    transform: translateY(0);
  }

  .drink-selected {
    font-size: 12px;
    color: #666;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-bottom: 8px;
  }

  .drink-clear {
    border: none;
    background: #ddd;
    color: #666;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    font-size: 12px;
    cursor: pointer;
    line-height: 1;
  }

  .drink-select {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 8px;
  }

  .drink-label {
    font-size: 11px;
    font-weight: bold;
    color: #999;
  }

  .drink-btn {
    padding: 4px 8px;
    border: 1px solid #74c0fc;
    border-radius: 4px;
    background: #e7f5ff;
    color: #1971c2;
    font-size: 11px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .drink-btn:hover {
    background: #d0ebff;
  }
</style>
