import { describe, it, expect } from "vitest";
import { render } from "@testing-library/svelte";
import Statistics from "./Statistics.svelte";

describe("Statistics", () => {
  it("renders empty state when no meals", () => {
    const { container } = render(Statistics, { props: { meals: {} } });
    expect(container).toHaveTextContent(
      "カレンダーから食事を選んでシミュレーションを開始しましょう!",
    );
  });

  it("calculates total cost from meals", () => {
    const meals = {
      1: { cost: 1000, category: "外食" },
      2: { cost: 800, category: "コンビニ弁当" },
      3: { cost: 500, category: "自炊" },
    };
    const { container } = render(Statistics, { props: { meals } });
    expect(container).toHaveTextContent("¥2,300");
  });

  it("calculates selected days", () => {
    const meals = {
      1: { cost: 1000, category: "外食" },
      2: { cost: 800, category: "コンビニ弁当" },
    };
    const { container } = render(Statistics, { props: { meals } });
    expect(container).toHaveTextContent("2 / 30 日");
  });

  it("calculates average cost per day", () => {
    const meals = {
      1: { cost: 1000, category: "外食" },
      2: { cost: 1000, category: "外食" },
    };
    const { container } = render(Statistics, { props: { meals } });
    expect(container).toHaveTextContent("1日平均: ¥1,000");
  });

  it("calculates savings compared to daily ramen", () => {
    const meals = {
      1: { cost: 900, category: "自炊" },
    };
    const { container } = render(Statistics, { props: { meals } });
    // monthlyIfAllRamen = 30 * 900 = 27,000
    // savings = 27,000 - 900 = 26,100
    expect(container).toHaveTextContent("¥26,100");
  });

  it("shows breakdown when meals exist", () => {
    const meals = {
      1: { cost: 1000, category: "外食" },
      2: { cost: 800, category: "コンビニ弁当" },
      3: { cost: 500, category: "自炊" },
    };
    const { container } = render(Statistics, { props: { meals } });
    expect(container).toHaveTextContent("食事カテゴリ別 支出と頻度");
    expect(container).toHaveTextContent("食事パターン分析");
  });

  it("calculates category costs correctly", () => {
    const meals = {
      1: { cost: 1000, category: "外食" },
      2: { cost: 1000, category: "外食" },
      3: { cost: 800, category: "コンビニ弁当" },
    };
    const { container } = render(Statistics, { props: { meals } });
    // Should show 外食 with 2 days and total cost
    expect(container).toHaveTextContent("2日");
    expect(container).toHaveTextContent("¥2,000");
  });
});
