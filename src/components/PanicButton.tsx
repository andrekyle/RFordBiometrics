import { useState } from "react";
import { AlertTriangle, Phone, Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface PanicButtonProps {
  driverId?: string;
  driverName?: string;
  location?: string;
  compact?: boolean;
}

export function PanicButton({ driverId, driverName, location, compact = false }: PanicButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const { toast } = useToast();

  const handlePanicActivation = () => {
    setIsActivated(true);
    
    // Countdown before emergency alert
    let count = 3;
    const countdownInterval = setInterval(() => {
      count -= 1;
      setCountdown(count);
      
      if (count === 0) {
        clearInterval(countdownInterval);
        triggerEmergencyAlert();
      }
    }, 1000);
  };

  const handleCancel = () => {
    setIsActivated(false);
    setCountdown(3);
    setIsDialogOpen(false);
    
    toast({
      title: "Panic Alert Cancelled",
      description: "Emergency alert has been cancelled.",
    });
  };

  const triggerEmergencyAlert = () => {
    // Simulate emergency alert to police and control centre
    const emergencyData = {
      driverId: driverId || "UNKNOWN",
      driverName: driverName || "Unknown Driver",
      location: location || "Location unavailable",
      timestamp: new Date().toISOString(),
      type: "PANIC_BUTTON",
    };

    console.log("🚨 EMERGENCY ALERT TRIGGERED:", emergencyData);

    // Show success notification
    toast({
      title: "🚨 Emergency Alert Sent!",
      description: "Police and Control Centre have been notified. Help is on the way.",
      variant: "destructive",
    });

    // Close dialog after alert is sent
    setTimeout(() => {
      setIsActivated(false);
      setCountdown(3);
      setIsDialogOpen(false);
    }, 2000);
  };

  if (compact) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-destructive hover:text-destructive"
          onClick={() => setIsDialogOpen(true)}
        >
          <AlertTriangle className="h-5 w-5" />
        </Button>

        <EmergencyDialog
          isOpen={isDialogOpen}
          isActivated={isActivated}
          countdown={countdown}
          onActivate={handlePanicActivation}
          onCancel={handleCancel}
          driverName={driverName}
          location={location}
        />
      </>
    );
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsDialogOpen(true)}
        className="relative w-full sm:w-auto"
      >
        <div className="rounded-2xl bg-gradient-to-br from-red-600 to-red-700 p-6 shadow-lg hover:shadow-xl transition-all border-2 border-red-500/50 hover:border-red-400">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
              <AlertTriangle className="h-7 w-7 text-white" strokeWidth={2} />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-white">PANIC BUTTON</h3>
              <p className="text-sm text-white/90">Emergency Alert</p>
            </div>
          </div>
        </div>
      </motion.button>

      <EmergencyDialog
        isOpen={isDialogOpen}
        isActivated={isActivated}
        countdown={countdown}
        onActivate={handlePanicActivation}
        onCancel={handleCancel}
        driverName={driverName}
        location={location}
      />
    </>
  );
}

interface EmergencyDialogProps {
  isOpen: boolean;
  isActivated: boolean;
  countdown: number;
  onActivate: () => void;
  onCancel: () => void;
  driverName?: string;
  location?: string;
}

function EmergencyDialog({
  isOpen,
  isActivated,
  countdown,
  onActivate,
  onCancel,
  driverName,
  location,
}: EmergencyDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[500px] border-red-500/50">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-red-600 flex items-center justify-center animate-pulse">
              <AlertTriangle className="h-6 w-6 text-white" strokeWidth={2} />
            </div>
            <div>
              <DialogTitle className="text-2xl">Emergency Alert</DialogTitle>
              <DialogDescription>
                {isActivated ? "Sending emergency alert..." : "Activate panic button to alert authorities"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {isActivated ? (
            <motion.div
              key="countdown"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="py-8 flex flex-col items-center gap-4"
            >
              <div className="text-8xl font-bold text-red-600 animate-pulse">
                {countdown}
              </div>
              <p className="text-sm text-muted-foreground">
                Alerting authorities in {countdown} second{countdown !== 1 ? "s" : ""}...
              </p>
              <Button
                variant="outline"
                size="lg"
                onClick={onCancel}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Cancel Alert
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="confirm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Emergency Info */}
              <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
                <h4 className="text-sm font-medium">Emergency Details</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  {driverName && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Driver:</span>
                      <span>{driverName}</span>
                    </div>
                  )}
                  {location && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Location:</span>
                      <span>{location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Time:</span>
                    <span>{new Date().toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Emergency Contacts */}
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <h4 className="text-sm font-medium mb-3">Will Alert:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-2 rounded bg-background">
                    <Phone className="h-4 w-4 text-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">SAPS Emergency</p>
                      <p className="text-xs text-muted-foreground">10111</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded bg-background">
                    <Shield className="h-4 w-4 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">BioSentinel Control Centre</p>
                      <p className="text-xs text-muted-foreground">+27 11 XXX XXXX</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning Message */}
              <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-3">
                <p className="text-xs text-amber-700 dark:text-amber-500">
                  <strong>Warning:</strong> Only use this button in genuine emergencies. 
                  False alarms may result in delays to real emergency responses.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1 bg-red-600 hover:bg-red-700 gap-2"
                  onClick={onActivate}
                >
                  <AlertTriangle className="h-4 w-4" />
                  Activate Emergency Alert
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
