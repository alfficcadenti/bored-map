"use client";

import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAP_STYLES } from '@/lib/constants';
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

interface Props {
    data: FeatureCollection<Geometry, GeoJsonProperties>
}

const ExploreMap: React.FC<Props> = ({ data }) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const [zoom] = useState(3);

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
                    data,
                    cluster: true,
                    clusterMaxZoom: 50,
                    clusterRadius: 80
                });

                // Add clustering layers
                mapRef.current.addLayer({
                    id: 'clusters',
                    type: 'circle',
                    source: 'random-points',
                    filter: ['has', 'point_count'],
                    paint: {
                        'circle-color': '#ec4b28',
                        'circle-radius': [
                            'step',
                            ['get', 'point_count'],
                            20,  // size for clusters with less than 50 points
                            50,  // step value
                            40   // size for clusters with 50 or more points
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

                // Add unclustered point layer with custom SVG marker
                mapRef.current.loadImage('/pin24x30.png', (error, image) => {
                    if (error) {
                        console.error('Error loading image:', error);
                        return;
                    }

                    if (image && mapRef.current) {
                        mapRef.current.addImage('custom-marker', image);

                        mapRef.current.addLayer({
                            id: 'unclustered-point',
                            type: 'symbol',
                            source: 'random-points',
                            filter: ['!', ['has', 'point_count']],
                            layout: {
                                'icon-image': 'custom-marker',
                                'icon-size': 1
                            }
                        });
                    }
                });
            }
        });

    }, [zoom, data]);

    return (
        <div ref={mapContainer} className="map-container w-full h-screen fixed top-0" />
    );
};

export default ExploreMap;
