"use client"

import { useRef, useState, useId } from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface EarTagValue {
  /** Pełny numer w formacie "PL005000012345" (14 znaków) lub pusty string */
  full: string
  /** 12 cyfr bez prefiksu PL */
  digits: string
  /** Numer duplikatu np. "II" lub "" gdy oryginał */
  duplicate: string
}

interface EarTagInputProps {
  value?: EarTagValue
  onChange?: (value: EarTagValue) => void
  showDuplicate?: boolean
  className?: string
}

const DUPLICATES = ["I", "II", "III", "IV"]

function TagPreview({
  seg7,
  seg5,
  duplicate,
}: {
  seg7: string
  seg5: string
  duplicate: string
}) {
  const pad7 = seg7.padStart(7, "0")
  const pad5 = seg5.padStart(5, "0")

  return (
    <div className="flex flex-shrink-0 flex-col items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 600 650"
        width={118}
        height={128}
        style={{
          display: "block",
          filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))",
        }}
      >
        <defs>
          <style>{`
            .tag-yellow { fill: #f4ec00; }
            .t-small {
              font-family: "DIN 1451 Mittelschrift","DIN 1451",Bahnschrift,"Arial Narrow",Arial,sans-serif;
              font-weight: 700; fill: #111; letter-spacing: 4px;
            }
            .t-country {
              font-family: "DIN 1451 Mittelschrift","DIN 1451",Bahnschrift,"Arial Narrow",Arial,sans-serif;
              font-weight: 800; fill: #111;
            }
            .t-big {
              font-family: "DIN 1451 Mittelschrift","DIN 1451",Bahnschrift,"Arial Narrow",Arial,sans-serif;
              font-weight: 900; fill: #111;
            }
            .t-dup {
              font-family: "DIN 1451 Mittelschrift","DIN 1451",Bahnschrift,"Arial Narrow",Arial,sans-serif;
              font-weight: 700; fill: #111;
            }
            .bc { fill: #111; }
            .logo-line { stroke: #111; stroke-width: 2; fill: none; }
          `}</style>
        </defs>

        {/* Kształt kolczyka — dolna krawędź skrócona do 635 */}
        <path
          className="tag-yellow"
          d="
            M 38 635
            Q 10 635 10 605
            L 10 260
            Q 10 220 45 210
            C 130 185 170 120 205 45
            Q 225 5 300 5
            Q 375 5 395 45
            C 430 120 470 185 555 210
            Q 590 220 590 250
            L 590 605
            Q 590 635 562 635
            Z"
        />

        {/* Oczko/zatrzask */}
        <circle
          cx="300"
          cy="73"
          r="57"
          fill="#f4ec00"
          stroke="#222"
          strokeWidth="1.5"
        />
        <circle cx="300" cy="73" r="48" fill="#060606" />
        <circle cx="300" cy="73" r="25" fill="#000" />
        <circle cx="300" cy="73" r="12" fill="#2d2d2d" />

        {/* Logo ARiMR */}
        <g transform="translate(224 160)">
          <rect
            x="0"
            y="0"
            width="72"
            height="72"
            fill="none"
            stroke="#111"
            strokeWidth="2.5"
          />
          <path
            d="M5 13 H67 M5 24 H67 M5 35 H67 M5 46 H67"
            className="logo-line"
          />
          <path
            d="M17 42 C32 30 51 29 65 36"
            stroke="#111"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M8 52 C27 43 48 40 70 42"
            stroke="#111"
            strokeWidth="3"
            fill="none"
          />
          <path d="M21 39 A17 17 0 0 1 55 39 Z" fill="#111" />
          <text
            x="9"
            y="66"
            fontFamily="Arial"
            fontSize="14"
            fontStyle="italic"
            fontWeight="800"
            fill="#111"
          >
            ARiMR
          </text>
        </g>

        {/* Kod kraju */}
        <text x="342" y="226" className="t-country" fontSize="60">
          PL
        </text>

        {/* Duplikat (jeśli podany) */}
        {duplicate && (
          <text
            x="380"
            y="170"
            className="t-dup"
            fontSize="42"
            textAnchor="end"
          >
            {duplicate}
          </text>
        )}

        {/* Numer górny — 7 cyfr */}
        <text
          x="300"
          y="300"
          textAnchor="middle"
          className="t-small"
          fontSize="78"
        >
          {pad7}
        </text>

        {/* Barcode dekoracyjny */}
        <g transform="translate(70 315)">
          <rect className="bc" x="0" y="0" width="4" height="70" />
          <rect className="bc" x="9" y="0" width="3" height="70" />
          <rect className="bc" x="17" y="0" width="7" height="70" />
          <rect className="bc" x="31" y="0" width="2" height="70" />
          <rect className="bc" x="39" y="0" width="9" height="70" />
          <rect className="bc" x="55" y="0" width="4" height="70" />
          <rect className="bc" x="65" y="0" width="2" height="70" />
          <rect className="bc" x="73" y="0" width="8" height="70" />
          <rect className="bc" x="88" y="0" width="5" height="70" />
          <rect className="bc" x="101" y="0" width="3" height="70" />
          <rect className="bc" x="111" y="0" width="10" height="70" />
          <rect className="bc" x="130" y="0" width="4" height="70" />
          <rect className="bc" x="142" y="0" width="7" height="70" />
          <rect className="bc" x="157" y="0" width="2" height="70" />
          <rect className="bc" x="166" y="0" width="9" height="70" />
          <rect className="bc" x="184" y="0" width="3" height="70" />
          <rect className="bc" x="195" y="0" width="6" height="70" />
          <rect className="bc" x="210" y="0" width="4" height="70" />
          <rect className="bc" x="222" y="0" width="10" height="70" />
          <rect className="bc" x="240" y="0" width="3" height="70" />
          <rect className="bc" x="251" y="0" width="8" height="70" />
          <rect className="bc" x="268" y="0" width="5" height="70" />
          <rect className="bc" x="282" y="0" width="3" height="70" />
          <rect className="bc" x="292" y="0" width="9" height="70" />
          <rect className="bc" x="310" y="0" width="4" height="70" />
          <rect className="bc" x="322" y="0" width="7" height="70" />
          <rect className="bc" x="337" y="0" width="2" height="70" />
          <rect className="bc" x="346" y="0" width="10" height="70" />
          <rect className="bc" x="365" y="0" width="5" height="70" />
          <rect className="bc" x="378" y="0" width="3" height="70" />
          <rect className="bc" x="388" y="0" width="8" height="70" />
          <rect className="bc" x="405" y="0" width="4" height="70" />
          <rect className="bc" x="418" y="0" width="9" height="70" />
          <rect className="bc" x="438" y="0" width="3" height="70" />
          <rect className="bc" x="448" y="0" width="7" height="70" />
          <rect className="bc" x="464" y="0" width="4" height="70" />
        </g>

        {/* Duży numer — 5 cyfr */}
        <text
          x="300"
          y="610"
          textAnchor="middle"
          className="t-big"
          fontSize="278"
          transform="translate(300 0) scale(0.82 1) translate(-300 0)"
        >
          {pad5}
        </text>
      </svg>
    </div>
  )
}

export function EarTagInput({
  value,
  onChange,
  showDuplicate,
  className,
}: EarTagInputProps) {
  const id = useId()
  const ref7 = useRef<HTMLInputElement>(null)
  const ref5 = useRef<HTMLInputElement>(null)

  const [seg7, setSeg7] = useState(value?.digits?.slice(0, 7) ?? "")
  const [seg5, setSeg5] = useState(value?.digits?.slice(7) ?? "")
  const [duplicate, setDuplicate] = useState(value?.duplicate ?? "")

  const emit = (d7: string, d5: string, dup: string) => {
    const digits = d7 + d5
    onChange?.({
      full: digits.length === 12 ? `PL${digits}` : "",
      digits,
      duplicate: dup,
    })
  }

  const handleSeg7 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\D/g, "").slice(0, 7)
    setSeg7(v)
    if (v.length === 7) ref5.current?.focus()
    emit(v, seg5, duplicate)
  }

  const handleSeg5 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\D/g, "").slice(0, 5)
    setSeg5(v)
    emit(seg7, v, duplicate)
  }

  const handleDuplicate = (val: string) => {
    const dup = val === "none" ? "" : val
    setDuplicate(dup)
    emit(seg7, seg5, dup)
  }

  const digits12 = seg7 + seg5
  const isComplete = digits12.length === 12

  const inputCls = cn(
    "h-9 text-center text-sm tracking-widest tabular-nums",
    "rounded-md border border-input bg-background text-foreground",
    "focus:ring-2 focus:ring-ring focus:outline-none"
  )

  return (
    <div className={cn("flex items-start gap-5", className)}>
      <TagPreview seg7={seg7} seg5={seg5} duplicate={duplicate} />

      <div className="flex-1 space-y-3">
        <div className="space-y-2">
          <Label htmlFor={`${id}-s7`} className="text-xs text-muted-foreground">
            Numer kolczyka
          </Label>
          <div className="flex items-end gap-2">
            {/* PL prefix */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-muted-foreground">kraj</span>
              <div className="flex h-9 w-10 items-center justify-center rounded-md border border-input bg-muted text-sm font-medium text-muted-foreground select-none">
                PL
              </div>
            </div>
            <span className="pb-0.5 text-lg text-muted-foreground">·</span>
            {/* 7 cyfr */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-muted-foreground">
                pierwsze 7 cyfr
              </span>
              <input
                ref={ref7}
                id={`${id}-s7`}
                className={cn(inputCls, "w-28")}
                placeholder="0001234"
                maxLength={7}
                inputMode="numeric"
                value={seg7}
                onChange={handleSeg7}
              />
            </div>
            <span className="pb-0.5 text-lg text-muted-foreground">·</span>
            {/* 5 cyfr */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-muted-foreground">
                ostatnie 5 cyfr
              </span>
              <input
                ref={ref5}
                className={cn(inputCls, "w-20")}
                placeholder="56789"
                maxLength={5}
                inputMode="numeric"
                value={seg5}
                onChange={handleSeg5}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && seg5 === "")
                    ref7.current?.focus()
                }}
              />
            </div>
          </div>

          {/* status */}
          <div className="flex items-center gap-2">
            <div
              className={cn("h-1.5 w-1.5 rounded-full transition-colors", {
                "bg-green-600": isComplete,
                "bg-amber-500": !isComplete && digits12.length > 0,
                "bg-border": digits12.length === 0,
              })}
            />
            <span className="text-xs text-muted-foreground">
              {isComplete
                ? `Poprawny numer — PL${digits12}`
                : digits12.length > 0
                  ? `${digits12.length} z 12 cyfr`
                  : "Wprowadź 12 cyfr numeru"}
            </span>
          </div>
        </div>

        {showDuplicate && (
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Duplikat</Label>
            <Select value={duplicate || "none"} onValueChange={handleDuplicate}>
              <SelectTrigger className="h-8 w-40 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Oryginał</SelectItem>
                {DUPLICATES.map((d) => (
                  <SelectItem key={d} value={d}>
                    Duplikat {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  )
}
