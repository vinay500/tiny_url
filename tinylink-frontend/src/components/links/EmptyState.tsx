import { Link2 } from "lucide-react";

export const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
        <Link2 className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No links yet</h3>
      <p className="text-muted-foreground max-w-sm">
        Create your first short link to get started. It only takes a few seconds!
      </p>
    </div>
  );
};
