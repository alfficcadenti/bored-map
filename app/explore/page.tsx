import Link from 'next/link';
import ExploreMap from '@/components/ExploreMap'; 
import { randomPoints } from '@/lib/helper';
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';

const Explore = () => {

    //random data. add here api fetch to get real data
    const data: FeatureCollection<Geometry, GeoJsonProperties> = {
        type: 'FeatureCollection',
        features: randomPoints(10000, [-180, -90, 180, 90])
    };

return <ExploreMap data={data} />
}

export default Explore;