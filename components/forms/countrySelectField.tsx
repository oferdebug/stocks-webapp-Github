'use client';
import {Label} from "@/components/ui/label";
import {Controller} from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const SelectField=({name,label,placeholder,options,control,error,required=false}:SelectFieldProps)=> {
    <div className={'space-y-3'}>
        <Label htmlFor={name} className={'form-label'}>{label}</Label>

        <Controller
            name={name}
            control={control}
            rules={{
                required? `Please select ${label.toLowerCase()}`:false,
            }}
            render={({field})=>(
                <Select >
                    <SelectTrigger className="w-[180px] ">
                        <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                </Select>
            )}
    </div>
};


deafult export CountrySelectField;