import * as Lazy from "@/lazy";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import EditBid from "./pages/EditBid";
import MyBids from "./pages/MyBids";
import Chats from "./pages/Chats";
import Leaderboard from "./pages/Leaderboard";
import Balance from "./pages/Balance";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import PlaceBid from "./pages/PlaceBid";
import OrderView from "./pages/OrderView";
import NotFound from "./pages/NotFound";

import SubmitWork from "./pages/SubmitWork";
import WriterProfileCompletionLayout from "./pages/WriterProfileCompletionLayout";
import { RequireAuth } from '@/components/RequireAuth';
import { AuthProvider } from "@/contexts/AuthContext";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ChatProvider } from "@/contexts/ChatContext";
import { SupportChatProvider } from "@/contexts/SupportChatContext";

import { ProfileModalProvider } from "@/contexts/ProfileModalContext";

import ProfileCompletionGuard from "@/components/guards/ProfileCompletionGuard";
import SuspensionGuard from "@/components/guards/SuspensionGuard";
import RoleGuard from "@/components/guards/RoleGuard";


import { Suspense } from "react";
import PageLoader from "@/components/PageLoader";
import { ProfileCompletionProvider } from "@/contexts/ProfileCompletionContext";
import ProfileCompletionController from "@/components/profile/ProfileCompletionController";
import { HelmetProvider } from "react-helmet-async";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HelmetProvider>
        <BrowserRouter>
          <AuthProvider>
            <ProfileProvider>
            <NotificationProvider>
              <ChatProvider>
              <SupportChatProvider>
                <ProfileModalProvider>
                  <Suspense fallback={<PageLoader />}>
                  <Routes>

                    {/* ================= WRITER ROUTES ================= */}
                    <Route element={<RequireAuth requiredRole={["writer"]} />}>
                      <Route
                        path="/"
                        element={
                          <ProfileCompletionProvider>
                            <>
                              <Lazy.DashboardLayout />
                              <ProfileCompletionController />
                            </>
                          </ProfileCompletionProvider>
                        }
                      >
                        <Route element={<ProfileCompletionGuard />}>

                          {/* Default redirect */}
                          <Route
                            index
                            element={<Navigate to="available-orders/all" replace />}
                          />

                          {/* ================= Available Orders (SUSPENSION-LOCKED) ================= */}
                          <Route element={<SuspensionGuard allowNavigation={false} />}>
                            <Route
                              path="available-orders/:tab"
                              element={<Lazy.AvailableOrders />}
                            />
                            <Route
                              path="available-orders"
                              element={<Navigate to="available-orders/all" replace />}
                            />
                          </Route>

                          {/* ================= My Orders ================= */}
                          <Route
                            path="orders/:parentTab/*"
                            element={<Lazy.MyOrders />}
                          />

                          {/* ================= Order Details ================= */}
                          <Route
                            path="order-details/:orderId"
                            element={<Lazy.OrderDetails />}
                          />

                          {/* ================= My Bids ================= */}
                          <Route path="my-bids/edit/:bidId" element={<EditBid />} />
                          <Route path="my-bids/view/:bidId" element={<EditBid />} />
                          <Route path="my-bids/:tab" element={<MyBids />} />
                          <Route
                            path="my-bids"
                            element={<Navigate to="open" replace />}
                          />

                          {/* ================= Actions ================= */}
                          <Route path="place-bid/:orderId" element={<PlaceBid />} />
                          <Route path="order-view/:orderId" element={<OrderView />} />
                          <Route
                            path="submit-work/:orderId"
                            element={<Lazy.SubmitWork />}
                          />

                          {/* ================= Extras ================= */}
                          <Route path="chats" element={<Chats />} />
                          <Route path="leaderboard" element={<Leaderboard />} />
                          <Route path="balance/:tab" element={<Balance />} />
                          <Route path="notifications" element={<Notifications />} />

                          <Route path="*" element={<NotFound />} />

                        </Route>
                      </Route>
                    </Route>
                    {/* End WRITER */}

                  </Routes>
                </Suspense>
                </ProfileModalProvider>
              </SupportChatProvider>
              </ChatProvider>
            </NotificationProvider>
            </ProfileProvider>
          </AuthProvider>
        </BrowserRouter>
      </HelmetProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
