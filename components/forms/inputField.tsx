'use client';

import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * Reusable InputField Component
 * Acts as a single atomic unit. It does NOT contain multiple inputs.
 */
const InputField = ({
                        name,
                        label,
                        placeholder,
                        type = "text",
                        register,
                        error,
                        validation,
                        disabled
                    }: FormInputProps) => {
    return (
        <div className="space-y-2">
            <Label htmlFor={name} className="form-label">{label}</Label>
            <Input
                type={type}
                id={name}
                placeholder={placeholder}
                disabled={disabled}
                className={cn('form-input',
                    { 'opacity-50 cursor-not-allowed': disabled },
                    { 'border-red-500 focus-visible:ring-red-500': error }
                )}
                {...register(name, validation)}
                suppressHydrationWarning={true}
            />
            {error && <p className="text-sm text-red-500 mt-1 font-medium">{error.message}</p>}
        </div>
    );
};

export default InputField;