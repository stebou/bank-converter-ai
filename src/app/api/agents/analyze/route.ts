import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { bankingOrchestrator } from '@/lib/agents/banking';

export async function POST(req: NextRequest) {
  try {
    console.log('[AGENT_ANALYSIS_API] Starting agent-based analysis request');
    
    const { userId } = await auth();
    
    if (!userId) {
      console.log('[AGENT_ANALYSIS_API] Unauthorized request');
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    console.log('[AGENT_ANALYSIS_API] Authorized user:', userId);

    // Lancer le workflow d'analyse bancaire
    console.log('[AGENT_ANALYSIS_API] Starting banking AI agent workflow...');
    const workflow = await bankingOrchestrator.executeWorkflow(userId);
    
    console.log('[AGENT_ANALYSIS_API] Workflow completed:', {
      id: workflow.id,
      status: workflow.status,
      tasksCompleted: workflow.tasks.filter(t => t.status === 'completed').length,
      totalTasks: workflow.tasks.length
    });

    // Retourner le résultat complet du workflow
    return NextResponse.json({
      success: true,
      workflow: {
        id: workflow.id,
        status: workflow.status,
        createdAt: workflow.createdAt,
        completedAt: workflow.completedAt,
        tasks: workflow.tasks.map(task => ({
          id: task.id,
          type: task.type,
          status: task.status,
          startedAt: task.startedAt,
          completedAt: task.completedAt,
          error: task.error
        }))
      },
      report: workflow.finalReport,
      message: 'Analyse agentique terminée avec succès'
    }, { status: 200 });

  } catch (error) {
    console.error('[AGENT_ANALYSIS_API] Error during agent analysis:', error);
    
    return NextResponse.json({ 
      success: false,
      error: 'Erreur lors de l\'analyse agentique',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// Endpoint pour récupérer le statut d'un workflow en cours
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const url = new URL(req.url);
    const workflowId = url.searchParams.get('workflowId');

    if (!workflowId) {
      return NextResponse.json({ error: 'ID de workflow requis' }, { status: 400 });
    }

    // Récupérer le statut du workflow
    const workflow = await bankingOrchestrator.getWorkflowStatus(workflowId);
    
    if (!workflow) {
      return NextResponse.json({ error: 'Workflow non trouvé' }, { status: 404 });
    }

    return NextResponse.json({
      workflow: {
        id: workflow.id,
        status: workflow.status,
        tasks: workflow.tasks.map(task => ({
          id: task.id,
          type: task.type,
          status: task.status,
          startedAt: task.startedAt,
          completedAt: task.completedAt
        }))
      }
    });

  } catch (error) {
    console.error('[AGENT_ANALYSIS_API] Error getting workflow status:', error);
    
    return NextResponse.json({ 
      error: 'Erreur lors de la récupération du statut'
    }, { status: 500 });
  }
}