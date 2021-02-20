
import { fabric } from "fabric";
//绘制方法
let canvasObject, textBox;
export default function drawing(type, mouseFrom, mouseTo, color, drawWidth, isTextEditing, ctx) {
    console.log("type", type);
    switch (type) {
        case "arrow": //箭头
            canvasObject = new fabric.Path(drawArrow(mouseFrom.x, mouseFrom.y, mouseTo.x, mouseTo.y, 30, 30), {
                stroke: color,
                fill: "rgba(255,255,255,0)",
                strokeWidth: 2
            });
            break;
        case "line": //直线
            canvasObject = new fabric.Line([mouseFrom.x, mouseFrom.y, mouseTo.x, mouseTo.y], {
                stroke: color,
                strokeWidth: 2
            });
            break;
        case "circle": //正圆
            var left = mouseFrom.x,
                top = mouseFrom.y;
            var radius = Math.sqrt((mouseTo.x - left) * (mouseTo.x - left) + (mouseTo.y - top) * (mouseTo.y - top)) / 2;
            canvasObject = new fabric.Circle({
                left: left,
                top: top,
                stroke: color,
                fill: "",
                radius: radius,
                strokeWidth: drawWidth
            });
            break;
        case "rect": //矩形
            canvasObject = new fabric.Rect({
                top: mouseFrom.y,
                left: mouseFrom.x,
                width: (mouseTo.x - mouseFrom.x),
                height: (mouseTo.y - mouseFrom.y),
                stroke: color,
                strokeWidth: 3,
                fill: "rgba(255, 255, 255, 0)"
            });
            break;
        case "dottedline": //虚线
            canvasObject = new fabric.Line([mouseFrom.x, mouseFrom.y, mouseTo.x, mouseTo.y], {
                strokeDashArray: [3, 1],
                stroke: color,
                strokeWidth: 2
            });
            break;
        case "text":
            canvasObject = new fabric.IText("", {
                // borderColor: '#ccc', // 激活状态时的边框颜色
                // editingBorderColor: '#ccc', // 文本对象的边框颜色，当它处于编辑模式时
                left: mouseFrom.x,
                top: mouseFrom.y - 10,
                transparentCorners: true,
                fontSize: 14,
                fill: color || '#ff0000',
                padding: 5,
                cornerSize: 5, // Size of object's controlling corners
                // cornerColor: '#ccc',
                rotatingPointOffset: 20, // Offset for object's controlling rotating point
                lockScalingFlip: true, // 不能通过缩放为负值来翻转对象
                lockUniScaling: true // 对象非均匀缩放被锁定
            });
            break;
        case "select":
            canvasObject = null
            break;
        default:
            canvasObject = null
            break;
    }
    console.log("canvasObject", canvasObject);
    return canvasObject;
}

//绘制箭头方法
function drawArrow(fromX, fromY, toX, toY, theta, headlen) {
    theta = typeof theta != "undefined" ? theta : 30;
    headlen = typeof theta != "undefined" ? headlen : 10;
    // 计算各角度和对应的P2,P3坐标
    var angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,
        angle1 = (angle + theta) * Math.PI / 180,
        angle2 = (angle - theta) * Math.PI / 180,
        topX = headlen * Math.cos(angle1),
        topY = headlen * Math.sin(angle1),
        botX = headlen * Math.cos(angle2),
        botY = headlen * Math.sin(angle2);
    var arrowX = fromX - topX,
        arrowY = fromY - topY;
    var path = " M " + fromX + " " + fromY;
    path += " L " + toX + " " + toY;
    arrowX = toX + topX;
    arrowY = toY + topY;
    path += " M " + arrowX + " " + arrowY;
    path += " L " + toX + " " + toY;
    arrowX = toX + botX;
    arrowY = toY + botY;
    path += " L " + arrowX + " " + arrowY;
    return path;
}