import {NextResponse} from "next/server";
import {inngest} from "@/lib/inngest/client";

export async function POST() {
    await inngest.send({
        name: "app/user.created",
        data: {
            email: "[email protected]",
            country: "Israel",
            investmentGoals: "Growth",
            riskTolerance: "Medium",
            preferredIndustry: "Tech",
        },
    });

    return NextResponse.json({ok: true});
}
