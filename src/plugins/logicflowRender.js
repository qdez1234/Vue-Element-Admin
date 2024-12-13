import { RectNode, RectNodeModel, h } from '@logicflow/core';

class CustomNodeView extends RectNode {
  // 自定义一个用户图案
  getLabelShape() {
    const { model } = this.props;
    const { x, y, width, height } = model;
    const { iconHref } = model.properties;
    // 使用 h 函数生成虚拟 DOM 节点
    return h(
      'svg',
      {
        class: 'svg-icon',
        'aria-hidden': 'true',
        x: x - width / 4,
        y: y - height / 2,
        width: 50,
        height: 50,
      },
      [
        h('use', {
          'xlink:href': iconHref,
          fill: 'rgb(24, 125, 255)',
        }),
      ],
    );
  }

  // 自定义节点外观
  getShape() {
    const { model } = this.props;
    const { x, y, width, height, radius } = model;
    const style = model.getNodeStyle();
    return h('g', {}, [
      h('rect', {
        ...style,
        x: x - width / 2, // 矩形默认x，y代表左上角顶点坐标，切换为中心点
        y: y - height / 2,
        rx: radius,
        ry: radius,
        width,
        height,
      }),
      this.getLabelShape(),
    ]);
  }
}

class CustomNodeModel extends RectNodeModel {
  // 设置 model 形状属性，每次 properties 发生变化会触发, 初始化 properties 也会执行
  setAttributes() {
    const { scale = 1, width = 100, height = 80, } = this.properties;
    // 需要手动设置形状属性
    this.width = width * scale;
    this.height = height * scale;
    // 存储传递进来的 iconHref 值
  }

  // 自定义文本样式：依赖业务属性 isClicked 改变文本颜色
  getTextStyle() {
    const style = super.getTextStyle();
    style.fontSize = 18;
    const { isClicked } = this.properties;
    style.y = this.y + 30;
    style.color = isClicked ? 'red' : 'rgb(24, 125, 255)';
    return style;
  }

  // 自定义节点样式：依赖业务属性 isClicked 改变边框颜色
  getNodeStyle() {
    const style = super.getNodeStyle();
    const { isClicked } = this.properties;
    if (isClicked) {
      style.stroke = 'red';
    } else {
      style.stroke = 'rgb(24, 125, 255)';
    }
    style.strokeWidth = 0;
    return style;
  }

  // 自定义锚点样式属性：锚点（节点连线的点）
  getAnchorStyle() {
    const style = super.getAnchorStyle();
    const newStyle = Object.assign({}, style, {
      stroke: 'rgb(24, 125, 255)',
      r: 3,
      hover: {
        r: 8,
        fill: 'rgb(24, 125, 255)',
        stroke: 'rgb(24, 125, 255)',
      },
    });
    return newStyle;
  }

  // 自定义节点轮廓框的样式属性
  // getOutlineStyle() {
  //   const style = super.getOutlineStyle();
  //   const newStyle = Object.assign({}, style, {
  //     stroke: 'red',
  //     hover: {
  //       stroke: 'red',
  //     },
  //   });
  //   return newStyle;
  // }
}

export default {
  type: 'CustomNode',
  view: CustomNodeView,
  model: CustomNodeModel,
};