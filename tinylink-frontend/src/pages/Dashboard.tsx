import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchLinks, setSearchQuery } from "@/store/slices/linksSlice";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CreateLinkForm } from "@/components/links/CreateLinkForm";
import { LinksTable } from "@/components/links/LinksTable";
import { SearchBar } from "@/components/links/SearchBar";
import { EmptyState } from "@/components/links/EmptyState";
import { LoadingSkeleton } from "@/components/links/LoadingSkeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Link2, MousePointerClick } from "lucide-react";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { links, loading, error, searchQuery } = useAppSelector((state) => state.links);

  useEffect(() => {
    dispatch(fetchLinks());
  }, [dispatch]);

  const filteredLinks = useMemo(() => {
    if (!searchQuery.trim()) return links;
    
    const query = searchQuery.toLowerCase();
    return links.filter(
      (link) =>
        link.code.toLowerCase().includes(query) ||
        link.targetUrl.toLowerCase().includes(query)
    );
  }, [links, searchQuery]);

  const totalClicks = useMemo(
    () => links.reduce((sum, link) => sum + link.clicks, 0),
    [links]
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container space-y-8">
          {/* Hero Section */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground text-lg">
              Manage and track all your shortened links
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Links</CardTitle>
                <Link2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{links.length}</div>
                <p className="text-xs text-muted-foreground">
                  Active short links
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                <MousePointerClick className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Across all links
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Clicks</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {links.length > 0 ? Math.round(totalClicks / links.length) : 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Per link
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Create Link Form */}
          <CreateLinkForm />

          {/* Links Table Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Your Links</h2>
                <p className="text-sm text-muted-foreground">
                  {filteredLinks.length} {filteredLinks.length === 1 ? 'link' : 'links'}
                  {searchQuery && ` matching "${searchQuery}"`}
                </p>
              </div>
              <div className="w-full max-w-sm">
                <SearchBar
                  value={searchQuery}
                  onChange={(value) => dispatch(setSearchQuery(value))}
                />
              </div>
            </div>

            {error && (
              <Card className="border-destructive bg-destructive/5">
                <CardContent className="pt-6">
                  <p className="text-sm text-destructive">{error}</p>
                </CardContent>
              </Card>
            )}

            {loading ? (
              <LoadingSkeleton />
            ) : filteredLinks.length === 0 ? (
              searchQuery ? (
                <Card>
                  <CardContent className="pt-6">
                    <EmptyState />
                    <p className="text-center text-muted-foreground mt-2">
                      No links found matching "{searchQuery}"
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <EmptyState />
                  </CardContent>
                </Card>
              )
            ) : (
              <LinksTable links={filteredLinks} />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
