"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { Info, X } from "lucide-react"

import { ZButton, ZField } from "@/components/auth/auth-ui"

const CODE_LENGTH = 6

/**
 * W5b — „Dołącz do gospodarstwa”. Tak jak w aplikacji mobilnej (invite-sheet): core-api
 * ma encję zaproszenia, ale nie ma endpointu do sprawdzenia i przyjęcia kodu — po wpisaniu
 * kodu mówimy wprost, że dołączanie ruszy wkrótce.
 */
export function InviteDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [code, setCode] = React.useState("")
  const [checked, setChecked] = React.useState(false)
  const complete = code.length === CODE_LENGTH

  React.useEffect(() => {
    if (!open) {
      setCode("")
      setChecked(false)
    }
  }, [open])

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[rgba(17,26,20,.45)] data-[state=open]:animate-in data-[state=open]:fade-in-0 dark:bg-black/60" />
        <DialogPrimitive.Content
          onOpenAutoFocus={(e) => {
            // Od razu do pola kodu, nie do „Zamknij”.
            e.preventDefault()
            document.getElementById("invite-code")?.focus()
          }}
          className="fixed top-[120px] left-1/2 z-50 flex w-[min(480px,calc(100%-32px))] -translate-x-1/2 flex-col gap-3.5 rounded-3xl bg-z-surface px-6 pt-[22px] pb-6 font-sans text-[15px] leading-[22px] text-z-ink shadow-[0_8px_28px_rgba(17,26,20,.12)] outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        >
          <div className="flex items-center justify-between gap-2">
            <DialogPrimitive.Title className="text-[19px] leading-[26px] font-bold tracking-[-0.01em]">
              Dołącz do gospodarstwa
            </DialogPrimitive.Title>
            <DialogPrimitive.Close
              aria-label="Zamknij"
              className="-mr-3 flex size-12 cursor-pointer items-center justify-center rounded-[14px] text-z-ink-2 outline-none hover:bg-z-bg-sunken focus-visible:ring-2 focus-visible:ring-z-ink/25"
            >
              <X className="size-[22px]" />
            </DialogPrimitive.Close>
          </div>
          <DialogPrimitive.Description className="-mt-1.5 text-z-ink-2">
            Otwórz link z SMS-a z zaproszeniem albo wpisz kod z tej wiadomości.
          </DialogPrimitive.Description>

          <form
            className="flex flex-col gap-3.5"
            onSubmit={(e) => {
              e.preventDefault()
              if (complete) setChecked(true)
            }}
          >
            <ZField label="Kod zaproszenia" htmlFor="invite-code">
              <input
                id="invite-code"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, CODE_LENGTH))
                  setChecked(false)
                }}
                autoCapitalize="characters"
                autoComplete="one-time-code"
                spellCheck={false}
                placeholder="np. 4K7M2Q"
                className="h-[52px] w-full rounded-[14px] border border-z-line-strong bg-z-surface px-3.5 font-mono text-xl font-semibold tracking-[.18em] text-z-ink outline-none placeholder:font-normal placeholder:tracking-normal placeholder:text-z-ink-3 focus:border-z-ink focus:shadow-[0_0_0_1px_var(--z-ink)]"
              />
            </ZField>

            {checked ? (
              <p
                role="status"
                className="flex items-start gap-2.5 rounded-2xl bg-z-blue-bg px-4 py-3.5 text-[14.5px] leading-[21px] text-z-blue-ink"
              >
                <Info className="mt-0.5 size-[18px] flex-none" aria-hidden />
                <span>
                  Dołączanie kodem z zaproszenia uruchomimy wkrótce. Na razie załóż własne
                  gospodarstwo — osoba, która Cię zaprosiła, doda Cię później.
                </span>
              </p>
            ) : null}

            <div className="flex flex-col gap-2 pt-0.5">
              <ZButton type="submit" size="lg" block disabled={!complete}>
                Dołącz
              </ZButton>
              <ZButton
                type="button"
                variant="ghost"
                block
                className="text-[15px]"
                onClick={() => onOpenChange(false)}
              >
                Wolę założyć własne gospodarstwo
              </ZButton>
            </div>
          </form>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
