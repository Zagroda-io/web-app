import { AxiosError, AxiosHeaders } from "axios"
import { describe, expect, it } from "vitest"
import { apiErrorMessage } from "./api-error"

function problem(status: number, data: unknown): AxiosError {
  return new AxiosError("Request failed", "ERR_BAD_REQUEST", undefined, undefined, {
    status,
    statusText: "",
    headers: {},
    config: { headers: new AxiosHeaders() },
    data,
  })
}

describe("apiErrorMessage", () => {
  it("pokazuje powód z problem+json", () => {
    const error = problem(409, {
      title: "Conflict",
      status: 409,
      detail: "Czujnik 0080e115061bf535 jest już przypisany do krowy Mućka.",
    })

    expect(apiErrorMessage(error, "fallback")).toBe(
      "Czujnik 0080e115061bf535 jest już przypisany do krowy Mućka."
    )
  })

  it("bez pola detail używa komunikatu zapasowego", () => {
    expect(apiErrorMessage(problem(500, { error: "Internal" }), "fallback")).toBe("fallback")
    expect(apiErrorMessage(problem(400, { detail: "  " }), "fallback")).toBe("fallback")
  })

  it("błąd spoza axiosa daje komunikat zapasowy", () => {
    expect(apiErrorMessage(new Error("boom"), "fallback")).toBe("fallback")
  })
})
