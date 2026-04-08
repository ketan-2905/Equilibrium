import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const client = new OpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { message, currentGraph, isAgentMode } = await req.json();

        // Static Mapping: Add All 15 Stocks
        const isAddAllStocks = message.toLowerCase().includes('all 15') ||
            message.toLowerCase().includes('all fifteen') ||
            message.toLowerCase().includes('all institutions') ||
            message.toLowerCase().includes('add all stocks');

        if (isAddAllStocks) {
            // Neural network style layout - organic positioning around center
            const centerX = 400;
            const centerY = 300;

            const response = {
                type: 'add_nodes',
                nodes: [
                    // Inner layer (closer to center) - High credibility banks
                    { label: 'HDFC Bank', position: { x: centerX - 180, y: centerY - 80 }, data: { label: 'HDFC Bank', type: 'Bank', details: 'NSE - HDFCBANK', ticker: 'HDFCBANK.NS', credibility: 92 } },
                    { label: 'ICICI Bank', position: { x: centerX + 160, y: centerY - 100 }, data: { label: 'ICICI Bank', type: 'Bank', details: 'NSE - ICICIBANK', ticker: 'ICICIBANK.NS', credibility: 90 } },
                    { label: 'SBI', position: { x: centerX - 90, y: centerY + 120 }, data: { label: 'State Bank of India', type: 'Bank', details: 'NSE - SBIN', ticker: 'SBIN.NS', credibility: 95 } },
                    { label: 'Axis Bank', position: { x: centerX + 130, y: centerY + 90 }, data: { label: 'Axis Bank', type: 'Bank', details: 'NSE - AXISBANK', ticker: 'AXISBANK.NS', credibility: 88 } },

                    // Mid layer (medium distance) - Diverse sectors
                    { label: 'Kotak Bank', position: { x: centerX - 250, y: centerY - 150 }, data: { label: 'Kotak Mahindra Bank', type: 'Bank', details: 'NSE - KOTAKBANK', ticker: 'KOTAKBANK.NS', credibility: 91 } },
                    { label: 'Bajaj Finance', position: { x: centerX + 240, y: centerY - 180 }, data: { label: 'Bajaj Finance', type: 'FinTech', details: 'NSE - BAJFINANCE', ticker: 'BAJFINANCE.NS', credibility: 86 } },
                    { label: 'TCS', position: { x: centerX - 280, y: centerY + 30 }, data: { label: 'TCS', type: 'IT', details: 'NSE - TCS', ticker: 'TCS.NS', credibility: 94 } },
                    { label: 'Reliance', position: { x: centerX + 270, y: centerY + 40 }, data: { label: 'Reliance Industries', type: 'Conglomerate', details: 'NSE - RELIANCE', ticker: 'RELIANCE.NS', credibility: 89 } },
                    { label: 'BSE', position: { x: centerX - 200, y: centerY + 170 }, data: { label: 'BSE', type: 'Exchange', details: 'NSE - BSE', ticker: 'BSE.NS', credibility: 93 } },
                    { label: 'Tata Steel', position: { x: centerX + 220, y: centerY + 180 }, data: { label: 'Tata Steel', type: 'Industrial', details: 'NSE - TATASTEEL', ticker: 'TATASTEEL.NS', credibility: 87 } },

                    // Outer layer (furthest from center)
                    { label: 'Infosys', position: { x: centerX, y: centerY - 220 }, data: { label: 'Infosys', type: 'IT', details: 'NSE - INFY', ticker: 'INFY.NS', credibility: 93 } },
                    { label: 'Adani', position: { x: centerX - 320, y: centerY - 60 }, data: { label: 'Adani Enterprises', type: 'Conglomerate', details: 'NSE - ADANIENT', ticker: 'ADANIENT.NS', credibility: 72 } },
                    { label: 'HUL', position: { x: centerX + 310, y: centerY - 50 }, data: { label: 'Hindustan Unilever', type: 'Consumer', details: 'NSE - HINDUNILVR', ticker: 'HINDUNILVR.NS', credibility: 91 } },
                    { label: 'MRF', position: { x: centerX - 300, y: centerY + 140 }, data: { label: 'MRF', type: 'Consumer', details: 'NSE - MRF', ticker: 'MRF.NS', credibility: 85 } },
                    { label: 'Airtel', position: { x: centerX + 290, y: centerY + 160 }, data: { label: 'Bharti Airtel', type: 'Telecom', details: 'NSE - BHARTIARTL', ticker: 'BHARTIARTL.NS', credibility: 88 } }
                ],
                message: '✅ Added all 15 institutions in a neural network layout around the center. They will auto-connect to CCP forming an organic network structure!'
            };
            return NextResponse.json(response);
        }

        // Agent Mode Auto-Simulation Detection
        const isAutoSimPrompt = message.toLowerCase().includes('hdfcbank') &&
            message.toLowerCase().includes('icicibank') &&
            message.toLowerCase().includes('kotakbank') &&
            message.toLowerCase().includes('sbin');

        if (isAgentMode && isAutoSimPrompt) {
            // Auto-generate structured response for the simulation
            const response = {
                type: 'add_nodes',
                nodes: [
                    {
                        label: 'HDFC Bank',
                        data: {
                            label: 'HDFC Bank',
                            type: 'Bank',
                            details: 'NSE - HDFCBANK',
                            ticker: 'HDFCBANK.NS'
                        }
                    },
                    {
                        label: 'ICICI Bank',
                        data: {
                            label: 'ICICI Bank',
                            type: 'Bank',
                            details: 'NSE - ICICIBANK',
                            ticker: 'ICICIBANK.NS'
                        }
                    },
                    {
                        label: 'Kotak Bank',
                        data: {
                            label: 'Kotak Mahindra Bank',
                            type: 'Bank',
                            details: 'NSE - KOTAKBANK',
                            ticker: 'KOTAKBANK.NS'
                        }
                    },
                    {
                        label: 'SBI',
                        data: {
                            label: 'State Bank of India',
                            type: 'Bank',
                            details: 'NSE - SBIN',
                            ticker: 'SBIN.NS'
                        }
                    }
                ],
                message: '✅ Agent Mode: Added HDFC Bank, ICICI Bank, Kotak Mahindra Bank, and State Bank of India to the canvas. Connect them to the CCP node and click \"Run Analysis\" to start the simulation.'
            };
            return NextResponse.json(response);
        }

        const systemPrompt = `
You are a specialized Financial Network Architect AI. 
You control a React Flow graph visualization of a financial system.

Current Graph State:
- Node Count: ${currentGraph.nodes.length}
- Edge Count: ${currentGraph.edges.length}
- Existing Node IDs: ${currentGraph.nodes.map((n: any) => n.id).join(', ')}
${isAgentMode ? '\n**AGENT MODE ACTIVE**: You have enhanced capabilities to automatically execute multi-step workflows.' : ''}

Your Task:
Interpret the user's natural language request to MODIFY the graph.
You can ADD nodes (Banks), ADD edges (Connections), REMOVE items, or clear the graph.

CRITICAL RULES:
1. **JSON ONLY**: You must return ONLY a raw JSON object. Do not wrap it in markdown code blocks.
2. **Structure**: 
   {
     "action": "update" | "clear",
     "nodesToAdd": [ { "id": "bank-X", "type": "custom", "position": { "x": 0, "y": 0 }, "data": { "label": "Bank X", "type": "Bank", "details": "..." } } ],
     "edgesToAdd": [ { "id": "e-X-Y", "source": "X", "target": "Y", "animated": true, "style": { "stroke": "#..." } } ],
     "nodesToRemove": [ "id1" ],
     "edgesToRemove": [ "id1" ],
     "message": "Start with a short confirmation."
   }
3. **Connectivity**: 
   - Unless specified otherwise, connect ALL new banks to the Central Counterparty (id: 'ccp-1').
   - If 'ccp-1' does not exist, you should probably create it first if the user asks for a fresh start.
4. **Positioning**:
   - You MUST generate 'x' and 'y' coordinates for new nodes. 
   - Try to arrange them in a circle around the center (400, 300) or in a grid if many.
   - Do not place them all at (0,0).
${isAgentMode ? `
5. **AGENT MODE SPECIAL INSTRUCTIONS**:
   - When user mentions specific tickers (e.g., HDFCBANK.NS, ICICIBANK.NS), create nodes with proper ticker data
   - Include ticker field in node data: { "ticker": "SYMBOL.NS" }
   - Format details as: "NSE - SYMBOL"
   - Be proactive and execute complete workflows automatically
` : ''}

User Request: "${message}"
`;

        const completion = await client.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message }
            ],
            temperature: 0.2, // Low temperature for consistent JSON
            max_tokens: 1000,
        });

        let aiContent = completion.choices[0].message.content || "{}";

        // Clean up potential markdown formatting
        aiContent = aiContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');

        // Validate JSON parsing
        try {
            JSON.parse(aiContent);
        } catch (e) {
            console.error("AI JSON Parse Error:", aiContent);
            // Fallback or error handling
            return NextResponse.json({
                message: "I configured the network, but there was a data formatting error. Please try again.",
                raw: aiContent
            }, { status: 422 });
        }

        return new NextResponse(aiContent, {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('AI Route Error:', error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
