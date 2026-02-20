import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Shield, Users, Zap, Check, ArrowRight,
  ChevronRight, Star, ChevronDown, MapPin, 
  AlertTriangle, Eye, Lock, Camera, Smartphone, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const plans = [
  {
    name: "Starter",
    price: "R499",
    period: "/mo",
    description: "For individual riders and small operations",
    features: [
      "Up to 3 tracked vehicles",
      "Real-time GPS tracking",
      "Basic incident reporting",
      "Mobile app access",
      "Email support",
      "7-day data retention",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Professional",
    price: "R1,299",
    period: "/mo",
    description: "For growing fleets needing advanced security",
    features: [
      "Up to 25 tracked vehicles",
      "AI facial recognition",
      "Real-time panic alerts",
      "Driver management portal",
      "Video evidence capture",
      "Priority support",
      "90-day data retention",
      "Custom geofencing",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large-scale fleet & security operations",
    features: [
      "Unlimited vehicles",
      "SAPS database integration",
      "Home Affairs API access",
      "Dedicated account manager",
      "Custom API integrations",
      "On-premise deployment option",
      "Unlimited data retention",
      "SLA guarantee",
      "White-label options",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const features = [
  {
    icon: MapPin,
    title: "Live GPS Tracking",
    description: "Track your entire fleet in real-time with precision GPS. Monitor speed, routes, and stops on an interactive map.",
    color: "text-primary",
  },
  {
    icon: Eye,
    title: "AI Facial Recognition",
    description: "Identify persons of interest instantly using AI-powered face detection and matching against stored databases.",
    color: "text-accent",
  },
  {
    icon: AlertTriangle,
    title: "Panic Alert System",
    description: "One-tap emergency alerts notify your control room instantly with GPS coordinates and live camera feed.",
    color: "text-destructive",
  },
  {
    icon: Camera,
    title: "Video Evidence",
    description: "Automatic video recording during incidents for irrefutable evidence and faster insurance claims.",
    color: "text-primary",
  },
  {
    icon: Lock,
    title: "SAPS Integration",
    description: "Cross-reference captured faces against South African Police Service criminal records for immediate identification.",
    color: "text-primary",
  },
  {
    icon: Zap,
    title: "Incident Management",
    description: "Complete incident lifecycle — from detection through investigation to resolution, all in one platform.",
    color: "text-primary",
  },
];

const stats = [
  { value: "99.9%", label: "Uptime" },
  { value: "<2s", label: "Alert Response" },
  { value: "50K+", label: "Faces Processed" },
  { value: "24/7", label: "Monitoring" },
];

const testimonials = [
  {
    quote: "RFord Biometrics completely transformed how we manage our delivery fleet. The facial recognition alone has prevented multiple theft attempts.",
    name: "Johan van der Merwe",
    role: "Operations Manager, SwiftDeliver",
    rating: 5,
  },
  {
    quote: "The panic button feature saved one of our riders during an attempted hijacking. The control room had his location within seconds.",
    name: "Thandi Nkosi",
    role: "Fleet Director, MotoGuard SA",
    rating: 5,
  },
  {
    quote: "We reduced incident response times by 73% after deploying RFord Biometrics across our fleet. The ROI was immediate.",
    name: "Pieter du Plessis",
    role: "CEO, Cape Couriers",
    rating: 5,
  },
];

const Landing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  const handleSubscribe = (plan: string) => {
    setSelectedPlan(plan);
    const el = document.getElementById("subscribe");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast({
      title: "🎉 Welcome to RFord Biometrics!",
      description: `We'll be in touch at ${email} about the ${selectedPlan || "Professional"} plan. Thank you!`,
    });
    setEmail("");
    setSelectedPlan("");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img src="/biologo.png" alt="RFord Biometrics" className="h-9 w-9 object-contain" />
            <span className="text-sm sm:text-lg font-semibold tracking-tight">RFord Biometrics</span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-white/60 transition-colors hover:text-white">Features</a>
            <a href="#pricing" className="text-sm text-white/60 transition-colors hover:text-white">Pricing</a>
            <a href="#testimonials" className="text-sm text-white/60 transition-colors hover:text-white">Testimonials</a>
            <a href="#subscribe" className="text-sm text-white/60 transition-colors hover:text-white">Subscribe</a>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => navigate("/login")}
            >
              Log in
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90 text-white gap-1.5"
              onClick={() => handleSubscribe("Professional")}
            >
              Get Started
              <ArrowRight className="h-4 w-4" strokeWidth={0.7} />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative flex min-h-screen items-center justify-center px-4 pt-16"
      >
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(207,100%,42%)_0%,_transparent_70%)] opacity-[0.08]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,_hsl(207,89%,61%)_0%,_transparent_50%)] opacity-[0.05]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear_gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
        </div>

        {/* Animated floating orbs */}
        <motion.div
          animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl"
        />
        <motion.div
          animate={{ y: [20, -20, 20], x: [10, -10, 10] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-primary/3 blur-3xl"
        />

        {/* Biometric Art Elements */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          <defs>
            <filter id="biometric-glow">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Iris Scan Circle - Top Right - More Visible */}
          <g opacity="0.15" filter="url(#biometric-glow)">
            <circle cx="92%" cy="12%" r="28" fill="none" stroke="#0099ff" strokeWidth="0.9" />
            <circle cx="92%" cy="12%" r="22" fill="none" stroke="#00d4ff" strokeWidth="0.8" />
            <circle cx="92%" cy="12%" r="16" fill="none" stroke="#0099ff" strokeWidth="0.8" />
            <circle cx="92%" cy="12%" r="10" fill="none" stroke="#00d4ff" strokeWidth="0.7" />
            <circle cx="92%" cy="12%" r="5" fill="none" stroke="#0099ff" strokeWidth="0.6" />
            <circle cx="92%" cy="12%" r="2" fill="#00d4ff" opacity="0.9" />
            {/* Iris radial spokes */}
            <line x1="92%" y1="40%" x2="92%" y2="50%" stroke="#0099ff" strokeWidth="0.6" opacity="0.7" />
            <line x1="64%" y1="12%" x2="74%" y2="12%" stroke="#00d4ff" strokeWidth="0.6" opacity="0.7" />
            <line x1="92%" y1="-16%" x2="92%" y2="-6%" stroke="#0099ff" strokeWidth="0.6" opacity="0.7" />
            <line x1="120%" y1="12%" x2="110%" y2="12%" stroke="#00d4ff" strokeWidth="0.6" opacity="0.7" />
          </g>

          {/* Face Detection Grid - Bottom Left - Smaller */}
          <g opacity="0.06" filter="url(#biometric-glow)">
            <rect x="6%" y="78%" width="70" height="70" fill="none" stroke="#0099ff" strokeWidth="0.4" />
            <line x1="6%" y1="84%" x2="13%" y2="84%" stroke="#00d4ff" strokeWidth="0.3" />
            <line x1="6%" y1="90%" x2="13%" y2="90%" stroke="#0099ff" strokeWidth="0.3" />
            {/* Face landmark points */}
            <circle cx="8.5%" cy="80%" r="1.5" fill="#00d4ff" opacity="0.7" />
            <circle cx="12%" cy="81%" r="1.5" fill="#0099ff" opacity="0.7" />
            <circle cx="10%" cy="86%" r="1.5" fill="#00d4ff" opacity="0.7" />
            <circle cx="9%" cy="92%" r="1.5" fill="#0099ff" opacity="0.7" />
          </g>

          {/* Vertical Scan Lines - Center Right - Smaller */}
          <g opacity="0.07" filter="url(#biometric-glow)">
            <line x1="75%" y1="35%" x2="75%" y2="65%" stroke="#0099ff" strokeWidth="0.5" />
            <line x1="76.5%" y1="35%" x2="76.5%" y2="65%" stroke="#00d4ff" strokeWidth="0.4" />
            <line x1="78%" y1="35%" x2="78%" y2="65%" stroke="#0099ff" strokeWidth="0.35" />
          </g>

          {/* Diagonal Accent Lines */}
          <g opacity="0.06">
            <line x1="5%" y1="50%" x2="25%" y2="30%" stroke="#0099ff" strokeWidth="0.8" />
            <line x1="75%" y1="50%" x2="95%" y2="70%" stroke="#00d4ff" strokeWidth="0.8" />
          </g>
        </svg>

        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
          <div className="space-y-6">
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
                <Badge className="mb-6 border-primary/20 bg-primary/10 text-primary px-4 py-1.5 text-sm font-medium hover:bg-primary/15">
                  AI-Powered Fleet Security for South Africa
                </Badge>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={1}
                className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
              >
                Protect Your Riders.
                <br />
                <span className="bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent">
                  Identify Threats Instantly.
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={2}
                className="text-base text-white/50 sm:text-lg leading-relaxed"
              >
                RFord Biometrics combines real-time GPS tracking, AI facial recognition, and instant panic alerts 
                to keep your motorbike fleet safe — identifying persons of interest before they disappear.
              </motion.p>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={3}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <Button
                  size="lg"
                  className="h-14 px-8 text-base bg-primary hover:bg-primary/90 text-white gap-2 rounded-xl shadow-lg shadow-primary/25"
                  onClick={() => handleSubscribe("Professional")}
                >
                  Start Free Trial
                  <ArrowRight className="h-5 w-5" strokeWidth={0.7} />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-base border-white/10 bg-white/5 text-white hover:bg-white/10 gap-2 rounded-xl"
                  onClick={() => navigate("/login")}
                >
                  View Live Demo
                  <ChevronRight className="h-5 w-5" strokeWidth={0.7} />
                </Button>
              </motion.div>
            </div>

          {/* Stats bar - now below both columns */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={5}
            className="mx-auto mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-8 lg:mt-20"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-white sm:text-3xl">{stat.value}</div>
                <div className="mt-1 text-xs text-white/40 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </motion.div>

        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="h-6 w-6 text-white/20" strokeWidth={0.7} />
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="relative py-24 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 border-primary/20 bg-primary/10 text-primary inline-flex items-center">
              <Shield className="mr-1.5 h-3.5 w-3.5" strokeWidth={0.7} />
              Platform Features
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              Everything you need to
              <br />
              <span className="text-primary">secure your fleet</span>
            </h2>
            <p className="mx-auto max-w-2xl text-white/50 text-base sm:text-lg">
              From real-time tracking to AI-powered facial recognition, RFord Biometrics provides 
              a complete security ecosystem for motorbike operations.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                custom={i}
                className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-6 sm:p-8 transition-all duration-300 hover:border-primary/20 hover:bg-white/[0.04]"
              >
                <feature.icon className={`mb-4 h-6 w-6 ${feature.color}`} strokeWidth={0.7} />
                <h3 className="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-white/50">{feature.description}</p>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-24 sm:py-32 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 border-primary/20 bg-primary/10 text-primary inline-flex items-center">
              <Zap className="mr-1.5 h-3.5 w-3.5" strokeWidth={0.7} />
              How It Works
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              From incident to
              <span className="text-primary"> identification</span>
              <br />in seconds
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {[
              { step: "01", title: "Deploy", desc: "Install RFord Biometrics on your fleet devices and register your drivers in minutes.", icon: Smartphone },
              { step: "02", title: "Monitor", desc: "Track all vehicles in real-time. AI continuously scans for anomalies and threats.", icon: Globe },
              { step: "03", title: "Detect", desc: "Incidents trigger automatic camera activation. Faces are captured and analysed instantly.", icon: Camera },
              { step: "04", title: "Identify", desc: "AI matches faces against databases. Authorities are notified with evidence packages.", icon: Eye },
            ].map((item, i) => (
              <motion.div key={item.step} variants={fadeUp} custom={i} className="relative flex items-start gap-4 sm:flex-col sm:items-center sm:text-center sm:gap-0">
                <div className="shrink-0 mt-1 sm:mt-0 sm:mb-6">
                  <item.icon className="h-7 w-7 text-primary" strokeWidth={0.7} />
                </div>
                <div>
                  <div className="mb-1 sm:mb-2 text-xs font-mono text-primary/60 tracking-widest">STEP {item.step}</div>
                  <h3 className="mb-1 sm:mb-2 text-xl font-semibold text-white">{item.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden lg:block absolute top-8 -right-3 w-6">
                    <ChevronRight className="h-5 w-5 text-white/10" strokeWidth={0.7} />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-24 sm:py-32 border-t border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 border-primary/20 bg-primary/10 text-primary">
              Subscription Plans
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              Simple, transparent
              <span className="text-primary"> pricing</span>
            </h2>
            <p className="mx-auto max-w-2xl text-white/50 text-base sm:text-lg">
              Start with a 14-day free trial. No credit card required. Scale as your fleet grows.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 gap-6 md:grid-cols-3 max-w-5xl mx-auto"
          >
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                variants={fadeUp}
                custom={i}
                className={`relative flex flex-col rounded-2xl border p-6 sm:p-8 transition-all duration-300 ${
                  plan.popular
                    ? "border-primary/40 bg-primary/[0.04] shadow-lg shadow-primary/10 scale-[1.02] md:scale-105"
                    : "border-white/5 bg-white/[0.02] hover:border-white/10"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-white border-0 px-4 py-1 text-xs font-semibold shadow-lg shadow-primary/30">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-1">{plan.name}</h3>
                  <p className="text-sm text-white/40">{plan.description}</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-white/40">{plan.period}</span>
                </div>
                <ul className="mb-8 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={0.7} />
                      <span className="text-sm text-white/60">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full h-12 text-sm font-semibold rounded-xl ${
                    plan.popular
                      ? "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25"
                      : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                  }`}
                  onClick={() => handleSubscribe(plan.name)}
                >
                  {plan.cta}
                  <ArrowRight className="ml-2 h-4 w-4" strokeWidth={0.7} />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative py-24 sm:py-32 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 border-primary/20 bg-primary/10 text-primary inline-flex items-center">
              <Users className="mr-1.5 h-3.5 w-3.5" strokeWidth={0.7} />
              Testimonials
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              Trusted by fleet operators
              <br />
              <span className="text-primary">across South Africa</span>
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 gap-6 md:grid-cols-3"
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                custom={i}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 sm:p-8 hover:border-white/10 transition-colors"
              >
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-none text-primary" strokeWidth={0.7} />
                  ))}
                </div>
                <p className="mb-6 text-sm leading-relaxed text-white/60 italic">"{t.quote}"</p>
                <div>
                  <div className="text-sm font-semibold text-white">{t.name}</div>
                  <div className="text-xs text-white/40">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Subscribe / CTA Section */}
      <section id="subscribe" className="relative py-24 sm:py-32 border-t border-white/5">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/[0.04] via-transparent to-transparent" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              Ready to secure
              <span className="text-primary"> your fleet?</span>
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-white/50 text-base sm:text-lg">
              Start your 14-day free trial today. No credit card required. 
              Get full access to all {selectedPlan || "Professional"} features.
            </p>

            {selectedPlan && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6"
              >
                <Badge className="border-primary/30 bg-primary/10 text-primary px-4 py-1.5">
                  Selected Plan: {selectedPlan}
                </Badge>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-14 flex-1 rounded-xl border-white/10 bg-white/5 px-5 text-white placeholder:text-white/30 focus:border-primary focus:ring-primary"
              />
              <Button
                type="submit"
                size="lg"
                className="h-14 px-8 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/25 whitespace-nowrap"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" strokeWidth={0.7} />
              </Button>
            </form>

            <p className="mt-4 text-xs text-white/30">
              Free 14-day trial · No credit card required · Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#050505]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <img src="/biologo.png" alt="RFord Biometrics" className="h-8 w-8 object-contain" />
                <span className="text-base font-semibold text-white">RFord Biometrics</span>
              </div>
              <p className="text-sm text-white/40 leading-relaxed max-w-xs">
                AI-powered motorbike fleet security & tracking platform for South Africa.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/60">Product</h4>
              <ul className="space-y-2.5">
                {["GPS Tracking", "Facial Recognition", "Incident Management", "Driver Portal", "Mobile App"].map((item) => (
                  <li key={item}>
                    <a href="#features" className="text-sm text-white/40 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/60">Company</h4>
              <ul className="space-y-2.5">
                {["About Us", "Pricing", "Contact", "Careers", "Partners"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-white/40 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/60">Contact</h4>
              <ul className="space-y-2.5 text-sm text-white/40">
                <li>RJF Investments</li>
                <li>2008 / 023862 / 23</li>
                <li>M. +27 83 241 5947</li>
                <li>
                  <a href="mailto:randell@rjfinvestments.co.za" className="hover:text-white transition-colors">
                    randell@rjfinvestments.co.za
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
            <p className="text-xs text-white/30">
              © {new Date().getFullYear()} RJF Investments. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-xs text-white/30 hover:text-white/60 transition-colors">Privacy Policy</a>
              <a href="#" className="text-xs text-white/30 hover:text-white/60 transition-colors">Terms of Service</a>
              <a href="#" className="text-xs text-white/30 hover:text-white/60 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
