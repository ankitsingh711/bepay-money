import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "./status-badge";

describe("StatusBadge", () => {
  it("renders the human label for each status", () => {
    render(<StatusBadge status="confirmed" />);
    expect(screen.getByText("Confirmed")).toBeInTheDocument();
  });

  it("maps payment-link statuses too", () => {
    render(<StatusBadge status="expired" />);
    expect(screen.getByText("Expired")).toBeInTheDocument();
  });
});
