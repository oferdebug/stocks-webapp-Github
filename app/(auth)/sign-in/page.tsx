'use client';

import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import InputField from "@/components/forms/inputField";
import FooterLink from "@/components/forms/FooterLink";
import { authClient } from "@/lib/better-auth/client";
import { useState } from "react";

function SignIn() {
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInFormData>({
        defaultValues: { email: '', password: '' },
        mode: 'onBlur'
    });

    const onSubmit = async (data: SignInFormData) => {
        setErrorMsg(null);
        try {
            // Authenticating via better-auth with MongoDB adapter
            const { error } = await authClient.signIn.email({
                email: data.email,
                password: data.password,
                callbackURL: "/",
            });

            if (error) {
                // Setting error message from server response
                setErrorMsg(error.message || "Invalid email or password");
            } else {
                // Hard refresh to sync session with Server Components
                window.location.href = "/";
            }
        } catch (e) {
            // Catching unexpected auth service errors
            console.error("Auth Error:", e);
            setErrorMsg("An unexpected error occurred.");
        }
    };

    return (
        <div className="relative overflow-hidden">
            <h1 className="form-title">Sign In & Start Enjoying Your Experience!</h1>

            {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-md mb-4 text-sm text-center">
                    {errorMsg}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <InputField
                    name="email"
                    label="Email"
                    placeholder="contact@NextTrade.com"
                    register={register}
                    error={errors.email}
                    validation={{ required: 'Full Email Is Required' }}
                />

                <InputField
                    name="password"
                    label="Password"
                    placeholder="Enter Your Password"
                    register={register}
                    type="password"
                    error={errors.password}
                    validation={{ required: 'Password Is Required' }}
                />

                <Button type="submit" disabled={isSubmitting} className="green-btn w-full mt-5">
                    {isSubmitting ? 'Signing In...' : 'Sign In Now'}
                </Button>

                <FooterLink text="Don't Have An Account?" linkText="SignUp" href="/sign-up" />
            </form>
        </div>
    );
}

export default SignIn;