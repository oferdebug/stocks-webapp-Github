'use client';
import { SubmitHandler, useForm } from 'react-hook-form';
import {Button} from "@/components/ui/button";
import InputField from "@/components/forms/inputField";
import SelectField from "@/components/forms/SelectField";
import {INVESTMENT_GOALS, PREFERRED_INDUSTRIES, RISK_TOLERANCE_OPTIONS} from "@/lib/constants";
import CountrySelectField from "@/components/forms/countrySelectField";




function SignUp() {
const {
    register,
    handleSubmit,
    control,
    formState:{errors,isSubmitting},
}=useForm<SignUpFormData>({
        defaultValues:{
            email:'',
            fullName:'',
            password:'',
            country: 'US',
            investmentGoals:'Growth',
            riskTolerance:'Medium',
            preferredIndustry:'Technology'
        },

        mode:'onBlur'
    });


   const onSubmit=async (data:SignUpFormData)=>{

        try {
            console.log(data);
        } catch (e) {
            console.error(e);
        }
    }


    return (
        <div className={'relative overflow-hidden'}>
            <h1 className="form-title">SignUp & Personalize Your Experience</h1>

            <form onSubmit={handleSubmit(onSubmit)} className={'space-y-6'}>
                <InputField
                    name={'fullName'}
                    label={'Full Name'}
                    placeholder={'Sarah Mitchell'}
                    register={register}
                    error={errors.fullName}
                    validation={{required:'Full Name Is Required',minLength:2}}
                />
                <InputField
                    name={'email'}
                    label={'Email'}
                    placeholder={'contact@NextTrade.com'}
                    register={register}
                    error={errors.email}
                    validation={{required:'Full Email Is Required',minLength:2}}
                />
                <InputField
                    name={'Password'}
                    label={'Password'}
                    placeholder={'Enter Is A Strong Password'}
                    register={register}
                    type={'password'}
                    error={errors.fullName}
                    validation={{required:'Password Is Required',minLength:2}}
                />
                {/*<InputField*/}
                {/*    name={'fullName'}*/}
                {/*    label={'Full Name'}*/}
                {/*    placeholder={'Sarah Mitchell'}*/}
                {/*    register={register}*/}
                {/*    error={errors.fullName}*/}
                {/*    validation={{required:'Full Name Is Required',minLength:2}}*/}
                {/*/>*/}
                {/* County */}
                <CountrySelectField
                    name="country"
                    label="Country"
                    placeholder="Select your country"
                    control={control} // This passes the react-hook-form control to the component
                    error={errors.country}
                    validation={{ required: 'Country is required' }}
                />
                <SelectField
                name='invetmentGoals'
                label={'Investment Goals'}
                placeholder={'Select Your Investment Goals'}
                options={INVESTMENT_GOALS}
                control={control}
                error={errors.investmentGoals}
                required
                />
                <SelectField
                    name='preferredIndustry'
                    label={'Preferred Industry'}
                    placeholder={'Select Your Preferred Industry'}
                    options={PREFERRED_INDUSTRIES}
                    control={control}
                    error={errors.riskTolerance}
                    required
                />
                <SelectField
                    name='riskTolerance'
                    label={'Risk Tolerance'}
                    placeholder={'Select Your Risk Level'}
                    options={RISK_TOLERANCE_OPTIONS}
                    control={control}
                    error={errors.riskTolerance}
                    required
                />
                {/*<InputField*/}
                {/*    name={'fullName'}*/}
                {/*    label={'Full Name'}*/}
                {/*    placeholder={'Sarah Mitchell'}*/}
                {/*    register={register}*/}
                {/*    error={errors.fullName}*/}
                {/*    validation={{required:'Full Name Is Required',minLength:2}}*/}
                {/*/>*/}
                {/*<InputField*/}
                {/*    name={'fullName'}*/}
                {/*    label={'Full Name'}*/}
                {/*    placeholder={'Sarah Mitchell'}*/}
                {/*    register={register}*/}
                {/*    error={errors.fullName}*/}
                {/*    validation={{required:'Full Name Is Required',minLength:2}}*/}
                {/*/>*/}







                <Button type={'submit'} disabled={isSubmitting} className={'green-btn w-full mt-5'}>
                    {isSubmitting?'Creating Account':'Start Your Investing Journey Today'}
                </Button>
            </form>
        </div>
    );
}

export default SignUp;