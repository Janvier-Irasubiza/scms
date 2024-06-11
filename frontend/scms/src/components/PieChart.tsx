import { Component } from "react";
import CanvasJSReact from "@canvasjs/react-charts";

interface Props {
  inRehab: number;
  inTransit: number;
  inSchools: number;
  inFamilies: number;
}

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

class PieChart extends Component<Props> {
  render() {
    const { inRehab, inTransit, inSchools, inFamilies } = this.props;

    const options = {
      animationEnabled: true,
      data: [
        {
          type: "pie",
          startAngle: 75,
          toolTipContent: "<b>{label}</b>: {y}",
          showInLegend: true,
          legendText: "{label}",
          indexLabelFontSize: 16,
          indexLabel: "{label} - {y}",
          dataPoints: [
            { y: inRehab, label: "In rehabilitation centres", color: "yellow" },
            { y: inTransit, label: "In transit centres" },
            { y: inSchools, label: "In schools", color: "blue" },
            { y: inFamilies, label: "Into their families", color: "green" },
          ],
        },
      ],
    };

    return (
      <div>
        <CanvasJSChart options={options} />
      </div>
    );
  }
}

export default PieChart;
