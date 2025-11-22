import { useState } from "react";
import { Link } from "@/types/link";
import { useAppDispatch } from "@/store/hooks";
import { deleteLink } from "@/store/slices/linksSlice";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Copy, Trash2, BarChart3, ExternalLink, Clock } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow, isAfter } from "date-fns";
import { API_BASE_URL } from "@/config/api";

interface LinksTableProps {
  links: Link[];
}

export const LinksTable = ({ links }: LinksTableProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null);

  const copyToClipboard = (code: string) => {
    const shortUrl = `${window.location.origin}/${code}`;
    navigator.clipboard.writeText(shortUrl);
    toast.success("Link copied to clipboard!", {
      description: shortUrl,
    });
  };

  // const copyToClipboard = (code: string) => {
  //   if (!code) return;
  
  //   // Build short URL using backend base URL
  //   const shortUrl = `${API_BASE_URL}/${code}`;
  
  //   navigator.clipboard.writeText(shortUrl);
  
  //   toast.success("Link copied to clipboard!", {
  //     description: shortUrl,
  //   });
  // };

  const handleDelete = async () => {
    if (!linkToDelete) return;

    try {
      await dispatch(deleteLink(linkToDelete)).unwrap();
      toast.success("Link deleted successfully");
      setDeleteDialogOpen(false);
      setLinkToDelete(null);
    } catch (error) {
      toast.error("Failed to delete link", {
        description: error instanceof Error ? error.message : "Please try again",
      });
    }
  };

  const confirmDelete = (code: string) => {
    setLinkToDelete(code);
    setDeleteDialogOpen(true);
  };

  const truncateUrl = (url: string, maxLength: number = 50) => {
    return url.length > maxLength ? `${url.substring(0, maxLength)}...` : url;
  };

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return isAfter(new Date(), new Date(expiresAt));
  };

  return (
    <>
      <div className="rounded-lg border border-border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Short Code</TableHead>
              <TableHead className="font-semibold">Target URL</TableHead>
              <TableHead className="font-semibold text-center">Clicks</TableHead>
              <TableHead className="font-semibold">Last Clicked</TableHead>
              {/* <TableHead className="font-semibold">Status</TableHead> */}
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links.map((link) => (
              <TableRow key={link.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-mono font-medium text-primary">
                  {link.code}
                </TableCell>
                <TableCell>
                  <a
                    href={link.targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
                    title={link.targetUrl}
                  >
                    {truncateUrl(link.targetUrl)}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </TableCell>
                <TableCell className="text-center">
                  <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                    {link.clicks.toLocaleString()}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {link.lastClicked
                    ? formatDistanceToNow(new Date(link.lastClicked), { addSuffix: true })
                    : "Never"}
                </TableCell>
                {/* <TableCell>
                  {link.expiresAt ? (
                    isExpired(link.expiresAt) ? (
                      <Badge variant="destructive" className="gap-1">
                        <Clock className="h-3 w-3" />
                        Expired
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1 bg-warning/10 text-warning border-warning/20">
                        <Clock className="h-3 w-3" />
                        Expires Soon
                      </Badge>
                    )
                  ) : (
                    <Badge variant="secondary" className="gap-1">Active</Badge>
                  )}
                </TableCell> */}
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/stats/${link.code}`)}
                      title="View Stats"
                    >
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(link.code)}
                      title="Copy Link"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => confirmDelete(link.code)}
                      title="Delete Link"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the short link <span className="font-mono font-semibold text-foreground">{linkToDelete}</span>.
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
    </>
  );
};
