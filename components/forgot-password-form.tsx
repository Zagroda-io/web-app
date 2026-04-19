"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Przypomnij hasło</CardTitle>
          <CardDescription>
            Wprowadź swój adres e-mail, aby otrzymać link do resetowania hasła.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="jan.kowalski@przyklad.pl"
                  required
                />
              </Field>
              <Field>
                <Button type="submit" className="w-full">
                  Wyślij link do resetowania
                </Button>
                <FieldDescription className="text-center">
                  Pamiętasz hasło?{" "}
                  <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                    Zaloguj się
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <div className="text-center">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/login">
            <ArrowLeft className="mr-2 size-4" />
            Powrót do logowania
          </Link>
        </Button>
      </div>
    </div>
  )
}
