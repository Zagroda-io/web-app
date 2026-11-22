import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveTokens,
  updateTokens,
} from "./token-storage"

/** Magazyn w pamięci — Node 22+ ma własny `localStorage`, który przesłania ten z jsdom. */
class MemoryStorage implements Storage {
  private data = new Map<string, string>()
  get length() {
    return this.data.size
  }
  clear() {
    this.data.clear()
  }
  getItem(key: string) {
    return this.data.get(key) ?? null
  }
  key(index: number) {
    return [...this.data.keys()][index] ?? null
  }
  removeItem(key: string) {
    this.data.delete(key)
  }
  setItem(key: string, value: string) {
    this.data.set(key, String(value))
  }
}

beforeEach(() => {
  vi.stubGlobal("localStorage", new MemoryStorage())
  vi.stubGlobal("sessionStorage", new MemoryStorage())
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("token-storage", () => {
  it("„Zapamiętaj mnie” zapisuje sesję w localStorage", () => {
    saveTokens("a1", "r1", true)
    expect(localStorage.getItem("accessToken")).toBe("a1")
    expect(sessionStorage.getItem("accessToken")).toBeNull()
    expect(getAccessToken()).toBe("a1")
    expect(getRefreshToken()).toBe("r1")
  })

  it("bez „Zapamiętaj mnie” sesja trafia do sessionStorage", () => {
    saveTokens("a1", "r1", false)
    expect(sessionStorage.getItem("refreshToken")).toBe("r1")
    expect(localStorage.getItem("refreshToken")).toBeNull()
    expect(getAccessToken()).toBe("a1")
  })

  it("odświeżenie zostaje w magazynie bieżącej sesji", () => {
    saveTokens("a1", "r1", false)
    updateTokens("a2", "r2")
    expect(sessionStorage.getItem("accessToken")).toBe("a2")
    expect(localStorage.getItem("accessToken")).toBeNull()
  })

  it("nowe logowanie usuwa tokeny z drugiego magazynu", () => {
    saveTokens("a1", "r1", true)
    saveTokens("a2", "r2", false)
    expect(localStorage.getItem("accessToken")).toBeNull()
    expect(getAccessToken()).toBe("a2")
  })

  it("wylogowanie czyści oba magazyny", () => {
    saveTokens("a1", "r1", true)
    clearTokens()
    expect(getAccessToken()).toBeNull()
    expect(getRefreshToken()).toBeNull()
  })
})
