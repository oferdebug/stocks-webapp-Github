'use server';

import {auth} from "@/lib/better-auth/auth";
import {inngest} from "@/inngest/client";
import {headers} from "next/headers";

export const signUpWithEmail = async ({
                                          email,
                                          password,
                                          fullName,
                                          country,
                                          investmentGoals,
                                          riskTolerance,
                                          preferredIndustry
                                      }: SignUpFormData) => {


    // Keeping your logic structure
    try {
        const response = await auth.api.signUpEmail({
            body: {
                email,
                password,
                name: fullName
            }
        });

        // Fixed logic: Check if response exists (success) before sending event
        // Original code had (!response) which would prevent the event from firing on success
        if (response) {
            await inngest.send({
                name: 'app/user.created',
                data: {
                    email,
                    name: fullName,
                    country,
                    investmentGoals,
                    riskTolerance,
                    preferredIndustry
                }
            })
        }

        return {success: true, data: response};

    } catch (e: any) {
        console.log('SignUp Failed: ', e);
        const errorMsg = e?.body?.message || e?.message || 'Sign Up Failed. Please Try Again.';
        return {success: false, error: errorMsg};
    }
};

export const signInWithEmail = async ({email, password}: SignInFormData) => {
    try {
        const response = await auth.api.signInEmail({body: {email, password}});

        return {success: true, data: response};
    } catch (e: any) {
        console.log('SignIn Failed, please Try Again: ', e);
        const errorMsg = e?.body?.message || e?.message || 'Sign In Failed. Please Try Again.';
        return {success: false, error: errorMsg};
    }
};


export const signOutUser = async () => {
    try {
        await auth.api.signOut({headers: await headers()});
    } catch (e: any) {
        console.log('SignOut Failed: ', e);
        const errorMsg = e?.body?.message || e?.message || 'Sign Out Failed. Please Try Again.';
        return {success: false, error: errorMsg};
    }
};