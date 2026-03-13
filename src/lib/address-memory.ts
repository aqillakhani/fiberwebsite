"use client"

const STORAGE_KEY = "ffusa_address_memory"
const EXPIRY_DAYS = 90

type AddressMemory = {
  serviceAddress: string
  city: string
  state: string
  zip: string
  fullName: string
  email: string
  phone: string
  savedAt: number
}

export function getSavedAddress(): AddressMemory | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data: AddressMemory = JSON.parse(raw)
    const expiryMs = EXPIRY_DAYS * 24 * 60 * 60 * 1000
    if (Date.now() - data.savedAt > expiryMs) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return data
  } catch {
    return null
  }
}

export function saveAddress(data: Omit<AddressMemory, "savedAt">): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, savedAt: Date.now() }))
  } catch {
    // localStorage full or unavailable — fail silently
  }
}

export function clearSavedAddress(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEY)
}
