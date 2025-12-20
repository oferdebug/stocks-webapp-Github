'use client';
import { SubmitHandler, useForm } from 'react-hook-form';
import {Button} from "@/components/ui/button";




function SignUp() {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors,isSubmitting },
    } = useForm<SignUpFormData>({
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

    const onSubmit = async (data:SignUpFormData) => {
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
            {/*  Inputs  */}
                <Button type={'submit'} disabled={isSubmitting} className={'green-btn w-full mt-5'}>
                    {isSubmitting?'Creating Account':'Start Your Investing Journey Today'}
                </Button>
            </form>
        </div>
    );
}

export default SignUp;
