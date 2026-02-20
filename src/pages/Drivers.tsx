import { useState } from "react";
import { drivers as initialDrivers } from "@/lib/mock-data";
import type { Driver } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PanicButton } from "@/components/PanicButton";
import { MapPin, Gauge, Clock, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Zone coordinates mapping
const ZONE_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "Sandton CBD": { lat: -26.107407, lng: 28.056229 },
  "Rosebank": { lat: -26.147886, lng: 28.042421 },
  "Midrand": { lat: -25.989460, lng: 28.125280 },
  "Randburg": { lat: -26.094444, lng: 27.981389 },
  "Braamfontein": { lat: -26.195246, lng: 28.034088 },
  "Melville": { lat: -26.184167, lng: 28.011667 },
  "Parktown": { lat: -26.121667, lng: 28.013889 },
  "Bedfordview": { lat: -26.133056, lng: 28.088333 },
  "Cyrildene": { lat: -26.172222, lng: 28.078333 },
  "Hyde Park": { lat: -26.068889, lng: 28.026667 },
  "Alexandra": { lat: -26.087778, lng: 28.097222 },
  "Germiston": { lat: -26.153333, lng: 28.120556 },
  "Fourways": { lat: -26.012222, lng: 28.010556 },
  "Rivonia": { lat: -26.053611, lng: 28.058889 },
};

const Drivers = () => {
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddDriver = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    
    const selectedZone = formData.get('zone') as string;
    const coordinates = ZONE_COORDINATES[selectedZone] || ZONE_COORDINATES["Sandton CBD"];
    
    const newDriver: Driver = {
      id: `D${String(drivers.length + 1).padStart(3, '0')}`,
      name: formData.get('name') as string,
      status: formData.get('status') as "active" | "idle" | "offline",
      lat: coordinates.lat,
      lng: coordinates.lng,
      speed: 0, // Always start at 0
      zone: selectedZone,
      lastSeen: "Just now",
      avatar: "/avatars/sample-avatar.png",
    };

    setDrivers([...drivers, newDriver]);
    setIsDialogOpen(false);
    
    toast({
      title: "Driver added successfully",
      description: `${newDriver.name} has been added to the fleet.`,
    });
    
    // Reset form
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="p-3 sm:p-6 space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-[28px] font-normal text-foreground mb-1">Driver Management</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Fleet overview and individual driver monitoring</p>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <PanicButton compact location="Driver Management" />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="icon" className="shrink-0 h-9 w-9">
                <Plus className="h-5 w-5" />
              </Button>
            </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Driver</DialogTitle>
              <DialogDescription>
                Enter the driver's information to add them to the fleet.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddDriver} className="space-y-4 mt-4">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground border-b pb-2">Personal Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" name="name" placeholder="e.g., Thabo Molefe" required />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" name="phone" type="tel" placeholder="+27 XX XXX XXXX" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" name="email" type="email" placeholder="driver@example.com" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="idNumber">ID Number *</Label>
                  <Input id="idNumber" name="idNumber" placeholder="YYMMDDXXXXXXX" required />
                </div>
              </div>
              
              {/* Vehicle Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground border-b pb-2">Vehicle Information</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicleMake">Motorcycle Make *</Label>
                    <Input id="vehicleMake" name="vehicleMake" placeholder="e.g., Honda" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicleModel">Model *</Label>
                    <Input id="vehicleModel" name="vehicleModel" placeholder="e.g., CBR 150" required />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="registrationNumber">Registration Number *</Label>
                    <Input id="registrationNumber" name="registrationNumber" placeholder="CA XXX-XXX GP" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicleColor">Color</Label>
                    <Input id="vehicleColor" name="vehicleColor" placeholder="e.g., Black" />
                  </div>
                </div>
              </div>
              
              {/* License Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground border-b pb-2">License Information</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">License Number *</Label>
                    <Input id="licenseNumber" name="licenseNumber" placeholder="XXXXXXXX" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licenseExpiry">License Expiry</Label>
                    <Input id="licenseExpiry" name="licenseExpiry" type="date" />
                  </div>
                </div>
              </div>
              
              {/* Assignment Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground border-b pb-2">Assignment</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zone">Assigned Zone *</Label>
                    <Select name="zone" defaultValue="Sandton CBD" required>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sandton CBD">Sandton CBD</SelectItem>
                        <SelectItem value="Rosebank">Rosebank</SelectItem>
                        <SelectItem value="Midrand">Midrand</SelectItem>
                        <SelectItem value="Randburg">Randburg</SelectItem>
                        <SelectItem value="Braamfontein">Braamfontein</SelectItem>
                        <SelectItem value="Melville">Melville</SelectItem>
                        <SelectItem value="Parktown">Parktown</SelectItem>
                        <SelectItem value="Bedfordview">Bedfordview</SelectItem>
                        <SelectItem value="Cyrildene">Cyrildene</SelectItem>
                        <SelectItem value="Hyde Park">Hyde Park</SelectItem>
                        <SelectItem value="Alexandra">Alexandra</SelectItem>
                        <SelectItem value="Germiston">Germiston</SelectItem>
                        <SelectItem value="Fourways">Fourways</SelectItem>
                        <SelectItem value="Rivonia">Rivonia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Initial Status *</Label>
                    <Select name="status" defaultValue="offline" required>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="idle">Idle</SelectItem>
                        <SelectItem value="offline">Offline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Add Driver
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-border">
                {["Driver", "Status", "Zone", "Speed", "Last Seen"].map((h) => (
                  <th key={h} className="p-2 sm:p-3 text-left text-[15px] sm:text-xs font-normal tracking-wider uppercase text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
            {drivers.map((d) => (
              <tr
                key={d.id}
                className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors cursor-pointer"
              >
                <td className="p-2 sm:p-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10 shrink-0">
                      <AvatarImage src={d.avatar} alt={d.name} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs sm:text-sm font-medium">
                        {d.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-normal text-foreground text-xs sm:text-sm truncate">{d.name}</p>
                      <p className="text-[15px] sm:text-xs text-muted-foreground font-light font-mono">{d.id}</p>
                    </div>
                  </div>
                </td>
                <td className="p-2 sm:p-3">
                  <Badge 
                    variant={d.status === "active" ? "default" : d.status === "idle" ? "warning" : "secondary"}
                    className="inline-flex items-center gap-1 sm:gap-1.5 text-[19px] sm:text-xs"
                  >
                    <span className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      d.status === "active" && "bg-green-500",
                      d.status === "idle" && "bg-yellow-500",
                      d.status === "offline" && "bg-gray-400"
                    )} />
                    {d.status}
                  </Badge>
                </td>
                <td className="p-2 sm:p-3">
                  <div className="flex items-center gap-1 sm:gap-1.5 text-muted-foreground">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" strokeWidth={1} />
                    <span className="font-light text-[15px] sm:text-xs truncate">{d.zone}</span>
                  </div>
                </td>
                <td className="p-2 sm:p-3">
                  <div className="flex items-center gap-1 sm:gap-1.5 font-mono">
                    <Gauge className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" strokeWidth={1} />
                    <span className={cn(
                      "text-[15px] sm:text-xs",
                      d.speed > 35 ? "text-warning font-normal" : "text-foreground font-normal"
                    )}>{d.speed} km/h</span>
                  </div>
                </td>
                <td className="p-2 sm:p-3">
                  <div className="flex items-center gap-1 sm:gap-1.5 text-muted-foreground">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" strokeWidth={1} />
                    <span className="font-light text-[15px] sm:text-xs">{d.lastSeen}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

    </div>
  );
};

export default Drivers;
