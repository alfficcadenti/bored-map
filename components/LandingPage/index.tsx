"use client";

import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MAP_STYLES } from "@/lib/constants";
import { spinGlobe } from "@/lib/helper";
import { LngLatLike } from "mapbox-gl";
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

type Chapter = {
  bearing: number;
  center: LngLatLike;
  zoom: number;
  pitch?: number;
  duration?: number;
  speed?: number;
};


const chapters: Record<string, Chapter> = {
  bored: {
    bearing: 0,
    center: [2, 48],
    zoom: 0,
    pitch: 0,
  },
  apes: {
    bearing: 0,
    center: [2, 48],
    zoom: 5,
    pitch: 20,
  },
  mbas: {
    bearing: 45,
    center: [-118.16317734773007, 33.77565697981687],
    zoom: 5,
    pitch: 60,
  },
  events: {
    bearing: 45,
    center: [-9.178893425660304, 38.70363098902135],
    zoom: 12,
    pitch: 60,
  },
  register: {
    bearing: 45,
    center: [8, 47],
    zoom: 0,
    pitch: 20,
    speed: 0.5,
  },
};

const markersData = [
  { lng: 7.15128, lat: 46.80237 }, // CH
  { lng: -0.118092, lat: 51.509865 }, // London
  { lng: -0.118092, lat: 51.509865 },
  { lng: -9.10624574232916, lat: 38.735102270394094 }, // Apefest
  { lng: -9.178873003369832, lat: 38.703656952780285 },
  { lng: -118.16317734773007, lat: 33.77565697981687 }, // MBAs (Bored and hungry)
];

const Homepage = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mainRef = useRef<HTMLDivElement | null>(null);

  const [spinEnabled, setSpinEnabled] = useState(true);
  const [email, setEmail] = useState('');

  const map = useRef<mapboxgl.Map | null>(null);
  const [lat] = useState(48);
  const [lng] = useState(2);
  const [zoom] = useState(0);
  const [activeChapterName, setActiveChapterName] =
    useState<keyof typeof chapters>("bored");

  function setActiveChapter(chapterName: keyof typeof chapters) {
    if (chapterName === activeChapterName) return;

    if (map.current) {
      map.current.flyTo(chapters[chapterName]);
    }

    document.getElementById(chapterName)?.classList.add("active");
    document.getElementById(activeChapterName)?.classList.remove("active");

    setActiveChapterName(chapterName);
  }

  function isElementOnScreen(id: string) {
    const element = document.getElementById(id);
    if (!element) return false;
    const bounds = element.getBoundingClientRect();
    return bounds.top < window.innerHeight && bounds.bottom > 100;
  }

  useEffect(() => {
    if (!mapContainer.current) return;

    const handleScroll = () => {
      for (const chapterName in chapters) {
        if (isElementOnScreen(chapterName)) {
          console.log(chapterName);
          setActiveChapter(chapterName as keyof typeof chapters);
          break;
        }
      }
    };

    const main = mainRef.current;
    if (main) {
      main.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (main) {
        main.removeEventListener("scroll", handleScroll);
      }
    };
  }, [activeChapterName]);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: MAP_STYLES.dark,
      center: [lng, lat],
      zoom: zoom,
      attributionControl: false,
    });

    markersData.forEach((markerData) => {
      const el = document.createElement("div");
      const width = 25;
      const height = 30;
      el.className = "marker";
      el.style.backgroundImage = `url(/pin.svg)`;
      el.style.width = `${width}px`;
      el.style.height = `${height}px`;
      el.style.backgroundSize = "100%";

      new mapboxgl.Marker(el)
        .setLngLat([markerData.lng, markerData.lat])
        .addTo(map.current as mapboxgl.Map);
    });

    map.current.on("moveend", () => {
      spinGlobe(map, spinEnabled);
    });

    spinGlobe(map, spinEnabled);
  }, [lng, lat, zoom]);

  const toggleSpin = () => {
    setSpinEnabled((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/submit-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      alert('Email submitted successfully!');
    } else {
      alert('Error submitting email.');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      <div
        ref={mapContainer}
        className="map-container w-full h-screen fixed top-0"
      />
      <div
        ref={mainRef}
        className="z-10 items-center justify-between font-mono text-3xl flex flex-col snap-y snap-mandatory overflow-y-scroll h-screen w-full scrollbar-hide"
      >
        <div
          className="min-h-screen snap-always snap-center flex pb-32 md:pb-none items-end md:items-center justify-center h-screen"
          id="bored"
        >
          <img src="/logo.svg" alt="Logo" />
        </div>
        <div
          className="min-h-screen snap-always snap-center flex justify-start w-full pb-32 md:pb-none items-end md:items-center "
          id="apes"
        >
          <div className="w-half md:w-1/3 border-2 border-[#EC4B28] bg-black bg-opacity-40 font-bold text-[#EC4B28] rounded-lg p-8 text-center flex flex-col gap-4">
            <div className="uppercase">By apes, for apes</div>
            <div className="text-sm">
              Network and meet-up with apes close to you
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <img src="/apes/ape_1.png"></img>
                <span className="text-sm">mnats_</span>
              </div>
              <div>
                <img src="/apes/ape_3.png"></img>
                <span className="text-sm">0xBoredDev</span>
              </div>
              <div>
                <img src="/apes/ape_2.png"></img>
                <span className="text-sm">mdcodes</span>
              </div>
              <div>
                <img src="/apes/ape_4.png"></img>
                <span className="text-sm">Alfficcadenti</span>
              </div>
            </div>
          </div>
        </div>
        <div
          className="min-h-screen snap-always snap-center flex pb-32 md:pb-none items-end md:items-center justify-end w-full "
          id="mbas"
        >
          <div className="w-half  md:w-1/3  border-2 border-[#EC4B28] bg-black bg-opacity-40 font-bold text-[#EC4B28] rounded-lg p-8 text-center flex flex-col gap-4">
            <div className="uppercase">local clubs and MBAS</div>
            <div className="text-sm">
              Discover local businesses and clubs by fellow apes
            </div>
            <div className="flex justify-center">
              <img className="w-1/4" src="/mba/bored_hungry.png"></img>
            </div>
          </div>
        </div>
        <div
          className="min-h-screen snap-always snap-center flex pb-32 md:pb-none items-end md:items-center justify-start w-full"
          id="events"
        >
          <div className="w-half md:w-1/3  border-2 border-[#EC4B28] bg-black bg-opacity-40 font-bold text-[#EC4B28] rounded-lg p-8 text-center flex flex-col gap-4">
            <div className="uppercase">Events and travel</div>
            <div className="text-sm">
              Plan your trip and join in exclusive events
            </div>
            <div className="flex justify-center">
              <img className="w-1/2" src="/mba/apefest.svg"></img>
            </div>
          </div>
        </div>

        <div
          className="min-h-screen snap-always snap-center flex pb-32 md:pb-none items-end md:items-center justify-center w-full"
          id="register"
        >
          <div className="w-half border-2 border-[#EC4B28] bg-black bg-opacity-40 font-bold text-[#EC4B28] rounded-lg p-8 text-center">
            <div className="uppercase">Get notified on launch</div>
            <div>
              <form onSubmit={handleSubmit}>                
                <div className="flex flex-col md:flex-row gap-2 pt-4 ">
                  <input
                    className="w-full rounded-lg p-2 border-[#EC4B28] border-2 bg-transparent"
                    type="email"
                    required
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                  <button type="submit">Join</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Homepage;
