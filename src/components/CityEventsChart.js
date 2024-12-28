// import { number } from 'prop-types';
// import mockData from '../mock-data';
import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CityEventsChart = ({ allLocations, events }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        setData(getData());
    }, [allLocations, events]);

    const getData = () => {
        const data = allLocations.map((location) => {
            const count = events.filter((event) => event.location === location).length
            const city = location.split((/, | - /))[0];

            const color = 
                city === 'New York' ? '#12436D' : 
                city === 'Amsterdam' ? '#28A197' :
                city === 'Dubai' ? '#801650' :
                city === 'Toronto' ? '#F46A25' :
                city === 'Santiago' ? '#A285D1' :
                city === 'Tokyo' ? '#117733' :
                city === 'Berlin' ? '#332288' :
                city === 'Cape Town' ? '#AA4499' :
                city === 'Nairobi' ? '#6699CC' :
                city === 'Sydney NSW' ? '#DDCC77' :
                city === 'Mumbai' ? '#661100' :
                city === 'London' ? '#CC6677' :
                city === 'Moscow' ? '#882255' :
                city === 'California' ? '#AA4499' :
                city === 'Bangkok' ? '#44AA99' : '#000000';

            return { city, count, color };
        });
        return data;
    };

    const uniqueCounts = [...new Set(data.map((item) => item.count))];
    uniqueCounts.sort((a, b) => a - b);

    return (
        <ResponsiveContainer width="99%" height={400}>
          <ScatterChart
            margin={{
              top: 20,
              right: 20,
              bottom: 60,
              left: -30,
            }}
          >
            <CartesianGrid />
            <XAxis
              type="category" 
              dataKey="city"
              name="City"
              angle={60}
              interval={0}
              tick={{ dx: 20, dy: 40, fontSize: 14 }}
            />
            <YAxis 
              type="number"
              dataKey="count"
              name="Number of events"
              tickFormatter={(value) => Math.round(value)}
              ticks={uniqueCounts}
              domain={[0, 'auto']}
              allowDataOverflow={true}
            />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter 
                name="Events by City"
                data={data}
                fill={(entry) => entry.color}
            />            
          </ScatterChart>
        </ResponsiveContainer>
    );
};

export default CityEventsChart;