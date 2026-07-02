import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import Counter from "./Counter.svelte";

describe("Counter", () => {
  it("renders initial count of 0", () => {
    const { container } = render(Counter);
    expect(container).toHaveTextContent("Count is 0");
  });

  it("increments count on button click", async () => {
    const { container } = render(Counter);
    const button = container.querySelector("button");

    await userEvent.click(button);
    expect(container).toHaveTextContent("Count is 1");

    await userEvent.click(button);
    expect(container).toHaveTextContent("Count is 2");
  });

  it("renders as a button element", () => {
    const { container } = render(Counter);
    const button = container.querySelector("button.counter");
    expect(button).toBeTruthy();
  });
});
