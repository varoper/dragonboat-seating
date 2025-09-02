// ExportChart.js
// Displays form for exporting the seating chart
import React, { useState } from 'react';
import useStore from '../store/useStore';

const ExportChart = () => {

  const toggleShowExportChart = useStore((state) => state.toggleShowExportChart);
  const seatingChart = useStore((state) => state.seatingChart);
  const drummer = useStore((state) => state.drummer);
  const stern = useStore((state) => state.stern);

  const [customFileName, setCustomFileName] = useState(() => {
    const today = new Date();
    // MM-DD-YY
    const formatted = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}-${String(today.getFullYear()).slice(2)}`;
    return `${formatted}.csv`;
  });

  // Handles exporting a seating chart as a .csv file
  const exportSeatingChartToCSV = (fileName) => {
    const csvRows = [['name', 'seat']];
    if (drummer?.name && drummer.name !== 'Empty') csvRows.push([drummer.name, 'drummer']);
    seatingChart.forEach((p, i) => {
      if (p.name !== 'Empty') {
        const row = Math.floor(i / 2) + 1;
        const side = i % 2 === 0 ? 'L' : 'R';
        csvRows.push([p.name, `${row}${side}`]);
      }
    });
    if (stern?.name && stern.name !== 'Empty') csvRows.push([stern.name, 'stern']);

    const blob = new Blob([csvRows.map(r => r.join(',')).join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName ?? `seating-chart.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-4 space-y-2 toggle-form">
      <div>
        <label htmlFor="csv_filename">Choose file name</label>
        <input
          id="csv_filename"
          type="text"
          className="w-36"
          value={customFileName}
          onChange={(e) => setCustomFileName(e.target.value)}
        />
      </div>
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => exportSeatingChartToCSV(customFileName)}
        >
          Download
        </button>
        <button
          onClick={() => toggleShowExportChart()}
          className="button-alt"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ExportChart;
