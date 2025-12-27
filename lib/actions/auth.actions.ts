'use server';


import {auth} from "@/lib/better-auth/auth";
import {inngest} from "@/lib/inngest/client";

export const signUpWithEmail=async ({email,password,fullName,country,investmentGoals,riskTolerance,preferredIndustry}:SignUpFormData)=>{
    // Implement sign-up logic here
    try {
        const response = await auth.api.signUpEmail({
            body:{email,password,name:fullName}
        })

        if (response) {
            await inngest.send({
                name:'app/user.created',
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
            
            return { success: true };
        } catch (e: any) {
            console.log('SignUp Failed:', e);
            
            // Handle the "User already exists" case specifically
            if (e?.status === 'UNPROCESSABLE_ENTITY' || e?.message?.includes('already exists')) {
                return { success: false, message: 'User already exists. Use another email.' };
            }
            
            return { success: false, message: 'SignUp Failed, Please Try Again' };
        }
    }

export default signUpWithEmail;