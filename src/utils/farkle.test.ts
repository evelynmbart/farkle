import { describe, expect, test } from "vitest";
import { calculateScore, isValidBank } from "./farkle";

describe("calculateScore", () => {
  test("returns 50 for single 5", () => {
    expect(calculateScore([5])).toBe(50);
  });

  test("returns 100 for single 1", () => {
    expect(calculateScore([1])).toBe(100);
  });

  test("returns 300 for triple 1s", () => {
    expect(calculateScore([1, 1, 1])).toBe(300);
  });

  test("returns 200 for triple 2s", () => {
    expect(calculateScore([2, 2, 2])).toBe(200);
  });

  test("returns 300 for triple 3s", () => {
    expect(calculateScore([3, 3, 3])).toBe(300);
  });

  test("returns 400 for triple 4s", () => {
    expect(calculateScore([4, 4, 4])).toBe(400);
  });

  test("returns 500 for triple 5s", () => {
    expect(calculateScore([5, 5, 5])).toBe(500);
  });

  test("returns 600 for triple 6s", () => {
    expect(calculateScore([6, 6, 6])).toBe(600);
  });

  test("returns 1000 for 4 of any number", () => {
    expect(calculateScore([1, 1, 1, 1])).toBe(1000);
    expect(calculateScore([2, 2, 2, 2])).toBe(1000);
    expect(calculateScore([3, 3, 3, 3])).toBe(1000);
    expect(calculateScore([4, 4, 4, 4])).toBe(1000);
    expect(calculateScore([5, 5, 5, 5])).toBe(1000);
    expect(calculateScore([6, 6, 6, 6])).toBe(1000);
  });

  test("returns 2000 for 5 of any number", () => {
    expect(calculateScore([1, 1, 1, 1, 1])).toBe(2000);
    expect(calculateScore([2, 2, 2, 2, 2])).toBe(2000);
    expect(calculateScore([3, 3, 3, 3, 3])).toBe(2000);
    expect(calculateScore([4, 4, 4, 4, 4])).toBe(2000);
    expect(calculateScore([5, 5, 5, 5, 5])).toBe(2000);
    expect(calculateScore([6, 6, 6, 6, 6])).toBe(2000);
  });

  test("returns 3000 for 6 of any number", () => {
    expect(calculateScore([1, 1, 1, 1, 1, 1])).toBe(3000);
    expect(calculateScore([2, 2, 2, 2, 2, 2])).toBe(3000);
    expect(calculateScore([3, 3, 3, 3, 3, 3])).toBe(3000);
    expect(calculateScore([4, 4, 4, 4, 4, 4])).toBe(3000);
    expect(calculateScore([5, 5, 5, 5, 5, 5])).toBe(3000);
    expect(calculateScore([6, 6, 6, 6, 6, 6])).toBe(3000);
  });

  test("returns 1500 for 1-6 straight", () => {
    expect(calculateScore([1, 2, 3, 4, 5, 6])).toBe(1500);
  });

  test("combo of triple 6 and single 1 returns 700", () => {
    expect(calculateScore([6, 6, 6, 1])).toBe(700);
  });

  test("random combo", () => {
    expect(calculateScore([3, 4, 3, 1])).toBe(100);
  });
});

describe("isValidBank", () => {
  test("returns true for valid bank", () => {
    expect(isValidBank([1, 1, 1, 2, 2, 2])).toBe(true);
  });

  test("returns false for invalid bank", () => {
    expect(isValidBank([1, 6])).toBe(false);
  });
});
