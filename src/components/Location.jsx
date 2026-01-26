import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Location = ({ stats }) => {
    const cityCounts = stats?.reduce((acc, curr) => {
        if (acc[curr.city]) {
            acc[curr.city] += 1;
        } else {
            acc[curr.city] = 1;
        }
        return acc;
    }, {})

    const cities = Object.entries(cityCounts).map(([city, count]) => ({
        city, count
    }))
    return (
        <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
                <LineChart
                    width={700}
                    height={300}
                    data={cities.slice(0, 5)}
                    margin={{
                        top: 5,
                        right: 0,
                        left: 0,
                        bottom: 5,
                    }}
                >
                    {/* <CartesianGrid strokeDasharray="3 3" /> */}
                    <XAxis dataKey="city" />
                    <YAxis />
                    <Tooltip labelStyle={{ color: 'green' }} />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#8884d8"
                    // activeDot={{ r: 8 }} 
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default Location