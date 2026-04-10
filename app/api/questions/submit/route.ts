import { NextRequest, NextResponse } from 'next/server';
import { detectPersonas } from '@/lib/claude/persona-detector';
import { invokeClaudeWithPersonas } from '@/lib/claude/claude-client';
import { getDatabase } from '@/lib/database/init';

export async function POST(request: NextRequest) {
  try {
    // For MVP, we'll skip authentication check
    // In production, implement proper session validation with NextAuth v5

    // Parse request
    const { question, isVoiceInput } = await request.json();
    if (!question || question.trim().length === 0) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    // Auto-detect personas
    const domainsDetected = await detectPersonas(question);

    // Invoke Claude with automatic model selection
    const claudeResponse = await invokeClaudeWithPersonas(
      question,
      domainsDetected
    );

    // Log to database
    const db = getDatabase();
    const consultationId = `cons_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
      db.prepare(`
        INSERT INTO api_usage (id, consultation_id, model, tokens_input, tokens_output, cost, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        `usage_${Date.now()}`,
        consultationId,
        claudeResponse.model,
        claudeResponse.tokens_input,
        claudeResponse.tokens_output,
        claudeResponse.cost,
        new Date().toISOString()
      );
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Continue without db logging for now
    }

    return NextResponse.json({
      response: {
        content: claudeResponse.content,
        tokens_input: claudeResponse.tokens_input,
        tokens_output: claudeResponse.tokens_output,
        cost: claudeResponse.cost,
        model: claudeResponse.model,
        modelChoice: claudeResponse.modelChoice,
      },
      domainsDetected,
      consultationId,
    });
  } catch (error) {
    console.error('Error processing question:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to process question',
      },
      { status: 500 }
    );
  }
}
