/**
 * API client for OmniRoute AI backend
 */

import { RouteComplaintResponse, ErrorResponse } from './types';

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';

export async function routeComplaint(
  complaint: string
): Promise<RouteComplaintResponse | ErrorResponse> {
  try {
    const response = await fetch(`${API_URL}/api/route-complaint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ complaint }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}

export async function healthCheck(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
}
