import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldAlert, Lock, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Outlet } from "react-router-dom";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SuspensionGuardProps {
  children: ReactNode;
  allowNavigation?: boolean;
}

const SuspensionGuard = ({ children, allowNavigation = true }: SuspensionGuardProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return null;

  const isSuspended = user.account_state?.is_suspended;
  const suspension = user.account_state?.suspension;

  console.log(user);

  if (!isSuspended) return <Outlet />;

  const isPermanent = suspension?.type === "permanent";

  if (allowNavigation) {
    return (
      <div className="flex flex-col h-full">
        <Alert className={`m-3 ${isPermanent ? "border-destructive/50 bg-destructive/10" : "border-warning/50 bg-warning/10"}`}>
          <ShieldAlert className={isPermanent ? "text-destructive" : "text-warning"} />
          <AlertDescription className="flex justify-between gap-2">
            <span>
              Your account has been {isPermanent ? "permanently" : "temporarily"} suspended.
              {suspension?.reasons?.length > 0 && (
                <> Reasons: {suspension.reasons.join(", ")}.</>
              )}
              {suspension?.notes && <> Notes: {suspension.notes}</>}
            </span>
            <Button variant="outline" size="sm" asChild>
              <a href="mailto:support@academichub.com">Contact Support</a>
            </Button>
          </AlertDescription>
        </Alert>
        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card
        className={cn(
          "max-w-xl w-full"
        )}
      >
        <CardHeader className="text-center space-y-3">
          <ShieldAlert
            className={cn(
              "mx-auto h-12 w-12",
              isPermanent ? "text-destructive" : "text-yellow-500"
            )}
          />
          <CardTitle className="text-xl">
            Account {isPermanent ? "Permanently" : "Temporarily"} Suspended
          </CardTitle>
          <CardDescription>
            Your writer account is currently restricted due to a policy review.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 text-sm">
          {/* Duration */}
          <div className="rounded-lg bg-muted p-4">
            <p className="font-medium">Suspension period</p>
            <p className="text-muted-foreground">
              {isPermanent
                ? "This suspension is indefinite."
                : suspension?.suspended_until
                ? `Until ${new Date(
                    suspension.suspended_until
                  ).toLocaleDateString()}`
                : "Temporarily suspended"}
            </p>
          </div>

          {/* Reasons */}
          {suspension?.reasons?.length > 0 && (
            <div>
              <p className="font-medium mb-2">Reason(s)</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {suspension.reasons.map((reason, index) => (
                  <li key={index}>{reason}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Notes */}
          {suspension?.notes && (
            <div className="rounded-lg border bg-background p-4">
              <p className="font-medium mb-1">Additional notes</p>
              <p className="text-muted-foreground whitespace-pre-line">
                {suspension.notes}
              </p>
            </div>
          )}

          {/* Footer guidance */}
          <div className="rounded-lg bg-muted p-4 text-xs text-muted-foreground text-center">
            If you believe this action was taken in error, you may contact Academic
            Hub support for clarification. Please note that repeated violations
            may result in permanent suspension.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuspensionGuard;
