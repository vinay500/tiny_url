import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchLinkByCode, deleteLink } from "@/store/slices/linksSlice";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Copy, ExternalLink, Trash2, Calendar, MousePointerClick, Link2, TrendingUp, Clock } from "lucide-react";
import { toast } from "sonner";
import { format, isAfter } from "date-fns";
import { ClickHistoryChart } from "@/components/stats/ClickHistoryChart";
import { API_BASE_URL } from "@/config/api";

const Stats = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentLink, loading, error } = useAppSelector((state) => state.links);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (code) {
      dispatch(fetchLinkByCode(code));
    }
  }, [code, dispatch]);

  const copyToClipboard = () => {
    if (!code) return;
    const shortUrl = `${window.location.origin}/${code}`;
    navigator.clipboard.writeText(shortUrl);
    toast.success("Link copied to clipboard!", {
      description: shortUrl,
    });
  };

  // const copyToClipboard = () => {
  //   if (!code) return;
  
  //   // Build short URL using backend base URL
  //   const shortUrl = `${API_BASE_URL}/${code}`;
  //   console.log("shortUrl: ",shortUrl)
  //   navigator.clipboard.writeText(shortUrl);
  
  //   toast.success("Link copied to clipboard!", {
  //     description: shortUrl,
  //   });
  // };

  const handleDelete = async () => {
    if (!code) return;

    try {
      await dispatch(deleteLink(code)).unwrap();
      toast.success("Link deleted successfully");
      navigate("/");
    } catch (error) {
      toast.error("Failed to delete link", {
        description: error instanceof Error ? error.message : "Please try again",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 py-8">
          <div className="container space-y-8">
            <Skeleton className="h-10 w-64" />
            <div className="grid gap-4 md:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-4 w-20" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-24" />
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !currentLink) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 py-8">
          <div className="container">
            <Card className="border-destructive bg-destructive/5">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 mb-4">
                    <Link2 className="h-10 w-10 text-destructive" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Link Not Found</h3>
                  <p className="text-muted-foreground max-w-sm mb-6">
                    {error || "The link you're looking for doesn't exist or has been deleted."}
                  </p>
                  <Button onClick={() => navigate("/")}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/")}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              </div>
              <h1 className="text-4xl font-bold tracking-tight">Link Statistics</h1>
              <p className="text-muted-foreground text-lg font-mono">{code}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={copyToClipboard}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Link
              </Button>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(true)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>

          {/* Target URL Card */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5 text-primary" />
                Target URL
              </CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href={currentLink.targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-light break-all transition-colors inline-flex items-center gap-2"
              >
                {currentLink.targetUrl}
                <ExternalLink className="h-4 w-4 flex-shrink-0" />
              </a>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                <MousePointerClick className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {currentLink.clicks.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Created</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold">
                  {format(new Date(currentLink.createdAt), "MMM d, yyyy")}
                </div>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(currentLink.createdAt), "h:mm a")}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Last Clicked</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {currentLink.lastClicked ? (
                  <>
                    <div className="text-lg font-semibold">
                      {format(new Date(currentLink.lastClicked), "MMM d, yyyy")}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(currentLink.lastClicked), "h:mm a")}
                    </p>
                  </>
                ) : (
                  <div className="text-lg font-semibold text-muted-foreground">
                    Never
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Short Code</CardTitle>
                <Link2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-mono font-semibold text-primary">
                  {currentLink.code}
                </div>
                <p className="text-xs text-muted-foreground">
                  Unique identifier
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Expiration Notice */}
          {currentLink.expiresAt && (
            <Card className={isAfter(new Date(), new Date(currentLink.expiresAt)) ? "border-destructive bg-destructive/5" : "border-warning bg-warning/5"}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${isAfter(new Date(), new Date(currentLink.expiresAt)) ? "bg-destructive/10" : "bg-warning/10"}`}>
                    <Clock className={`h-5 w-5 ${isAfter(new Date(), new Date(currentLink.expiresAt)) ? "text-destructive" : "text-warning"}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {isAfter(new Date(), new Date(currentLink.expiresAt)) ? "Link Expired" : "Link Expires Soon"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {isAfter(new Date(), new Date(currentLink.expiresAt)) 
                        ? `Expired on ${format(new Date(currentLink.expiresAt), "MMM d, yyyy 'at' h:mm a")}`
                        : `Expires on ${format(new Date(currentLink.expiresAt), "MMM d, yyyy 'at' h:mm a")}`
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Click History Chart
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Click History (Last 7 Days)</CardTitle>
              <CardDescription>
                Daily click statistics for this link
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClickHistoryChart clickHistory={currentLink.clickHistory} />
            </CardContent>
          </Card> */}
        </div>
      </main>

      <Footer />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the short link <span className="font-mono font-semibold text-foreground">{code}</span> and all its statistics.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Stats;
