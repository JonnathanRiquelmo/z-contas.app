export type AccountType = "cash" | "checking" | "card"

export type Account = {
  id: string
  name: string
  type: AccountType
  balance: number
  ownerUid: string
}

export type TxType = "entrada" | "saida"

export type RecurrenceInterval = "monthly" | "weekly" | "daily" | "quinzenal"
export type RecurrenceMode = "parcelado" | "ate_data" | "indefinido"

export type Recurrence = {
  mode: RecurrenceMode
  interval: RecurrenceInterval
  amountPerInstallment: number
  installmentsTotal: number | null
  installmentsPaid: number
  startDate: number
  endDate: number | null
}

export type Transaction = {
  id: string
  date: number
  amount: number
  type: TxType
  category: string
  description?: string
  accountId: string
  responsible: "Zilma" | "Feito pelo Amorinho"
  isRecurring: boolean
  recurrence: Recurrence | null
  originTxId: string | null
  createdAt: number
  updatedAt: number
  ownerUid: string
}

export type Settings = {
  currency: "BRL"
  locale: "pt-BR"
  defaultAccountId?: string
  notificationPreferences?: Record<string, unknown>
  ownerUid: string
}
