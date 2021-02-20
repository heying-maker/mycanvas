import React from 'react'
import { Menu, Layout, List, Button, Input, Row, Col, Divider, Upload, Select, } from 'antd'
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons'
import { initcanvas ,doDraw} from './mycanvas'
import $ from 'jquery';
import { downloadPic } from './downLoad'
export default class ToDraw extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            drawtype: 'line', // 画笔类型
            penColor: 'red', // 画笔颜色
            drawWidth: '2', // 画笔大小
            mouseFrom: { x: '', y: '' },
            mouseTo: { x: '', y: '' },
            bgColor: '',  //背景色
            bgImagelist: [], //导入的图片列表
            imgType: 'png',
            isTextEditing: false,

        }
    }

    changeBGColor(color) {
        this.setState({ bgColor: color })
        this.mycanvas.backgroundColor = color;
        this.mycanvas.renderAll();

    }
    componentDidMount() {
        this.init()
    }

    init() {
        initcanvas(this)

    }
    changePenColor(color) {
        this.setState({ penColor: color })
    }

    clearCanvas(e) { // 清空画板
        this.mycanvas.clear();
        this.mycanvas.backgroundColor = this.state.bgColor; //清空画板保留底色
    }
    gettools(e) {
        const id = e.target.id
        this.setState({
            drawtype: id,
            mouseFrom: { x: '', y: '' },
            mouseTo: { x: '', y: '' }
        })
        if (id == 'free') {
            this.mycanvas.isDrawingMode = true
        } else {
            this.mycanvas.isDrawingMode = false
        }
        if (id == 'select') {
            this.mycanvas.skipTargetFind = false// 画板元素被选中
            this.mycanvas.selection = true// 画板显示被选中
            this.mycanvas.selectable = true
        } else {
            this.mycanvas.skipTargetFind = true// 画板元素不被选中
            this.mycanvas.selection = false// 画板不显示被选中
            this.mycanvas.selectable = false
        }
        if (id == 'text') {
            this.setState({ isTextEditing: true })
        } else {
            this.setState({ isTextEditing: false })
        }

        $('#' + id).addClass('active')
        $('#' + id).siblings().removeClass('active')
    }
    //导出图片
    exportPic(e) {
        downloadPic(this, this.state.imgType);
    }
    changeImgType(imgType) {
        this.setState({ imgType })
    }
    beforeUpload(file) {
        console.log("file", file);

        var r = (/^image\/(png|jpeg|bmp|gif)$/).test(file.type);
        if (!r) {
            console.error(`${file.name} is not a image file`);
            return false
        }
        let url = window.URL.createObjectURL(file);
        console.log("url", url);
        let bgImagelist = [];
        bgImagelist.push(url)
        this.setState({ bgImagelist }) //
        doDraw(this, bgImagelist)
        return true;

    }
    doUpload(info) {
        console.log("info", info);
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            console.log(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            console.error(`${info.file.name} file upload failed.`);
        }

    }
    render() {
        const { tools, bgcolors, coloroptions, imgOptions } = this.props
        return (
            <div>
                <Row>
                    <Col md={3}> <Button type='primary'
                        onClick={(e) => this.clearCanvas(e)}
                    > 清空画板 </Button></Col>
                    <Col md={6}>
                        <Button.Group>
                            <Button icon={<UploadOutlined />}
                                onClick={(e) => this.exportPic(e)}
                            >导出图片</Button>
                            <Select
                                showArrow
                                defaultValue={'png'}
                                style={{ width: '100%' }}
                                options={imgOptions}
                                onChange={(e) => this.changeImgType(e)}
                            />
                        </Button.Group>
                    </Col>
                    <Col md={3}>
                        <Upload
                            listType="picture"
                            beforeUpload={(e) => this.beforeUpload(e)}
                            onChange={(e) => this.doUpload(e)}
                        >
                            <Button icon={<DownloadOutlined />}>导入图片</Button>
                        </Upload>
                    </Col>
                </Row>
                <Divider />

                <Row>
                    <Col md={2}>切换画笔颜色：</Col>
                    <Col md={3}>
                        <Select
                            showArrow
                            defaultValue={'red'}

                            options={coloroptions}
                            onChange={(e) => this.changePenColor(e)}
                        /></Col>
                    <Col md={2}>切换画布颜色：</Col>
                    <Col md={2}>
                        <Select
                            showArrow
                            defaultValue={''}
                            options={bgcolors}
                            onChange={(e) => this.changeBGColor(e)}
                        /></Col>
                    <Col md={2}> <Button type='primary' onClick={(e) => this.clearCanvas(e)}> 图层下移 </Button></Col>
                    <Col md={2}> <Button type='primary' onClick={(e) => this.clearCanvas(e)}> 图层上移 </Button></Col>
                </Row>
                <div style={{ border: '1px solid #ccc', padding: '10px', height: '620px', marginTop: '5px', backgroundColor: '#999' }}>
                    <canvas id="canvas" ></canvas>
                    <div className="toolbox">
                        <ul>
                            {
                                tools.map((item) => {
                                    return <li key={item.id} onClick={(e) => this.gettools(e)} id={item.id} className={item.id == 'line' ? 'active' : ''}>
                                        {item.title}
                                    </li>
                                })
                            }

                        </ul>
                    </div>

                </div>
            </div>
        )
    }

}

ToDraw.defaultProps = {
    tools: [
        {
            title: '选择元素',
            id: 'select'
        }, {
            title: '长方形',
            id: 'rect'
        }, {
            title: '圆形',
            id: 'circle'
        }, {
            title: '直线',
            id: 'line'
        }, {
            title: '箭头',
            id: 'arrow'
        }, {
            title: '虚线',
            id: 'dottedline'
        }, {
            title: '文本',
            id: 'text'
        }, {
            title: '自由绘制',
            id: 'free'
        }

    ],
    bgcolors: [{ value: '', label: '透明背景' }, { value: 'white', label: '白色' }, { value: 'rgb(16,109,156)', label: '浅蓝色' }, { value: 'rgb(90,146,173)', label: '哑光蓝色' }, { value: 'rgb(61,89,171)', label: '钴色' },
    { value: 'rgb(128,42,42)', label: '朱红' },
    { value: 'rgb(226,205,188)', label: '浅黄' },
    { value: 'rgb(177,122,125)', label: '朱粉' },
    { value: 'rgb(214,214,214)', label: '青色' }],

    coloroptions: [{ value: 'red' }, { value: 'green' }, { value: 'yellow' }, { value: 'black' }, { value: 'blue' }, { value: 'pink' }, { value: 'white' }],
    imgOptions: [{ value: 'jpeg' }, { value: 'png' }, { value: 'jpg' }, { value: 'gif' }, { value: 'bmp' }],
}