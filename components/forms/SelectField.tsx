'use client';

import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Controller, Control, FieldValues, Path, FieldError } from "react-hook-form";

interface Option {
    value: string;
    label: string;
}

interface SelectFieldProps<TFieldValues extends FieldValues> {
    name: Path<TFieldValues>;
    label: string;
    placeholder: string;
    options: Option[];
    control: Control<TFieldValues>;
    error?: FieldError;
    required?: boolean;
}

const SelectField = <TFieldValues extends FieldValues,>({
                                                            name,
                                                            label,
                                                            placeholder,
                                                            options,
                                                            control,
                                                            error,
                                                            required = false
                                                        }: SelectFieldProps<TFieldValues>) => {

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        {/* eslint-disable-next-line react-hooks/set-state-in-effect */}
        setIsMounted(true);
    }, []);

    {/* Return skeleton during SSR to ensure hydration match */}
    if (!isMounted) {
        return (
            <div className="space-y-2">
                <Label className="form-label">{label}</Label>
                <div className="h-10 w-full border border-gray-500 bg-gray-900 rounded-md opacity-50" />
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <Label htmlFor={name} className="form-label">{label}</Label>

            <Controller
                name={name}
                control={control}
                rules={required ? { required: `${label} is required` } : {}}
                render={({ field }) => (
                    <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                    >
                        <SelectTrigger id={name} className="select-trigger">
                            <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-500 text-white">
                            {options.map((option) => (
                                <SelectItem
                                    value={option.value}
                                    key={option.value}
                                    className="focus:bg-gray-600 focus:text-white"
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            />
            {error && <p className="text-red-500 text-sm font-medium">{error.message}</p>}
        </div>
    );
};

export default SelectField;