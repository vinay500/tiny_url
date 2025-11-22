export interface Link {
  id: string;
  code: string;
  targetUrl: string;
  clicks: number;
  lastClicked: string | null;
  createdAt: string;
  expiresAt: string | null;
  
}

export interface CreateLinkRequest {
  targetUrl: string;
  customCode?: string;
  expiresAt?: string;
}

export interface LinkStats extends Link {
  isExpired?: boolean;
  clickHistory?: Array<{
    date: string;
    count: number;
  }>;
}

export interface CreateLinkResponse {
  link: Link;
  message: string;
}

export interface BackendLinkDTO {
  code: string;
  url: string;
  total_clicks: number;
  last_clicked: string | null;
  created_at: string;
  expiry_date?: string | null;
}
