import React from "react";
import { Users, AlertTriangle, Bike, Gauge, CheckCircle, Package } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { LiveMap } from "@/components/LiveMap";
import { PanicButton } from "@/components/PanicButton";
import { activities, stats, incidents } from "@/lib/mock-data";
import { useRoadBasedSimulation } from "@/hooks/useRoadBasedSimulation";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const liveDrivers = useRoadBasedSimulation(1500);

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-[1400px]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-[28px] font-normal text-foreground mb-1">Operations Dashboard</h1>
          <p className="text-xs sm:text-sm font-light text-muted-foreground">Real-time monitoring & incident overview</p>
        </div>
        <PanicButton compact location="Control Centre Dashboard" />
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-3"
      >
        <StatCard title="Active" value={stats.activeDrivers} icon={Users} variant="primary" trend={`of ${stats.totalDrivers} drivers`} />
        <StatCard title="Open Incidents" value={stats.openIncidents} icon={AlertTriangle} variant="destructive" />
        <StatCard title="Resolved Today" value={stats.resolvedToday} icon={CheckCircle} variant="primary" />
        <StatCard title="Avg Speed" value={`${stats.avgSpeed} km/h`} icon={Gauge} variant="accent" />
        <StatCard title="Deliveries" value={stats.totalDeliveries} icon={Package} variant="default" />
        <StatCard title="Fleet Online" value={`${Math.round((stats.activeDrivers / stats.totalDrivers) * 100)}%`} icon={Bike} variant="warning" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Map */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 rounded-2xl border bg-card overflow-hidden azure-shadow"
        >
          <div className="p-3 sm:p-4 border-b border-border flex items-center justify-between bg-card">
            <h2 className="text-[10px] sm:text-xs font-normal tracking-wider uppercase text-muted-foreground">Live Tracking</h2>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-primary animate-azure-pulse" />
              <span className="text-[10px] sm:text-xs font-normal text-primary uppercase">LIVE</span>
            </div>
          </div>
          <LiveMap height="240px" drivers={liveDrivers} />
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border bg-card azure-shadow"
        >
          <div className="p-3 sm:p-4 border-b border-border bg-card">
            <h2 className="text-[10px] sm:text-xs font-normal tracking-wider uppercase text-muted-foreground">Activity Feed</h2>
          </div>
          <div className="divide-y divide-border max-h-[280px] sm:max-h-[340px] overflow-y-auto">
            {activities.map((a) => (
              <div key={a.id} className="p-3 sm:p-4 flex items-start gap-2 sm:gap-3 hover:bg-secondary/50 transition-colors">
                <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${a.type === "alert" ? "bg-destructive" : a.type === "warning" ? "bg-[hsl(var(--warning))]" : "bg-accent"}`} />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-normal text-foreground truncate">{a.action}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">{a.driverName} · {a.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Incidents */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border bg-card azure-shadow"
      >
        <div className="p-3 sm:p-4 border-b border-border bg-card">
          <h2 className="text-[10px] sm:text-xs font-normal tracking-wider uppercase text-muted-foreground">Recent Incidents</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-border text-left bg-secondary/30">
                <th className="p-2 sm:p-3 text-[10px] sm:text-xs font-normal tracking-wider uppercase text-muted-foreground">ID</th>
                <th className="p-2 sm:p-3 text-[10px] sm:text-xs font-normal tracking-wider uppercase text-muted-foreground">Type</th>
                <th className="p-2 sm:p-3 text-[10px] sm:text-xs font-normal tracking-wider uppercase text-muted-foreground hidden sm:table-cell">Location</th>
                <th className="p-2 sm:p-3 text-[10px] sm:text-xs font-normal tracking-wider uppercase text-muted-foreground">Faces</th>
                <th className="p-2 sm:p-3 text-[10px] sm:text-xs font-normal tracking-wider uppercase text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {incidents.slice(0, 4).map((inc) => (
                <tr key={inc.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                  <td className="p-2 sm:p-3 text-[10px] sm:text-xs text-muted-foreground font-light font-mono">{inc.id}</td>
                  <td className="p-2 sm:p-3">
                    <Badge variant={inc.type === "collision" || inc.type === "assault" ? "destructive" : "warning"}>
                      {inc.type}
                    </Badge>
                  </td>
                  <td className="p-2 sm:p-3 text-xs sm:text-sm font-light text-foreground hidden sm:table-cell">{inc.location}</td>
                  <td className="p-2 sm:p-3 text-xs sm:text-sm font-normal text-accent font-mono">{inc.facesDetected}</td>
                  <td className="p-2 sm:p-3">
                    <Badge variant={inc.status === "open" ? "destructive" : inc.status === "investigating" ? "warning" : "default"} className="text-[10px] sm:text-xs">
                      {inc.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
