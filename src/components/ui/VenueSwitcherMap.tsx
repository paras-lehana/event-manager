import React, { useEffect, useRef, useState } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { useVenue } from "@/lib/providers";
import { motion, AnimatePresence } from "framer-motion";

const MapComponent = ({ onClick }: { onClick?: (e: google.maps.MapMouseEvent) => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const { venues, activeVenueId, setActiveVenueId } = useVenue();
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    if (ref.current && !map) {
      const activeLat = venues.find(v => v.id === activeVenueId)?.location.lat || 39.8283;
      const activeLng = venues.find(v => v.id === activeVenueId)?.location.lng || -98.5795;
      
      const newMap = new window.google.maps.Map(ref.current, {
        center: { lat: activeLat, lng: activeLng },
        zoom: 4,
        disableDefaultUI: true,
        styles: [
          { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
          { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
        ]
      });
      setMap(newMap);
    }
  }, [ref, map, venues, activeVenueId]);

  useEffect(() => {
    if (map) {
      // Clear old markers
      markersRef.current.forEach(m => m.setMap(null));
      markersRef.current = [];

      venues.forEach((v) => {
        const marker = new window.google.maps.Marker({
          position: v.location,
          map,
          title: v.name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: v.id === activeVenueId ? 10 : 7,
            fillColor: v.id === activeVenueId ? "#00f3ff" : "#db00ff",
            fillOpacity: 0.8,
            strokeWeight: 2,
            strokeColor: "#ffffff"
          }
        });

        marker.addListener("click", () => {
          setActiveVenueId(v.id);
          map.panTo(v.location);
          map.setZoom(12);
        });

        markersRef.current.push(marker);
      });
    }
  }, [map, venues, activeVenueId, setActiveVenueId]);

  return <div ref={ref} className="w-full h-full rounded-xl" />;
};

const render = (status: Status) => {
  if (status === Status.FAILURE) return <div className="text-red-500 font-mono text-xs">MAP_INITIALIZATION_FAILURE</div>;
  return <div className="text-[#00f3ff] animate-pulse font-mono text-xs uppercase">SYNCING_SATELLITE_FEED...</div>;
};

export const VenueSwitcherMap = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
        >
          <div className="absolute inset-0" onClick={onClose} />
          <motion.div 
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="w-full max-w-4xl h-[70vh] bg-[#06060c] border border-[#00f3ff]/30 rounded-2xl relative shadow-[0_0_50px_rgba(0,243,255,0.1)] flex flex-col overflow-hidden"
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40 relative z-10">
               <div>
                  <h2 className="text-lg font-black text-white tracking-widest uppercase">GLOBAL NETWORK</h2>
                  <p className="text-[10px] font-mono text-[#00f3ff] uppercase mt-1">SELECT_ACTIVE_NODE</p>
               </div>
               <button onClick={onClose} className="w-8 h-8 rounded border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors font-mono">&times;</button>
            </div>
            
            <div className="flex-1 relative bg-[#17263c] flex items-center justify-center">
              {apiKey ? (
                <Wrapper apiKey={apiKey} render={render}>
                  <MapComponent />
                </Wrapper>
              ) : (
                <div className="text-center">
                  <p className="text-[10px] font-mono text-[#ff003c] mb-2 uppercase tracking-widest border border-[#ff003c]/20 bg-[#ff003c]/10 p-2 rounded inline-block">NEXUS_API_KEY_MISSING</p>
                  <p className="text-xs text-white/40">The map layer requires a valid Google Maps API Key.</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
