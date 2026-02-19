import { useEffect, useState } from "react";
import { Database, Trash2, AlertCircle, Search, Filter, ArrowLeft, Video, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { faceDB, StoredFace, StoredVideo } from "@/lib/face-database";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const FaceDatabase = () => {
  const [faces, setFaces] = useState<StoredFace[]>([]);
  const [filteredFaces, setFilteredFaces] = useState<StoredFace[]>([]);
  const [videos, setVideos] = useState<StoredVideo[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadFaces();
    loadVideos();
  }, []);

  useEffect(() => {
    filterFaces();
  }, [faces, searchQuery, selectedGender]);

  const loadFaces = async () => {
    try {
      setIsLoading(true);
      const storedFaces = await faceDB.getAllFaces();
      // Sort by timestamp descending (newest first)
      storedFaces.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setFaces(storedFaces);
    } catch (err) {
      console.error("Error loading faces:", err);
      toast({
        title: "Load Failed",
        description: "Failed to load faces from database.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterFaces = () => {
    let filtered = [...faces];

    if (selectedGender !== "all") {
      filtered = filtered.filter((face) => face.gender === selectedGender);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (face) =>
          face.id.toLowerCase().includes(query) ||
          face.notes?.toLowerCase().includes(query) ||
          face.expression?.toLowerCase().includes(query)
      );
    }

    setFilteredFaces(filtered);
  };

  const deleteFace = async (id: string) => {
    try {
      await faceDB.deleteFace(id);
      toast({
        title: "Face Deleted",
        description: "Face removed from database successfully.",
      });
      loadFaces();
    } catch (err) {
      console.error("Error deleting face:", err);
      toast({
        title: "Delete Failed",
        description: "Failed to delete face from database.",
        variant: "destructive",
      });
    }
  };

  const deleteAllFaces = async () => {
    try {
      await faceDB.deleteAllFaces();
      toast({
        title: "Database Cleared",
        description: "All faces removed from database successfully.",
      });
      loadFaces();
    } catch (err) {
      console.error("Error clearing database:", err);
      toast({
        title: "Clear Failed",
        description: "Failed to clear database.",
        variant: "destructive",
      });
    }
  };

  // ── Video functions ──

  const loadVideos = async () => {
    try {
      const storedVideos = await faceDB.getAllVideos();
      storedVideos.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setVideos(storedVideos);
    } catch (err) {
      console.error("Error loading videos:", err);
    }
  };

  const deleteVideo = async (id: string) => {
    try {
      await faceDB.deleteVideo(id);
      toast({
        title: "Video Deleted",
        description: "Recording removed from database.",
      });
      loadVideos();
    } catch (err) {
      console.error("Error deleting video:", err);
    }
  };

  const deleteAllVideos = async () => {
    try {
      await faceDB.deleteAllVideos();
      toast({
        title: "Videos Cleared",
        description: "All recordings removed from database.",
      });
      loadVideos();
    } catch (err) {
      console.error("Error clearing videos:", err);
    }
  };

  const downloadVideo = (dataUrl: string, index: number) => {
    const ext = dataUrl.includes('video/mp4') ? 'mp4' : 'webm';
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `biosentinel-recording-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}-${index}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="p-3 sm:p-6 space-y-3 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/face-recognition")}
            className="font-mono text-[10px] sm:text-xs h-7 sm:h-8 px-2 sm:px-3 shrink-0"
          >
            <ArrowLeft className="h-3 w-3 mr-1" />
            BACK
          </Button>
          <div className="min-w-0">
            <h1 className="font-mono text-sm sm:text-lg font-bold tracking-wider text-foreground">
              FACE DATABASE
            </h1>
            <p className="text-[10px] sm:text-sm text-muted-foreground truncate">
              Manage captured faces and identities
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Badge
            variant="outline"
            className="bg-primary/15 text-primary border-primary/30 font-mono text-[10px] sm:text-xs"
          >
            <Database className="h-3 w-3 mr-1" />
            {filteredFaces.length} / {faces.length}
          </Badge>
          {faces.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="font-mono text-[10px] sm:text-xs h-7 sm:h-8 px-2 sm:px-3"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  CLEAR ALL
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear All Faces?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all {faces.length} faces from the database.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={deleteAllFaces} className="bg-destructive">
                    Delete All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by ID, expression, notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-secondary border-border text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="h-10 rounded-md border border-border bg-secondary px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring w-full sm:w-auto"
          >
            <option value="all">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>

      {/* Face Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading faces...</p>
        </div>
      ) : filteredFaces.length === 0 ? (
        <div className="rounded-lg border bg-card p-12 text-center">
          <Database className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground mb-2">
            {faces.length === 0 ? "No faces in database" : "No faces match your filters"}
          </p>
          <p className="text-xs text-muted-foreground">
            {faces.length === 0
              ? "Start the camera to capture faces automatically"
              : "Try adjusting your search or filters"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
          {filteredFaces.map((face, index) => (
            <motion.div
              key={face.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-lg border bg-card overflow-hidden hover:border-primary/30 transition-colors"
            >
              <div className="aspect-square bg-black relative">
                <img
                  src={face.imageData}
                  alt={`Face ${face.id}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge
                    variant="outline"
                    className="bg-primary/90 text-primary-foreground border-primary text-[11px]"
                  >
                    {face.confidence}%
                  </Badge>
                </div>
              </div>
              <div className="p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs text-muted-foreground truncate">
                      {face.id}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {new Date(face.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Face?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete this face from the database.
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteFace(face.id)}
                          className="bg-destructive"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <div className="space-y-1 text-xs">
                  {face.age && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Age:</span>
                      <span className="text-foreground">{face.age} years</span>
                    </div>
                  )}
                  {face.gender && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gender:</span>
                      <span className="text-foreground capitalize">{face.gender}</span>
                    </div>
                  )}
                  {face.expression && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expression:</span>
                      <span className="text-foreground capitalize">{face.expression}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Recorded Videos Section */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Video className="h-4 w-4 text-accent" strokeWidth={1.5} />
            <h2 className="font-mono text-sm sm:text-lg font-bold tracking-wider text-foreground">
              RECORDED VIDEOS
            </h2>
            <Badge
              variant="outline"
              className="bg-primary/15 text-primary border-primary/30 font-mono text-[10px] sm:text-xs"
            >
              {videos.length} CLIP{videos.length !== 1 ? "S" : ""}
            </Badge>
          </div>
          {videos.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="font-mono text-[10px] sm:text-xs h-7 sm:h-8 px-2 sm:px-3"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  CLEAR ALL VIDEOS
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear All Videos?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all {videos.length} recorded videos from the database.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={deleteAllVideos} className="bg-destructive">
                    Delete All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {videos.length === 0 ? (
          <div className="rounded-lg border bg-card p-12 text-center">
            <Video className="h-12 w-12 text-muted-foreground mx-auto mb-3" strokeWidth={1} />
            <p className="text-muted-foreground mb-2">No recorded videos</p>
            <p className="text-xs text-muted-foreground">
              Use the camera's RECORD button to capture video clips
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {videos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-lg border bg-card overflow-hidden hover:border-primary/30 transition-colors"
              >
                <div className="aspect-video bg-black">
                  <video
                    src={video.videoData}
                    controls
                    playsInline
                    className="w-full h-full"
                  />
                </div>
                <div className="p-3 flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-xs text-foreground font-medium">
                      Recording {videos.length - index}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(video.timestamp).toLocaleString()} • {formatDuration(video.duration)} • {video.size}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadVideo(video.videoData, index)}
                      className="font-mono text-[10px] h-7 px-2 gap-1"
                    >
                      <Download className="h-3 w-3" strokeWidth={1.5} />
                      SAVE
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Video?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete this recording from the database.
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteVideo(video.id)}
                            className="bg-destructive"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 sm:p-4">
        <div className="flex items-start gap-2 sm:gap-3">
          <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-mono text-[11px] sm:text-xs text-primary font-semibold mb-1">
              ADMIN NOTICE
            </h3>
            <p className="text-[11px] sm:text-xs text-muted-foreground">
              All faces and videos are stored locally in your browser's IndexedDB. For production use,
              data should be synced to a secure cloud database with proper encryption and
              access controls. Integration with SA Home Affairs and SAPS databases requires
              authorized API credentials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceDatabase;
