export function successResponse(data: any, message = 'Success') {
  return { success: true, message, data };
}

export function errorResponse(message: string, code?: string) {
  return { success: false, message, code };
}

export function paginatedResponse(data: any[], total: number, page: number, limit: number) {
  return {
    success: true,
    data,
    meta: { total, page, limit, pages: Math.ceil(total / limit) },
  };
}
