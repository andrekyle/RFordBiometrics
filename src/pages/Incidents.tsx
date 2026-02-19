import { incidents, drivers } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Camera, UserSearch, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const typeIcons: Record<string, typeof AlertTriangle> = {
  collision: AlertTriangle,
  theft: AlertTriangle,
  suspicious: UserSearch,
  assault: AlertTriangle,
};

const Incidents = () => {
  const navigate = useNavigate();

  return (
    <div className="p-3 sm:p-6 space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
        <div>
          <h1 className="text-xl sm:text-[28px] font-normal text-foreground mb-1">Incident Center</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Facial recognition &amp; incident management</p>
        </div>
        <Badge variant="destructive" className="text-[10px] sm:text-xs w-fit">
          {incidents.filter(i => i.status !== "resolved").length} ACTIVE
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {incidents.map((inc, i) => {
          const Icon = typeIcons[inc.type] || AlertTriangle;
          const driver = drivers.find(d => d.id === inc.driverId);
          return (
            <motion.div
              key={inc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border bg-card p-3 sm:p-5 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-destructive" strokeWidth={1} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs text-muted-foreground font-mono">{inc.id}</p>
                    <p className="text-xs sm:text-sm font-medium text-foreground capitalize">{inc.type}</p>
                  </div>
                </div>
                <Badge variant={inc.status === "open" ? "destructive" : inc.status === "investigating" ? "warning" : "default"} className="text-[10px] sm:text-xs shrink-0">
                  {inc.status}
                </Badge>
              </div>

              <p className="text-xs sm:text-sm text-foreground mb-2 sm:mb-3">{inc.description}</p>

              <div className="space-y-1 sm:space-y-1.5 text-[10px] sm:text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" strokeWidth={1} />
                  <span className="truncate">{inc.location}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" strokeWidth={1} />
                  <span>{new Date(inc.timestamp).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Camera className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" strokeWidth={1} />
                  <span className="text-accent">{inc.facesDetected} face(s) detected — linked to Home Affairs / SAPS</span>
                </div>
                {driver && (
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <UserSearch className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" strokeWidth={1} />
                    <span>Driver: {driver.name}</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="rounded-2xl border bg-card p-3 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2 sm:gap-0">
          <div className="flex items-center gap-2">
            <Camera className="h-4 w-4 sm:h-5 sm:w-5 text-accent shrink-0" strokeWidth={1} />
            <h3 className="text-[10px] sm:text-xs font-normal tracking-wider uppercase text-muted-foreground">Facial Recognition Status</h3>
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => navigate("/face-recognition")}
            className="text-[10px] sm:text-xs w-fit"
          >
            OPEN LIVE CAMERA
          </Button>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Camera feeds are processed in real-time. Identified faces are cross-referenced with
          <span className="text-accent"> SA Home Affairs</span> and
          <span className="text-accent"> SAPS</span> databases.
          Integration requires authorized API access and is currently in <span className="text-warning">demo mode</span>.
        </p>
      </div>
    </div>
  );
};

export default Incidents;
