"use client";
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { randomPoints } from '@/lib/helper';
import { MAP_STYLES } from '@/lib/constants';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;


const ExploreMap: React.FC = () => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const [zoom] = useState(3);

    const points = {
        type: 'FeatureCollection',
        features: randomPoints(10000, [-180, -90, 180, 90])
    };

    useEffect(() => {
        if (mapRef.current || !mapContainer.current) return;
        
        mapRef.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: MAP_STYLES.dark,
            center: [-74, 40],
            zoom: zoom
        });

        mapRef.current.on('load', () => {
            if (mapRef.current) {
                mapRef.current.addSource('random-points', {
                    type: 'geojson',
                    data: points,
                    cluster: true,
                    clusterMaxZoom: 50,
                    clusterRadius: 80
                });

                mapRef.current.addLayer({
                    id: 'clusters',
                    type: 'circle',
                    source: 'random-points',
                    filter: ['has', 'point_count'],
                    paint: {
                        'circle-color': [
                            'step',
                            ['get', 'point_count'],
                            '#51bbd6',
                            5,
                            '#f1f075',
                            15,
                            '#f28cb1'
                        ],
                        'circle-radius': [
                            'step',
                            ['get', 'point_count'],
                            30,
                            100,
                            50,
                            750,
                            60
                        ]
                    }
                });

                mapRef.current.addLayer({
                    id: 'cluster-count',
                    type: 'symbol',
                    source: 'random-points',
                    filter: ['has', 'point_count'],
                    layout: {
                        'text-field': '{point_count_abbreviated}',
                        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                        'text-size': 16
                    }
                });

                mapRef.current.addLayer({
                    id: 'unclustered-point',
                    type: 'circle',
                    source: 'random-points',
                    filter: ['!', ['has', 'point_count']],
                    paint: {
                        'circle-color': '#11b4da',
                        'circle-radius': 4,
                        'circle-stroke-width': 1,
                        'circle-stroke-color': '#fff'
                    }
                });
            }


        });
        
    }, [zoom, points]);

    return (
        <div ref={mapContainer} className="map-container w-full h-screen fixed top-0" />
    );
};

export default ExploreMap;
