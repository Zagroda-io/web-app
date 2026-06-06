export interface Farm {
  id: string
  name: string
  ownerId: string
  location?: string
  area?: number
  type?: "cattle" | "swine" | "mixed" | "other"
  logoUrl?: string
  createdAt: string
  updatedAt: string
}

export interface FarmMember {
  farmId: string
  userId: string
  role: "owner" | "manager" | "worker" | "viewer"
}

export interface UserFarmsResponse {
  farms: Farm[]
  activeFarmId?: string
}
