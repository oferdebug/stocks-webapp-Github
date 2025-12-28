import {inngest} from "@/lib/inngest/client";
import {PERSONALIZED_WELCOME_EMAIL_PROMPT} from "@/lib/inngest/prompts";

export const sendSignUpEmail=inngest.createFunction(
    {id:'sign-up-email'},
    { event: 'app/user.created' }, async ({ event, step }) => {
        const userProfile = `- Country: ${event.data.country} - Investment Goals: ${event.data.investmentGoals} - Risk Tolerance: ${event.data.riskTolerance} - Preferred Industry: ${event.data.preferredIndustry}`;

        const prompt=PERSONALIZED_WELCOME_EMAIL_PROMPT.replace('{{userProfile}}', userProfile).replace('{{userName}}', event.data.name);

        const response = await step.ai.infer('generate-welcome-email', {

            model: step.ai.models.gemini('gemini-1.5-pro'),
            body: {
                contents: [
                    {
                        role: 'user',
                        parts: [
                            { text: prompt }
                        ]
                    }
                ]
            }
        });
    });