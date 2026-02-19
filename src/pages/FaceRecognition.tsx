import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { Camera, Users, AlertCircle, CheckCircle, Loader2, Save, Database, Scan, AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { faceDB, StoredFace } from "@/lib/face-database";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface DetectedFace {
  id: number;
  confidence: number;
  age?: number;
  gender?: string;
  expression?: string;
  timestamp: string;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  landmarks?: number;
}

interface FaceMatch {
  id: string;
  confidence: number;
  storedFace: StoredFace;
}

const FaceRecognition = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [detectedFaces, setDetectedFaces] = useState<DetectedFace[]>([]);
  const [faceCount, setFaceCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [totalStoredFaces, setTotalStoredFaces] = useState(0);
  const [autoCapture, setAutoCapture] = useState(true);
  const [matchingEnabled, setMatchingEnabled] = useState(true);
  const [faceMatches, setFaceMatches] = useState<FaceMatch[]>([]);
  const [fps, setFps] = useState(0);
  const lastCaptureTime = useRef<number>(0);
  const lastFrameTime = useRef<number>(0);
  const frameCount = useRef<number>(0);
  const storedDescriptors = useRef<Float32Array[]>([]);
  const storedFacesRef = useRef<StoredFace[]>([]);
  const lastMatchAlertTime = useRef<number>(0); // Prevent toast spam
  const alertedMatchIds = useRef<Set<string>>(new Set()); // Track already alerted matches
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load face-api models and stored faces
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model";
        
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL), // More accurate than tinyFaceDetector
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
          faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
        ]);
        
        setIsModelLoaded(true);
        setIsLoading(false);

        // Initialize database and load all stored faces
        await faceDB.init();
        const count = await faceDB.getFaceCount();
        setTotalStoredFaces(count);

        // Load stored face descriptors for matching
        const faces = await faceDB.getAllFaces();
        storedFacesRef.current = faces;
        storedDescriptors.current = faces.map(face => new Float32Array(face.descriptor));

        toast({
          title: "System Ready",
          description: `AI models loaded. ${count} faces available for matching.`,
        });
      } catch (err) {
        console.error("Error loading models:", err);
        setError("Failed to load face detection models");
        setIsLoading(false);
      }
    };

    loadModels();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
          frameRate: { ideal: 30 }
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
        setError(null);
        
        toast({
          title: "Camera Started",
          description: "Face detection is now active",
        });
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Failed to access camera. Please grant permission.");
      toast({
        title: "Camera Error",
        description: "Could not access camera. Check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
      
      // Clear detection state
      setDetectedFaces([]);
      setFaceMatches([]);
      setFaceCount(0);
      alertedMatchIds.current.clear();
      
      toast({
        title: "Camera Stopped",
        description: "Face detection paused",
      });
    }
  };

  // Assess face quality for better captures
  const assessFaceQuality = (detection: faceapi.FaceDetection, landmarks: faceapi.FaceLandmarks68): 'excellent' | 'good' | 'fair' | 'poor' => {
    const confidence = detection.score;
    const box = detection.box;
    
    // Check face size (larger is better)
    const faceSize = box.width * box.height;
    const minSize = 10000; // minimum pixels
    const goodSize = 50000; // good size threshold
    
    // Check if face is centered and not at edges
    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;
    const isCentered = centerX > 200 && centerX < 1080 && centerY > 150 && centerY < 570;
    
    if (confidence > 0.95 && faceSize > goodSize && isCentered) {
      return 'excellent';
    } else if (confidence > 0.85 && faceSize > minSize && isCentered) {
      return 'good';
    } else if (confidence > 0.7 && faceSize > minSize) {
      return 'fair';
    }
    return 'poor';
  };

  // Match detected face against stored faces
  const matchFace = async (descriptor: Float32Array): Promise<FaceMatch | null> => {
    if (!matchingEnabled || storedDescriptors.current.length === 0) {
      return null;
    }

    let bestMatch: FaceMatch | null = null;
    let bestDistance = Infinity;
    const threshold = 0.6; // Lower distance = better match

    storedDescriptors.current.forEach((storedDesc, index) => {
      const distance = faceapi.euclideanDistance(descriptor, storedDesc);
      
      if (distance < threshold && distance < bestDistance) {
        bestDistance = distance;
        bestMatch = {
          id: storedFacesRef.current[index].id,
          confidence: Math.round((1 - distance) * 100),
          storedFace: storedFacesRef.current[index],
        };
      }
    });

    return bestMatch;
  };

  const captureFaceToDatabase = async (detection: faceapi.WithFaceDescriptor<faceapi.WithFaceExpressions<faceapi.WithAge<faceapi.WithGender<faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection }>>>>>) => {
    try {
      if (!videoRef.current || !canvasRef.current) return;

      // Create a temporary canvas to capture just the face
      const tempCanvas = document.createElement("canvas");
      const box = detection.detection.box;
      
      // Add padding around the face
      const padding = 20;
      const x = Math.max(0, box.x - padding);
      const y = Math.max(0, box.y - padding);
      const width = box.width + padding * 2;
      const height = box.height + padding * 2;

      tempCanvas.width = width;
      tempCanvas.height = height;
      const ctx = tempCanvas.getContext("2d");
      
      if (ctx) {
        ctx.drawImage(
          videoRef.current,
          x, y, width, height,
          0, 0, width, height
        );

        const imageData = tempCanvas.toDataURL("image/jpeg", 0.8);
        const expressions = detection.expressions;
        const maxExpression = Object.entries(expressions).reduce((a, b) =>
          a[1] > b[1] ? a : b
        );

        const storedFace: StoredFace = {
          id: `face_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          imageData,
          descriptor: Array.from(detection.descriptor),
          timestamp: new Date().toISOString(),
          age: Math.round(detection.age),
          gender: detection.gender,
          expression: maxExpression[0],
          confidence: Math.round(detection.detection.score * 100),
        };

        await faceDB.addFace(storedFace);
        const count = await faceDB.getFaceCount();
        setTotalStoredFaces(count);

        // Add to stored descriptors for matching
        storedDescriptors.current.push(new Float32Array(detection.descriptor));
        storedFacesRef.current.push(storedFace);

        toast({
          title: "✓ Face Captured",
          description: `High-quality face stored. Database: ${count} faces.`,
        });
      }
    } catch (err) {
      console.error("Error capturing face:", err);
      toast({
        title: "Capture Failed",
        description: "Failed to store face in database.",
        variant: "destructive",
      });
    }
  };

  // Face detection loop with improved performance
  useEffect(() => {
    if (!isCameraActive || !isModelLoaded || !videoRef.current || !canvasRef.current) {
      return;
    }

    const detectFaces = async () => {
      if (!videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Calculate FPS
      const now = performance.now();
      if (lastFrameTime.current > 0) {
        frameCount.current++;
        if (now - lastFrameTime.current > 1000) {
          setFps(frameCount.current);
          frameCount.current = 0;
          lastFrameTime.current = now;
        }
      } else {
        lastFrameTime.current = now;
      }

      // Match canvas size to video
      const displaySize = { width: video.videoWidth, height: video.videoHeight };
      faceapi.matchDimensions(canvas, displaySize);

      // Use SSD MobileNet for better accuracy (replaces TinyFaceDetector)
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
        .withFaceLandmarks()
        .withFaceDescriptors()
        .withFaceExpressions()
        .withAgeAndGender();

      // Clear canvas
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      // Draw detections with custom styling
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      
      // Custom drawing for better visibility
      resizedDetections.forEach((detection) => {
        const box = detection.detection.box;
        const drawBox = new faceapi.draw.DrawBox(box, { 
          label: `${Math.round(detection.detection.score * 100)}%`,
          lineWidth: 2,
          boxColor: '#0078D4',
        });
        drawBox.draw(canvas);
      });
      
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

      // Update face count and details
      setFaceCount(detections.length);

      if (detections.length > 0) {
        const matchPromises = detections.map(d => matchFace(d.descriptor));
        const matches = await Promise.all(matchPromises);
        const validMatches = matches.filter((m): m is FaceMatch => m !== null);
        
        // Only update matches if they actually changed
        if (JSON.stringify(validMatches.map(m => m.id)) !== JSON.stringify(faceMatches.map(m => m.id))) {
          setFaceMatches(validMatches);
        }

        const faces: DetectedFace[] = detections.map((detection, index) => {
          const expressions = detection.expressions;
          const maxExpression = Object.entries(expressions).reduce((a, b) =>
            a[1] > b[1] ? a : b
          );

          const quality = assessFaceQuality(detection.detection, detection.landmarks);

          return {
            id: index + 1,
            confidence: Math.round(detection.detection.score * 100),
            age: Math.round(detection.age),
            gender: detection.gender,
            expression: maxExpression[0],
            timestamp: new Date().toLocaleTimeString(),
            quality,
            landmarks: detection.landmarks.positions.length,
          };
        });

        // Only update if face data actually changed significantly
        const hasSignificantChange = faces.length !== detectedFaces.length || 
          faces.some((f, i) => {
            const prev = detectedFaces[i];
            return !prev || f.confidence !== prev.confidence || f.quality !== prev.quality;
          });

        if (hasSignificantChange) {
          setDetectedFaces(faces);
        }

        // Auto-capture high-quality faces only (one every 5 seconds)
        if (autoCapture && Date.now() - lastCaptureTime.current > 5000) {
          const excellentFace = detections.find((d, idx) => 
            faces[idx].quality === 'excellent' && d.detection.score > 0.85
          );
          
          if (excellentFace) {
            await captureFaceToDatabase(excellentFace);
            lastCaptureTime.current = Date.now();
          }
        }

        // Alert if known face detected (only once every 10 seconds per unique match)
        if (validMatches.length > 0 && matchingEnabled && Date.now() - lastMatchAlertTime.current > 10000) {
          const newMatches = validMatches.filter(match => 
            match.confidence > 70 && !alertedMatchIds.current.has(match.id)
          );
          
          if (newMatches.length > 0) {
            newMatches.forEach(match => {
              alertedMatchIds.current.add(match.id);
            });
            
            // Only show one toast for all new matches
            toast({
              title: "⚠️ Known Face Detected",
              description: `${newMatches.length} match${newMatches.length > 1 ? 'es' : ''} found with ${newMatches[0].confidence}%+ confidence`,
              variant: "default",
            });
            
            lastMatchAlertTime.current = Date.now();
          }
        }
      } else {
        setDetectedFaces([]);
        setFaceMatches([]);
      }
    };

    const interval = setInterval(detectFaces, 200); // Reduced to 5 FPS to prevent glitching
    return () => clearInterval(interval);
  }, [isCameraActive, isModelLoaded, autoCapture, matchingEnabled, detectedFaces, faceMatches]);

  return (
    <div className="p-3 sm:p-6 space-y-3 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-light tracking-tight text-foreground">
            Facial Recognition System
          </h1>
          <p className="text-xs sm:text-sm font-light text-muted-foreground">
            AI-powered live detection with face matching • {fps} FPS
          </p>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <Badge
            variant="outline"
            className={`font-light text-[10px] sm:text-xs ${
              isCameraActive
                ? "bg-primary/15 text-primary border-[1px] border-primary/30"
                : "bg-muted text-muted-foreground border-[1px]"
            }`}
          >
            <Camera className="h-3 w-3 mr-1" strokeWidth={1} />
            {isCameraActive ? "LIVE" : "OFF"}
          </Badge>
          <Badge
            variant="outline"
            className="bg-primary/15 text-primary border-[1px] border-primary/30 font-light text-[10px] sm:text-xs"
          >
            <Scan className="h-3 w-3 mr-1" strokeWidth={1} />
            {faceCount} DETECTED
          </Badge>
          {faceMatches.length > 0 && (
            <Badge
              variant="outline"
              className="bg-destructive/15 text-destructive border-[1px] border-destructive/30 font-light text-[10px] sm:text-xs"
            >
              <AlertTriangle className="h-3 w-3 mr-1" strokeWidth={1} />
              {faceMatches.length} MATCH{faceMatches.length !== 1 ? "ES" : ""}
            </Badge>
          )}
          <Badge
            variant="outline"
            className="bg-muted text-muted-foreground border-[1px] font-light text-[10px] sm:text-xs"
          >
            <Database className="h-3 w-3 mr-1" strokeWidth={1} />
            {totalStoredFaces} DB
          </Badge>
        </div>
      </div>

      {/* Status Messages */}
      {isLoading && (
        <div className="rounded-lg border bg-card p-4 flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading AI models...</p>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/15 p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {isModelLoaded && !isCameraActive && !error && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-primary" />
          <p className="text-sm text-primary">AI models loaded. Ready to start camera.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
        {/* Camera Feed */}
        <div className="md:col-span-2 space-y-3 sm:space-y-4">
          <div className="rounded-lg border bg-card p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 sm:mb-4">
              <div className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-accent shrink-0" />
                <h3 className="font-mono text-[10px] sm:text-xs tracking-widest uppercase text-muted-foreground">
                  Live Camera Feed
                </h3>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {isModelLoaded && isCameraActive && (
                  <>
                    <label className="text-[10px] sm:text-xs font-light text-muted-foreground cursor-pointer flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        checked={autoCapture}
                        onChange={(e) => setAutoCapture(e.target.checked)}
                        className="rounded"
                      />
                      Auto-Save
                    </label>
                    <label className="text-[10px] sm:text-xs font-light text-muted-foreground cursor-pointer flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        checked={matchingEnabled}
                        onChange={(e) => setMatchingEnabled(e.target.checked)}
                        className="rounded"
                      />
                      Match
                    </label>
                  </>
                )}
                {isModelLoaded && (
                  <Button
                    size="sm"
                    variant={isCameraActive ? "destructive" : "default"}
                    onClick={isCameraActive ? stopCamera : startCamera}
                    className="font-mono text-[10px] sm:text-xs h-7 sm:h-8 px-2 sm:px-3"
                  >
                    {isCameraActive ? "STOP" : "START CAMERA"}
                  </Button>
                )}
              </div>
            </div>

            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              <video
                ref={videoRef}
                autoPlay
                muted
                width="640"
                height="480"
                className="w-full h-full object-cover"
                onLoadedMetadata={() => {
                  if (canvasRef.current && videoRef.current) {
                    canvasRef.current.width = videoRef.current.videoWidth;
                    canvasRef.current.height = videoRef.current.videoHeight;
                  }
                }}
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full"
              />
              {isCameraActive && (
                <button
                  onClick={stopCamera}
                  className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-black/60 hover:bg-red-600 flex items-center justify-center transition-colors"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              )}
              {!isCameraActive && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-2" strokeWidth={1} />
                    <p className="text-sm text-muted-foreground">
                      Camera is off
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detection Results */}
        <div className="space-y-3 sm:space-y-4">
          <div className="rounded-lg border bg-card p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Users className="h-4 w-4 text-accent" />
              <h3 className="font-mono text-[10px] sm:text-xs tracking-widest uppercase text-muted-foreground">
                Detected Individuals
              </h3>
            </div>

            {detectedFaces.length === 0 ? (
              <p className="text-sm font-light text-muted-foreground text-center py-8">
                No faces detected
              </p>
            ) : (
              <div className="space-y-3">
                {detectedFaces.map((face, index) => {
                  const match = faceMatches[index];
                  const qualityColors = {
                    excellent: 'bg-primary/15 text-primary border-primary/30',
                    good: 'bg-primary/10 text-primary border-primary/20',
                    fair: 'bg-muted text-muted-foreground border-muted',
                    poor: 'bg-destructive/10 text-destructive border-destructive/20',
                  };
                  
                  return (
                    <motion.div
                      key={face.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`rounded-lg border-[1px] p-3 space-y-2 ${
                        match ? 'bg-destructive/10 border-destructive/30' : 'bg-card border-border'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-light text-muted-foreground">
                          FACE #{face.id}
                        </p>
                        <div className="flex items-center gap-1">
                          <Badge
                            variant="outline"
                            className={`${qualityColors[face.quality]} text-[9px] font-light border-[1px]`}
                          >
                            {face.quality.toUpperCase()}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-primary/15 text-primary border-[1px] border-primary/30 text-[9px] font-light"
                          >
                            {face.confidence}%
                          </Badge>
                        </div>
                      </div>

                      {match && (
                        <div className="flex items-center gap-2 p-2 rounded bg-destructive/15 border-[1px] border-destructive/30">
                          <AlertTriangle className="h-4 w-4 text-destructive" strokeWidth={1} />
                          <div className="flex-1">
                            <p className="text-xs font-medium text-destructive">Known Face Match</p>
                            <p className="text-[10px] text-destructive/80">
                              {match.confidence}% confidence • {new Date(match.storedFace.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="space-y-1 text-[11px] font-light">
                        {face.age && (
                          <p className="text-muted-foreground">
                            Age: <span className="text-foreground font-normal">{face.age} years</span>
                          </p>
                        )}
                        {face.gender && (
                          <p className="text-muted-foreground">
                            Gender:{" "}
                            <span className="text-foreground font-normal capitalize">{face.gender}</span>
                          </p>
                        )}
                        {face.expression && (
                          <p className="text-muted-foreground">
                            Expression:{" "}
                            <span className="text-foreground font-normal capitalize">
                              {face.expression}
                            </span>
                          </p>
                        )}
                        <p className="text-muted-foreground">
                          Landmarks: <span className="text-foreground font-normal">{face.landmarks} points</span>
                        </p>
                        <p className="text-muted-foreground">
                          Time: <span className="text-foreground font-normal">{face.timestamp}</span>
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Database Integration Info */}
          <div className="rounded-lg border bg-card p-3 sm:p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-primary" />
                <h3 className="font-mono text-[10px] sm:text-xs tracking-widest uppercase text-muted-foreground">
                  Face Database
                </h3>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/face-database")}
                className="font-mono text-[10px] sm:text-xs h-7 sm:h-8 px-2 sm:px-3"
              >
                MANAGE
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground mb-2">
              <span className="text-primary font-semibold">{totalStoredFaces} faces</span> stored in local database.
              {autoCapture && " Auto-capture is enabled."}
            </p>
            <p className="text-[11px] text-muted-foreground">
              Faces can be cross-referenced with{" "}
              <span className="text-accent">SA Home Affairs</span> and{" "}
              <span className="text-accent">SAPS</span> databases when API integration is active.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceRecognition;
