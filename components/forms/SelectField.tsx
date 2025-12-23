'use client';
import React, {useCallback} from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Controller, Control, FieldError } from "react-hook-form";

interface Option {
    value: string;
    label: string;
}

interface SelectFieldProps {
    name: string;
    label: string;
    placeholder: string;
    options: Option[];
    control: Control<any>;
    error?: FieldError;
    required?: boolean;
}

const SelectField = ({ name, label, placeholder, options, control, error, required = false }: SelectFieldProps) => {

    const controllerRender = useCallback(({field}) => (
        <Select
            value={field.value || ""}
            onValueChange={field.onChange}
        >
            <SelectTrigger id={name} className={"select-trigger"}>
                <SelectValue placeholder={placeholder}/>
            </SelectTrigger>
            <SelectContent className={"bg-gray-900 border-gray-500 text-white"}>
                {options.map((option) => (
                    <SelectItem
                        value={option.value}
                        key={option.value}
                        className={"focus:bg-gray-600 focus:text-white"}
                    >
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    ), [name, placeholder, options]);
    return (
        <div className={'space-y-2'}>
            <Label htmlFor={name} className={'form-label'}>{label}</Label>

            <Controller
                name={name}
                control={control}
                rules={{
                    required: required ? `Please select ${label.toLowerCase()}` : false
                }}
                render={controllerRender}
            />
            {error && <p className="text-red-500 text-sm">{error.message}</p>}
        </div>
    )
}

export default SelectField;