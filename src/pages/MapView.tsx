import React from "react";
import { LiveMap } from "@/components/LiveMap";
import { PanicButton } from "@/components/PanicButton";
import { useRoadBasedSimulation } from "@/hooks/useRoadBasedSimulation";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Navigation, Gauge, MapPin, Clock } from "lucide-react";

const MapView = () => {
  const drivers = useRoadBasedSimulation(1500);
  const activeDrivers = drivers.filter(d => d.status === "active");
  const avgSpeed = Math.round(activeDrivers.reduce((sum, d) => sum + d.speed, 0) / activeDrivers.length) || 0;

  return (
    <div className="p-3 sm:p-6 space-y-3 sm:space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-[28px] font-normal text-foreground mb-1">Live Tracking</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Real-time motorbike positions across Johannesburg</p>
        </div>
        <PanicButton compact location="Live Tracking Map" />
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border bg-card p-3 sm:p-4"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
              <Navigation className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-normal text-foreground">{activeDrivers.length}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Active Drivers</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border bg-card p-3 sm:p-4"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
              <Gauge className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-normal text-foreground">{avgSpeed}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Avg Speed km/h</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border bg-card p-3 sm:p-4"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-normal text-foreground">{drivers.length}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Total Fleet</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border bg-card p-3 sm:p-4"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-normal text-foreground">Live</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Real-time Updates</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="lg:col-span-3 rounded-2xl border bg-card overflow-hidden order-2 lg:order-1"
        >
          <div className="p-3 sm:p-4 border-b border-border flex items-center justify-between bg-card/50 backdrop-blur">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50" />
              <span className="text-xs sm:text-sm font-medium text-foreground">LIVE MAP</span>
            </div>
            <span className="text-[10px] sm:text-xs text-muted-foreground font-light">
              Tracking {activeDrivers.length} active motorbike{activeDrivers.length !== 1 ? 's' : ''}
            </span>
          </div>
          <LiveMap height="min(calc(100vh - 380px), 500px)" drivers={drivers} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-2 sm:space-y-3 order-1 lg:order-2"
        >
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs sm:text-sm font-medium text-foreground">Driver Status</h3>
            <span className="text-[10px] sm:text-xs text-muted-foreground">{drivers.length} total</span>
          </div>
          
          <div className="space-y-2 max-h-[200px] lg:max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
            {drivers.map((d) => (
              <div 
                key={d.id} 
                className="rounded-2xl border bg-card p-3 sm:p-4 hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">{d.name}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground font-mono">{d.id}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <Badge 
                    variant={d.status === "active" ? "default" : d.status === "idle" ? "warning" : "secondary"}
                    className="text-[10px] sm:text-xs"
                  >
                    {d.status}
                  </Badge>
                  
                  {d.status === "active" && (
                    <div className="flex items-center gap-1 sm:gap-1.5 text-foreground">
                      <Gauge className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={1.5} />
                      <span className="text-xs sm:text-sm font-medium">{d.speed}</span>
                      <span className="text-[10px] sm:text-xs text-muted-foreground">km/h</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-2 pt-2 border-t border-border space-y-1">
                  <div className="flex items-center gap-1 sm:gap-1.5 text-muted-foreground">
                    <MapPin className="h-3 w-3 shrink-0" strokeWidth={1.5} />
                    <span className="text-[10px] sm:text-xs truncate">{d.zone}</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-1.5 text-muted-foreground">
                    <Clock className="h-3 w-3 shrink-0" strokeWidth={1.5} />
                    <span className="text-[10px] sm:text-xs truncate">{d.lastSeen}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MapView;
