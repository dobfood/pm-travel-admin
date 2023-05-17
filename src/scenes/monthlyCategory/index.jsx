import React, { useMemo } from 'react';
import { Box, useTheme } from '@mui/material';
import Header from 'components/Header';
import { ResponsiveLine } from '@nivo/line';
import { useStat } from 'hooks/swr';
import { connectStorageEmulator } from 'firebase/storage';

const MonthlyCategory = () => {
  const { stat: data } = useStat();
  const theme = useTheme();

  const [formattedData] = useMemo(() => {
    if (!data) return [];

    const { monthCategory } = data;
    const totalCategory1Line = {
      id: 'Du lịch sinh thái ',
      color: theme.palette.secondary.main,
      data: [],
    };
    const totalCategory2Line = {
      id: 'Du lịch trải nghiệm',
      color: theme.palette.secondary[500],
      data: [],
    };
    const totalCategory3Line = {
      id: 'Du lịch nghĩ dưỡng',
      color: theme.palette.secondary[400],
      data: [],
    };
    const totalCategory4Line = {
      id: 'Du lịch văn hóa',
      color: theme.palette.secondary[600],
      data: [],
    };

    Object.values(monthCategory).forEach(({ month, monthCategory }) => {
      console.log(monthCategory);
      const entries = Object.entries(monthCategory);
      const firstEntry = entries[0];
      const secondEntry = entries[1];
      const threeEntry = entries[2];
      const fourEntry = entries[3];

      // Truy cập key và value tương ứng
      const firstKey = firstEntry[0];
      const firstValue = firstEntry[1];
      const secondKey = secondEntry[0];
      const secondValue = secondEntry[1];
      const threeKey = threeEntry[0];
      const threeValue = threeEntry[1];
      const fourKey = fourEntry[0];
      const fourValue = fourEntry[1];
      totalCategory1Line.data = [
        ...totalCategory1Line.data,
        { x: month, y: firstValue },
      ];
      totalCategory2Line.data = [
        ...totalCategory2Line.data,
        { x: month, y: secondValue },
      ];
      totalCategory3Line.data = [
        ...totalCategory3Line.data,
        { x: month, y: threeValue },
      ];
      totalCategory4Line.data = [
        ...totalCategory4Line.data,
        { x: month, y: fourValue },
      ];
    });

    const formattedData = [
      totalCategory1Line,
      totalCategory2Line,
      totalCategory3Line,
      totalCategory4Line,
    ];
    return [formattedData];
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <Box m="1.5rem 2.5rem">
        <Header
          title="Biểu đồ loại tour tháng"
          subtitle="Biểu đồ doanh số hàng tháng của loại tour"
        />
        <Box height="75vh">
          {data ? (
            <>
              <ResponsiveLine
                data={formattedData}
                theme={{
                  axis: {
                    domain: {
                      line: {
                        stroke: theme.palette.secondary[200],
                      },
                    },
                    legend: {
                      text: {
                        fill: theme.palette.secondary[200],
                      },
                    },
                    ticks: {
                      line: {
                        stroke: theme.palette.secondary[200],
                        strokeWidth: 1,
                      },
                      text: {
                        fill: theme.palette.secondary[200],
                      },
                    },
                  },
                  legends: {
                    text: {
                      fill: theme.palette.secondary[200],
                    },
                  },
                  tooltip: {
                    container: {
                      color: theme.palette.primary.main,
                    },
                  },
                }}
                colors={{ datum: 'color' }}
                margin={{ top: 50, right: 50, bottom: 70, left: 60 }}
                xScale={{ type: 'point' }}
                yScale={{
                  type: 'linear',
                  min: 'auto',
                  max: 'auto',
                  stacked: false,
                  reverse: false,
                }}
                yFormat=" >-.2f"
                // curve="catmullRom"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  orient: 'bottom',
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 90,
                  legend: 'Month',
                  legendOffset: 60,
                  legendPosition: 'middle',
                }}
                axisLeft={{
                  orient: 'left',
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'Total',
                  legendOffset: -50,
                  legendPosition: 'middle',
                }}
                enableGridX={false}
                enableGridY={false}
                pointSize={10}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                pointLabelYOffset={-12}
                useMesh={true}
                legends={[
                  {
                    anchor: 'top-right',
                    direction: 'column',
                    justify: false,
                    translateX: 50,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemDirection: 'left-to-right',
                    itemWidth: 120,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: 'circle',
                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                    effects: [
                      {
                        on: 'hover',
                        style: {
                          itemBackground: 'rgba(0, 0, 0, .03)',
                          itemOpacity: 1,
                        },
                      },
                    ],
                  },
                ]}
              />
            </>
          ) : (
            'Loading...'
          )}
        </Box>
      </Box>
    </>
  );
};
export default MonthlyCategory;
