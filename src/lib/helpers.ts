export function JsonResponse(message: string, success: boolean, status: number = 200): Response {
    return Response.json({ success, message }, { status });
} 