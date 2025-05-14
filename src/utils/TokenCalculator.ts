import { encode } from 'gpt-tokenizer';

interface TokenUsageResult {
    userTokens: number;
    aiTokens: number;
    totalTokens: number;
}

/**
 * Calculates token usage for both user request and AI response using proper GPT tokenization.
 * @param userReq - The user's request message
 * @param aiRes - The AI's response message
 * @returns TokenUsageResult object containing token counts
 */

export const calculateTokenUsage = (userReq: string, aiRes: string): TokenUsageResult => {
    // Calculate tokens for user request
    const userTokens = encode(userReq).length;

    // Calculate tokens for AI response
    const aiTokens = encode(aiRes).length;

    // Calculate total tokens used
    const totalTokens = userTokens + aiTokens;

    return {
        userTokens,
        aiTokens,
        totalTokens
    };
};