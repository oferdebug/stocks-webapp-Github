'use server';

import {auth} from "@/lib/better-auth/auth";
import {inngest} from "@/lib/inngest/client";

export const signUpWithEmail=async ({email, password, fullName, country, investmentGoals, riskTolerance, preferredIndustry}: SignUpFormData) => {
    try {
        const response=await auth.api.signUpEmail({body:{email,password,name:fullName}});

        if (response) {
            console.log('User created in Better Auth, sending Inngest event...');
            await inngest.send({
                name:'app/user.created',
                data:{email, name:fullName, country, investmentGoals, riskTolerance, preferredIndustry}
            })
            console.log('Inngest event sent successfully');
        }

         return {success:true,data:response};
    } catch (e) {
        console.log('SignUp Failed: ',e);
        return {success:false,error:'Sign Up Failed. Please Try Again.'};
    }
}