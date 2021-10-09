import {fabric} from 'fabric';
import {removeShapes} from './utils';
import {DEFAULT_SHAPE_FEATURES} from "./constants";



export default function shapes(canvas) {
    removeShapes(canvas);

    const drawCircle = () => {

        let radius = canvas.getWidth() / 6;
        let circle = new fabric.Circle({
            top: canvas.getHeight() / 2 - radius,
            left: canvas.getWidth() / 2 - radius,
            radius: radius,
            ...DEFAULT_SHAPE_FEATURES
        });
        canvas.add(circle)
    }

    const drawRectangle = () => {
        let width = canvas.getWidth() / 2;
        let height = canvas.getHeight() / 2;
        let rectanle = new fabric.Rect({
            top: canvas.getHeight() / 2 - height / 2,
            left: canvas.getWidth() / 2 - width / 2,
            width: width,
            height: height,
            ...DEFAULT_SHAPE_FEATURES
        });
        canvas.add(rectanle)
    }

    const drawTriangle = () => {
        let width = canvas.getWidth() / 2;
        let height = canvas.getHeight() / 2;
        let triangle = new fabric.Triangle({
            width: width,
            height: height,
            top: canvas.getHeight() / 2 - height / 2,
            left: canvas.getWidth() / 2 - width / 2,
            ...DEFAULT_SHAPE_FEATURES
        });
        canvas.add(triangle)
    }

    const drawEllipse = () => {
        let width = canvas.getWidth() / 2;
        let height = canvas.getHeight() / 2;
        let ellipse = new fabric.Ellipse({
            width: width,
            height: height,
            originX: 'left',
            originY: 'top',
            rx: 100,
            ry: 40,
            angle: 0,
            top: canvas.getHeight() / 2 - height / 2,
            left: canvas.getWidth() / 2 - width / 2,
            ...DEFAULT_SHAPE_FEATURES
        });
        canvas.add(ellipse)
    }

    const drawPolygon = () => {
        let width = canvas.getWidth() / 2;
        let height = canvas.getHeight() / 2;
        let ellipse = new fabric.Ellipse({
            width: width,
            height: height,
            originX: 'left',
            originY: 'top',
            rx: 100,
            ry: 40,
            angle: 0,
            top: canvas.getHeight() / 2 - height / 2,
            left: canvas.getWidth() / 2 - width / 2,
            ...DEFAULT_SHAPE_FEATURES
        });
        canvas.add(ellipse)
    }

    return {drawCircle, drawRectangle, drawTriangle, drawEllipse, drawPolygon}
}

