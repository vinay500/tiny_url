import { Link } from "@/types/link";

export const mockLinks: Link[] = [
  {
    id: "1",
    code: "gh-repo",
    targetUrl: "https://github.com/username/awesome-project",
    clicks: 1247,
    lastClicked: "2025-01-15T14:32:00Z",
    createdAt: "2024-12-01T10:00:00Z",
    expiresAt: null,
  },
  {
    id: "2",
    code: "docs",
    targetUrl: "https://documentation-site.com/getting-started/installation-guide",
    clicks: 856,
    lastClicked: "2025-01-15T11:20:00Z",
    createdAt: "2024-12-05T15:30:00Z",
    expiresAt: "2025-12-31T23:59:59Z",
  },
  {
    id: "3",
    code: "demo",
    targetUrl: "https://example.com/product-demo",
    clicks: 423,
    lastClicked: "2025-01-14T09:15:00Z",
    createdAt: "2024-12-10T08:45:00Z",
    expiresAt: null,
  },
  {
    id: "4",
    code: "blog-post",
    targetUrl: "https://blog.example.com/2024/best-practices-web-development",
    clicks: 312,
    lastClicked: "2025-01-13T16:48:00Z",
    createdAt: "2024-12-15T12:00:00Z",
    expiresAt: "2025-01-10T00:00:00Z",
  },
  {
    id: "5",
    code: "promo",
    targetUrl: "https://store.example.com/sale/winter-2024",
    clicks: 2891,
    lastClicked: "2025-01-15T15:02:00Z",
    createdAt: "2024-11-20T09:00:00Z",
    expiresAt: "2025-02-28T23:59:59Z",
  },
  {
    id: "6",
    code: "event",
    targetUrl: "https://events.example.com/conference-2025",
    clicks: 0,
    lastClicked: null,
    createdAt: "2025-01-15T13:00:00Z",
    expiresAt: "2025-06-30T23:59:59Z",
  },
];

export const generateMockClickHistory = (clicks: number) => {
  const history = [];
  const days = 7;
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    history.push({
      date: date.toISOString().split('T')[0],
      count: Math.floor((clicks / days) * (0.5 + Math.random())),
    });
  }
  
  return history;
};
