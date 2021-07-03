export class Plugins {

  static chartAreaBorderPlugin(): any {
    return {
      id: 'chartAreaBorder',
      beforeDraw(chart, args, options) {
        const ctx = chart.ctx;
        ctx.save();
        ctx.strokeStyle = options.borderColor;
        ctx.lineWidth = options.borderWidth;
        ctx.setLineDash(options.borderDash || []);
        ctx.lineDashOffset = options.borderDashOffset;

        const left   = chart.chartArea.left;
        const top    = chart.chartArea.top;
        const width  = chart.chartArea.right - left;
        const height = chart.chartArea.bottom - top;
        ctx.strokeRect(left, top, width, height);
        ctx.restore();
      }
    };
  }
}

