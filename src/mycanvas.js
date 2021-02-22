import drawing from "./drawing";
import hotkeys from 'hotkeys-js';


export function initcanvas(ctx) {

    window.mycanvas = ctx.mycanvas = new fabric.Canvas("canvas", {
        isDrawingMode: false,  //是否开启自由绘制
        skipTargetFind: true,// 画板元素不能被选中
        selection: false, //画板显示被选中
        selectable: false,
        width: 900,
        height: 600,
    });
    initCanvasHooks(ctx.mycanvas, ctx);
    inithotkeys(ctx);


}
function initCanvasHooks(mycanvas, ctx) {
    window.zoom = window.zoom ? window.zoom : 1; //缩放比例
    mycanvas.freeDrawingBrush.color = 'black'; //设置自由绘颜色
    mycanvas.freeDrawingBrush.width = 2; //自由绘笔触宽度
    let moveCount = 0, doDrawing = false, selected = false;
    //绑定画板事件
    mycanvas.on("mouse:down", function (options) {
        var xy = transformMouse(options.e.offsetX, options.e.offsetY);
        ctx.state.mouseFrom.x = xy.x;
        ctx.state.mouseFrom.y = xy.y;
        doDrawing = true;
    });
    mycanvas.on("mouse:up", function (options) {
        var xy = transformMouse(options.e.offsetX, options.e.offsetY);
        ctx.state.mouseTo.x = xy.x;
        ctx.state.mouseTo.y = xy.y;

        moveCount = 1;
        doDrawing = false;
        if (selected) {
            return
        }
        if (ctx.state.mouseTo.x == ctx.state.mouseFrom.x && ctx.state.mouseFrom.y == ctx.state.mouseTo.y) {//单击不绘制
            return
        }
        ctx.canvasObject = drawing(ctx.state.drawtype, ctx.state.mouseFrom, ctx.state.mouseTo, ctx.state.penColor, ctx.state.drawWidth,ctx.state.isTextEditing,ctx);
        if (ctx.canvasObject) {
            mycanvas.add(ctx.canvasObject).setActiveObject(ctx.canvasObject); //设置激活状态
            ctx.state.drawtype=='text' && ctx.canvasObject.enterEditing();  //文本编辑
            mycanvas.renderAll();
           
        }

    });
    mycanvas.on("mouse:move", function (options) {
        if (moveCount % 2 && !doDrawing) {
            //减少绘制频率
            return;
        }
        moveCount++;
        var xy = transformMouse(options.e.offsetX, options.e.offsetY);
        ctx.state.mouseTo.x = xy.x;
        ctx.state.mouseTo.y = xy.y;
    });

    mycanvas.on("selection:created", function (e) {
        selected = true;
        mycanvas.setActiveObject(e.target);
    });

    mycanvas.on('selection:updated', (e) => {
        mycanvas.setActiveObject(e.target);
    });

    mycanvas.on('selection:cleared', (e) => {
        selected = false;
        return mycanvas.setActiveObject(null);
    });

}
function inithotkeys(ctx) {
    hotkeys('delete, backspace', function (event, handler) {//删除对象
        ctx.mycanvas.getActiveObjects().forEach(v => {
            ctx.mycanvas.remove(v);
        });
        ctx.mycanvas.discardActiveObject();
    });

}

//坐标转换
function transformMouse(mouseX, mouseY) {
    return { x: mouseX / window.zoom, y: mouseY / window.zoom };
}


//导入图片到画布中
export function doDraw(ctx,bgImagelist){
    bgImagelist.forEach((item)=>{
        new fabric.Image.fromURL(item, function(img) {
            img.set("scaleX",  900/img.width);
            img.set("scaleY",  600/img.height);
            ctx.mycanvas.add(img);
            ctx.mycanvas.renderAll();
        })
    })
    

}