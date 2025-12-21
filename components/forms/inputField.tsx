'use client';
import {Input} from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {cn} from "@/lib/utils";

const InputField=({name,label,placeholder,type='text',register,error,validation,disabled,value}:FormInputProps)=>{
    return(
        <div className={'space-y-3'}>
            <Label htmlFor={name} className={'form-label'}>
                {label}
            </Label>
            <Input
                type={type}
                id={name}
                placeholder={placeholder}
                disabled={disabled}
                value={value}
                className={cn('form-input',{'opacity-50 cursor-not-allowed':disabled})}
                validation={{ required: "Full Name is Required" }}
                {...register(name,validation)}
                />
            {error&& <p className='text-sm text-red-500'>{error.message}</p>}
        </div>
    )
}

export default InputField;