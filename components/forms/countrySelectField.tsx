'use client';

import React, {useMemo, useState} from 'react';
import {useFormContext, Controller, Control, FieldError} from "react-hook-form";
import countryList from 'react-select-country-list';
import {US, GB, CA, FR, DE, JP, CN, IT, ES, AU} from 'country-flag-icons/react/3x2';
import * as Flags from 'country-flag-icons/react/3x2';
import {Check, ChevronsUpDown} from "lucide-react";

import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {Label} from "@/components/ui/label";

interface CountrySelectFieldProps {
    name: string,
    label: string,
    placeholder: string,
    control: Control<any>,
    error?: FieldError,
    validation?: object,
    errors?: string,
    required?: boolean
}

const CountrySelectField = ({
                                name,
                                label,
                                placeholder,
                                control,
                                error,
                                validation,
                                errors,
                                required
                            }: CountrySelectFieldProps) => {
    const [open, setOpen] = useState(false);
    const options = useMemo(() => countryList().getData(), []);

    const getFlag = (countryCode: string) => {
        const Flag = (Flags as any)[countryCode];
        return Flag ? (
            <div className="w-5 h-5 rounded-full overflow-hidden border border-gray-700 flex-shrink-0">
                <Flag className="w-full h-full object-cover scale-150"/>
            </div>
        ) : null;
    };

    return (
        <div className="space-y-2">
            <Label htmlFor={name} className="form-label">{label}</Label>

            <Controller
                name={name}
                control={control}
                rules={validation}
                render={({field}) => (
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className={cn(
                                    "w-full h-12 justify-between bg-transparent border-input dark:bg-input/30 hover:bg-input/50 px-4 text-base",
                                    !field.value && "text-muted-foreground",
                                    error && "border-red-500"
                                )}
                            >
                                <div className="flex items-center overflow-hidden gap-3">
                                    {field.value && getFlag(field.value)}
                                    <span className="truncate">
                                        {field.value
                                            ? options.find((opt) => opt.value === field.value)?.label
                                            : placeholder}
                                    </span>
                                </div>
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-gray-900 border-gray-500">
                            <Command className="bg-transparent text-white">
                                <CommandInput placeholder="Search country..." className="h-9"/>
                                <CommandList>
                                    <CommandEmpty>No country found.</CommandEmpty>
                                    <CommandGroup>
                                        {options.map((option) => (
                                            <CommandItem
                                                key={option.value}
                                                value={option.label}
                                                onSelect={() => {
                                                    field.onChange(option.value);
                                                    setOpen(false);
                                                }}
                                                className="focus:bg-gray-600 focus:text-white flex items-center gap-2"
                                            >
                                                {getFlag(option.value)}
                                                <span>{option.label}</span>
                                                <Check
                                                    className={cn(
                                                        "ml-auto h-4 w-4",
                                                        field.value === option.value ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                )}
            />
            {error && (
                <p className="text-sm text-red-500 mt-1 font-medium">
                    {error.message}
                </p>
            )}
        </div>
    );
};

export default CountrySelectField;