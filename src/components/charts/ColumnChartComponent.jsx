import React, { useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { chartData } from '../../data/Data';
import { DigiContext } from '../../context/DigiContext';
const ColumnChartComponent = () => {
  const { isLightTheme, isRechartHeight } = useContext(DigiContext)
    return (
      <ResponsiveContainer width="100%" maxHeight={410} minHeight={isRechartHeight}>
      <BarChart data={chartData}>
          <CartesianGrid stroke="#334652" strokeDasharray="3" />
          <XAxis dataKey="name" fill="rgba(0, 0, 0, 0.15)" stroke={`${isLightTheme? 'hsl(0deg 0% 0% / 70%)' : 'hsl(0deg 0% 89.41% / 70%)'}`}/>
          <YAxis stroke={`${isLightTheme? 'hsl(0deg 0% 0% / 70%)' : 'hsl(0deg 0% 89.41% / 70%)'}`}/>
          <Tooltip />
          <Bar dataKey="Desktops" fill="#037fe0" />
        </BarChart>
      </ResponsiveContainer>
    );
  };
  
  export default ColumnChartComponent;
  