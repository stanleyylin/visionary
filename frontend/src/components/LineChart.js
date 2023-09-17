import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function LineChart({
  data,
  width = 640,
  height = 400,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 50, // Increased marginBottom to accommodate x-axis labels
  marginLeft = 50, // Increased marginLeft to accommodate y-axis labels
}) {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const x = d3
      .scaleTime()
      .domain([0, 24]) // Assuming data represents 24 hours
      .range([marginLeft, width - marginRight]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data)]) // Adjust the domain based on your data
      .nice()
      .range([height - marginBottom, marginTop]);

    const xAxis = d3.axisBottom(x).ticks(24); // 24 ticks for 24 hours
    const yAxis = d3.axisLeft(y);

    const line = d3
      .line()
      .x((d, i) => x(i)) // Assuming data represents 24 hours
      .y((d) => y(d));

    // Create x-axis
    svg
      .select(".x-axis")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(xAxis);

    // Create y-axis
    svg
      .select(".y-axis")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(yAxis);

    // Create line path
    svg
      .select(".line")
      .attr("fill", "none")
      .attr("stroke", "currentColor")
      .attr("stroke-width", 1.5)
      .attr("d", line(data));

    // Create circles for data points
    svg
      .selectAll(".data-point")
      .data(data)
      .join("circle")
      .attr("class", "data-point")
      .attr("cx", (d, i) => x(i)) // Assuming data represents 24 hours
      .attr("cy", (d) => y(d))
      .attr("r", 2.5);
  }, [data, height, marginBottom, marginLeft, marginRight, marginTop, width]);

  return (
    <div>
      <h3>Distance Over 24 Hours</h3>
      <svg ref={svgRef} width={width} height={height}>
        <g className="x-axis" />
        <g className="y-axis" />
        <path className="line" />
      </svg>
    </div>
  );
}
