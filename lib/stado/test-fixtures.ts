import type { Animal } from "@/lib/types/stado.types"

/** Zwierzę z domyślnymi polami do testów prezenterów — nadpisz tylko to, co ważne w teście. */
export function animalFixture(overrides: Partial<Animal> = {}): Animal {
  return {
    id: "a1",
    name: "Basia",
    birthDate: "2021-03-01",
    breed: "HO",
    earTagNumber: "PL005003001234034",
    bookType: "A",
    sensorId: null,
    sex: "FEMALE",
    category: "COW",
    lactationStatus: "LACTATING",
    lactationNumber: 3,
    dayInMilk: 120,
    ageLabel: "5 lat 6 m-ce",
    dryOffSuggested: false,
    suggestedDryOffDate: null,
    lastCalvingDate: "2026-05-20",
    expectedCalvingDate: null,
    reproduction: {
      status: "OPEN",
      lastInseminationDate: null,
      lastEstrusAt: null,
      pregnancyConfirmedDate: null,
      pregnancyCheckDate: null,
      expectedCalvingDate: null,
      daysToCalving: null,
    },
    attentionLevel: "OK",
    urgency: 5,
    tasks: [],
    activeAlert: null,
    lastEvent: null,
    ...overrides,
  }
}
