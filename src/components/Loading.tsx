import type { ComponentPropsWithoutRef } from 'react';

export type ButtonProps = {
  size?: number; // rem
} & ComponentPropsWithoutRef<'button'>;

export const Loading = ({ size = 1.2, color = '#2150ce' }: ButtonProps) => (
  <svg
    style={{ color }}
    xmlns="http://www.w3.org/2000/svg"
    width={`${size}rem`}
    height={`${size}rem`}
    viewBox="0 0 24 24">
    <rect width="7.33" height="7.33" x="1" y="1" fill="currentCoslor">
      <animate
        id="svgSpinnersBlocksWave0"
        attributeName="x"
        begin="0;svgSpinnersBlocksWave1.end+0.2s"
        dur="0.6s"
        values="1;4;1"></animate>
      <animate attributeName="y" begin="0;svgSpinnersBlocksWave1.end+0.2s" dur="0.6s" values="1;4;1"></animate>
      <animate
        attributeName="width"
        begin="0;svgSpinnersBlocksWave1.end+0.2s"
        dur="0.6s"
        values="7.33;1.33;7.33"></animate>
      <animate
        attributeName="height"
        begin="0;svgSpinnersBlocksWave1.end+0.2s"
        dur="0.6s"
        values="7.33;1.33;7.33"></animate>
    </rect>
    <rect width="7.33" height="7.33" x="8.33" y="1" fill="currentColor">
      <animate
        attributeName="x"
        begin="svgSpinnersBlocksWave0.begin+0.1s"
        dur="0.6s"
        values="8.33;11.33;8.33"></animate>
      <animate attributeName="y" begin="svgSpinnersBlocksWave0.begin+0.1s" dur="0.6s" values="1;4;1"></animate>
      <animate
        attributeName="width"
        begin="svgSpinnersBlocksWave0.begin+0.1s"
        dur="0.6s"
        values="7.33;1.33;7.33"></animate>
      <animate
        attributeName="height"
        begin="svgSpinnersBlocksWave0.begin+0.1s"
        dur="0.6s"
        values="7.33;1.33;7.33"></animate>
    </rect>
    <rect width="7.33" height="7.33" x="1" y="8.33" fill="currentColor">
      <animate attributeName="x" begin="svgSpinnersBlocksWave0.begin+0.1s" dur="0.6s" values="1;4;1"></animate>
      <animate
        attributeName="y"
        begin="svgSpinnersBlocksWave0.begin+0.1s"
        dur="0.6s"
        values="8.33;11.33;8.33"></animate>
      <animate
        attributeName="width"
        begin="svgSpinnersBlocksWave0.begin+0.1s"
        dur="0.6s"
        values="7.33;1.33;7.33"></animate>
      <animate
        attributeName="height"
        begin="svgSpinnersBlocksWave0.begin+0.1s"
        dur="0.6s"
        values="7.33;1.33;7.33"></animate>
    </rect>
    <rect width="7.33" height="7.33" x="15.66" y="1" fill="currentColor">
      <animate
        attributeName="x"
        begin="svgSpinnersBlocksWave0.begin+0.2s"
        dur="0.6s"
        values="15.66;18.66;15.66"></animate>
      <animate attributeName="y" begin="svgSpinnersBlocksWave0.begin+0.2s" dur="0.6s" values="1;4;1"></animate>
      <animate
        attributeName="width"
        begin="svgSpinnersBlocksWave0.begin+0.2s"
        dur="0.6s"
        values="7.33;1.33;7.33"></animate>
      <animate
        attributeName="height"
        begin="svgSpinnersBlocksWave0.begin+0.2s"
        dur="0.6s"
        values="7.33;1.33;7.33"></animate>
    </rect>
    <rect width="7.33" height="7.33" x="8.33" y="8.33" fill="currentColor">
      <animate
        attributeName="x"
        begin="svgSpinnersBlocksWave0.begin+0.2s"
        dur="0.6s"
        values="8.33;11.33;8.33"></animate>
      <animate
        attributeName="y"
        begin="svgSpinnersBlocksWave0.begin+0.2s"
        dur="0.6s"
        values="8.33;11.33;8.33"></animate>
      <animate
        attributeName="width"
        begin="svgSpinnersBlocksWave0.begin+0.2s"
        dur="0.6s"
        values="7.33;1.33;7.33"></animate>
      <animate
        attributeName="height"
        begin="svgSpinnersBlocksWave0.begin+0.2s"
        dur="0.6s"
        values="7.33;1.33;7.33"></animate>
    </rect>
    <rect width="7.33" height="7.33" x="1" y="15.66" fill="currentColor">
      <animate attributeName="x" begin="svgSpinnersBlocksWave0.begin+0.2s" dur="0.6s" values="1;4;1"></animate>
      <animate
        attributeName="y"
        begin="svgSpinnersBlocksWave0.begin+0.2s"
        dur="0.6s"
        values="15.66;18.66;15.66"></animate>
      <animate
        attributeName="width"
        begin="svgSpinnersBlocksWave0.begin+0.2s"
        dur="0.6s"
        values="7.33;1.33;7.33"></animate>
      <animate
        attributeName="height"
        begin="svgSpinnersBlocksWave0.begin+0.2s"
        dur="0.6s"
        values="7.33;1.33;7.33"></animate>
    </rect>
    <rect width="7.33" height="7.33" x="15.66" y="8.33" fill="currentColor">
      <animate
        attributeName="x"
        begin="svgSpinnersBlocksWave0.begin+0.3s"
        dur="0.6s"
        values="15.66;18.66;15.66"></animate>
      <animate
        attributeName="y"
        begin="svgSpinnersBlocksWave0.begin+0.3s"
        dur="0.6s"
        values="8.33;11.33;8.33"></animate>
      <animate
        attributeName="width"
        begin="svgSpinnersBlocksWave0.begin+0.3s"
        dur="0.6s"
        values="7.33;1.33;7.33"></animate>
      <animate
        attributeName="height"
        begin="svgSpinnersBlocksWave0.begin+0.3s"
        dur="0.6s"
        values="7.33;1.33;7.33"></animate>
    </rect>
    <rect width="7.33" height="7.33" x="8.33" y="15.66" fill="currentColor">
      <animate
        attributeName="x"
        begin="svgSpinnersBlocksWave0.begin+0.3s"
        dur="0.6s"
        values="8.33;11.33;8.33"></animate>
      <animate
        attributeName="y"
        begin="svgSpinnersBlocksWave0.begin+0.3s"
        dur="0.6s"
        values="15.66;18.66;15.66"></animate>
      <animate
        attributeName="width"
        begin="svgSpinnersBlocksWave0.begin+0.3s"
        dur="0.6s"
        values="7.33;1.33;7.33"></animate>
      <animate
        attributeName="height"
        begin="svgSpinnersBlocksWave0.begin+0.3s"
        dur="0.6s"
        values="7.33;1.33;7.33"></animate>
    </rect>
    <rect width="7.33" height="7.33" x="15.66" y="15.66" fill="currentColor">
      <animate
        id="svgSpinnersBlocksWave1"
        attributeName="x"
        begin="svgSpinnersBlocksWave0.begin+0.4s"
        dur="0.6s"
        values="15.66;18.66;15.66"></animate>
      <animate
        attributeName="y"
        begin="svgSpinnersBlocksWave0.begin+0.4s"
        dur="0.6s"
        values="15.66;18.66;15.66"></animate>
      <animate
        attributeName="width"
        begin="svgSpinnersBlocksWave0.begin+0.4s"
        dur="0.6s"
        values="7.33;1.33;7.33"></animate>
      <animate
        attributeName="height"
        begin="svgSpinnersBlocksWave0.begin+0.4s"
        dur="0.6s"
        values="7.33;1.33;7.33"></animate>
    </rect>
  </svg>
);
