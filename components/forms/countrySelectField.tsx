'use client';
import React from 'react'
import {Label} from "@/components/ui/label";
import useCountryList from 'react-select-country-list';
import {Control,FieldError} from "react-hook-form";



type CountryFieldProps = {
    name:string;
    label:string;
    placeholder?: string;
    control:Control<Record<string, unknown>>;
    error?: FieldError;
    validation? :object;
    disabled?:boolean;
}



const CountrySelectField = ({ name, label, placeholder, control, error, validation, disabled }: CountryFieldProps) => {
    const countries = useCountryList().getData();

    return (
        <div className='space-y-3'>
            <Label htmlFor={name} className='form-label'>
                {label}
            </Label>
        </div>
    )
}

export default CountrySelectField
