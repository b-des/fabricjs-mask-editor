import {fabric} from "fabric";
import App from "./side";
import {CIRCLE} from "./constants";

/**
 *
 * @param canvas
 */
const removeShapes = (canvas) => {
    App.drawMode = false;
    let objects = canvas.getObjects();
    objects.filter(object => object.id !== 'product-image').map(object => canvas.remove(object));
    canvas.renderAll();
}

/**
 *
 * @param canvas
 */
const clearCanvasAndLeaveOnlyShape = (canvas) => {
    let objects = canvas.getObjects();
    objects.filter(object => object.id !== 'canvas-shape').map(object => canvas.remove(object));
    canvas.renderAll();
}

/**
 *
 * @param canvas
 */
const getCurrentShape = (canvas) => {
    let objects = canvas.getObjects();
    let shape = objects.filter(object => object.id === 'canvas-shape');
    if(shape.length){
        return shape[0];
    }else{
        return null;
    }
}

/**
 * define a function that will define what the control does
 * this function will be called on every mouse move after a control has been
 * clicked and is being dragged.
 * The function receive as argument the mouse event, the current trasnform object
 * and the current position in canvas coordinate
 * transform.target is a reference to the current object being transformed,
 */
const actionHandler = (eventData, transform, x, y) => {
    const polygon = transform.target;
    const currentControl = polygon.controls[polygon.__corner];
    const mouseLocalPosition = polygon.toLocalPoint(new fabric.Point(x, y), 'center', 'center');
    const size = polygon._getTransformedDimensions(0, 0);
    const finalPointPosition = {
        x: (mouseLocalPosition.x * polygon.width) / size.x + polygon.pathOffset.x,
        y: (mouseLocalPosition.y * polygon.height) / size.y + polygon.pathOffset.y,
    };
    polygon.points[currentControl.pointIndex] = finalPointPosition;
    return true;
}


/**
 * define a function that can keep the polygon in the same position when we change its
 * width/height/top/left.
 */
const anchorWrapper = (anchorIndex, fn) => {
    return function(eventData, transform, x, y) {
        const fabricObject = transform.target;
        const point = {
            x: fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x,
            y: fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y,
        };

        // update the transform border
        fabricObject._setPositionDimensions({});

        // Now newX and newY represent the point position with a range from
        // -0.5 to 0.5 for X and Y.
        const newX = point.x / fabricObject.width;
        const newY = point.y / fabricObject.height;

        // Fabric supports numeric origins for objects with a range from 0 to 1.
        // This let us use the relative position as an origin to translate the old absolutePoint.
        const absolutePoint = fabric.util.transformPoint(point, fabricObject.calcTransformMatrix());
        fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5);

        // action performed
        return fn(eventData, transform, x, y);
    };
}

/**
 * define a function that can locate the controls.
 * this function will be used both for drawing and for interaction.
 */
const polygonPositionHandler = (dim, finalMatrix, fabricObject) => {
    console.log(fabricObject);
    console.log(this);
    const transformPoint = {
        x: fabricObject.points[this.pointIndex].x - fabricObject.pathOffset.x,
        y: fabricObject.points[this.pointIndex].y - fabricObject.pathOffset.y,
    };
    return fabric.util.transformPoint(transformPoint, fabricObject.calcTransformMatrix());
}

const transformCoords = (object, scale) => {
    object.width *= scale;
    object.height *= scale;
    object.top *= scale;
    object.left *= scale;
    if (object.type === CIRCLE.toLowerCase()) {
        object.radius *= scale;
    }

    if (object.points) {
        object.points.map(point => {
            point.x *= scale;
            point.y *= scale;
        })
    }
    return object;
}

export {removeShapes, clearCanvasAndLeaveOnlyShape, actionHandler, anchorWrapper, polygonPositionHandler, getCurrentShape, transformCoords}
