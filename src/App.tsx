import { type ReactNode } from "react";
import { Route, Switch, useLocation, Router as WouterRouter } from "wouter";
import { ErrorBoundary } from "@/components/error-boundary";
import { Shell } from "@/components/Shell";
import RosterPage from "@/pages/Roster";
import CreatePage from "@/pages/Create";
import GuidePage from "@/pages/Guide";
import RehearsalPage from "@/pages/Rehearsal";
import NotFound from "@/pages/not-found";

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Shell>
        <RoutedErrorBoundary>
          <Switch>
            <Route path="/" component={RosterPage} />
            <Route path="/create" component={CreatePage} />
            <Route path="/guide" component={GuidePage} />
            <Route path="/rehearsal" component={RehearsalPage} />
            <Route component={NotFound} />
          </Switch>
        </RoutedErrorBoundary>
      </Shell>
    </WouterRouter>
  );
}

export default App;
