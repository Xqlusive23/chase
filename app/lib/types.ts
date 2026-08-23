export type AccountType = "checking" | "savings" | "credit";

export type Account = {
  id: string;
  name: string;
  type: AccountType;
  number: string;
  balance: number;
};

export type ActivityStatus = "pending" | "processing" | "hold" | "posted";

export type TransferType = "ach" | "wire" | "internal" | "bill" | "deposit" | "activity" | "p2p";

export type Transaction = {
  id: string;
  accountId: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  status: ActivityStatus;
  applied: boolean;
  manualStatus?: boolean;
  recipient?: string;
  recipientDetail?: string;
  recipientEmail?: string;
  recipientBank?: string;
  routingNumber?: string;
  fee?: number;
  method?: string;
  transferType?: TransferType;
};

export type Bill = {
  id: string;
  payee: string;
  amount: number;
  dueDate: string;
  status: "due" | "paid";
};

export type Card = {
  id: string;
  name: string;
  last4: string;
  holder: string;
  expires: string;
  locked: boolean;
  type: "debit" | "credit";
  pan?: string;
  cvv?: string;
};

export type MemberPreferences = {
  hideBalances: boolean;
  alerts: boolean;
  paperless: boolean;
  twoStep: boolean;
};

export type MobileDeposit = {
  id: string;
  accountId: string;
  amount: number;
  memo: string;
  imageName: string;
  date: string;
  status: ActivityStatus;
};

export type Loan = {
  id: string;
  name: string;
  type: "personal" | "auto" | "home";
  principal: number;
  balance: number;
  rate: number;
  monthlyPayment: number;
  nextDue: string;
  status: "current" | "applied" | "closed";
};

export type WireTransfer = {
  id: string;
  accountId: string;
  beneficiary: string;
  bankName: string;
  routingNumber: string;
  accountNumber: string;
  swift: string;
  amount: number;
  date: string;
  status: ActivityStatus;
};

export type AchTransfer = {
  id: string;
  accountId: string;
  direction: "push" | "pull";
  recipient: string;
  routingNumber: string;
  accountNumber: string;
  amount: number;
  date: string;
  status: ActivityStatus;
};

export type SupportChannel = "whatsapp" | "email" | "instagram" | "facebook" | "telegram" | "other";

export type MemberSupport = {
  channel: SupportChannel;
  value: string;
};

export type LinkedAccount = {
  id: string;
  bankName: string;
  holder: string;
  routingNumber: string;
  accountNumber: string;
  type: string;
};

export type BankState = {
  displayName: string;
  avatar?: string;
  email?: string;
  phone?: string;
  address?: string;
  billingAddress?: string;
  transferPin?: string;
  accountHold?: boolean;
  accountActivityStatus?: ActivityStatus;
  support?: MemberSupport;
  linkedAccounts?: LinkedAccount[];
  preferences: MemberPreferences;
  accounts: Account[];
  transactions: Transaction[];
  bills: Bill[];
  cards: Card[];
  deposits: MobileDeposit[];
  loans: Loan[];
  wires: WireTransfer[];
  achs: AchTransfer[];
};

export type UserRole = "member" | "admin";

export type StoredUser = {
  username: string;
  displayName: string;
  password: string;
  email?: string;
  address?: string;
  transferPin?: string;
  role: UserRole;
  approved?: boolean;
  createdAt: string;
};

export type Session = {
  username: string;
  role: UserRole;
  signedInAt: string;
};
