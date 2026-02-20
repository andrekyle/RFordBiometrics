import { 
  BookOpen, Zap, Cpu, Globe, MapPin, Server, Smartphone,
  Monitor, ArrowRight, CheckCircle, HardDrive, AlertTriangle,
  Camera, Search, Bell, Database, Users, Shield, Lock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const About = () => {
  return (
    <div className="p-3 sm:p-6 space-y-6 sm:space-y-8 max-w-[1000px]">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-[28px] font-normal text-foreground mb-1">About RFord Biometrics</h1>
        <p className="text-[15px] sm:text-[17px] font-light text-muted-foreground">
          Platform overview, technology stack & how-to guide
        </p>
      </div>

      {/* Overview */}
      <div className="rounded-2xl border bg-card p-4 sm:p-6 space-y-4">
        <div className="flex items-center gap-3">
          <img src="/biologo.png" alt="RFord Biometrics" className="h-14 w-14 object-contain" />
          <div>
            <h2 className="text-[18px] sm:text-[19px] font-medium text-foreground">RFord Biometrics Security Platform</h2>
            <p className="text-[19px] sm:text-[15px] text-muted-foreground">Real-time motorbike security & facial recognition</p>
          </div>
        </div>
        <p className="text-[16px] sm:text-[17px] font-light text-muted-foreground leading-relaxed">
          RFord Biometrics is a comprehensive security and tracking platform built for motorbike fleet operations in South Africa. 
          The system combines <span className="text-foreground">real-time GPS tracking</span>, <span className="text-foreground">AI-powered facial recognition</span>, and 
          <span className="text-foreground"> incident management</span> to protect drivers and identify persons of interest during security events.
        </p>
        <p className="text-[16px] sm:text-[17px] font-light text-muted-foreground leading-relaxed">
          The primary focus of RFord Biometrics is the <span className="text-primary font-medium">identification of persons of interest</span> in the event of an incident — 
          whether it's a collision, attempted theft, assault, or suspicious activity. Using live camera feeds and AI face detection, 
          the system captures, stores, and cross-references facial data in real time, enabling rapid identification and response. 
          The platform is designed to integrate with <span className="text-primary font-medium">SA Home Affairs</span> (population register and national identity database) 
          and <span className="text-primary font-medium">SAPS</span> (South African Police Service) criminal records databases. 
          When these API connections are active, captured face descriptors can be matched against national records to positively identify 
          wanted individuals, missing persons, and known offenders — turning RFord Biometrics into a powerful tool for law enforcement collaboration 
          and community safety.
        </p>
      </div>

      {/* Core Workflow */}
      <div className="rounded-2xl border bg-card p-4 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="h-4 w-4 text-primary" strokeWidth={1.5} />
          <h2 className="font-mono text-[15px] sm:text-[15px] tracking-widest uppercase text-muted-foreground">
            Core Workflow — Person of Interest Identification
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              step: "01",
              title: "Incident Detected",
              description: "A driver reports an incident via the panic button, or suspicious activity is flagged through the monitoring dashboard.",
              icon: AlertTriangle,
              color: "text-destructive",
            },
            {
              step: "02",
              title: "Camera Activated",
              description: "The facial recognition camera is activated to capture live video. AI models detect and analyse all faces in the frame.",
              icon: Camera,
              color: "text-primary",
            },
            {
              step: "03",
              title: "Face Matched",
              description: "Detected faces are compared against the stored database using euclidean distance matching. Matches above 60% confidence are flagged.",
              icon: Search,
              color: "text-accent",
            },
            {
              step: "04",
              title: "Alert & Response",
              description: "Known individuals trigger immediate alerts. Face data, age, gender, and timestamps are logged for investigation and evidence.",
              icon: Bell,
              color: "text-destructive",
            },
          ].map((item) => (
            <div key={item.step} className="rounded-xl border border-border p-3 sm:p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[15px] font-mono text-muted-foreground/50">STEP {item.step}</span>
                <item.icon className={`h-4 w-4 ${item.color}`} strokeWidth={1.5} />
              </div>
              <h3 className="text-xs sm:text-[17px] font-medium text-foreground">{item.title}</h3>
              <p className="text-[15px] sm:text-[15px] font-light text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="rounded-2xl border bg-card p-4 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Monitor className="h-4 w-4 text-primary" strokeWidth={1.5} />
          <h2 className="font-mono text-[15px] sm:text-[15px] tracking-widest uppercase text-muted-foreground">
            Platform Features
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              icon: MapPin,
              title: "Live GPS Tracking",
              description: "Real-time motorbike positions on Google Maps with road-based simulation, speed monitoring, zone tracking, and geofencing across South Africa.",
            },
            {
              icon: Camera,
              title: "AI Facial Recognition",
              description: "Live camera face detection using face-api.js with SSD MobileNet. Detects age, gender, expression, and 68-point facial landmarks with quality scoring.",
            },
            {
              icon: Database,
              title: "Face Database",
              description: "IndexedDB-powered local face storage. Captured faces include descriptors for matching, metadata (age, gender, expression), and timestamped records.",
            },
            {
              icon: Search,
              title: "Face Matching Engine",
              description: "Euclidean distance comparison against stored face descriptors. Configurable confidence threshold (default 60%). Real-time alerts on known face detection.",
            },
            {
              icon: AlertTriangle,
              title: "Incident Management",
              description: "Track collisions, thefts, assaults, and suspicious activity. Each incident links to a driver, location, and number of faces detected at the scene.",
            },
            {
              icon: Users,
              title: "Driver Management",
              description: "Full driver roster with status tracking (active, idle, offline), avatar photos, assigned zones, speed data, and last-seen timestamps.",
            },
            {
              icon: Shield,
              title: "Panic Button",
              description: "Emergency alert system accessible from any page. Triggers immediate notification to the RFord Biometrics Control Centre with driver location and incident details.",
            },
            {
              icon: Lock,
              title: "Secure Authentication",
              description: "Admin login with credential validation. Firebase authentication integration ready for production deployment with Google Sign-In capability.",
            },
          ].map((feature) => (
            <div key={feature.title} className="flex gap-3 p-3 rounded-xl border border-border/50 hover:border-primary/20 transition-colors">
              <div className="shrink-0 mt-0.5">
                <feature.icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs sm:text-[17px] font-medium text-foreground">{feature.title}</h3>
                <p className="text-[15px] sm:text-[15px] font-light text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Stack */}
      <div className="rounded-2xl border bg-card p-4 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Cpu className="h-4 w-4 text-primary" strokeWidth={1.5} />
          <h2 className="font-mono text-[15px] sm:text-[15px] tracking-widest uppercase text-muted-foreground">
            Technology Stack
          </h2>
        </div>

        <div className="space-y-4">
          {/* Frontend */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Globe className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
              <h3 className="text-xs font-medium text-foreground uppercase tracking-wider">Frontend</h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                "React 18", "TypeScript", "Vite 5", "Tailwind CSS", "shadcn/ui", 
                "Radix UI", "Framer Motion", "React Router v6", "Lucide Icons",
              ].map((tech) => (
                <Badge key={tech} variant="outline" className="text-[14px] sm:text-[15px] font-light border-primary/20 text-muted-foreground">
                  {tech}
                </Badge>
              ))}
            </div>
            <p className="text-[15px] sm:text-[15px] font-light text-muted-foreground leading-relaxed">
              The frontend is a single-page application (SPA) built with React and TypeScript, using Vite for fast builds and hot module replacement. 
              The UI is styled with Tailwind CSS and uses shadcn/ui components (built on Radix UI primitives) for accessible, consistent design. 
              Framer Motion provides smooth page transitions and animations.
            </p>
          </div>

          {/* AI & Computer Vision */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-medium text-foreground uppercase tracking-wider">AI & Computer Vision</h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                "face-api.js", "SSD MobileNet v1", "68-Point Landmarks", 
                "Face Descriptors", "Age/Gender Detection", "Expression Analysis",
              ].map((tech) => (
                <Badge key={tech} variant="outline" className="text-[14px] sm:text-[15px] font-light border-primary/20 text-muted-foreground">
                  {tech}
                </Badge>
              ))}
            </div>
            <p className="text-[15px] sm:text-[15px] font-light text-muted-foreground leading-relaxed">
              Facial recognition is powered by face-api.js, a JavaScript API built on TensorFlow.js. 
              The SSD MobileNet v1 model provides accurate face detection. The system extracts 128-dimensional face descriptors for identity matching, 
              detects 68 facial landmarks for quality assessment, and estimates age, gender, and facial expressions in real time. 
              All AI processing runs client-side in the browser — no server required.
            </p>
          </div>

          {/* Maps & Location */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
              <h3 className="text-xs font-medium text-foreground uppercase tracking-wider">Maps & Location</h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                "Google Maps JavaScript API", "Places Library", "Geometry Library", 
                "Road-Based Simulation", "Geocoding",
              ].map((tech) => (
                <Badge key={tech} variant="outline" className="text-[14px] sm:text-[15px] font-light border-primary/20 text-muted-foreground">
                  {tech}
                </Badge>
              ))}
            </div>
            <p className="text-[15px] sm:text-[15px] font-light text-muted-foreground leading-relaxed">
              Live tracking uses the Google Maps JavaScript API with Places and Geometry libraries. 
              Motorbike positions are rendered as real-time markers on the map, with road-based simulation 
              ensuring realistic movement along South African streets. The map supports zone-based monitoring across areas 
              including Sandton, Midrand, Rosebank, Melville, Braamfontein, and more.
            </p>
          </div>

          {/* Backend & Database */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Server className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
              <h3 className="text-xs font-medium text-foreground uppercase tracking-wider">Backend & Database</h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                "Firebase Authentication", "IndexedDB", "LocalStorage", 
                "Vercel (Hosting)", "TanStack React Query",
              ].map((tech) => (
                <Badge key={tech} variant="outline" className="text-[14px] sm:text-[15px] font-light border-primary/20 text-muted-foreground">
                  {tech}
                </Badge>
              ))}
            </div>
            <p className="text-[15px] sm:text-[15px] font-light text-muted-foreground leading-relaxed">
              Firebase provides authentication infrastructure with support for admin credentials and Google Sign-In. 
              The face database uses IndexedDB for high-performance, structured local storage of face images and descriptors. 
              Session state is managed via LocalStorage. The app is deployed on Vercel with automatic CI/CD from GitHub. 
              TanStack React Query handles data fetching and caching.
            </p>
          </div>

          {/* Responsive & Mobile */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Smartphone className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
              <h3 className="text-xs font-medium text-foreground uppercase tracking-wider">Responsive & Mobile</h3>
            </div>
            <p className="text-[15px] sm:text-[15px] font-light text-muted-foreground leading-relaxed">
              Every page is fully responsive, optimised for desktop, tablet, and mobile. 
              The sidebar collapses on small screens, controls stack vertically, and touch-friendly elements are sized for mobile use. 
              The panic button is positioned as a fixed bottom-right overlay on mobile for instant access.
            </p>
          </div>
        </div>
      </div>

      {/* How to Use */}
      <div className="rounded-2xl border bg-card p-4 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="h-4 w-4 text-primary" strokeWidth={1.5} />
          <h2 className="font-mono text-[15px] sm:text-[15px] tracking-widest uppercase text-muted-foreground">
            How to Use the Platform
          </h2>
        </div>

        <div className="space-y-4">
          {[
            {
              title: "1. Log In",
              content: "Access the platform at the login screen using the admin credentials. The system uses dark mode by default for optimal viewing in control room environments.",
            },
            {
              title: "2. Dashboard — Monitor Operations",
              content: "The dashboard provides an at-a-glance overview: active drivers, open incidents, fleet status, and a live tracking map. Use this as your primary monitoring screen.",
            },
            {
              title: "3. Live Map — Track Your Fleet",
              content: "View all motorbike positions in real time on Google Maps. Markers show driver names, speeds, and zones. The map auto-updates with road-based movement simulation.",
            },
            {
              title: "4. Incidents — Manage Security Events",
              content: "Review all reported incidents including collisions, thefts, and suspicious activity. Each incident logs the driver involved, location, timestamp, and the number of faces detected at the scene. Use the 'Identify Suspect' button to launch facial recognition for that incident.",
            },
            {
              title: "5. Face Recognition — Identify Persons of Interest",
              content: "This is the core security feature. Start the camera to activate live AI face detection. The system detects all faces in frame, assesses quality (excellent/good/fair/poor), estimates age, gender, and expression, and automatically captures high-quality faces to the database. When face matching is enabled, every detected face is compared against the stored database — if a known person is identified, an immediate alert is triggered with confidence percentage.",
            },
            {
              title: "6. Face Database — Review & Manage Records",
              content: "Browse all captured faces with filters for gender and search. Each record includes the face image, descriptor data, age estimate, gender, expression, confidence score, and timestamp. Delete individual records or clear the entire database. This is your evidence library for investigations.",
            },
            {
              title: "7. Drivers — Manage Your Team",
              content: "Add, view, and manage drivers in the fleet. Track individual status (active, idle, offline), assigned zones, and last-seen times. The panic button is accessible from this page for emergency situations.",
            },
            {
              title: "8. Panic Button — Emergency Response",
              content: "Available on the dashboard and drivers pages, the panic button triggers an immediate alert to the RFord Biometrics Control Centre. It sends the current location, driver details, and activates emergency protocols.",
            },
          ].map((step) => (
            <div key={step.title} className="space-y-1">
              <div className="flex items-center gap-2">
                <ArrowRight className="h-3 w-3 text-primary shrink-0" strokeWidth={2} />
                <h3 className="text-xs sm:text-[17px] font-medium text-foreground">{step.title}</h3>
              </div>
              <p className="text-[15px] sm:text-[15px] font-light text-muted-foreground leading-relaxed pl-5">{step.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Night Operation */}
      <div className="rounded-2xl border bg-card p-4 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Monitor className="h-4 w-4 text-primary" strokeWidth={1.5} />
          <h2 className="font-mono text-[15px] sm:text-[15px] tracking-widest uppercase text-muted-foreground">
            Night Operation & Low-Light Recognition
          </h2>
        </div>

        <p className="text-xs sm:text-[17px] font-light text-muted-foreground leading-relaxed">
          Facial recognition in low-light or nighttime conditions requires specialised hardware to ensure reliable detection. 
          RFord Biometrics' AI models perform optimally when the face is clearly illuminated — the system's quality scoring will flag 
          dark or noisy captures as <span className="text-destructive font-medium">"poor"</span> quality, preventing false matches.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              title: "IR / Night Vision Cameras",
              description: "Infrared cameras emit invisible IR light that illuminates faces without visible flash. USB or IP-based IR cameras can be connected to the platform. This is the industry standard used by SAPS, private security firms, and CCTV networks across South Africa.",
            },
            {
              title: "NIR Facial Recognition Models",
              description: "Near-infrared (NIR) trained AI models can be loaded into the pipeline alongside or replacing the current SSD MobileNet. face-api.js supports custom model loading, enabling seamless integration of NIR-optimised models for nighttime accuracy.",
            },
            {
              title: "LED / Flash Illumination Cameras",
              description: "Cameras with built-in white-light or IR-LED illumination (dashcam-style) provide consistent lighting. Many security cameras auto-switch between colour mode (day) and IR mode (night) for 24/7 operation.",
            },
            {
              title: "Thermal Imaging (Advanced)",
              description: "Thermal cameras detect body heat signatures for person detection even in total darkness. While facial recognition from thermal data alone is less precise, thermal + visible light fusion provides robust identification in all conditions.",
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-3 p-3 rounded-xl border border-border/50">
              <div className="shrink-0 mt-1">
                <CheckCircle className="h-3.5 w-3.5 text-primary" strokeWidth={1.5} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs sm:text-[17px] font-medium text-foreground">{item.title}</h3>
                <p className="text-[15px] sm:text-[15px] font-light text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 sm:p-4">
          <h3 className="text-xs font-medium text-primary mb-1">Recommended Setup for Motorbike Fleets</h3>
          <p className="text-[15px] sm:text-[15px] font-light text-muted-foreground leading-relaxed">
            For RFord Biometrics' South African operations, the optimal configuration is a 
            <span className="text-foreground"> motorbike-mounted dashcam with IR LEDs</span> for capturing faces of nearby individuals at night, 
            combined with a <span className="text-foreground">helmet-mounted camera with fill light</span> for close-range identification during incidents. 
            As long as the face is illuminated — whether by infrared or visible light — the AI detection pipeline operates at full accuracy.
          </p>
        </div>
      </div>

      {/* Future Integration */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-6 space-y-3">
        <div className="flex items-center gap-2">
          <HardDrive className="h-4 w-4 text-primary" strokeWidth={1.5} />
          <h2 className="font-mono text-[15px] sm:text-[15px] tracking-widest uppercase text-primary">
            Future Integration Ready
          </h2>
        </div>
        <p className="text-[15px] sm:text-[15px] font-light text-muted-foreground leading-relaxed">
          The platform is architected for future integration with external databases including 
          <span className="text-primary font-medium"> SA Home Affairs</span> (population register) and 
          <span className="text-primary font-medium"> SAPS</span> (South African Police Service) criminal databases. 
          When API access is enabled, captured face descriptors can be cross-referenced against national records for 
          positive identification of persons of interest, wanted individuals, and missing persons.
        </p>
      </div>

      {/* Version Info */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[15px] text-muted-foreground/40 pb-4">
        <span>RFord Biometrics v1.0 • Built by RJF Investments</span>
        <span>React 18 • TypeScript • Vite 5 • Tailwind CSS • face-api.js</span>
      </div>
    </div>
  );
};

export default About;
