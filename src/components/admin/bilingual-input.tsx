"use client"

/**
 * Bilingual input field component
 */

import { Controller, FieldPath, FieldValues, UseControllerProps } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface BilingualInputProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> {
  control: any
  name: TName
  label: string
  placeholder?: { en?: string; bn?: string }
  type?: "input" | "textarea"
  required?: boolean
}

export function BilingualInput<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  control,
  name,
  label,
  placeholder,
  type = "input",
  required = true,
}: BilingualInputProps<TFieldValues, TName>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <div className="space-y-3">
          <Label className="text-sm font-semibold">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* English Input */}
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">English</label>
              {type === "textarea" ? (
                <Textarea
                  {...field}
                  value={(field.value?.en || "")}
                  onChange={(e) =>
                    field.onChange({
                      ...field.value,
                      en: e.target.value,
                    })
                  }
                  placeholder={placeholder?.en || `Enter ${label.toLowerCase()} in English`}
                  className="h-24 resize-none"
                />
              ) : (
                <Input
                  {...field}
                  value={(field.value?.en || "")}
                  onChange={(e) =>
                    field.onChange({
                      ...field.value,
                      en: e.target.value,
                    })
                  }
                  placeholder={placeholder?.en || `Enter ${label.toLowerCase()} in English`}
                />
              )}
            </div>

            {/* Bangla Input */}
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">বাংলা</label>
              {type === "textarea" ? (
                <Textarea
                  {...field}
                  value={(field.value?.bn || "")}
                  onChange={(e) =>
                    field.onChange({
                      ...field.value,
                      bn: e.target.value,
                    })
                  }
                  placeholder={placeholder?.bn || `Enter ${label.toLowerCase()} in Bangla`}
                  className="h-24 resize-none"
                />
              ) : (
                <Input
                  {...field}
                  value={(field.value?.bn || "")}
                  onChange={(e) =>
                    field.onChange({
                      ...field.value,
                      bn: e.target.value,
                    })
                  }
                  placeholder={placeholder?.bn || `Enter ${label.toLowerCase()} in Bangla`}
                />
              )}
            </div>
          </div>

          {error && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
        </div>
      )}
    />
  )
}
