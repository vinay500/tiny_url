import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { createLink } from "@/store/slices/linksSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Link2, Sparkles, CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export const CreateLinkForm = () => {
  const dispatch = useAppDispatch();
  const [url, setUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [expiresAt, setExpiresAt] = useState<Date | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [urlError, setUrlError] = useState("");

  const validateUrl = (value: string): boolean => {
    if (!value.trim()) {
      setUrlError("URL is required");
      return false;
    }
    try {
      new URL(value);
      setUrlError("");
      return true;
    } catch {
      setUrlError("Please enter a valid URL");
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateUrl(url)) return;

    setLoading(true);
    try {
      console.log("in handle submit of create link")
      const result = await dispatch(
        createLink({
          targetUrl: url,
          customCode: customCode || undefined,
          expiresAt: expiresAt ? expiresAt.toISOString() : undefined,
        })
      ).unwrap();

      toast.success(result.message, {
        description: `Short code: ${result.link.code}`,
      });

      setUrl("");
      setCustomCode("");
      setExpiresAt(undefined);
      setUrlError("");
    } catch (error: any) {
      console.log("create link error: ",error)
      console.log("create link error message: ",error.message)
      toast.error("Failed to create link", {
        description: error.message ? error.message : "Please try again",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Link2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>Create New Link</CardTitle>
            <CardDescription>
              Shorten your URL and track its performance
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">Target URL *</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com/your-long-url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (urlError) validateUrl(e.target.value);
              }}
              onBlur={() => url && validateUrl(url)}
              className={urlError ? "border-destructive" : ""}
            />
            {urlError && (
              <p className="text-sm text-destructive">{urlError}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="customCode">
              Custom Short Code <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="customCode"
              type="text"
              placeholder="my-custom-code"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              maxLength={20}
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to generate a random code
            </p>
          </div>

          {/* <div className="space-y-2">
            <Label>
              Expiration Date <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !expiresAt && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {expiresAt ? format(expiresAt, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={expiresAt}
                  onSelect={setExpiresAt}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <p className="text-xs text-muted-foreground">
              Link will stop working after this date
            </p>
          </div> */}

          <Button
            type="submit"
            disabled={loading}
            className="w-full shadow-primary"
          >
            {loading ? (
              <>Creating...</>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Create Short Link
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
