import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

const Location = ({ stats }) => {
    const locationCounts = stats?.reduce((acc, curr) => {
        const key = `${curr.city}, ${curr.country}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {}) || {};

    const data = Object.entries(locationCounts).map(([location, count]) => ({
        location,
        count,
    }));

    return (
        <div className="w-full h-[300px] overflow-hidden mt-5">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data.slice(0, 5)}
                    margin={{ top: 10, right: 20, left: 0, bottom: 40 }}
                >
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />

                    <XAxis
                        dataKey="location"
                        interval={0}
                        angle={-30}
                        textAnchor="end"
                        height={60}
                        tick={{ fontSize: 11 }}
                    />

                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />

                    <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#FF5555"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Location;
