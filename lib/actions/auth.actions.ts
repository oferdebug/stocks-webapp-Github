'use server';

import {auth} from "@/lib/better-auth/auth";
import {inngest} from "@/lib/inngest/client";
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


    console.log('----------------------------------------------------');
    console.log('DEBUG: Attempting to register email:', email);
    // Be careful not to expose the password in logs, just the connection string
    console.log('DEBUG: Active Database URL:', process.env.DATABASE_URL);
    console.log('----------------------------------------------------');

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

    } catch (e) {
        console.log('SignUp Failed: ', e);
        return {success: false, error: 'Sign Up Failed. Please Try Again.'};
    }
};

export const signInWithEmail = async ({email, password}: SignInFormData) => {
    try {
        const response = await auth.api.signInEmail({body: {email, password}});

        return {success: true, data: response};
    } catch (e) {
        console.log('SignIn Failed, please Try Again: ', e);
        return {success: false, error: 'Sign In Failed. Please Try Again.'};
    }
};


export const signOutUser = async () => {
    try {
        await auth.api.signOut({headers: await headers()});
    } catch (e) {
        console.log('SignOut Failed: ', e);
        return {success: false, error: 'Sign Out Failed. Please Try Again.'};
    }
};