"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2Icon } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { userService } from "@/api/user-service"
import { useUser } from "@/context/UserContext"

const farmSchema = z.object({
  name: z.string().min(2, "Nazwa musi mieć co najmniej 2 znaki"),
  type: z.enum(["cattle", "swine", "mixed", "other"]),
  location: z.string().optional(),
  area: z.number().min(0).optional(),
})

type FarmFormValues = z.infer<typeof farmSchema>

interface CreateFarmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateFarmDialog({
  open,
  onOpenChange,
}: CreateFarmDialogProps) {
  const { refreshUser } = useUser()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<FarmFormValues>({
    resolver: zodResolver(farmSchema),
    defaultValues: {
      name: "",
      type: "cattle",
      location: "",
    },
  })

  const onSubmit = async (values: FarmFormValues) => {
    setIsSubmitting(true)
    try {
      await userService.createFarm(values)
      await refreshUser()
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error("Failed to create farm:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dodaj nowe gospodarstwo</DialogTitle>
          <DialogDescription>
            Wprowadź dane swojego nowego gospodarstwa, aby zacząć nim zarządzać.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nazwa gospodarstwa</FormLabel>
                  <FormControl>
                    <Input placeholder="np. Zielona Dolina" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Typ działalności</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz typ" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cattle">Bydło</SelectItem>
                      <SelectItem value="swine">Trzoda chlewna</SelectItem>
                      <SelectItem value="mixed">Mieszane</SelectItem>
                      <SelectItem value="other">Inne</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lokalizacja (opcjonalnie)</FormLabel>
                  <FormControl>
                    <Input placeholder="np. Mazowsze" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Anuluj
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                )}
                Utwórz gospodarstwo
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
