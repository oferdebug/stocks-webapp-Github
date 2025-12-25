'use client';
import { useForm } from 'react-hook-form';
import {Button} from "@/components/ui/button";
import InputField from "@/components/forms/inputField";
import FooterLink from "@/components/forms/FooterLink";



function SignIn() {
    {/* Initialize form state with validation rules and default values */}
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm<SignInFormData>({
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onBlur'
    });


    {/* Process form submission with error handling */}
    const onSubmit = async (data: SignInFormData) => {
        try {
            console.log(data);
        } catch (e) {
            console.error(e);
        }
    }


    return (
        <div className="relative overflow-hidden">
            <h1 className="form-title">Sign In & Start Enjoying Your Experience!</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* User credentials input section */}
                <InputField
                    name="email"
                    label="Email"
                    placeholder="contact@NextTrade.com"
                    register={register}
                    error={errors.email}
                    validation={{ required: 'Full Email Is Required', minLength: 2 }}
                />

                <InputField
                    name="password"
                    label="Password"
                    placeholder="Enter A Strong Password"
                    register={register}
                    type="password"
                    error={errors.password}
                    validation={{ required: 'Password Is Required', minLength: 8 }}
                />

                {/* Form submission with async state management */}
                <Button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="green-btn w-full mt-5"
                >
                    {isSubmitting ? 'Signing In...' : 'Sign In Now'}
                </Button>

                <FooterLink 
                    text="Don't Have An Account?" 
                    linkText="SignUp" 
                    href="/sign-up" 
                />
            </form>
        </div>
    );
}

export default SignIn;