"use client"

import { useState } from "react"
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  Calendar as CalendarIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Calendar } from "@/components/ui/calendar"
import { format, parseISO, isValid } from "date-fns"
import { pl } from "date-fns/locale"
import { cn } from "@/lib/utils"
import {
  EarTagInput,
  type EarTagValue,
} from "@/components/stado/new-animal/EartagInput"

const BREEDS = [
  { value: "HO", label: "HO – Holsztyno-fryzyjska" },
  { value: "RW", label: "RW – Polska Czerwono-biała" },
  { value: "JE", label: "JE – Jersey" },
  { value: "SI", label: "SI – Simental" },
  { value: "ZB", label: "ZB – Polska Czarno-biała" },
]

const BOOK_TYPES = [
  { value: "A", label: "A – Księga główna" },
  { value: "B", label: "B – Pomocnicza" },
  { value: "C", label: "C – Rejestr" },
]

const STEPS = [
  { id: 0, label: "Krowa" },
  { id: 1, label: "Matka" },
  { id: 2, label: "Ojciec" },
  { id: 3, label: "Dziadkowie" },
]

const EMPTY_TAG: EarTagValue = { full: "", digits: "", duplicate: "" }

interface FormData {
  // Animal
  earTag: EarTagValue
  name: string
  birthDate: string
  breed: string
  bookType: string
  sensorId: string
  // Father
  fatherEarTag: EarTagValue
  fatherName: string
  fatherBirthDate: string
  fatherBreed: string
  fatherBookType: string
  // Mother
  motherEarTag: EarTagValue
  motherName: string
  motherBirthDate: string
  motherBreed: string
  motherBookType: string
  motherEfficiency: string
  motherLactation: string
  motherOffspring: string
  // Grandparents – father's side
  ffEarTag: EarTagValue
  ffName: string
  ffBirthDate: string
  ffBreed: string
  ffBookType: string
  fmEarTag: EarTagValue
  fmName: string
  fmBirthDate: string
  fmBreed: string
  fmBookType: string
  // Grandparents – mother's side
  mfEarTag: EarTagValue
  mfName: string
  mfBirthDate: string
  mfBreed: string
  mfBookType: string
  mmEarTag: EarTagValue
  mmName: string
  mmBirthDate: string
  mmBreed: string
  mmBookType: string
  grandmotherLactations: string
}

const EMPTY: FormData = {
  earTag: EMPTY_TAG,
  name: "",
  birthDate: "",
  breed: "HO",
  bookType: "",
  sensorId: "",
  fatherEarTag: EMPTY_TAG,
  fatherName: "",
  fatherBirthDate: "",
  fatherBreed: "",
  fatherBookType: "",
  motherEarTag: EMPTY_TAG,
  motherName: "",
  motherBirthDate: "",
  motherBreed: "",
  motherBookType: "",
  motherEfficiency: "",
  motherLactation: "",
  motherOffspring: "",
  ffEarTag: EMPTY_TAG,
  ffName: "",
  ffBirthDate: "",
  ffBreed: "",
  ffBookType: "",
  fmEarTag: EMPTY_TAG,
  fmName: "",
  fmBirthDate: "",
  fmBreed: "",
  fmBookType: "",
  mfEarTag: EMPTY_TAG,
  mfName: "",
  mfBirthDate: "",
  mfBreed: "",
  mfBookType: "",
  mmEarTag: EMPTY_TAG,
  mmName: "",
  mmBirthDate: "",
  mmBreed: "",
  mmBookType: "",
  grandmotherLactations: "",
}

// ─── helpers ────────────────────────────────────────────────────────────────

function BreedSelect({
  id,
  value,
  onChange,
}: {
  id: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id={id}>
        <SelectValue placeholder="Wybierz rasę" />
      </SelectTrigger>
      <SelectContent>
        {BREEDS.map((b) => (
          <SelectItem key={b.value} value={b.value}>
            {b.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function BookTypeSelect({
  id,
  value,
  onChange,
}: {
  id: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id={id}>
        <SelectValue placeholder="Typ księgi" />
      </SelectTrigger>
      <SelectContent>
        {BOOK_TYPES.map((b) => (
          <SelectItem key={b.value} value={b.value}>
            {b.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function FieldRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1 border-b pb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">
      {children}
    </p>
  )
}

// ─── step 0: Krowa ──────────────────────────────────────────────────────────

function DatePickerField({
  value,
  onChange,
  placeholder = "Wybierz datę",
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  const date = value ? parseISO(value) : undefined

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date && isValid(date) ? (
            format(date, "PPP", { locale: pl })
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => onChange(d ? d.toISOString() : "")}
          locale={pl}
        />
      </PopoverContent>
    </Popover>
  )
}

function AnimalFields({
  data,
  set,
  setTag,
}: {
  data: FormData
  set: (k: keyof FormData, v: string) => void
  setTag: (k: keyof FormData, v: EarTagValue) => void
}) {
  return (
    <div className="space-y-4">
      <EarTagInput
        value={data.earTag}
        onChange={(v) => setTag("earTag", v)}
        showDuplicate
      />
      <div className="space-y-3">
        <FieldRow label="Imię">
          <Input
            placeholder="np. Bella"
            value={data.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </FieldRow>
        <FieldRow label="Data urodzenia *">
          <DatePickerField
            value={data.birthDate}
            onChange={(v) => set("birthDate", v)}
          />
        </FieldRow>
        <FieldRow label="Rasa *">
          <BreedSelect
            id="breed"
            value={data.breed}
            onChange={(v) => set("breed", v)}
          />
        </FieldRow>
        <FieldRow label="Typ księgi">
          <BookTypeSelect
            id="bookType"
            value={data.bookType}
            onChange={(v) => set("bookType", v)}
          />
        </FieldRow>
        <FieldRow label="ID sensora">
          <Input
            placeholder="np. SENS-001"
            value={data.sensorId}
            onChange={(e) => set("sensorId", e.target.value)}
          />
        </FieldRow>
      </div>
    </div>
  )
}

// ─── step 1 & 2: Rodzic ─────────────────────────────────────────────────────

function ParentFields({
  prefix,
  earTagKey,
  labels,
  data,
  set,
  setTag,
}: {
  prefix: "father" | "mother"
  earTagKey: keyof FormData
  labels: { name: string; birth: string; breed: string; book: string }
  data: FormData
  set: (k: keyof FormData, v: string) => void
  setTag: (k: keyof FormData, v: EarTagValue) => void
}) {
  const f = (field: string) =>
    `${prefix}${field[0].toUpperCase() + field.slice(1)}` as keyof FormData

  return (
    <div className="space-y-4">
      <EarTagInput
        value={data[earTagKey] as EarTagValue}
        onChange={(v) => setTag(earTagKey, v)}
        showDuplicate={false}
      />
      <div className="space-y-3">
        <FieldRow label={labels.name}>
          <Input
            placeholder="Imię"
            value={data[f("name")] as string}
            onChange={(e) => set(f("name"), e.target.value)}
          />
        </FieldRow>
        <FieldRow label={labels.birth}>
          <DatePickerField
            value={data[f("birthDate")] as string}
            onChange={(v) => set(f("birthDate"), v)}
          />
        </FieldRow>
        <FieldRow label={labels.breed}>
          <BreedSelect
            id={`${prefix}-breed`}
            value={data[f("breed")] as string}
            onChange={(v) => set(f("breed"), v)}
          />
        </FieldRow>
        <FieldRow label={labels.book}>
          <BookTypeSelect
            id={`${prefix}-book`}
            value={data[f("bookType")] as string}
            onChange={(v) => set(f("bookType"), v)}
          />
        </FieldRow>
      </div>
    </div>
  )
}

function MotherExtras({
  data,
  set,
}: {
  data: FormData
  set: (k: keyof FormData, v: string) => void
}) {
  return (
    <div className="space-y-3 pt-2">
      <SectionTitle>Wydajność i rozród matki</SectionTitle>
      <FieldRow label="Wydajność">
        <Input
          placeholder="np. 9500 kg"
          value={data.motherEfficiency}
          onChange={(e) => set("motherEfficiency", e.target.value)}
        />
      </FieldRow>
      <FieldRow label="Liczba laktacji">
        <Input
          placeholder="np. 4"
          value={data.motherLactation}
          onChange={(e) => set("motherLactation", e.target.value)}
        />
      </FieldRow>
      <FieldRow label="Liczba potomstwa">
        <Input
          placeholder="np. 5"
          value={data.motherOffspring}
          onChange={(e) => set("motherOffspring", e.target.value)}
        />
      </FieldRow>
    </div>
  )
}

// ─── step 3: Dziadkowie ──────────────────────────────────────────────────────

function GrandparentBlock({
  title,
  prefix,
  earTagKey,
  data,
  set,
  setTag,
}: {
  title: string
  prefix: "ff" | "fm" | "mf" | "mm"
  earTagKey: keyof FormData
  data: FormData
  set: (k: keyof FormData, v: string) => void
  setTag: (k: keyof FormData, v: EarTagValue) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const f = (field: string) =>
    `${prefix}${field[0].toUpperCase() + field.slice(1)}` as keyof FormData

  const earTag = data[earTagKey] as EarTagValue
  const hasData =
    earTag.digits.length > 0 ||
    data[f("name")] ||
    data[f("birthDate")] ||
    (prefix === "mm" && data.grandmotherLactations)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="flex w-full items-center justify-between p-0 h-auto hover:bg-transparent"
        >
          <div className="flex items-center gap-2">
            <SectionTitle>{title}</SectionTitle>
            {hasData && !isOpen && (
              <span className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded-full lowercase">
                Wypełniono
              </span>
            )}
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-3 pt-1">
        <EarTagInput
          value={data[earTagKey] as EarTagValue}
          onChange={(v) => setTag(earTagKey, v)}
          showDuplicate={false}
        />
        <div className="space-y-2">
          <FieldRow label="Imię">
            <Input
              value={data[f("name")] as string}
              onChange={(e) => set(f("name"), e.target.value)}
            />
          </FieldRow>
          <FieldRow label="Data urodzenia">
            <DatePickerField
              value={data[f("birthDate")] as string}
              onChange={(v) => set(f("birthDate"), v)}
            />
          </FieldRow>
          <div className="grid grid-cols-2 gap-2">
            <FieldRow label="Rasa">
              <BreedSelect
                id={`${prefix}-breed`}
                value={data[f("breed")] as string}
                onChange={(v) => set(f("breed"), v)}
              />
            </FieldRow>
            <FieldRow label="Typ księgi">
              <BookTypeSelect
                id={`${prefix}-book`}
                value={data[f("bookType")] as string}
                onChange={(v) => set(f("bookType"), v)}
              />
            </FieldRow>
          </div>
          {prefix === "mm" && (
            <FieldRow label="Laktacje">
              <Input
                placeholder="np. 3 laktacje, 8800 kg"
                value={data.grandmotherLactations}
                onChange={(e) => set("grandmotherLactations", e.target.value)}
              />
            </FieldRow>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function GrandparentsFields({
  data,
  set,
  setTag,
}: {
  data: FormData
  set: (k: keyof FormData, v: string) => void
  setTag: (k: keyof FormData, v: EarTagValue) => void
}) {
  return (
    <div className="space-y-4">
      <GrandparentBlock
        title="Ojciec ojca (FF)"
        prefix="ff"
        earTagKey="ffEarTag"
        data={data}
        set={set}
        setTag={setTag}
      />
      <GrandparentBlock
        title="Matka ojca (FM)"
        prefix="fm"
        earTagKey="fmEarTag"
        data={data}
        set={set}
        setTag={setTag}
      />
      <GrandparentBlock
        title="Ojciec matki (MF)"
        prefix="mf"
        earTagKey="mfEarTag"
        data={data}
        set={set}
        setTag={setTag}
      />
      <GrandparentBlock
        title="Matka matki (MM)"
        prefix="mm"
        earTagKey="mmEarTag"
        data={data}
        set={set}
        setTag={setTag}
      />
    </div>
  )
}

// ─── main ────────────────────────────────────────────────────────────────────

export function AddCowSheet() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [data, setData] = useState<FormData>(EMPTY)

  const set = (key: keyof FormData, value: string) =>
    setData((prev) => ({ ...prev, [key]: value }))

  const setTag = (key: keyof FormData, value: EarTagValue) =>
    setData((prev) => ({ ...prev, [key]: value }))

  const handleClose = () => {
    setOpen(false)
    setStep(0)
    setData(EMPTY)
  }
  const handleSubmit = () => {
    console.log("Nowa krowa:", data)
    handleClose()
  }

  const isFirstStepValid =
    data.earTag.digits.length === 12 && data.birthDate !== ""

  return (
    <Sheet
      open={open}
      onOpenChange={(o) => {
        if (!o) handleClose()
        else setOpen(true)
      }}
    >
      <SheetTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Dodaj krowę
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle>Dodaj nową krowę</SheetTitle>
          <SheetDescription>
            Krok {step + 1} z {STEPS.length} — {STEPS[step].label}
          </SheetDescription>
        </SheetHeader>

        {/* Step indicator */}
        <div className="flex items-center gap-0 border-b px-6 py-3">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex flex-1 items-center">
              <button
                type="button"
                onClick={() => (i < step || i === 0 ? setStep(i) : undefined)}
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium transition-colors",
                  i === step
                    ? "bg-primary text-primary-foreground"
                    : i < step
                      ? "cursor-pointer bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                )}
              >
                {i < step ? <Check className="h-3 w-3" /> : i + 1}
              </button>
              <span
                className={cn(
                  "ml-1.5 truncate text-xs",
                  i === step
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {s.label}
              </span>
              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    "mx-2 h-px flex-1 shrink-0",
                    i < step ? "bg-primary/30" : "bg-border"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {step === 0 && <AnimalFields data={data} set={set} setTag={setTag} />}
          {step === 1 && (
            <>
              <ParentFields
                prefix="mother"
                earTagKey="motherEarTag"
                data={data}
                set={set}
                setTag={setTag}
                labels={{
                  name: "Imię matki",
                  birth: "Data urodzenia matki",
                  breed: "Rasa matki",
                  book: "Typ księgi matki",
                }}
              />
              <MotherExtras data={data} set={set} />
            </>
          )}
          {step === 2 && (
            <ParentFields
              prefix="father"
              earTagKey="fatherEarTag"
              data={data}
              set={set}
              setTag={setTag}
              labels={{
                name: "Imię ojca",
                birth: "Data urodzenia ojca",
                breed: "Rasa ojca",
                book: "Typ księgi ojca",
              }}
            />
          )}
          {step === 3 && (
            <GrandparentsFields data={data} set={set} setTag={setTag} />
          )}
        </div>

        {/* Footer */}
        <SheetFooter className="flex-row justify-between gap-2 border-t px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={step === 0 ? handleClose : () => setStep((s) => s - 1)}
            className="gap-1.5"
          >
            {step === 0 ? (
              "Anuluj"
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                Wstecz
              </>
            )}
          </Button>

          {step < STEPS.length - 1 ? (
            <div className="flex gap-2">
              {step > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep((s) => s + 1)}
                  className="gap-1.5 text-muted-foreground"
                >
                  Pomiń
                </Button>
              )}
              <Button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                disabled={step === 0 && !isFirstStepValid}
                className="gap-1.5"
              >
                Dalej
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={handleSubmit}
                className="gap-1.5 text-muted-foreground"
              >
                Pomiń i zapisz
              </Button>
              <Button type="button" onClick={handleSubmit} className="gap-1.5">
                <Check className="h-4 w-4" />
                Zapisz krowę
              </Button>
            </div>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
