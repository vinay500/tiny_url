import { Link, CreateLinkRequest, LinkStats, BackendLinkDTO, CreateLinkResponse } from "@/types/link";
import { USE_MOCK_API, API_BASE_URL } from "@/config/api";
import { mockLinks, generateMockClickHistory } from "./mockData";

// Simulated delay for mock API
const mockDelay = (ms: number = 500) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Mock API Implementation
const mockApi = {
  async getLinks(): Promise<Link[]> {
    await mockDelay();
    return [...mockLinks];
  },

  async getLinkByCode(code: string): Promise<LinkStats | null> {
    await mockDelay();
    const link = mockLinks.find(l => l.code === code);
    if (!link) return null;
    
    return {
      ...link,
      clickHistory: generateMockClickHistory(link.clicks),
    };
  },

  async createLink(data: CreateLinkRequest): Promise<CreateLinkResponse> {
    await mockDelay();
    
    const code = data.customCode || Math.random().toString(36).substring(2, 8);
    
    // Check if code already exists
    if (mockLinks.some(l => l.code === code)) {
      throw new Error("Short code already exists");
    }

    const newLink: Link = {
      id: Date.now().toString(),
      code,
      targetUrl: data.targetUrl,
      clicks: 0,
      lastClicked: null,
      createdAt: new Date().toISOString(),
      expiresAt: data.expiresAt || null,
    };

    mockLinks.push(newLink);
    return {
      link: newLink,
      message: "Short link created successfully.",
    };
  },

  async deleteLink(code: string): Promise<void> {
    await mockDelay();
    const index = mockLinks.findIndex(l => l.code === code);
    if (index === -1) {
      throw new Error("Link not found");
    }
    mockLinks.splice(index, 1);
  },
};

// Real API Implementation
const realApi = {
  // async getLinks(): Promise<Link[]> {
  //   const response = await fetch(`${API_BASE_URL}/api/links`);
  //   if (!response.ok) throw new Error("Failed to fetch links");
  //   const json = await response.json();
  //   return json.data;
  // },
  // async getLinks(): Promise<Link[]> {
  //   const response = await fetch(`${API_BASE_URL}/api/links`);
  //   if (!response.ok) throw new Error("Failed to fetch links");
  
  //   const json = await response.json();
  
  //   return json.data.map((item: any) => ({
  //     id: item.code,
  //     code: item.code,
  //     targetUrl: item.url,
  //     clicks: item.total_clicks,
  //     lastClicked: item.last_clicked,
  //     createdAt: item.created_at,
  //     expiresAt: item.expiry_date ?? null,
  //   }));
  // },


  async getLinks(): Promise<Link[]> {
    const response = await fetch(`${API_BASE_URL}/api/links`);
    if (!response.ok) throw new Error("Failed to fetch links");
  
    const json = await response.json();
  
    return json.data.map((item: any): Link => ({
      id: item.code,
      code: item.code,
      targetUrl: item.url,
      clicks: item.total_clicks,
      lastClicked: item.last_clicked,
      createdAt: item.created_at,
      expiresAt: item.expiry_date ?? null,
    }));
  },
  

  

  // async getLinkByCode(code: string): Promise<LinkStats | null> {
  //   const response = await fetch(`${API_BASE_URL}/api/links/${code}`);
  //   if (response.status === 404) return null;
  //   if (!response.ok) throw new Error("Failed to fetch link");
  //   const json = await response.json();
  //   return json.data;
  // },

  // async getLinkByCode(code: string): Promise<LinkStats | null> {
  //   const response = await fetch(`${API_BASE_URL}/api/links/${code}`);
  
  //   if (response.status === 404) return null;
  //   if (!response.ok) throw new Error("Failed to fetch link");
  
  //   const json = await response.json();
  //   const item = json.data;
  
  //   return {
  //     id: item.code,
  //     code: item.code,
  //     targetUrl: item.url,
  //     clicks: item.total_clicks,
  //     lastClicked: item.last_clicked,
  //     createdAt: item.created_at,
  //     expiresAt: item.expiry_date,
  //     // isExpired: item.isExpired ?? undefined, // <-- IMPORTANT
  //     isExpired: item.isExpired ?? false,
  //     clickHistory: [], // until implemented
  //   };
  // },


  async getLinkByCode(code: string): Promise<LinkStats | null> {
    const response = await fetch(`${API_BASE_URL}/api/links/${code}`);
    if (response.status === 404) return null;
  
    const json = await response.json();
    const item = json.data;
  
    return {
      id: item.code,
      code: item.code,
      targetUrl: item.url,
      clicks: item.total_clicks,
      lastClicked: item.last_clicked,
      createdAt: item.created_at,
      expiresAt: item.expiry_date ?? null,
      isExpired: item.isExpired ?? false,
    };
  },
  

  // async createLink(data: CreateLinkRequest): Promise<Link> {
  // async createLink(data: CreateLinkRequest): Promise<BackendLinkDTO> {

  //   const response = await fetch(`${API_BASE_URL}/api/links`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(data),
  //   });
  //   if (!response.ok) {
  //     const error = await response.json();
  //     throw new Error(error.message || "Failed to create link");
  //   }
  //   const json = await response.json();
  //   return json.data;
  // },

  

  async createLink(data: CreateLinkRequest): Promise<CreateLinkResponse> {
    const response = await fetch(`${API_BASE_URL}/api/links`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        targetUrl: data.targetUrl,
        customCode: data.customCode,
        expiresAt: data.expiresAt,
      }),
    });
  
    if (!response.ok) {
      const json = await response.json().catch(() => ({}));
      throw new Error(json.message || "Failed to create link");
    }
  
    const json = await response.json();
    const item = json.data;
  
    // Normalize backend → frontend
    const mapped: Link = {
      id: item.code,
      code: item.code,
      targetUrl: item.url,
      clicks: item.total_clicks,
      lastClicked: item.last_clicked,
      createdAt: item.created_at,
      expiresAt: item.expiry_date ?? null,
    };
  
    return {
      link: mapped,
      message: json.message || "Short link created successfully.",
    };
  },



  async deleteLink(code: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/links/${code}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const json = await response.json();
      throw new Error(json.message || "Failed to delete link");
    }
  },
};

// Export the appropriate API based on configuration
export const api = USE_MOCK_API ? mockApi : realApi;
