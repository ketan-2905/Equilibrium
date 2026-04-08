import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const client = new OpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { simulationResults } = await req.json();

        if (!simulationResults) {
            return NextResponse.json({
                analysis: "No simulation data provided."
            }, { status: 400 });
        }

        const systemPrompt = `You are a financial risk analysis system producing clean, technical output.

CRITICAL OUTPUT RULES:
- Use plain text only, NO markdown formatting
- NO asterisks, stars, or special characters for emphasis
- NO em dashes or decorative symbols
- Use simple hyphens (-) for lists
- Write in direct, declarative sentences
- Output format should resemble statistical analysis tools like SHAP
- Keep it professional and technical
- Maximum 150 words

Provide analysis in this exact structure:

RISK ASSESSMENT:
[1-2 sentences on overall risk level]

KEY FINDINGS:
- [Finding 1]
- [Finding 2]
- [Finding 3]

VULNERABILITIES:
- [Vulnerability 1]
- [Vulnerability 2]

RECOMMENDATIONS:
- [Recommendation 1]
- [Recommendation 2]`;

        // Safely extract values with fallbacks
        const systemicRisk = simulationResults.systemic_risk || simulationResults.latest_payoff_S || 0;
        const cascadeStatus = simulationResults.cascade?.status || 'stable';
        const failedNodes = simulationResults.cascade?.failed_nodes?.length || 0;
        const totalNodes = simulationResults.used_tickers?.length || 0;
        const failureRatio = simulationResults.cascade?.failure_ratio || 0;
        const congestionLevel = simulationResults.congestion?.level || 'low';

        const userPrompt = `Analyze this financial network simulation:

Systemic Risk: ${(systemicRisk * 100).toFixed(1)}%
Cascade Status: ${cascadeStatus}
Failed Nodes: ${failedNodes} out of ${totalNodes}
Failure Ratio: ${(failureRatio * 100).toFixed(1)}%
Congestion Level: ${congestionLevel}

Network Metrics:
- Lambda Max: ${simulationResults.features?.lambda_max?.toFixed(3) || 'N/A'}
- Mean Risk: ${simulationResults.features?.mean_risk?.toFixed(3) || 'N/A'}
- Max Risk: ${simulationResults.features?.max_risk?.toFixed(3) || 'N/A'}

CCP Funds:
- Initial Margin: ${simulationResults.ccp_funds?.initial_margin?.toFixed(2) || 'N/A'}
- Default Fund: ${simulationResults.ccp_funds?.default_fund?.toFixed(2) || 'N/A'}

Provide your expert analysis:`;

        const completion = await client.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            temperature: 0.3,
            max_tokens: 400,
        });

        const analysis = completion.choices[0].message.content || "Analysis unavailable";

        return NextResponse.json({ analysis });

    } catch (error: any) {
        console.error('Analysis Error:', error);
        console.error('Error details:', error.response?.data || error.message);
        return NextResponse.json({
            error: error.message || "Analysis generation failed",
            analysis: "Unable to generate analysis at this time. The expert analysis system is temporarily unavailable."
        }, { status: 500 });
    }
}
